import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { messageSchema } from "@/lib/validations";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { threadId } = await params;

    const thread = await prisma.messageThread.findUnique({
      where: { id: threadId },
      include: {
        item: {
          select: { id: true, title: true, images: true, dailyPrice: true },
        },
        borrower: {
          select: { id: true, name: true, avatar: true },
        },
        lender: {
          select: { id: true, name: true, avatar: true },
        },
      },
    });

    if (!thread) {
      return Response.json({ error: "Thread not found" }, { status: 404 });
    }

    if (
      thread.borrowerId !== session.id &&
      thread.lenderId !== session.id &&
      session.role !== "ADMIN"
    ) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = request.nextUrl;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50", 10)));

    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where: { threadId },
        orderBy: { createdAt: "asc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          sender: {
            select: { id: true, name: true, avatar: true },
          },
        },
      }),
      prisma.message.count({ where: { threadId } }),
    ]);

    // Mark messages from the other user as read
    await prisma.message.updateMany({
      where: {
        threadId,
        senderId: { not: session.id },
        readAt: null,
      },
      data: { readAt: new Date() },
    });

    return Response.json({
      thread,
      messages,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get thread messages error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { threadId } = await params;

    const thread = await prisma.messageThread.findUnique({
      where: { id: threadId },
    });

    if (!thread) {
      return Response.json({ error: "Thread not found" }, { status: 404 });
    }

    if (
      thread.borrowerId !== session.id &&
      thread.lenderId !== session.id &&
      session.role !== "ADMIN"
    ) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = messageSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const message = await prisma.message.create({
      data: {
        threadId,
        senderId: session.id,
        content: parsed.data.content,
        type: "TEXT",
      },
      include: {
        sender: {
          select: { id: true, name: true, avatar: true },
        },
      },
    });

    // Update thread lastMessageAt
    await prisma.messageThread.update({
      where: { id: threadId },
      data: { lastMessageAt: new Date() },
    });

    return Response.json({ message }, { status: 201 });
  } catch (error) {
    console.error("Send message error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
