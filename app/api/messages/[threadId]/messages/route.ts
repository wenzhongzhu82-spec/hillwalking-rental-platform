import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { messageSchema } from "@/lib/validations";
import { messageRateLimit } from "@/lib/rate-limit";
import { createNotification } from "@/lib/notifications";

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
      select: { borrowerId: true, lenderId: true },
    });
    if (!thread) {
      return Response.json({ error: "Thread not found" }, { status: 404 });
    }
    if (thread.borrowerId !== session.id && thread.lenderId !== session.id && session.role !== "ADMIN") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }
    const messages = await prisma.message.findMany({
      where: { threadId },
      orderBy: { createdAt: "asc" },
      include: {
        sender: { select: { id: true, name: true, avatar: true } },
      },
    });
    // Mark as read
    await prisma.message.updateMany({
      where: { threadId, senderId: { not: session.id }, readAt: null },
      data: { readAt: new Date() },
    });
    return Response.json({ messages });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Internal error" }, { status: 500 });
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

    // Rate limit message sending
    const rl = messageRateLimit(session.id);
    if (!rl.success) {
      return Response.json(
        { error: "You are sending messages too fast. Please slow down." },
        { status: 429 }
      );
    }

    const { threadId } = await params;
    const thread = await prisma.messageThread.findUnique({
      where: { id: threadId },
      select: { borrowerId: true, lenderId: true },
    });
    if (!thread) {
      return Response.json({ error: "Thread not found" }, { status: 404 });
    }
    if (thread.borrowerId !== session.id && thread.lenderId !== session.id) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }
    const body = await request.json();
    const parsed = messageSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: "Validation failed", details: parsed.error.issues }, { status: 400 });
    }
    const message = await prisma.message.create({
      data: {
        threadId,
        senderId: session.id,
        content: parsed.data.content,
        type: "TEXT",
      },
      include: {
        sender: { select: { id: true, name: true, avatar: true } },
      },
    });
    await prisma.messageThread.update({
      where: { id: threadId },
      data: { lastMessageAt: new Date() },
    });

    // Create notification for the OTHER participant
    try {
      const otherUserId =
        thread.borrowerId === session.id ? thread.lenderId : thread.borrowerId;
      await createNotification({
        userId: otherUserId,
        type: "NEW_MESSAGE",
        title: "New message",
        message: `${message.sender.name} sent you a new message`,
        actionUrl: `/messages/${threadId}`,
      });
    } catch (notifErr) {
      console.error("Failed to create notification:", notifErr);
    }

    return Response.json({ message }, { status: 201 });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Internal error" }, { status: 500 });
  }
}
