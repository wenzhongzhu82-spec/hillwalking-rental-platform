import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { createNotification } from "@/lib/notifications";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        item: {
          include: {
            category: { select: { id: true, name: true, slug: true } },
            owner: {
              select: { id: true, name: true, avatar: true, rating: true },
            },
          },
        },
        borrower: {
          select: {
            id: true,
            name: true,
            avatar: true,
            rating: true,
            grade: true,
            house: true,
          },
        },
        lender: {
          select: {
            id: true,
            name: true,
            avatar: true,
            rating: true,
            grade: true,
            house: true,
          },
        },
        reviews: {
          select: {
            id: true,
            rating: true,
            content: true,
            reviewerId: true,
            createdAt: true,
          },
        },
      },
    });

    if (!order) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    // Only borrower, lender, or admin can view
    if (
      order.borrowerId !== session.id &&
      order.lenderId !== session.id &&
      session.role !== "ADMIN"
    ) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    return Response.json({ order });
  } catch (error) {
    console.error("Get order error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: { item: { select: { id: true, ownerId: true } } },
    });

    if (!order) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    const body = await request.json();
    const { status } = body;

    if (!status) {
      return Response.json(
        { error: "Status is required" },
        { status: 400 }
      );
    }

    // Define valid status transitions based on role
    const borrowerTransitions: Record<string, string[]> = {
      REQUEST_PENDING: ["CANCELLED"],
      ACCEPTED: ["CANCELLED"],
      WAITING_PICKUP: ["CANCELLED"],
      PICKED_UP: ["RETURN_REQUESTED"],
      IN_USE: ["RETURN_REQUESTED"],
      COMPLETED: [],
      REJECTED: [],
      CANCELLED: [],
      RETURN_REQUESTED: [],
      RETURNED: [],
      DISPUTE_OPENED: [],
    };

    const lenderTransitions: Record<string, string[]> = {
      REQUEST_PENDING: ["ACCEPTED", "REJECTED"],
      ACCEPTED: ["CANCELLED"],
      RETURN_REQUESTED: ["RETURNED"],
      RETURNED: ["COMPLETED"],
      COMPLETED: [],
      REJECTED: [],
      CANCELLED: [],
      WAITING_PICKUP: ["PICKED_UP"],
      PICKED_UP: ["RETURN_REQUESTED"],
      IN_USE: [],
      DISPUTE_OPENED: [],
    };

    const adminTransitions: Record<string, string[]> = {
      REQUEST_PENDING: ["ACCEPTED", "REJECTED", "CANCELLED"],
      ACCEPTED: ["CANCELLED", "WAITING_PICKUP"],
      REJECTED: [],
      CANCELLED: [],
      WAITING_PICKUP: ["PICKED_UP", "CANCELLED"],
      PICKED_UP: ["RETURN_REQUESTED", "IN_USE"],
      IN_USE: ["RETURN_REQUESTED", "DISPUTE_OPENED"],
      RETURN_REQUESTED: ["RETURNED", "DISPUTE_OPENED"],
      RETURNED: ["COMPLETED", "DISPUTE_OPENED"],
      COMPLETED: ["DISPUTE_OPENED"],
      DISPUTE_OPENED: ["COMPLETED", "CANCELLED"],
    };

    let allowedTransitions: string[] = [];

    if (session.role === "ADMIN") {
      allowedTransitions = adminTransitions[order.status] || [];
    } else if (order.borrowerId === session.id) {
      allowedTransitions = borrowerTransitions[order.status] || [];
    } else if (order.lenderId === session.id) {
      allowedTransitions = lenderTransitions[order.status] || [];
    } else {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!allowedTransitions.includes(status)) {
      return Response.json(
        {
          error: `Cannot transition from ${order.status} to ${status}`,
          allowedTransitions,
        },
        { status: 400 }
      );
    }

    // Build update data
    const updateData: Record<string, unknown> = { status };

    // Read existing status history
    let history: { status: string; at: string; by: string }[];
    try {
      history = JSON.parse(order.statusHistory);
    } catch {
      history = [];
    }
    history.push({
      status,
      at: new Date().toISOString(),
      by: session.id,
    });
    updateData.statusHistory = JSON.stringify(history);

    // Set timestamps for specific statuses
    if (status === "WAITING_PICKUP" || status === "PICKED_UP") {
      updateData.pickupTime = new Date();
    }
    if (status === "RETURN_REQUESTED" || status === "RETURNED") {
      updateData.returnTime = new Date();
    }

    // If accepted, update item status
    if (status === "ACCEPTED") {
      await prisma.item.update({
        where: { id: order.itemId },
        data: { status: "RESERVED" },
      });
    }

    // If picked up, update item status
    if (status === "PICKED_UP" || status === "IN_USE") {
      await prisma.item.update({
        where: { id: order.itemId },
        data: { status: "RENTED" },
      });
    }

    // If returned or completed, update item status back to available
    if (status === "RETURNED" || status === "COMPLETED") {
      await prisma.item.update({
        where: { id: order.itemId },
        data: { status: "AVAILABLE" },
      });
    }

    // If completed, increment lender completedOrders
    if (status === "COMPLETED") {
      await prisma.user.update({
        where: { id: order.lenderId },
        data: { completedOrders: { increment: 1 } },
      });
    }

    const updated = await prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        item: {
          select: { id: true, title: true, images: true, dailyPrice: true },
        },
        borrower: {
          select: { id: true, name: true, avatar: true, rating: true },
        },
        lender: {
          select: { id: true, name: true, avatar: true, rating: true },
        },
      },
    });

    // Create notifications for the OTHER party based on status change
    try {
      const itemTitle = updated.item.title;
      if (status === "ACCEPTED") {
        await createNotification({
          userId: updated.borrowerId,
          type: "ORDER_UPDATE",
          title: "Rental request accepted",
          message: `${updated.lender.name} accepted your rental request for "${itemTitle}"`,
          actionUrl: `/orders/${id}`,
        });
      } else if (status === "REJECTED") {
        await createNotification({
          userId: updated.borrowerId,
          type: "ORDER_UPDATE",
          title: "Rental request rejected",
          message: `${updated.lender.name} rejected your rental request for "${itemTitle}"`,
          actionUrl: `/orders/${id}`,
        });
      } else if (status === "COMPLETED") {
        await createNotification({
          userId: updated.borrowerId,
          type: "ORDER_UPDATE",
          title: "Order completed",
          message: `Your rental for "${itemTitle}" has been completed. You can now leave a review.`,
          actionUrl: `/orders/${id}`,
        });
      } else if (status === "CANCELLED") {
        const notifyUserId = session.id === updated.borrowerId ? updated.lenderId : updated.borrowerId;
        const cancellerName = session.id === updated.borrowerId ? updated.borrower.name : updated.lender.name;
        await createNotification({
          userId: notifyUserId,
          type: "ORDER_UPDATE",
          title: "Order cancelled",
          message: `${cancellerName} cancelled the order for "${itemTitle}"`,
          actionUrl: `/orders/${id}`,
        });
      }
    } catch (notifErr) {
      console.error("Failed to create notification:", notifErr);
    }

    return Response.json({ order: updated });
  } catch (error) {
    console.error("Update order error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
