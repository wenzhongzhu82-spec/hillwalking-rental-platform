import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { z } from "zod/v4";

const createCommunitySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name too long"),
  type: z.enum(["SCHOOL", "CLUB", "CITY", "ORGANIZATION", "OTHER"]).default("OTHER"),
  description: z.string().max(1000).optional().or(z.literal("")),
  location: z.string().max(200).optional().or(z.literal("")),
});

const joinLeaveSchema = z.object({
  communityId: z.string().min(1),
  action: z.enum(["JOIN", "LEAVE"]),
});

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const search = searchParams.get("search") || "";
    const type = searchParams.get("type");
    const verified = searchParams.get("verified");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));

    const where: Record<string, unknown> = {};

    if (search) {
      where.name = { contains: search };
    }

    if (type) {
      where.type = type;
    }

    if (verified === "true") {
      where.verified = true;
    }

    const [communities, total] = await Promise.all([
      prisma.community.findMany({
        where,
        orderBy: { name: "asc" },
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
    console.error("Get communities error:", error);
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

    if (!session.verified) {
      return Response.json(
        { error: "Your account must be verified to create communities" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const parsed = createCommunitySchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const data = parsed.data;
    let slug = slugify(data.name);

    // Ensure slug uniqueness
    const existing = await prisma.community.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    const community = await prisma.community.create({
      data: {
        name: data.name,
        slug,
        type: data.type,
        description: data.description || null,
        location: data.location || null,
      },
    });

    return Response.json({ community }, { status: 201 });
  } catch (error) {
    console.error("Create community error:", error);
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
    const parsed = joinLeaveSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { communityId, action } = parsed.data;

    // Verify community exists
    const community = await prisma.community.findUnique({
      where: { id: communityId },
    });
    if (!community) {
      return Response.json({ error: "Community not found" }, { status: 404 });
    }

    if (action === "JOIN") {
      const updatedUser = await prisma.user.update({
        where: { id: session.id },
        data: { communityId },
        select: {
          id: true,
          name: true,
          email: true,
          communityId: true,
        },
      });
      return Response.json({ user: updatedUser, community });
    } else if (action === "LEAVE") {
      // Only leave if user is currently in this community
      const currentUser = await prisma.user.findUnique({
        where: { id: session.id },
        select: { communityId: true },
      });

      if (currentUser?.communityId !== communityId) {
        return Response.json(
          { error: "You are not a member of this community" },
          { status: 400 }
        );
      }

      const updatedUser = await prisma.user.update({
        where: { id: session.id },
        data: { communityId: null },
        select: {
          id: true,
          name: true,
          email: true,
          communityId: true,
        },
      });
      return Response.json({ user: updatedUser });
    }

    return Response.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Join/leave community error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
