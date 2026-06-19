import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { GearChecklistClient } from "./GearChecklistClient";

export const dynamic = "force-dynamic";

export default async function HillwalkingChecklistPage() {
  const session = await getSession();

  const gearItems = await prisma.gearChecklistItem.findMany({
    orderBy: [{ importance: "desc" }, { name: "asc" }],
  });

  let userChecklist: Record<string, string> = {};
  if (session) {
    const entries = await prisma.userGearChecklist.findMany({
      where: { userId: session.id },
    });
    for (const entry of entries) {
      userChecklist[entry.gearItemId] = entry.status;
    }
  }

  return (
    <GearChecklistClient
      gearItems={JSON.parse(JSON.stringify(gearItems))}
      userChecklist={userChecklist}
      isLoggedIn={!!session}
    />
  );
}
