import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSession();

    const items = await prisma.gearChecklistItem.findMany({
      orderBy: [{ category: "asc" }, { importance: "desc" }],
    });

    let userChecklist: Record<string, { status: string; id: string }> = {};

    if (session) {
      const entries = await prisma.userGearChecklist.findMany({
        where: { userId: session.id },
        select: {
          id: true,
          gearItemId: true,
          status: true,
          linkedRentalOrderId: true,
        },
      });

      for (const entry of entries) {
        userChecklist[entry.gearItemId] = {
          status: entry.status,
          id: entry.id,
        };
      }
    }

    return Response.json({ items, userChecklist });
  } catch (error) {
    console.error("Get checklist error:", error);
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
    const { gearItemId, status } = body;

    if (!gearItemId || !status) {
      return Response.json(
        { error: "gearItemId and status are required" },
        { status: 400 }
      );
    }

    const validStatuses = ["HAVE", "NEED", "RESERVED", "RECEIVED", "RETURNED"];
    if (!validStatuses.includes(status)) {
      return Response.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    // Verify gear item exists
    const gearItem = await prisma.gearChecklistItem.findUnique({
      where: { id: gearItemId },
    });

    if (!gearItem) {
      return Response.json(
        { error: "Gear checklist item not found" },
        { status: 404 }
      );
    }

    // Upsert the user's checklist entry
    const entry = await prisma.userGearChecklist.upsert({
      where: {
        id: (
          await prisma.userGearChecklist.findFirst({
            where: {
              userId: session.id,
              gearItemId,
            },
          })
        )?.id || "new",
      },
      update: { status },
      create: {
        userId: session.id,
        gearItemId,
        status,
      },
    });

    return Response.json({ entry });
  } catch (error) {
    console.error("Update checklist error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
