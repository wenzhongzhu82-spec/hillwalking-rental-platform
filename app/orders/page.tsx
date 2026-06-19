import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { OrdersContent } from "./OrdersContent";

export const dynamic = "force-dynamic";

interface OrdersPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const params = await searchParams;
  const tab = (params.tab as string) || "all";
  const statusFilter = (params.status as string) || "";

  // Fetch counts for all tabs
  const [borrowerCount, lenderCount, allCount] = await Promise.all([
    prisma.order.count({ where: { borrowerId: session.id } }),
    prisma.order.count({ where: { lenderId: session.id } }),
    prisma.order.count({
      where: {
        OR: [{ borrowerId: session.id }, { lenderId: session.id }],
      },
    }),
  ]);

  // Build where clause
  const whereClause: Record<string, unknown> = {};

  if (tab === "borrower") {
    whereClause.borrowerId = session.id;
  } else if (tab === "lender") {
    whereClause.lenderId = session.id;
  } else {
    whereClause.OR = [
      { borrowerId: session.id },
      { lenderId: session.id },
    ];
  }

  if (statusFilter) {
    whereClause.status = statusFilter;
  }

  // Fetch orders
  const orders = await prisma.order.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      item: {
        select: {
          id: true,
          title: true,
          images: true,
          dailyPrice: true,
          deposit: true,
        },
      },
      borrower: {
        select: { id: true, name: true, avatar: true, rating: true },
      },
      lender: {
        select: { id: true, name: true, avatar: true, rating: true },
      },
    },
  });

  const serializedOrders = JSON.parse(JSON.stringify(orders));
  const counts = { borrower: borrowerCount, lender: lenderCount, all: allCount };

  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-surface-dark rounded-xl" />
            ))}
          </div>
        </div>
      }
    >
      <OrdersContent
        orders={serializedOrders}
        counts={counts}
        currentTab={tab}
        currentStatus={statusFilter}
        userId={session.id}
      />
    </Suspense>
  );
}
