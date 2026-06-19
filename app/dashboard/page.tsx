"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Package, ClipboardList, MessageSquare, Heart, Plus, ShieldCheck } from "lucide-react";
import { PageLoading, EmptyState } from "@/components/ui/loading";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [threads, setThreads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(r => r.json())
      .then(d => {
        if (!d.user) { router.push("/login"); return; }
        setUser(d.user);
        // Fetch orders
        fetch("/api/orders?limit=5")
          .then(r => r.json())
          .then(od => setOrders(od.orders || []))
          .catch(() => {});
        // Fetch threads
        fetch("/api/messages/threads")
          .then(r => r.json())
          .then(td => setThreads(td.threads || []))
          .catch(() => {});
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) return <PageLoading />;
  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted mt-1">Welcome back, {user.name}</p>
        </div>
        <Link
          href="/my-items/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-light transition-colors"
        >
          <Plus className="w-4 h-4" />
          Post New Item
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { label: "My Items", icon: Package, href: "/my-items" },
          { label: "Orders", icon: ClipboardList, href: "/orders" },
          { label: "Messages", icon: MessageSquare, href: "/messages" },
          { label: "Favorites", icon: Heart, href: "/favorites" },
        ].map((s, i) => (
          <Link
            key={i}
            href={s.href}
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white border border-surface-dark hover:border-primary-light hover:shadow-sm transition-all"
          >
            <s.icon className="w-6 h-6 text-primary" />
            <span className="text-sm font-medium">{s.label}</span>
          </Link>
        ))}
        {user.role === "ADMIN" && (
          <Link
            href="/admin"
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-accent-50 border border-accent hover:shadow-sm transition-all"
          >
            <ShieldCheck className="w-6 h-6 text-accent-dark" />
            <span className="text-sm font-medium">Admin Panel</span>
          </Link>
        )}
      </div>

      {/* Recent Orders */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Recent Orders</h2>
          <Link href="/orders" className="text-sm text-primary hover:underline">View all</Link>
        </div>
        {orders.length === 0 ? (
          <div className="bg-white rounded-xl border border-surface-dark p-6 text-center">
            <p className="text-sm text-muted">No orders yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {orders.slice(0, 3).map((order: any) => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="flex items-center justify-between p-3 bg-white rounded-lg border border-surface-dark hover:border-primary-light transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center text-sm">🎒</div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{order.item?.title || "Item"}</p>
                    <p className="text-xs text-muted">Status: {order.status}</p>
                  </div>
                </div>
                <span className="text-xs text-muted">¥{order.totalPrice}</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Recent Messages */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Messages</h2>
          <Link href="/messages" className="text-sm text-primary hover:underline">View all</Link>
        </div>
        {threads.length === 0 ? (
          <div className="bg-white rounded-xl border border-surface-dark p-6 text-center">
            <p className="text-sm text-muted">No messages yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {threads.slice(0, 3).map((thread: any) => (
              <Link
                key={thread.id}
                href={`/messages/${thread.id}`}
                className="flex items-center justify-between p-3 bg-white rounded-lg border border-surface-dark hover:border-primary-light transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                    {thread.messages?.[0]?.senderId === user.id
                      ? (thread.borrower?.name?.charAt(0) || "?")
                      : (thread.borrower?.name?.charAt(0) || "?")}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{thread.item?.title || "Item"}</p>
                    <p className="text-xs text-muted truncate max-w-[200px]">{thread.messages?.[0]?.content || "No messages"}</p>
                  </div>
                </div>
                {(thread._count?.messages || 0) > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-primary text-white text-[10px] font-bold">{thread._count.messages}</span>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
