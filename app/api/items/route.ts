import type { NextRequest } from "next/server";
import { checkBannedContent } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { itemSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const search = searchParams.get("search") || "";
    const categoryId = searchParams.get("categoryId");
    const ownerId = searchParams.get("ownerId");
    const communityId = searchParams.get("communityId");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sort = searchParams.get("sort") || "newest";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "12", 10)));
    const status = searchParams.get("status") || "AVAILABLE";

    const where: Record<string, unknown> = { status };

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { brand: { contains: search } },
      ];
    }

    if (ownerId) {
      where.ownerId = ownerId;
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (communityId) {
      where.communityId = communityId;
    }

    if (minPrice || maxPrice) {
      where.dailyPrice = {};
      if (minPrice) (where.dailyPrice as Record<string, unknown>).gte = parseFloat(minPrice);
      if (maxPrice) (where.dailyPrice as Record<string, unknown>).lte = parseFloat(maxPrice);
    }

    let orderBy: Record<string, string> = { createdAt: "desc" };
    switch (sort) {
      case "price_asc":
        orderBy = { dailyPrice: "asc" };
        break;
      case "price_desc":
        orderBy = { dailyPrice: "desc" };
        break;
      case "most_viewed":
        orderBy = { viewCount: "desc" };
        break;
      case "most_favorited":
        orderBy = { favoriteCount: "desc" };
        break;
      case "newest":
      default:
        orderBy = { createdAt: "desc" };
        break;
    }

    const [items, total] = await Promise.all([
      prisma.item.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
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
            },
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
    console.error("Get items error:", error);
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
        { error: "Your account must be verified to create listings" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const parsed = itemSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Check for banned content
    const titleCheck = checkBannedContent(data.title);
    const descCheck = checkBannedContent(data.description || "");
    const tagsCheck = checkBannedContent((data.tags || []).join(" "));
    if (titleCheck || descCheck || tagsCheck) {
      return Response.json(
        { error: titleCheck || descCheck || tagsCheck, banned: true },
        { status: 400 }
      );
    }

    const item = await prisma.item.create({
      data: {
        title: data.title,
        description: data.description,
        categoryId: data.categoryId,
        ownerId: session.id,
        brand: data.brand || null,
        size: data.size || null,
        condition: data.condition,
        dailyPrice: data.dailyPrice,
        deposit: data.deposit,
        pickupLocation: data.pickupLocation,
        returnLocation: data.returnLocation || null,
        availableFrom: new Date(data.availableFrom),
        availableTo: new Date(data.availableTo),
        safetyNotes: data.safetyNotes || null,
        tags: JSON.stringify(data.tags),
        isHillwalkingRecommended: data.isHillwalkingRecommended,
        status: "PENDING_REVIEW",
      },
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

    return Response.json({ item }, { status: 201 });
  } catch (error) {
    console.error("Create item error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
