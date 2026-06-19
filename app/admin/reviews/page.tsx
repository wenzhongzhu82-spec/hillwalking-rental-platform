import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import Link from "next/link";
import { ShieldCheck, CheckCircle2, XCircle, Eye, Clock } from "lucide-react";
import { cn, formatDate, formatPrice, timeAgo } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/forbidden");

  const pendingItems = await prisma.item.findMany({
    where: { status: "PENDING_REVIEW" },
    orderBy: { createdAt: "desc" },
    include: {
      owner: { select: { id: true, name: true, email: true } },
      category: { select: { id: true, name: true } },
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Item Reviews</h1>
          <p className="text-sm text-muted mt-1">
            {pendingItems.length} items pending approval
          </p>
        </div>
      </div>

      {pendingItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-surface-dark">
          <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-3" />
          <p className="text-lg font-semibold text-foreground">All caught up!</p>
          <p className="text-sm text-muted mt-1">No items pending review.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pendingItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-surface-dark p-5 hover:border-primary-light transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                    <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium">
                      Pending Review
                    </span>
                  </div>
                  <p className="text-sm text-muted line-clamp-2 mb-2">{item.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted">
                    <span>{item.category?.name || "Uncategorized"}</span>
                    <span>{formatPrice(item.dailyPrice)}/day</span>
                    <span>Deposit ¥{item.deposit}</span>
                    <span>By: {item.owner.name}</span>
                    <span>{timeAgo(item.createdAt)}</span>
                  </div>
                  {item.safetyNotes && (
                    <p className="text-xs text-warning mt-1">⚠️ Safety: {item.safetyNotes}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link
                    href={`/items/${item.id}`}
                    className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-surface transition-colors"
                    title="View item"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
