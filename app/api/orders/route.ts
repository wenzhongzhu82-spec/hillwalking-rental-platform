import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { createNotification } from "@/lib/notifications";
import { orderSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!session.verified) {
      return Response.json(
        { error: "Your account must be verified to place orders" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const parsed = orderSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { itemId, startDate, endDate, borrowerNote, pickupTime, returnTime } = parsed.data;

    const item = await prisma.item.findUnique({
      where: { id: itemId },
      select: { id: true, title: true, dailyPrice: true, deposit: true, status: true, ownerId: true, owner: { select: { id: true, name: true } } },
    });

    if (!item) {
      return Response.json({ error: "Item not found" }, { status: 404 });
    }

    if (item.status !== "AVAILABLE") {
      return Response.json(
        { error: "This item is not currently available for rent" },
        { status: 400 }
      );
    }

    if (item.ownerId === session.id) {
      return Response.json(
        { error: "You cannot rent your own item" },
        { status: 400 }
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (days < 1) {
      return Response.json(
        { error: "Rental period must be at least 1 day" },
        { status: 400 }
      );
    }

    const totalPrice = item.dailyPrice * days;

    const order = await prisma.order.create({
      data: {
        itemId,
        borrowerId: session.id,
        lenderId: item.ownerId,
        startDate: start,
        endDate: end,
        totalPrice,
        deposit: item.deposit,
        pickupTime: pickupTime ? new Date(pickupTime) : null,
        returnTime: returnTime ? new Date(returnTime) : null,
        borrowerNote: borrowerNote || null,
        status: "REQUEST_PENDING",
        statusHistory: JSON.stringify([
          {
            status: "REQUEST_PENDING",
            at: new Date().toISOString(),
            by: session.id,
          },
        ]),
      },
      include: {
        item: {
          include: {
            category: { select: { id: true, name: true } },
          },
        },
        borrower: {
          select: { id: true, name: true, avatar: true, rating: true },
        },
        lender: {
          select: { id: true, name: true, avatar: true, rating: true },
        },
      },
    });

    // Create notification for the lender
    await createNotification({
      userId: item.ownerId,
      type: "RENTAL_REQUEST",
      title: "New rental request",
      message: `${session.name} requested to rent your "${item.title}"`,
      actionUrl: `/orders/${order.id}`,
    }).catch((err) => console.error("Failed to create notification:", err));

    return Response.json({ order }, { status: 201 });
  } catch (error) {
    console.error("Create order error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = request.nextUrl;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const status = searchParams.get("status");
    const role = searchParams.get("role"); // "borrower" or "lender"

    const where: Record<string, unknown> = {};

    if (role === "borrower") {
      where.borrowerId = session.id;
    } else if (role === "lender") {
      where.lenderId = session.id;
    } else {
      where.OR = [
        { borrowerId: session.id },
        { lenderId: session.id },
      ];
    }

    if (status) {
      where.status = status;
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          item: {
            select: {
              id: true,
              title: true,
              images: true,
              dailyPrice: true,
              deposit: true,
            },
          },
          borrower: {
            select: { id: true, name: true, avatar: true, rating: true },
          },
          lender: {
            select: { id: true, name: true, avatar: true, rating: true },
          },
        },
      }),
      prisma.order.count({ where }),
    ]);

    return Response.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get orders error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
