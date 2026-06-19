import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Users,
  Package,
  ClipboardList,
  Clock,
  Flag,
  TrendingUp,
  ShoppingCart,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Eye,
  Star,
  Tag,
  AlertTriangle,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { formatDate, formatPrice, timeAgo, shortenText } from "@/lib/utils";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    // layout should catch this, but double-check
    if (!session) redirect("/login?redirect=/admin");
    redirect("/forbidden");
  }

  const [
    totalUsers,
    totalItems,
    activeItems,
    pendingItems,
    openReports,
    activeOrders,
    pendingReviewItems,
    openReportsList,
    recentOrders,
    categoryStats,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.item.count(),
    prisma.item.count({ where: { status: "AVAILABLE" } }),
    prisma.item.count({ where: { status: "PENDING_REVIEW" } }),
    prisma.report.count({ where: { status: "PENDING" } }),
    prisma.order.count({
      where: {
        status: { in: ["REQUEST_PENDING", "ACCEPTED", "WAITING_PICKUP", "PICKED_UP", "IN_USE"] },
      },
    }),
    prisma.item.findMany({
      where: { status: "PENDING_REVIEW" },
      include: {
        owner: { select: { name: true } },
        category: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.report.findMany({
      where: { status: "PENDING" },
      include: {
        reporter: { select: { name: true } },
        item: { select: { title: true } },
        targetUser: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.order.findMany({
      include: {
        item: { select: { title: true } },
        borrower: { select: { name: true } },
        lender: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.category.findMany({
      include: { _count: { select: { items: true } } },
      orderBy: { items: { _count: "desc" } },
      take: 6,
    }),
  ]);

  const stats = [
    {
      label: "Total Users",
      value: totalUsers,
      icon: Users,
      color: "bg-info-light text-info",
    },
    {
      label: "Total Items",
      value: totalItems,
      icon: Package,
      color: "bg-primary-50 text-primary",
    },
    {
      label: "Active Items",
      value: activeItems,
      icon: CheckCircle2,
      color: "bg-success-light text-success",
    },
    {
      label: "Pending Review",
      value: pendingItems,
      icon: Clock,
      color: "bg-warning-light text-accent-darker",
    },
    {
      label: "Open Reports",
      value: openReports,
      icon: Flag,
      color: "bg-error-light text-error",
    },
    {
      label: "Active Orders",
      value: activeOrders,
      icon: ShoppingCart,
      color: "bg-accent-50 text-accent-darker",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Admin Dashboard
        </h1>
        <p className="text-sm text-muted mt-1">
          Overview of the Hillwalking Rental Platform
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-border-light shadow-sm p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", stat.color)}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Pending Review Items + Open Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Review Items */}
        <div className="bg-white rounded-xl border border-border-light shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border-light">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Clock className="w-5 h-5 text-accent" />
              Pending Review Items
            </h3>
            <Link
              href="/admin/items"
              className="text-sm text-primary hover:text-primary-light font-medium flex items-center gap-1"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-border-light">
            {pendingReviewItems.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-muted">
                <CheckCircle2 className="w-8 h-8 text-success mx-auto mb-2" />
                No items pending review.
              </div>
            ) : (
              pendingReviewItems.map((item) => (
                <div
                  key={item.id}
                  className="px-5 py-4 flex items-center justify-between gap-4 hover:bg-surface/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground truncate">
                        {item.title}
                      </p>
                      {item.isHillwalkingRecommended && (
                        <span className="text-xs bg-accent-50 text-accent-darker px-1.5 py-0.5 rounded font-medium flex-shrink-0">
                          Hillwalking
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted mt-0.5">
                      by {item.owner.name} in {item.category.name} &middot;{" "}
                      {timeAgo(item.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Link
                      href={`/items/${item.id}`}
                      className="p-1.5 rounded-lg text-muted hover:text-primary hover:bg-primary-50 transition-colors"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Open Reports */}
        <div className="bg-white rounded-xl border border-border-light shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border-light">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Flag className="w-5 h-5 text-error" />
              Open Reports
            </h3>
            <Link
              href="/admin/reports"
              className="text-sm text-primary hover:text-primary-light font-medium flex items-center gap-1"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-border-light">
            {openReportsList.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-muted">
                <CheckCircle2 className="w-8 h-8 text-success mx-auto mb-2" />
                No open reports.
              </div>
            ) : (
              openReportsList.map((report) => (
                <div
                  key={report.id}
                  className="px-5 py-4 hover:bg-surface/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-error bg-error-light px-2 py-0.5 rounded-full">
                          {report.reason.replace(/_/g, " ")}
                        </span>
                        <span className="text-xs text-muted">
                          {timeAgo(report.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-foreground">
                        Reported by {report.reporter.name}
                      </p>
                      {(report.item || report.targetUser) && (
                        <p className="text-xs text-muted mt-0.5">
                          Target:{" "}
                          {report.item
                            ? `Item "${report.item.title}"`
                            : report.targetUser
                              ? `User "${report.targetUser.name}"`
                              : "N/A"}
                        </p>
                      )}
                      {report.description && (
                        <p className="text-xs text-muted mt-1 line-clamp-1">
                          {report.description}
                        </p>
                      )}
                    </div>
                    <Link
                      href={`/admin/reports`}
                      className="text-xs text-primary hover:underline flex-shrink-0"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders + Popular Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl border border-border-light shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border-light">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-primary" />
              Recent Orders
            </h3>
            <span className="text-sm text-muted">Latest {recentOrders.length}</span>
          </div>
          <div className="divide-y divide-border-light">
            {recentOrders.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-muted">
                No orders yet.
              </div>
            ) : (
              recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="px-5 py-3.5 flex items-center justify-between gap-3 hover:bg-surface/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {order.item.title}
                    </p>
                    <p className="text-xs text-muted">
                      {order.borrower.name} &rarr; from {order.lender.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-sm font-medium text-primary">
                      {formatPrice(order.totalPrice)}
                    </span>
                    <span className="text-xs bg-surface-dark text-muted-dark px-2 py-0.5 rounded-full">
                      {order.status.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Popular Categories */}
        <div className="bg-white rounded-xl border border-border-light shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border-light">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Tag className="w-5 h-5 text-accent" />
              Popular Categories
            </h3>
          </div>
          <div className="divide-y divide-border-light">
            {categoryStats.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-muted">
                No categories yet.
              </div>
            ) : (
              categoryStats.map((cat, i) => (
                <div
                  key={cat.id}
                  className="px-5 py-3.5 flex items-center justify-between hover:bg-surface/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold",
                        i === 0
                          ? "bg-accent text-white"
                          : i === 1
                            ? "bg-primary-100 text-primary"
                            : i === 2
                              ? "bg-surface-dark text-muted-dark"
                              : "bg-surface text-muted-light"
                      )}
                    >
                      {i + 1}
                    </span>
                    <p className="text-sm font-medium text-foreground">
                      {cat.name}
                    </p>
                  </div>
                  <span className="text-sm text-muted">
                    {cat._count.items} items
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-xl border border-border-light shadow-sm p-5">
        <h3 className="font-semibold text-foreground mb-3">Quick Actions</h3>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/items"
            className="px-4 py-2 bg-primary-50 text-primary text-sm font-medium rounded-lg hover:bg-primary-100 transition-colors"
          >
            Review Items ({pendingItems})
          </Link>
          <Link
            href="/admin/reports"
            className="px-4 py-2 bg-error-light text-error text-sm font-medium rounded-lg hover:bg-red-100 transition-colors"
          >
            Handle Reports ({openReports})
          </Link>
          <Link
            href="/admin/announcements"
            className="px-4 py-2 bg-info-light text-info text-sm font-medium rounded-lg hover:bg-blue-100 transition-colors"
          >
            Create Announcement
          </Link>
          <Link
            href="/admin/users"
            className="px-4 py-2 bg-surface text-muted-dark text-sm font-medium rounded-lg hover:bg-surface-dark transition-colors"
          >
            Manage Users
          </Link>
        </div>
      </div>
    </div>
  );
}
