import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import FavoritesContent from "./FavoritesContent";

export const dynamic = "force-dynamic";

export default async function FavoritesPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.id },
    orderBy: { createdAt: "desc" },
    include: {
      item: {
        include: {
          category: { select: { id: true, name: true, slug: true } },
          owner: {
            select: {
              id: true,
              name: true,
              avatar: true,
              rating: true,
              verified: true,
            },
          },
        },
      },
    },
  });

  // Parse JSON fields and map to ItemCard format
  const items = favorites.map((fav) => {
    const item = fav.item;
    let images: string[] = [];
    let tags: string[] = [];
    try {
      images = JSON.parse(item.images);
    } catch {
      images = [];
    }
    try {
      tags = JSON.parse(item.tags);
    } catch {
      tags = [];
    }

    return {
      id: item.id,
      title: item.title,
      images,
      dailyPrice: item.dailyPrice,
      deposit: item.deposit,
      condition: item.condition,
      tags,
      owner: {
        id: item.owner.id,
        name: item.owner.name,
        avatar: item.owner.avatar,
        verified: item.owner.verified,
      },
      isFavorite: true,
      pickupLocation: item.pickupLocation,
    };
  });

  return <FavoritesContent initialItems={JSON.parse(JSON.stringify(items))} />;
}
