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
    const itemId = searchParams.get("itemId");
    if (itemId) {
      const fav = await prisma.favorite.findUnique({
        where: { userId_itemId: { userId: session.id, itemId } },
      });
      return Response.json({ isFavorite: !!fav });
    }
    const favorites = await prisma.favorite.findMany({
      where: { userId: session.id },
      include: {
        item: {
          include: {
            category: { select: { id: true, name: true, slug: true } },
            owner: { select: { id: true, name: true, avatar: true, rating: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return Response.json({ favorites });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { itemId } = await request.json();
    if (!itemId) {
      return Response.json({ error: "itemId required" }, { status: 400 });
    }
    const existing = await prisma.favorite.findUnique({
      where: { userId_itemId: { userId: session.id, itemId } },
    });
    if (existing) {
      return Response.json({ favorite: existing });
    }
    const fav = await prisma.favorite.create({
      data: { userId: session.id, itemId },
    });
    await prisma.item.update({
      where: { id: itemId },
      data: { favoriteCount: { increment: 1 } },
    });
    return Response.json({ favorite: fav }, { status: 201 });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { itemId } = await request.json();
    if (!itemId) {
      return Response.json({ error: "itemId required" }, { status: 400 });
    }
    await prisma.favorite.deleteMany({
      where: { userId: session.id, itemId },
    });
    await prisma.item.update({
      where: { id: itemId },
      data: { favoriteCount: { decrement: 1 } },
    });
    return Response.json({ success: true });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Internal error" }, { status: 500 });
  }
}
