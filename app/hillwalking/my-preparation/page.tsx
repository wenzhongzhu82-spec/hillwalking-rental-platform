import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { MyPreparationClient } from "./MyPreparationClient";

export const dynamic = "force-dynamic";

export default async function MyPreparationPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login?redirect=/hillwalking/my-preparation");
  }

  const [gearItems, userEntries, activeOrders] = await Promise.all([
    prisma.gearChecklistItem.findMany({
      orderBy: [{ importance: "desc" }, { name: "asc" }],
    }),
    prisma.userGearChecklist.findMany({
      where: { userId: session.id },
    }),
    prisma.order.findMany({
      where: {
        borrowerId: session.id,
        status: {
          in: [
            "REQUEST_PENDING",
            "ACCEPTED",
            "WAITING_PICKUP",
            "PICKED_UP",
            "IN_USE",
          ],
        },
      },
      include: {
        item: {
          select: { id: true, title: true, images: true, dailyPrice: true },
        },
        lender: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  // Build lookup map
  const userChecklistMap: Record<
    string,
    { status: string; linkedRentalOrderId: string | null }
  > = {};
  for (const entry of userEntries) {
    userChecklistMap[entry.gearItemId] = {
      status: entry.status,
      linkedRentalOrderId: entry.linkedRentalOrderId,
    };
  }

  const totalItems = gearItems.length;
  const haveItems = userEntries.filter((e) => e.status === "HAVE").length;
  const needItems = userEntries.filter((e) => e.status === "NEED").length;
  const reservedItems = userEntries.filter((e) =>
    ["RESERVED", "RECEIVED"].includes(e.status)
  ).length;
  const preparedCount = haveItems + reservedItems;

  return (
    <MyPreparationClient
      gearItems={JSON.parse(JSON.stringify(gearItems))}
      userChecklistMap={userChecklistMap}
      activeOrders={JSON.parse(JSON.stringify(activeOrders))}
      totalItems={totalItems}
      haveCount={haveItems}
      needCount={needItems}
      reservedCount={reservedItems}
      preparedCount={preparedCount}
    />
  );
}
