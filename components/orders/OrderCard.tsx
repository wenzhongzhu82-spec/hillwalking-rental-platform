"use client";

import Link from "next/link";
import { CalendarDays, MapPin, ArrowRight } from "lucide-react";
import { cn, formatPrice, formatDate } from "@/lib/utils";
import StatusBadge from "@/components/ui/StatusBadge";
import Avatar from "@/components/ui/Avatar";

interface OrderItem {
  id: string;
  title: string;
  images: string[];
}

interface OrderUser {
  id: string;
  name: string;
  avatar: string | null;
}

interface Order {
  id: string;
  status: string;
  startDate: string | Date;
  endDate: string | Date;
  totalPrice: number;
  item: OrderItem;
  lender: OrderUser;
  borrower: OrderUser;
  createdAt: string | Date;
}

interface OrderCardProps {
  order: Order;
  currentUserId?: string;
  className?: string;
}

export default function OrderCard({
  order,
  currentUserId,
  className,
}: OrderCardProps) {
  const isBorrower = currentUserId === order.borrower.id;
  const otherParty = isBorrower ? order.lender : order.borrower;
  const roleLabel = isBorrower ? "Borrowing" : "Lending";

  return (
    <Link
      href={`/orders/${order.id}`}
      className={cn(
        "block bg-white rounded-2xl border border-surface-dark p-4 shadow-sm hover:shadow-md hover:border-primary-light transition-all duration-200 group",
        className
      )}
    >
      <div className="flex gap-4">
        {/* Item image */}
        <div className="w-20 h-20 rounded-xl overflow-hidden bg-surface flex-shrink-0">
          {order.item.images?.[0] ? (
            <img
              src={order.item.images[0]}
              alt={order.item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center">
              <span className="text-primary/40 text-xs font-bold">HR</span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
              {order.item.title}
            </h4>
            <StatusBadge status={order.status} type="order" />
          </div>

          <div className="flex items-center gap-1 text-xs text-muted mb-2">
            <CalendarDays className="w-3 h-3" />
            <span>
              {formatDate(order.startDate)} - {formatDate(order.endDate)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar
                src={otherParty.avatar}
                name={otherParty.name}
                size="sm"
              />
              <div className="text-xs">
                <span className="text-muted-light">{roleLabel} from </span>
                <span className="text-muted-dark font-medium">
                  {otherParty.name}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-foreground">
                {formatPrice(order.totalPrice)}
              </span>
              <ArrowRight className="w-4 h-4 text-muted-light group-hover:text-primary transition-colors" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
