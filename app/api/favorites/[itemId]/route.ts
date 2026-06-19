import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { itemId } = await params;

    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_itemId: {
          userId: session.id,
          itemId,
        },
      },
    });

    if (!favorite) {
      return Response.json(
        { error: "Favorite not found" },
        { status: 404 }
      );
    }

    await prisma.favorite.delete({
      where: { id: favorite.id },
    });

    // Decrement favoriteCount on item (min 0)
    await prisma.item.update({
      where: { id: itemId },
      data: { favoriteCount: { decrement: 1 } },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Remove favorite error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
