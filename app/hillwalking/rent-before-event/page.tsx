import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { RentBeforeEventClient } from "./RentBeforeEventClient";

export const dynamic = "force-dynamic";

export default async function RentBeforeEventPage() {
  const session = await getSession();

  // Get all Hillwalking recommended items that are available
  const allRecommendedItems = await prisma.item.findMany({
    where: {
      isHillwalkingRecommended: true,
      status: { in: ["AVAILABLE", "PENDING_REVIEW"] },
    },
    include: {
      owner: {
        select: { id: true, name: true, rating: true, grade: true },
      },
      category: { select: { name: true, icon: true } },
    },
    orderBy: [{ matchScore: "desc" }, { dailyPrice: "asc" }],
  });

  const upcomingEvents = await prisma.hillwalkingEvent.findMany({
    where: { eventDate: { gte: new Date() }, isActive: true },
    orderBy: { eventDate: "asc" },
    take: 5,
  });

  return (
    <RentBeforeEventClient
      allItems={JSON.parse(JSON.stringify(allRecommendedItems))}
      upcomingEvents={JSON.parse(JSON.stringify(upcomingEvents))}
    />
  );
}
