"use client";

import { cn } from "@/lib/utils";
import { Star, ShieldCheck } from "lucide-react";
import {
  CONDITION_LABELS,
  STATUS_LABELS,
  ORDER_STATUS_LABELS,
} from "@/lib/constants";

export function PriceBadge({ price, deposit }: { price: number; deposit: number }) {
  if (price === 0) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent-50 text-accent-dark text-xs font-semibold">
        Free to Borrow
      </span>
    );
  }
  return (
    <div className="flex items-center gap-2">
      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary-50 text-primary text-xs font-semibold">
        ¥{price}/day
      </span>
      {deposit > 0 && (
        <span className="text-xs text-muted">
          Deposit ¥{deposit}
        </span>
      )}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const label = STATUS_LABELS[status] || status;
  const colors: Record<string, string> = {
    AVAILABLE: "bg-green-100 text-green-700",
    PENDING_REVIEW: "bg-yellow-100 text-yellow-700",
    RESERVED: "bg-blue-100 text-blue-700",
    RENTED: "bg-purple-100 text-purple-700",
    RETURNED: "bg-gray-100 text-gray-600",
    HIDDEN: "bg-red-50 text-red-500",
    BANNED: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
        colors[status] || "bg-gray-100 text-gray-600"
      )}
    >
      {label}
    </span>
  );
}

export function OrderStatusBadge({ status }: { status: string }) {
  const label = ORDER_STATUS_LABELS[status] || status;
  const colors: Record<string, string> = {
    REQUEST_PENDING: "bg-yellow-100 text-yellow-700",
    ACCEPTED: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-700",
    CANCELLED: "bg-gray-100 text-gray-500",
    WAITING_PICKUP: "bg-blue-100 text-blue-700",
    PICKED_UP: "bg-indigo-100 text-indigo-700",
    IN_USE: "bg-purple-100 text-purple-700",
    RETURN_REQUESTED: "bg-orange-100 text-orange-700",
    RETURNED: "bg-teal-100 text-teal-700",
    COMPLETED: "bg-green-100 text-green-800",
    DISPUTE_OPENED: "bg-red-100 text-red-800",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
        colors[status] || "bg-gray-100 text-gray-600"
      )}
    >
      {label}
    </span>
  );
}

export function ConditionBadge({ condition }: { condition: string }) {
  const label = CONDITION_LABELS[condition] || condition;
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-surface-dark text-muted-dark text-xs">
      {label}
    </span>
  );
}

export function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-primary-light" title="SCIE Verified">
      <ShieldCheck className="w-4 h-4" />
    </span>
  );
}

export function RatingStars({ rating, size }: { rating: number; size?: "sm" | "md" }) {
  const full = Math.round(rating);
  const starSize = size === "sm" ? "w-3 h-3" : "w-4 h-4";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            starSize,
            i <= full
              ? "text-accent fill-accent"
              : "text-surface-darker"
          )}
        />
      ))}
      <span className="ml-1 text-xs text-muted">({rating.toFixed(1)})</span>
    </div>
  );
}

export function CategoryBadge({ name, href }: { name: string; href?: string }) {
  const Tag = href ? "a" : "span";
  return (
    <Tag
      href={href}
      className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary-50 text-primary-dark text-xs font-medium hover:bg-primary-100 transition-colors"
    >
      {name}
    </Tag>
  );
}
