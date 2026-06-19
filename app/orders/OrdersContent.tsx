"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Package,
  ShoppingBag,
  Users,
  ChevronDown,
  ArrowRight,
  FileText,
} from "lucide-react";
import { cn, formatPrice, formatDate, parseJson } from "@/lib/utils";
import Avatar from "@/components/ui/Avatar";
import { OrderStatusBadge } from "@/components/ui/badges";
import { Button } from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { ORDER_STATUSES, ORDER_STATUS_LABELS } from "@/lib/constants";

interface OrderItem {
  id: string;
  title: string;
  images: string;
  dailyPrice: number;
  deposit: number;
}

interface OrderUser {
  id: string;
  name: string;
  avatar: string | null;
  rating: number;
}

interface Order {
  id: string;
  itemId: string;
  borrowerId: string;
  lenderId: string;
  startDate: string | Date;
  endDate: string | Date;
  totalPrice: number;
  deposit: number;
  status: string;
  createdAt: string | Date;
  item: OrderItem;
  borrower: OrderUser;
  lender: OrderUser;
}

interface OrdersContentProps {
  orders: Order[];
  counts: { borrower: number; lender: number; all: number };
  currentTab: string;
  currentStatus: string;
  userId: string;
}

const tabs = [
  { key: "all", label: "All Orders", icon: Package },
  { key: "borrower", label: "As Borrower", icon: ShoppingBag },
  { key: "lender", label: "As Lender", icon: Users },
];

export function OrdersContent({
  orders,
  counts,
  currentTab,
  currentStatus,
  userId,
}: OrdersContentProps) {
  const router = useRouter();
  const [statusOpen, setStatusOpen] = useState(false);

  const handleTabChange = useCallback(
    (tab: string) => {
      const params = new URLSearchParams();
      params.set("tab", tab);
      if (currentStatus) params.set("status", currentStatus);
      router.push(`/orders?${params.toString()}`);
    },
    [router, currentStatus]
  );

  const handleStatusChange = useCallback(
    (status: string) => {
      setStatusOpen(false);
      const params = new URLSearchParams();
      params.set("tab", currentTab);
      if (status) params.set("status", status);
      router.push(`/orders?${params.toString()}`);
    },
    [router, currentTab]
  );

  const getItemImage = (item: OrderItem): string => {
    const images = parseJson<string[]>(item.images, []);
    return images[0] || "";
  };

  const getOtherParty = (order: Order) => {
    if (currentTab === "borrower") {
      return order.lender;
    }
    // For "lender" and "all" tabs, show borrower if we're the lender, otherwise show lender
    if (order.lenderId === userId) {
      return order.borrower;
    }
    return order.lender;
  };

  const getRoleLabel = (order: Order): string => {
    if (order.borrowerId === userId && order.lenderId === userId) return "You";
    if (order.borrowerId === userId) return "Borrower";
    return "Lender";
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <section className="bg-primary-gradient py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl font-bold text-white">My Orders</h1>
          <p className="text-white/80 mt-1">Track your rentals and lending activity</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-6 relative z-10">
        {/* Tabs */}
        <div className="bg-white rounded-xl border border-border-light shadow-md p-1.5 flex gap-1 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const count = counts[tab.key as keyof typeof counts];
            return (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-lg text-sm font-medium transition-all",
                  currentTab === tab.key
                    ? "bg-primary text-white shadow-sm"
                    : "text-muted-dark hover:text-foreground hover:bg-surface"
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span
                  className={cn(
                    "inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs",
                    currentTab === tab.key
                      ? "bg-white/20 text-white"
                      : "bg-surface-dark text-muted"
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filter Bar */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted">
            {orders.length} order{orders.length !== 1 ? "s" : ""}
            {currentStatus &&
              ` • ${ORDER_STATUS_LABELS[currentStatus] || currentStatus}`}
          </p>

          <div className="relative">
            <button
              onClick={() => setStatusOpen(!statusOpen)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border transition-colors",
                currentStatus
                  ? "border-primary bg-primary-50 text-primary"
                  : "border-surface-dark bg-white text-muted-dark hover:border-primary hover:text-primary"
              )}
            >
              <FileText className="w-4 h-4" />
              {currentStatus
                ? ORDER_STATUS_LABELS[currentStatus] || currentStatus
                : "All Statuses"}
              <ChevronDown
                className={cn(
                  "w-4 h-4 transition-transform",
                  statusOpen && "rotate-180"
                )}
              />
            </button>

            {statusOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setStatusOpen(false)}
                />
                <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-xl border border-border-light shadow-lg z-20 py-1 max-h-64 overflow-y-auto">
                  <button
                    onClick={() => handleStatusChange("")}
                    className={cn(
                      "w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-surface",
                      !currentStatus ? "text-primary font-medium bg-primary-50" : "text-foreground"
                    )}
                  >
                    All Statuses
                  </button>
                  {ORDER_STATUSES.map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(status)}
                      className={cn(
                        "w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-surface",
                        currentStatus === status
                          ? "text-primary font-medium bg-primary-50"
                          : "text-foreground"
                      )}
                    >
                      {ORDER_STATUS_LABELS[status] || status}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <EmptyState
            icon={<FileText className="w-12 h-12" />}
            title={currentStatus ? "No orders with this status" : "No orders yet"}
            description={
              currentStatus
                ? `You don't have any ${ORDER_STATUS_LABELS[currentStatus]?.toLowerCase() || currentStatus} orders.`
                : currentTab === "borrower"
                  ? "You haven't rented any gear yet. Browse the marketplace to find gear you need."
                  : currentTab === "lender"
                    ? "No one has rented your gear yet."
                    : "You have no orders yet. Browse the marketplace to get started."
            }
            action={
              currentTab !== "lender" && !currentStatus ? (
                <Link href="/marketplace" className="inline-flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-light transition-colors">
                  Browse Marketplace
                </Link>
              ) : undefined
            }
          />
        ) : (
          <motion.div
            className="space-y-3"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.05 } },
            }}
          >
            {orders.map((order) => {
              const image = getItemImage(order.item);
              const otherParty = getOtherParty(order);
              const roleLabel = getRoleLabel(order);

              return (
                <motion.div
                  key={order.id}
                  variants={{
                    hidden: { opacity: 0, y: 12 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <Link
                    href={`/orders/${order.id}`}
                    className="block bg-white rounded-xl border border-border-light shadow-sm hover:shadow-md hover:border-primary-light transition-all p-4 sm:p-5"
                  >
                    <div className="flex gap-4">
                      {/* Item Image */}
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden flex-shrink-0 bg-surface-dark">
                        {image ? (
                          <img
                            src={image}
                            alt={order.item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-8 h-8 text-muted-light" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-semibold text-foreground truncate">
                            {order.item.title}
                          </h3>
                          <OrderStatusBadge status={order.status} />
                        </div>

                        {/* Dates */}
                        <p className="text-xs text-muted mb-2">
                          {formatDate(order.startDate)} — {formatDate(order.endDate)}
                        </p>

                        {/* Pricing */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-dark mb-3">
                          <span className="font-medium">
                            {formatPrice(order.totalPrice)} total
                          </span>
                          {order.deposit > 0 && (
                            <span>Deposit: {formatPrice(order.deposit)}</span>
                          )}
                          <span className="text-primary-400 text-xs font-medium bg-primary-50 px-1.5 py-0.5 rounded">
                            {roleLabel}
                          </span>
                        </div>

                        {/* Other Party */}
                        <div className="flex items-center gap-2 pt-2 border-t border-surface-dark">
                          <Avatar
                            src={otherParty.avatar}
                            name={otherParty.name}
                            size="sm"
                          />
                          <span className="text-xs text-muted-dark truncate">
                            {otherParty.name}
                          </span>
                          <ArrowRight className="w-3 h-3 text-muted-light flex-shrink-0" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* Bottom spacing */}
      <div className="h-12" />
    </div>
  );
}
