import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { AdminItemsClient } from "./AdminItemsClient";

export const dynamic = "force-dynamic";

export default async function AdminItemsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    if (!session) redirect("/login?redirect=/admin/items");
    redirect("/forbidden");
  }

  const params = await searchParams;
  const page = Number(params.page) || 1;
  const search = (params.search as string) || "";
  const statusFilter = (params.status as string) || "ALL";
  const pageSize = 20;
  const skip = (page - 1) * pageSize;

  // Build where clause
  const where: Record<string, unknown> = {};
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { owner: { name: { contains: search } } },
    ];
  }
  if (statusFilter !== "ALL") {
    where.status = statusFilter;
  }

  const [items, totalItems] = await Promise.all([
    prisma.item.findMany({
      where,
      include: {
        owner: { select: { id: true, name: true, email: true } },
        category: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.item.count({ where }),
  ]);

  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <AdminItemsClient
      initialItems={JSON.parse(JSON.stringify(items))}
      totalItems={totalItems}
      currentPage={page}
      totalPages={totalPages}
      currentSearch={search}
      currentStatus={statusFilter}
    />
  );
}
