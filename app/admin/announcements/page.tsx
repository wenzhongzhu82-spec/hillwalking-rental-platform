import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { AdminAnnouncementsClient } from "./AdminAnnouncementsClient";

export const dynamic = "force-dynamic";

export default async function AdminAnnouncementsPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    if (!session) redirect("/login?redirect=/admin/announcements");
    redirect("/forbidden");
  }

  const announcements = await prisma.announcement.findMany({
    include: {
      createdBy: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <AdminAnnouncementsClient
      initialAnnouncements={JSON.parse(JSON.stringify(announcements))}
    />
  );
}
