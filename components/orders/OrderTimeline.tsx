"use client";

import { Check, Clock, XCircle, Truck, Package, RotateCcw, AlertTriangle } from "lucide-react";
import { cn, formatDateTime } from "@/lib/utils";

interface TimelineEntry {
  status: string;
  at: string;
  by: string;
}

const statusIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  REQUEST_PENDING: Clock,
  ACCEPTED: Check,
  REJECTED: XCircle,
  CANCELLED: XCircle,
  WAITING_PICKUP: Truck,
  PICKED_UP: Package,
  IN_USE: Package,
  RETURN_REQUESTED: RotateCcw,
  RETURNED: Check,
  COMPLETED: Check,
  DISPUTE_OPENED: AlertTriangle,
};

const statusLabels: Record<string, string> = {
  REQUEST_PENDING: "Request Placed",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
  CANCELLED: "Cancelled",
  WAITING_PICKUP: "Waiting for Pickup",
  PICKED_UP: "Picked Up",
  IN_USE: "In Use",
  RETURN_REQUESTED: "Return Requested",
  RETURNED: "Returned",
  COMPLETED: "Completed",
  DISPUTE_OPENED: "Dispute Opened",
};

export default function OrderTimeline({ history }: { history: TimelineEntry[] }) {
  if (!history || history.length === 0) {
    return <p className="text-sm text-muted">No status history available.</p>;
  }

  return (
    <div className="space-y-0">
      {history.map((entry, i) => {
        const Icon = statusIcons[entry.status] || Clock;
        const isLast = i === history.length - 1;
        return (
          <div key={i} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", isLast ? "bg-primary text-white" : "bg-surface-dark text-muted")}>
                <Icon className="w-4 h-4" />
              </div>
              {!isLast && <div className="w-0.5 flex-1 bg-surface-dark" />}
            </div>
            <div className={cn("pb-4", isLast && "pb-0")}>
              <p className="text-sm font-medium text-foreground">{statusLabels[entry.status] || entry.status}</p>
              <p className="text-xs text-muted">{formatDateTime(entry.at)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
