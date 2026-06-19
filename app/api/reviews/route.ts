import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { reviewSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!session.verified) {
      return Response.json(
        { error: "Your account must be verified to leave reviews" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return Response.json(
        { error: "orderId is required" },
        { status: 400 }
      );
    }

    const parsed = reviewSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    // Verify order exists and is completed
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        status: true,
        borrowerId: true,
        lenderId: true,
      },
    });

    if (!order) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.status !== "COMPLETED") {
      return Response.json(
        { error: "You can only review completed orders" },
        { status: 400 }
      );
    }

    // Must be borrower or lender of this order
    let revieweeId: string;
    if (order.borrowerId === session.id) {
      revieweeId = order.lenderId;
    } else if (order.lenderId === session.id) {
      revieweeId = order.borrowerId;
    } else {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check no duplicate review from this user for this order
    const existing = await prisma.review.findFirst({
      where: {
        orderId,
        reviewerId: session.id,
      },
    });

    if (existing) {
      return Response.json(
        { error: "You have already reviewed this order" },
        { status: 409 }
      );
    }

    const data = parsed.data;

    const review = await prisma.review.create({
      data: {
        orderId,
        reviewerId: session.id,
        revieweeId,
        rating: data.rating,
        content: data.content || null,
        punctuality: data.punctuality,
        itemAccuracy: data.itemAccuracy,
        communication: data.communication,
        recommended: data.recommended,
      },
      include: {
        reviewer: {
          select: { id: true, name: true, avatar: true },
        },
        reviewee: {
          select: { id: true, name: true, avatar: true },
        },
        order: {
          select: { id: true, itemId: true },
        },
      },
    });

    // Update user's average rating
    const reviewsReceived = await prisma.review.findMany({
      where: { revieweeId },
      select: { rating: true },
    });
    const avgRating =
      reviewsReceived.reduce((sum, r) => sum + r.rating, 0) /
      reviewsReceived.length;

    await prisma.user.update({
      where: { id: revieweeId },
      data: { rating: Math.round(avgRating * 10) / 10 },
    });

    return Response.json({ review }, { status: 201 });
  } catch (error) {
    console.error("Create review error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const userId = searchParams.get("userId");

    if (!userId) {
      return Response.json(
        { error: "userId query parameter is required" },
        { status: 400 }
      );
    }

    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));

    const where = { revieweeId: userId };

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          reviewer: {
            select: { id: true, name: true, avatar: true },
          },
          order: {
            select: { id: true, itemId: true },
          },
        },
      }),
      prisma.review.count({ where }),
    ]);

    // Compute averages
    const allReviews = await prisma.review.findMany({
      where,
      select: {
        rating: true,
        punctuality: true,
        itemAccuracy: true,
        communication: true,
      },
    });

    const averages =
      allReviews.length > 0
        ? {
            rating: Math.round(
              (allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length) * 10
            ) / 10,
            punctuality: Math.round(
              (allReviews.reduce((s, r) => s + r.punctuality, 0) / allReviews.length) * 10
            ) / 10,
            itemAccuracy: Math.round(
              (allReviews.reduce((s, r) => s + r.itemAccuracy, 0) / allReviews.length) * 10
            ) / 10,
            communication: Math.round(
              (allReviews.reduce((s, r) => s + r.communication, 0) / allReviews.length) * 10
            ) / 10,
          }
        : null;

    return Response.json({
      reviews,
      averages,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get reviews error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
