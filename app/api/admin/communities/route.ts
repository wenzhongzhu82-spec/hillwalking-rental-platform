import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = request.nextUrl;
    const search = searchParams.get("search") || "";
    const type = searchParams.get("type");
    const verified = searchParams.get("verified");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50", 10)));

    const where: Record<string, unknown> = {};

    if (search) {
      where.name = { contains: search };
    }

    if (type) {
      where.type = type;
    }

    if (verified === "true") {
      where.verified = true;
    } else if (verified === "false") {
      where.verified = false;
    }

    const [communities, total] = await Promise.all([
      prisma.community.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          _count: {
            select: { members: true, items: true },
          },
        },
      }),
      prisma.community.count({ where }),
    ]);

    return Response.json({
      communities,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Admin get communities error:", error);
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
    const { communityId, action } = body;

    if (!communityId || !action) {
      return Response.json(
        { error: "communityId and action are required" },
        { status: 400 }
      );
    }

    const validActions = ["VERIFY", "UNVERIFY"];
    if (!validActions.includes(action)) {
      return Response.json(
        { error: `Invalid action. Must be one of: ${validActions.join(", ")}` },
        { status: 400 }
      );
    }

    const community = await prisma.community.findUnique({
      where: { id: communityId },
    });
    if (!community) {
      return Response.json({ error: "Community not found" }, { status: 404 });
    }

    const verified = action === "VERIFY";

    const updated = await prisma.community.update({
      where: { id: communityId },
      data: { verified },
      include: {
        _count: {
          select: { members: true, items: true },
        },
      },
    });

    return Response.json({ community: updated });
  } catch (error) {
    console.error("Admin update community error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
