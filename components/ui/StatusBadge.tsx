"use client";

import { STATUS_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const colors: Record<string, string> = {
  AVAILABLE: "bg-green-100 text-green-700",
  PENDING_REVIEW: "bg-yellow-100 text-yellow-700",
  RESERVED: "bg-blue-100 text-blue-700",
  RENTED: "bg-purple-100 text-purple-700",
  RETURNED: "bg-gray-100 text-gray-600",
  HIDDEN: "bg-red-50 text-red-500",
  BANNED: "bg-red-100 text-red-700",
  REQUEST_PENDING: "bg-yellow-100 text-yellow-700",
  ACCEPTED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
  CANCELLED: "bg-gray-100 text-gray-500",
  WAITING_PICKUP: "bg-blue-100 text-blue-700",
  PICKED_UP: "bg-indigo-100 text-indigo-700",
  IN_USE: "bg-purple-100 text-purple-700",
  RETURN_REQUESTED: "bg-orange-100 text-orange-700",
  COMPLETED: "bg-green-100 text-green-800",
  DISPUTE_OPENED: "bg-red-100 text-red-800",
};

export default function StatusBadge({ status, label, type }: { status: string; label?: string; type?: string | undefined }) {
  const display = label || STATUS_LABELS[status] || status;
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium", colors[status] || "bg-gray-100 text-gray-600")}>
      {display}
    </span>
  );
}

export function OrderStatusBadge({ status }: { status: string }) {
  return <StatusBadge status={status} />;
}
