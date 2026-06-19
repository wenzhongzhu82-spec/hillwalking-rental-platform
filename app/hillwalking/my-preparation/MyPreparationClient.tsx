"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Backpack,
  CheckCircle2,
  Circle,
  Clock,
  ShoppingCart,
  ArrowRight,
  Mountain,
  Search,
  Package,
  ChevronDown,
  PackageSearch,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface GearItem {
  id: string;
  name: string;
  category: string;
  importance: number;
  description: string | null;
  recommendedForWeather: string | null;
  icon: string | null;
}

interface ActiveOrder {
  id: string;
  status: string;
  startDate: string;
  endDate: string;
  item: {
    id: string;
    title: string;
    images: string;
    dailyPrice: number;
  };
  lender: { id: string; name: string };
}

interface MyPreparationClientProps {
  gearItems: GearItem[];
  userChecklistMap: Record<
    string,
    { status: string; linkedRentalOrderId: string | null }
  >;
  activeOrders: ActiveOrder[];
  totalItems: number;
  haveCount: number;
  needCount: number;
  reservedCount: number;
  preparedCount: number;
}

const ORDER_STATUS_LABELS: Record<string, string> = {
  REQUEST_PENDING: "Awaiting Confirmation",
  ACCEPTED: "Accepted",
  WAITING_PICKUP: "Ready to Pick Up",
  PICKED_UP: "Picked Up",
  IN_USE: "In Use",
  RETURN_REQUESTED: "Return Requested",
  RETURNED: "Returned",
  COMPLETED: "Completed",
};

const ORDER_STATUS_COLORS: Record<string, string> = {
  REQUEST_PENDING: "bg-warning-light text-accent-darker",
  ACCEPTED: "bg-info-light text-info",
  WAITING_PICKUP: "bg-primary-50 text-primary",
  PICKED_UP: "bg-success-light text-success",
  IN_USE: "bg-accent-50 text-accent-darker",
};

export function MyPreparationClient({
  gearItems,
  userChecklistMap,
  activeOrders,
  totalItems,
  haveCount,
  needCount,
  reservedCount,
  preparedCount,
}: MyPreparationClientProps) {
  const router = useRouter();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [localMap, setLocalMap] = useState(userChecklistMap);

  const progressPercent =
    totalItems > 0 ? Math.round((preparedCount / totalItems) * 100) : 0;

  const updateStatus = useCallback(
    async (gearItemId: string, status: string) => {
      setUpdatingId(gearItemId);
      try {
        const res = await fetch("/api/hillwalking/checklist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ gearItemId, status }),
        });
        if (res.ok) {
          setLocalMap((prev) => ({
            ...prev,
            [gearItemId]: { status, linkedRentalOrderId: null },
          }));
          router.refresh();
        }
      } catch {
        // silently fail
      } finally {
        setUpdatingId(null);
      }
    },
    [router]
  );

  const haveItems = gearItems.filter(
    (item) => localMap[item.id]?.status === "HAVE"
  );
  const needItems = gearItems.filter(
    (item) =>
      localMap[item.id]?.status === "NEED" || !localMap[item.id]
  );
  const reservedReceivedItems = gearItems.filter((item) =>
    ["RESERVED", "RECEIVED"].includes(localMap[item.id]?.status || "")
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-primary-gradient py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-3">
            <Backpack className="w-8 h-8 text-accent" />
            <h1 className="text-3xl font-bold text-white">
              My Hillwalking Preparation
            </h1>
          </div>
          <p className="text-white/80 max-w-2xl">
            Track your hillwalking gear preparation. See what you already own,
            what you need to rent, and what you have reserved.
          </p>
        </div>
      </section>

      {/* Progress Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        <div className="bg-white rounded-xl border border-border-light shadow-md p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-foreground">
              Preparation Progress
            </h2>
            <span
              className={cn(
                "text-sm font-bold",
                progressPercent === 100
                  ? "text-success"
                  : progressPercent >= 50
                    ? "text-accent-darker"
                    : "text-muted"
              )}
            >
              {progressPercent}%
            </span>
          </div>
          <div className="h-3 bg-surface-dark rounded-full overflow-hidden mb-3">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-700 ease-out",
                progressPercent === 100
                  ? "bg-success"
                  : progressPercent >= 50
                    ? "bg-accent"
                    : "bg-primary"
              )}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span className="font-medium">{haveCount} Owned</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShoppingCart className="w-4 h-4 text-accent" />
              <span className="font-medium">{reservedCount} Reserved</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Circle className="w-4 h-4 text-muted-light" />
              <span className="font-medium">{needCount} Need to Rent</span>
            </div>
          </div>
          {preparedCount === totalItems && totalItems > 0 && (
            <div className="mt-4 p-3 bg-success-light rounded-lg flex items-center gap-2 text-sm text-success">
              <CheckCircle2 className="w-4 h-4" />
              You are fully prepared for your hillwalking adventure!
            </div>
          )}
        </div>
      </section>

      {/* Three Columns */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {totalItems === 0 ? (
          <div className="text-center py-16">
            <PackageSearch className="w-12 h-12 text-muted-light mx-auto mb-3" />
            <p className="text-muted text-lg mb-2">
              No gear items to prepare yet.
            </p>
            <p className="text-muted-light text-sm mb-4">
              Start by checking the Gear Checklist and marking items you own or
              need.
            </p>
            <Link
              href="/hillwalking/checklist"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-medium rounded-xl hover:bg-primary-light transition-colors"
            >
              <Search className="w-4 h-4" />
              View Gear Checklist
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* I Have (Green) */}
            <div>
              <div className="bg-white rounded-xl border border-border-light shadow-sm overflow-hidden">
                <div className="px-5 py-4 bg-success-light border-b border-success/20">
                  <h3 className="font-semibold text-success flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />I Have
                  </h3>
                  <p className="text-xs text-success/70 mt-0.5">
                    Items you already own — no need to rent
                  </p>
                </div>
                <div className="divide-y divide-border-light">
                  {haveItems.length === 0 ? (
                    <div className="px-5 py-8 text-center text-sm text-muted">
                      <CheckCircle2 className="w-8 h-8 text-muted-light mx-auto mb-2" />
                      <p>No items marked as owned yet.</p>
                      <p className="text-xs mt-1">
                        Mark items from the checklist page.
                      </p>
                    </div>
                  ) : (
                    haveItems.map((item) => (
                      <div key={item.id} className="px-5 py-3.5">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {item.name}
                            </p>
                            {item.description && (
                              <p className="text-xs text-muted mt-0.5 line-clamp-1">
                                {item.description}
                              </p>
                            )}
                          </div>
                          <select
                            value="HAVE"
                            disabled={updatingId === item.id}
                            onChange={(e) =>
                              updateStatus(item.id, e.target.value)
                            }
                            className="text-xs px-2 py-1 rounded border border-success/20 bg-white text-success cursor-pointer"
                          >
                            <option value="HAVE">I Have</option>
                            <option value="NEED">Need</option>
                            <option value="RESERVED">Reserved</option>
                          </select>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Need to Rent (Orange) */}
            <div>
              <div className="bg-white rounded-xl border border-border-light shadow-sm overflow-hidden">
                <div className="px-5 py-4 bg-warning-light border-b border-warning/20">
                  <h3 className="font-semibold text-accent-darker flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    Need to Rent
                  </h3>
                  <p className="text-xs text-accent-darker/70 mt-0.5">
                    Items you need — find and rent them below
                  </p>
                </div>
                <div className="divide-y divide-border-light">
                  {needItems.length === 0 ? (
                    <div className="px-5 py-8 text-center text-sm text-muted">
                      <Search className="w-8 h-8 text-muted-light mx-auto mb-2" />
                      <p>No items needed.</p>
                      <p className="text-xs mt-1">
                        You are all set for hillwalking!
                      </p>
                    </div>
                  ) : (
                    needItems.map((item) => (
                      <div key={item.id} className="px-5 py-3.5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground">
                              {item.name}
                            </p>
                            {item.description && (
                              <p className="text-xs text-muted mt-0.5 line-clamp-1">
                                {item.description}
                              </p>
                            )}
                            <Link
                              href={`/marketplace?search=${encodeURIComponent(item.name)}`}
                              className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-accent hover:text-accent-dark transition-colors"
                            >
                              <Package className="w-3.5 h-3.5" />
                              Find to Rent
                              <ArrowRight className="w-3 h-3" />
                            </Link>
                          </div>
                          <select
                            value={localMap[item.id]?.status || "NEED"}
                            disabled={updatingId === item.id}
                            onChange={(e) =>
                              updateStatus(item.id, e.target.value)
                            }
                            className="text-xs px-2 py-1 rounded border border-accent/20 bg-white text-accent-darker cursor-pointer flex-shrink-0"
                          >
                            <option value="NEED">Need</option>
                            <option value="HAVE">I Have</option>
                            <option value="RESERVED">Reserved</option>
                          </select>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Reserved/Received (Blue) */}
            <div>
              <div className="bg-white rounded-xl border border-border-light shadow-sm overflow-hidden">
                <div className="px-5 py-4 bg-info-light border-b border-info/20">
                  <h3 className="font-semibold text-info flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Reserved / Received
                  </h3>
                  <p className="text-xs text-info/70 mt-0.5">
                    Items you have reserved or received
                  </p>
                </div>
                <div className="divide-y divide-border-light">
                  {reservedReceivedItems.length === 0 && activeOrders.length === 0 ? (
                    <div className="px-5 py-8 text-center text-sm text-muted">
                      <Clock className="w-8 h-8 text-muted-light mx-auto mb-2" />
                      <p>No reserved items yet.</p>
                      <p className="text-xs mt-1">
                        Rent items from the marketplace to see them here.
                      </p>
                    </div>
                  ) : (
                    <>
                      {reservedReceivedItems.map((item) => (
                        <div key={item.id} className="px-5 py-3.5">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {item.name}
                              </p>
                              <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-info-light text-info mt-1">
                                {localMap[item.id]?.status === "RECEIVED"
                                  ? "Received"
                                  : "Reserved"}
                              </span>
                            </div>
                            {localMap[item.id]?.linkedRentalOrderId && (
                              <Link
                                href={`/orders/${localMap[item.id].linkedRentalOrderId}`}
                                className="text-xs text-info hover:underline"
                              >
                                View Order
                              </Link>
                            )}
                          </div>
                        </div>
                      ))}

                      {/* Active Orders (linked to items) */}
                      {activeOrders.length > 0 && (
                        <div className="px-5 py-3.5">
                          <p className="text-xs font-medium text-muted mb-2 uppercase tracking-wider">
                            Active Rental Orders
                          </p>
                          <div className="space-y-2">
                            {activeOrders.map((order) => {
                              const statusColor =
                                ORDER_STATUS_COLORS[order.status] ||
                                "bg-surface-dark text-muted-dark";
                              const statusLabel =
                                ORDER_STATUS_LABELS[order.status] || order.status;
                              return (
                                <Link
                                  key={order.id}
                                  href={`/orders/${order.id}`}
                                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface transition-colors"
                                >
                                  <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center flex-shrink-0">
                                    <Package className="w-5 h-5 text-muted" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-foreground truncate">
                                      {order.item.title}
                                    </p>
                                    <p className="text-xs text-muted">
                                      from {order.lender.name}
                                    </p>
                                  </div>
                                  <span
                                    className={cn(
                                      "text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0",
                                      statusColor
                                    )}
                                  >
                                    {statusLabel}
                                  </span>
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
