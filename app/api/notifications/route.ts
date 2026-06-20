import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = request.nextUrl;

    // If unreadCount query param is present, just return the count
    if (searchParams.get("unreadCount") === "true") {
      const count = await prisma.notification.count({
        where: { userId: session.id, readAt: null },
      });
      return Response.json({ count });
    }

    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: { userId: session.id },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.notification.count({ where: { userId: session.id } }),
      prisma.notification.count({
        where: { userId: session.id, readAt: null },
      }),
    ]);

    return Response.json({
      notifications,
      unreadCount,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get notifications error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { notificationId, markAll } = body;

    if (markAll) {
      await prisma.notification.updateMany({
        where: { userId: session.id, readAt: null },
        data: { readAt: new Date() },
      });
      return Response.json({ success: true });
    }

    if (!notificationId) {
      return Response.json(
        { error: "notificationId or markAll is required" },
        { status: 400 }
      );
    }

    // Ensure the notification belongs to the user
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      return Response.json(
        { error: "Notification not found" },
        { status: 404 }
      );
    }

    if (notification.userId !== session.id) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const updated = await prisma.notification.update({
      where: { id: notificationId },
      data: { readAt: new Date() },
    });

    return Response.json({ notification: updated });
  } catch (error) {
    console.error("Update notification error:", error);
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
    const { userId, type, title, message, actionUrl } = body;

    if (!userId || !type || !title || !message) {
      return Response.json(
        { error: "userId, type, title, and message are required" },
        { status: 400 }
      );
    }

    // Only admin or the user themselves can create notifications
    if (session.role !== "ADMIN" && session.id !== userId) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        actionUrl: actionUrl || null,
      },
    });

    return Response.json({ notification }, { status: 201 });
  } catch (error) {
    console.error("Create notification error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
