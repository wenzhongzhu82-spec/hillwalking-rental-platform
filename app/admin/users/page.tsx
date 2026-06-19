import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { AdminUsersClient } from "./AdminUsersClient";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    if (!session) redirect("/login?redirect=/admin/users");
    redirect("/forbidden");
  }

  const params = await searchParams;
  const page = Number(params.page) || 1;
  const search = (params.search as string) || "";
  const roleFilter = (params.role as string) || "ALL";
  const gradeFilter = (params.grade as string) || "ALL";
  const houseFilter = (params.house as string) || "ALL";
  const pageSize = 20;
  const skip = (page - 1) * pageSize;

  const where: Record<string, unknown> = {};
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { email: { contains: search } },
    ];
  }
  if (roleFilter !== "ALL") {
    where.role = roleFilter;
  }
  if (gradeFilter !== "ALL") {
    where.grade = gradeFilter;
  }
  if (houseFilter !== "ALL") {
    where.house = houseFilter;
  }

  const [users, totalUsers] = await Promise.all([
    prisma.user.findMany({
      where,
      include: {
        _count: {
          select: {
            items: true,
            rentalRequestsAsBorrower: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.user.count({ where }),
  ]);

  const totalPages = Math.ceil(totalUsers / pageSize);

  return (
    <AdminUsersClient
      initialUsers={JSON.parse(JSON.stringify(users))}
      totalUsers={totalUsers}
      currentPage={page}
      totalPages={totalPages}
      currentSearch={search}
      currentRole={roleFilter}
      currentGrade={gradeFilter}
      currentHouse={houseFilter}
    />
  );
}
