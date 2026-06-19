import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const [
      totalUsers,
      totalItems,
      activeItems,
      pendingItems,
      pendingReports,
      ordersByStatus,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.item.count(),
      prisma.item.count({ where: { status: "AVAILABLE" } }),
      prisma.item.count({ where: { status: "PENDING_REVIEW" } }),
      prisma.report.count({ where: { status: "PENDING" } }),
      prisma.order.groupBy({
        by: ["status"],
        _count: { id: true },
      }),
    ]);

    const orderStats: Record<string, number> = {
      REQUEST_PENDING: 0,
      ACCEPTED: 0,
      REJECTED: 0,
      CANCELLED: 0,
      WAITING_PICKUP: 0,
      PICKED_UP: 0,
      IN_USE: 0,
      RETURN_REQUESTED: 0,
      RETURNED: 0,
      COMPLETED: 0,
      DISPUTE_OPENED: 0,
    };

    for (const row of ordersByStatus) {
      orderStats[row.status] = row._count.id;
    }

    const totalOrders = Object.values(orderStats).reduce((a, b) => a + b, 0);

    return Response.json({
      stats: {
        totalUsers,
        totalItems,
        activeItems,
        pendingItems,
        pendingReports,
        totalOrders,
        ordersByStatus: orderStats,
      },
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
