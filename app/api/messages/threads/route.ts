import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const threads = await prisma.messageThread.findMany({
      where: {
        OR: [
          { borrowerId: session.id },
          { lenderId: session.id },
        ],
      },
      orderBy: { lastMessageAt: "desc" },
      include: {
        item: {
          select: { id: true, title: true, images: true },
        },
        borrower: {
          select: { id: true, name: true, avatar: true },
        },
        lender: {
          select: { id: true, name: true, avatar: true },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: {
            id: true,
            content: true,
            senderId: true,
            createdAt: true,
            readAt: true,
          },
        },
        _count: {
          select: {
            messages: {
              where: {
                senderId: { not: session.id },
                readAt: null,
              },
            },
          },
        },
      },
    });

    return Response.json({ threads });
  } catch (error) {
    console.error("Get threads error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { itemId, lenderId } = body;

    if (!itemId || !lenderId) {
      return Response.json(
        { error: "itemId and lenderId are required" },
        { status: 400 }
      );
    }

    if (lenderId === session.id) {
      return Response.json(
        { error: "You cannot start a thread with yourself" },
        { status: 400 }
      );
    }

    // Verify item exists and lender is the owner
    const item = await prisma.item.findUnique({
      where: { id: itemId },
      select: { id: true, ownerId: true, status: true },
    });

    if (!item) {
      return Response.json({ error: "Item not found" }, { status: 404 });
    }

    if (item.ownerId !== lenderId) {
      return Response.json(
        { error: "The specified lender is not the owner of this item" },
        { status: 400 }
      );
    }

    // Check if thread already exists
    const existing = await prisma.messageThread.findFirst({
      where: {
        itemId,
        borrowerId: session.id,
        lenderId,
      },
    });

    if (existing) {
      return Response.json({ thread: existing });
    }

    const thread = await prisma.messageThread.create({
      data: {
        itemId,
        borrowerId: session.id,
        lenderId,
      },
      include: {
        item: {
          select: { id: true, title: true, images: true },
        },
        borrower: {
          select: { id: true, name: true, avatar: true },
        },
        lender: {
          select: { id: true, name: true, avatar: true },
        },
      },
    });

    return Response.json({ thread }, { status: 201 });
  } catch (error) {
    console.error("Create thread error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
