import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { createNotification } from "@/lib/notifications";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = request.nextUrl;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status");
    const communityId = searchParams.get("communityId");

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (communityId) {
      where.communityId = communityId;
    }

    const [items, total] = await Promise.all([
      prisma.item.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          owner: {
            select: { id: true, name: true, email: true, avatar: true },
          },
          _count: {
            select: { orders: true, reports: true },
          },
        },
      }),
      prisma.item.count({ where }),
    ]);

    return Response.json({
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Admin get items error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { itemId, action, adminNote, hiddenReason } = body;

    if (!itemId || !action) {
      return Response.json(
        { error: "itemId and action are required" },
        { status: 400 }
      );
    }

    const validActions = ["APPROVE", "REJECT", "BAN", "UNBAN", "UNHIDE"];
    if (!validActions.includes(action)) {
      return Response.json(
        { error: `Invalid action. Must be one of: ${validActions.join(", ")}` },
        { status: 400 }
      );
    }

    const item = await prisma.item.findUnique({ where: { id: itemId } });
    if (!item) {
      return Response.json({ error: "Item not found" }, { status: 404 });
    }

    let newStatus: string;
    switch (action) {
      case "APPROVE":
        if (item.status !== "PENDING_REVIEW") {
          return Response.json(
            { error: "Only items pending review can be approved" },
            { status: 400 }
          );
        }
        newStatus = "AVAILABLE";
        break;
      case "REJECT":
        if (item.status !== "PENDING_REVIEW") {
          return Response.json(
            { error: "Only items pending review can be rejected" },
            { status: 400 }
          );
        }
        newStatus = "HIDDEN";
        break;
      case "BAN":
        newStatus = "BANNED";
        break;
      case "UNBAN":
        if (item.status !== "BANNED") {
          return Response.json(
            { error: "Only banned items can be unbanned" },
            { status: 400 }
          );
        }
        newStatus = "PENDING_REVIEW";
        break;
      case "UNHIDE":
        if (item.status !== "HIDDEN") {
          return Response.json(
            { error: "Only hidden items can be unhidden" },
            { status: 400 }
          );
        }
        newStatus = "PENDING_REVIEW";
        break;
      default:
        return Response.json({ error: "Invalid action" }, { status: 400 });
    }

    const updateData: Record<string, unknown> = { status: newStatus };
    if (adminNote !== undefined) updateData.adminNote = adminNote;
    if (hiddenReason !== undefined) updateData.hiddenReason = hiddenReason;

    if (action === "BAN") {
      updateData.adminNote = adminNote || "Item banned by admin";
      updateData.hiddenReason = hiddenReason || "Item banned";
    }

    // Create an admin note record
    if (adminNote) {
      await prisma.adminNote.create({
        data: {
          itemId,
          content: `[${action}] ${adminNote}`,
          createdById: session.id,
        },
      });
    }

    const updated = await prisma.item.update({
      where: { id: itemId },
      data: updateData,
      include: {
        category: { select: { id: true, name: true } },
        owner: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    // Create notification for the item owner
    try {
      if (action === "APPROVE") {
        await createNotification({
          userId: updated.ownerId,
          type: "ITEM_APPROVED",
          title: "Item approved",
          message: `Your item "${updated.title}" has been approved and is now available for rent.`,
          actionUrl: `/items/${itemId}`,
        });
      } else if (action === "REJECT") {
        await createNotification({
          userId: updated.ownerId,
          type: "ITEM_REJECTED",
          title: "Item rejected",
          message: `Your item "${updated.title}" was not approved. Reason: ${hiddenReason || adminNote || "Not specified"}`,
          actionUrl: `/items/${itemId}`,
        });
      }
    } catch (notifErr) {
      console.error("Failed to create notification:", notifErr);
    }

    return Response.json({ item: updated });
  } catch (error) {
    console.error("Admin update item error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
