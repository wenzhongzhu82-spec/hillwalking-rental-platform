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
    const eventDateStr = searchParams.get("eventDate");

    if (!eventDateStr) {
      return Response.json(
        { error: "eventDate query parameter is required (ISO date string)" },
        { status: 400 }
      );
    }

    const eventDate = new Date(eventDateStr);
    if (isNaN(eventDate.getTime())) {
      return Response.json(
        { error: "Invalid eventDate format" },
        { status: 400 }
      );
    }

    // Find items that are:
    // - Hillwalking recommended
    // - Available during the event date
    // - Not owned by the current user
    const items = await prisma.item.findMany({
      where: {
        isHillwalkingRecommended: true,
        status: "AVAILABLE",
        availableFrom: { lte: eventDate },
        availableTo: { gte: eventDate },
        ownerId: { not: session.id },
      },
      orderBy: [
        { matchScore: "desc" },
        { favoriteCount: "desc" },
        { viewCount: "desc" },
      ],
      take: 30,
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
    });

    // Get the user's checklist to show which recommended items they still need
    const userChecklist = await prisma.userGearChecklist.findMany({
      where: {
        userId: session.id,
        status: { in: ["NEED"] },
      },
      select: { gearItemId: true },
    });

    const neededGearIds = new Set(
      userChecklist.map((e) => e.gearItemId)
    );

    // Get gear checklist items for context
    const gearItems = await prisma.gearChecklistItem.findMany({
      select: { id: true, name: true, category: true },
    });

    return Response.json({
      eventDate,
      recommendations: items,
      userNeededGear: gearItems.filter((g) => neededGearIds.has(g.id)),
      total: items.length,
    });
  } catch (error) {
    console.error("Get recommendations error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
