import { prisma } from "@/lib/prisma";

export interface RecommendationResult {
  item: {
    id: string;
    title: string;
    dailyPrice: number;
    deposit: number;
    pickupLocation: string;
    isHillwalkingRecommended: boolean;
    status: string;
    availableFrom: Date;
    availableTo: Date;
    owner: { id: string; name: string; rating: number };
    category: { id: string; name: string; slug: string } | null;
  };
  score: number;
  reasons: string[];
}

export async function getEventRecommendations(
  eventDate: Date,
  limit = 12
): Promise<RecommendationResult[]> {
  const items = await prisma.item.findMany({
    where: {
      status: "AVAILABLE",
      availableFrom: { lte: eventDate },
      availableTo: { gte: eventDate },
    },
    include: {
      owner: { select: { id: true, name: true, rating: true } },
      category: { select: { id: true, name: true, slug: true } },
    },
    take: 50,
  });

  const results: RecommendationResult[] = items.map((item) => {
    let score = 50;
    const reasons: string[] = [];

    if (item.isHillwalkingRecommended) {
      score += 30;
      reasons.push("Hillwalking recommended");
    }

    const availableStart = new Date(item.availableFrom);
    const availableEnd = new Date(item.availableTo);
    if (availableStart <= eventDate && availableEnd >= eventDate) {
      score += 20;
      reasons.push("Available on your date");
    } else {
      score -= 20;
    }

    if (item.owner.rating >= 4.5) {
      score += 15;
      reasons.push("High-rated lender");
    }

    if (
      item.pickupLocation.toLowerCase().includes("campus") ||
      item.pickupLocation.toLowerCase().includes("antuo")
    ) {
      score += 15;
      reasons.push("Campus pickup");
    }

    if (item.dailyPrice === 0) {
      score += 20;
      reasons.push("Free to borrow");
    } else if (item.dailyPrice <= 10) {
      score += 10;
      reasons.push("Affordable price");
    }

    if (item.deposit <= 100) {
      score += 10;
      reasons.push("Low deposit");
    }

    return { item, score, reasons };
  });

  return results.sort((a, b) => b.score - a.score).slice(0, limit);
}
