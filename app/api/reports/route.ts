import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { reportSchema } from "@/lib/validations";
import { reportRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!session.verified) {
      return Response.json(
        { error: "Your account must be verified to submit reports" },
        { status: 403 }
      );
    }

    // Rate limit report submissions
    const rl = reportRateLimit(session.id);
    if (!rl.success) {
      return Response.json(
        { error: "Too many reports submitted. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = reportSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { itemId, reason, description } = parsed.data;

    // If itemId provided, verify item exists and find its owner
    let targetUserId: string | null = null;
    if (itemId) {
      const item = await prisma.item.findUnique({
        where: { id: itemId },
        select: { id: true, ownerId: true },
      });

      if (!item) {
        return Response.json({ error: "Item not found" }, { status: 404 });
      }

      if (item.ownerId === session.id) {
        return Response.json(
          { error: "You cannot report your own item" },
          { status: 400 }
        );
      }

      targetUserId = item.ownerId;
    }

    const report = await prisma.report.create({
      data: {
        reporterId: session.id,
        itemId: itemId || null,
        targetUserId,
        reason,
        description: description || null,
        status: "PENDING",
      },
    });

    return Response.json({ report }, { status: 201 });
  } catch (error) {
    console.error("Create report error:", error);
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

    if (session.role !== "ADMIN") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = request.nextUrl;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const status = searchParams.get("status");

    const where: Record<string, unknown> = {};
    if (status) {
      where.status = status;
    }

    const [reports, total] = await Promise.all([
      prisma.report.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          reporter: {
            select: { id: true, name: true, avatar: true },
          },
          item: {
            select: { id: true, title: true, status: true },
          },
          targetUser: {
            select: { id: true, name: true, email: true },
          },
        },
      }),
      prisma.report.count({ where }),
    ]);

    return Response.json({
      reports,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get reports error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
