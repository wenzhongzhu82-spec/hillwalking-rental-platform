import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { itemSchema } from "@/lib/validations";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const item = await prisma.item.findUnique({
      where: { id },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        owner: {
          select: {
            id: true,
            name: true,
            avatar: true,
            rating: true,
            grade: true,
            house: true,
            completedOrders: true,
            createdAt: true,
          },
        },
        orders: {
          where: {
            status: { in: ["ACCEPTED", "IN_USE", "WAITING_PICKUP", "PICKED_UP"] },
          },
          select: {
            id: true,
            startDate: true,
            endDate: true,
            status: true,
          },
        },
      },
    });

    if (!item || item.status === "HIDDEN" || item.status === "BANNED") {
      return Response.json({ error: "Item not found" }, { status: 404 });
    }

    // Increment view count
    await prisma.item.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    return Response.json({ item });
  } catch (error) {
    console.error("Get item error:", error);
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

    const item = await prisma.item.findUnique({ where: { id } });
    if (!item) {
      return Response.json({ error: "Item not found" }, { status: 404 });
    }

    // Only owner or admin can update
    if (item.ownerId !== session.id && session.role !== "ADMIN") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = itemSchema.partial().safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const updateData: Record<string, unknown> = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
    if (data.brand !== undefined) updateData.brand = data.brand || null;
    if (data.size !== undefined) updateData.size = data.size || null;
    if (data.condition !== undefined) updateData.condition = data.condition;
    if (data.dailyPrice !== undefined) updateData.dailyPrice = data.dailyPrice;
    if (data.deposit !== undefined) updateData.deposit = data.deposit;
    if (data.pickupLocation !== undefined) updateData.pickupLocation = data.pickupLocation;
    if (data.returnLocation !== undefined) updateData.returnLocation = data.returnLocation || null;
    if (data.availableFrom !== undefined) updateData.availableFrom = new Date(data.availableFrom);
    if (data.availableTo !== undefined) updateData.availableTo = new Date(data.availableTo);
    if (data.safetyNotes !== undefined) updateData.safetyNotes = data.safetyNotes || null;
    if (data.tags !== undefined) updateData.tags = JSON.stringify(data.tags);
    if (data.isHillwalkingRecommended !== undefined) updateData.isHillwalkingRecommended = data.isHillwalkingRecommended;

    const updated = await prisma.item.update({
      where: { id },
      data: updateData,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        owner: {
          select: {
            id: true,
            name: true,
            avatar: true,
            rating: true,
          },
        },
      },
    });

    return Response.json({ item: updated });
  } catch (error) {
    console.error("Update item error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const item = await prisma.item.findUnique({ where: { id } });
    if (!item) {
      return Response.json({ error: "Item not found" }, { status: 404 });
    }

    // Only owner or admin can soft-delete
    if (item.ownerId !== session.id && session.role !== "ADMIN") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    // Soft-delete: set status to HIDDEN
    await prisma.item.update({
      where: { id },
      data: { status: "HIDDEN" },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Delete item error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
