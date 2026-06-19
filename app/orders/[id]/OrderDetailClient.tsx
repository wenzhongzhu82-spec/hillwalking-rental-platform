"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Calendar, MessageCircle, AlertTriangle, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StatusBadge, OrderStatusBadge, RatingStars } from "@/components/ui/badges";
import Avatar from "@/components/ui/Avatar";
import OrderTimeline from "@/components/orders/OrderTimeline";
import { formatDate, formatPrice, cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface OrderDetailClientProps {
  order: any;
  userId: string;
  userRole: "borrower" | "lender" | "admin";
  existingUserReview: any;
}

export function OrderDetailClient({ order, userId, userRole, existingUserReview }: OrderDetailClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [showReview, setShowReview] = useState(false);

  const item = order.item;
  const otherParty = userRole === "borrower" ? order.lender : order.borrower;

  const updateOrder = async (newStatus: string) => {
    setLoading(newStatus);
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update");
      }
      toast.success("Order updated!");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(null);
    }
  };

  const s = order.status;

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Link href="/orders" className="inline-flex items-center text-sm text-muted hover:text-foreground mb-4">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Orders
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{item.title}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-muted">
              <span>Order #{order.id.slice(-8)}</span>
              <span>·</span>
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(order.createdAt)}</span>
            </div>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-surface-dark">
              <h3 className="font-semibold text-foreground mb-4">Order Timeline</h3>
              <OrderTimeline history={(order.statusHistory ? JSON.parse(order.statusHistory) : [])} />
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-surface-dark">
              <h3 className="font-semibold text-foreground mb-3">Actions</h3>
              {userRole === "borrower" && (
                <div className="flex flex-wrap gap-2">
                  {s === "REQUEST_PENDING" && (
                    <Button variant="ghost" onClick={() => updateOrder("CANCELLED")} loading={loading === "CANCELLED"}>Cancel Request</Button>
                  )}
                  {s === "ACCEPTED" && (
                    <Button variant="primary" onClick={() => updateOrder("PICKED_UP")} loading={loading === "PICKED_UP"}>Confirm Pickup</Button>
                  )}
                  {s === "IN_USE" && (
                    <Button variant="primary" onClick={() => updateOrder("RETURN_REQUESTED")} loading={loading === "RETURN_REQUESTED"}>Request Return</Button>
                  )}
                  {s === "COMPLETED" && !existingUserReview && (
                    <Button variant="secondary" onClick={() => setShowReview(true)}>Write Review</Button>
                  )}
                  {s !== "COMPLETED" && s !== "CANCELLED" && s !== "REJECTED" && s !== "RETURNED" && (
                    <Button variant="danger" onClick={() => updateOrder("DISPUTE_OPENED")} loading={loading === "DISPUTE_OPENED"}>
                      <AlertTriangle className="w-4 h-4 mr-1" /> Open Dispute
                    </Button>
                  )}
                </div>
              )}
              {userRole === "lender" && (
                <div className="flex flex-wrap gap-2">
                  {s === "REQUEST_PENDING" && (
                    <>
                      <Button variant="primary" onClick={() => updateOrder("ACCEPTED")} loading={loading === "ACCEPTED"}>Accept Request</Button>
                      <Button variant="danger" onClick={() => updateOrder("REJECTED")} loading={loading === "REJECTED"}>Reject</Button>
                    </>
                  )}
                  {s === "PICKED_UP" && (
                    <Button variant="primary" onClick={() => updateOrder("IN_USE")} loading={loading === "IN_USE"}>Mark as In Use</Button>
                  )}
                  {s === "RETURN_REQUESTED" && (
                    <Button variant="primary" onClick={() => updateOrder("RETURNED")} loading={loading === "RETURNED"}>Confirm Return</Button>
                  )}
                  {s === "RETURNED" && (
                    <Button variant="primary" onClick={() => updateOrder("COMPLETED")} loading={loading === "COMPLETED"}>Mark Completed</Button>
                  )}
                  {s === "COMPLETED" && !existingUserReview && (
                    <Button variant="secondary" onClick={() => setShowReview(true)}>Write Review</Button>
                  )}
                  {s !== "COMPLETED" && s !== "CANCELLED" && s !== "REJECTED" && (
                    <Button variant="danger" onClick={() => updateOrder("DISPUTE_OPENED")} loading={loading === "DISPUTE_OPENED"}>
                      <AlertTriangle className="w-4 h-4 mr-1" /> Open Dispute
                    </Button>
                  )}
                </div>
              )}
              {(!userRole || userRole === "admin") && <p className="text-sm text-muted">No user actions available for admin.</p>}
            </div>

            {showReview && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-surface-dark">
                <h3 className="font-semibold text-foreground mb-4">Write a Review</h3>
                <ReviewInline orderId={order.id} revieweeId={otherParty?.id} onDone={() => { setShowReview(false); router.refresh(); }} />
              </div>
            )}

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-surface-dark">
              <h3 className="font-semibold text-foreground mb-3">Item Details</h3>
              <Link href={`/items/${item.id}`} className="flex gap-4 group">
                <div className="w-20 h-20 rounded-xl bg-surface flex items-center justify-center shrink-0">
                  <MapPin className="w-8 h-8 text-muted" />
                </div>
                <div>
                  <p className="font-medium text-foreground group-hover:text-primary transition-colors">{item.title}</p>
                  <p className="text-sm text-muted mt-1">{item.category?.name || "Item"}</p>
                  <p className="text-sm font-medium text-primary mt-1">
                    {formatPrice(item.dailyPrice)} / day · {formatPrice(order.deposit)} deposit
                  </p>
                </div>
              </Link>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-surface-dark space-y-4">
              <h3 className="font-semibold text-foreground">Parties</h3>
              <div>
                <p className="text-xs text-muted mb-2">LENDER</p>
                <Link href={`/profile/${order.lender?.id}`} className="flex items-center gap-3 group">
                  <Avatar src={order.lender?.avatar} name={order.lender?.name} size="md" />
                  <div>
                    <p className="font-medium text-foreground group-hover:text-primary transition-colors">{order.lender?.name}</p>
                    <p className="text-xs text-muted">{order.lender?.grade} · {order.lender?.house}</p>
                    <RatingStars rating={order.lender?.rating || 0} size="sm" />
                  </div>
                </Link>
              </div>
              <div className="border-t border-surface-dark pt-4">
                <p className="text-xs text-muted mb-2">BORROWER</p>
                <Link href={`/profile/${order.borrower?.id}`} className="flex items-center gap-3 group">
                  <Avatar src={order.borrower?.avatar} name={order.borrower?.name} size="md" />
                  <div>
                    <p className="font-medium text-foreground group-hover:text-primary transition-colors">{order.borrower?.name}</p>
                    <p className="text-xs text-muted">{order.borrower?.grade} · {order.borrower?.house}</p>
                    <RatingStars rating={order.borrower?.rating || 0} size="sm" />
                  </div>
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-surface-dark space-y-3">
              <h3 className="font-semibold text-foreground">Pricing</h3>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Daily Rate</span>
                <span className="font-medium">{formatPrice(item.dailyPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Total Rent</span>
                <span className="font-medium text-primary">{formatPrice(order.totalPrice)}</span>
              </div>
              <div className="border-t border-surface-dark pt-3 flex justify-between text-sm">
                <span className="text-muted">Deposit</span>
                <span className="font-medium">{formatPrice(order.deposit)}</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-surface-dark space-y-3">
              <h3 className="font-semibold text-foreground">Dates</h3>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted" />
                <span className="text-muted">Start:</span>
                <span className="font-medium">{formatDate(order.startDate)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted" />
                <span className="text-muted">End:</span>
                <span className="font-medium">{formatDate(order.endDate)}</span>
              </div>
            </div>

            {otherParty && (
              <Link
                href={`/messages?itemId=${item.id}`}
                className="flex items-center justify-center gap-2 w-full bg-white rounded-2xl p-4 shadow-sm border border-surface-dark hover:border-primary transition-colors"
              >
                <MessageCircle className="w-5 h-5 text-primary" />
                <span className="font-medium text-primary">Message {otherParty.name}</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewInline({ orderId, revieweeId, onDone }: { orderId: string; revieweeId: string; onDone: () => void }) {
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [punctuality, setPunctuality] = useState(5);
  const [itemAccuracy, setItemAccuracy] = useState(5);
  const [communication, setCommunication] = useState(5);
  const [recommended, setRecommended] = useState(true);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, revieweeId, rating, content, punctuality, itemAccuracy, communication, recommended }),
      });
      if (!res.ok) throw new Error("Failed to submit review");
      toast.success("Review submitted!");
      onDone();
    } catch (err: any) {
      toast.error(err.message || "Failed to submit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Overall Rating</label>
        <div className="flex gap-1 mt-1">
          {[1,2,3,4,5].map((s) => (
            <button key={s} type="button" onClick={() => setRating(s)}>
              <Star className={cn("w-6 h-6", s <= rating ? "text-accent fill-accent" : "text-muted")} />
            </button>
          ))}
        </div>
      </div>
      <textarea
        className="w-full border border-surface-dark rounded-xl p-3 text-sm bg-surface min-h-[80px]"
        placeholder="Share your experience..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="flex gap-2 items-center">
        <input type="checkbox" checked={recommended} onChange={(e) => setRecommended(e.target.checked)} className="rounded" />
        <label className="text-sm">I recommend this user</label>
      </div>
      <Button variant="secondary" onClick={submit} loading={loading}>Submit Review</Button>
    </div>
  );
}
