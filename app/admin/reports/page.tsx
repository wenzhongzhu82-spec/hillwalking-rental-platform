import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { AdminReportsClient } from "./AdminReportsClient";

export const dynamic = "force-dynamic";

export default async function AdminReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    if (!session) redirect("/login?redirect=/admin/reports");
    redirect("/forbidden");
  }

  const params = await searchParams;
  const page = Number(params.page) || 1;
  const statusFilter = (params.status as string) || "PENDING";
  const pageSize = 20;
  const skip = (page - 1) * pageSize;

  const where: Record<string, unknown> = {};
  if (statusFilter !== "ALL") {
    where.status = statusFilter;
  }

  const [reports, totalReports] = await Promise.all([
    prisma.report.findMany({
      where,
      include: {
        reporter: { select: { id: true, name: true, email: true } },
        item: { select: { id: true, title: true } },
        targetUser: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.report.count({ where }),
  ]);

  const totalPages = Math.ceil(totalReports / pageSize);

  return (
    <AdminReportsClient
      initialReports={JSON.parse(JSON.stringify(reports))}
      totalReports={totalReports}
      currentPage={page}
      totalPages={totalPages}
      currentStatus={statusFilter}
    />
  );
}
