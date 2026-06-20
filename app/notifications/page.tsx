"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Bell, Check, Loader2, ExternalLink, Clock, Inbox } from "lucide-react";
import toast from "react-hot-toast";

interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  actionUrl: string | null;
  readAt: string | null;
  createdAt: string;
}

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [markingAll, setMarkingAll] = useState(false);

  const fetchNotifications = useCallback(async (pageNum: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/notifications?page=${pageNum}&limit=20`);
      if (!res.ok) {
        if (res.status === 401) {
          setError("Please log in to view notifications.");
          setLoading(false);
          return;
        }
        throw new Error("Failed to fetch notifications");
      }
      const data = await res.json();
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
      setTotalPages(data.pagination.totalPages);
    } catch (err) {
      setError("Failed to load notifications. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const initialLoadDone = useRef(false);

  useEffect(() => {
    if (initialLoadDone.current) return;
    initialLoadDone.current = true;
    fetchNotifications(1);
  }, [fetchNotifications]);

  const handleMarkAsRead = async (notification: Notification) => {
    if (notification.readAt) {
      // Already read, just navigate
      if (notification.actionUrl) {
        router.push(notification.actionUrl);
      }
      return;
    }

    try {
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId: notification.id }),
      });
      if (!res.ok) throw new Error("Failed to mark as read");
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id ? { ...n, readAt: new Date().toISOString() } : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      if (notification.actionUrl) {
        router.push(notification.actionUrl);
      }
    } catch {
      toast.error("Failed to mark notification as read");
    }
  };

  const handleMarkAllAsRead = async () => {
    setMarkingAll(true);
    try {
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAll: true }),
      });
      if (!res.ok) throw new Error("Failed to mark all as read");
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, readAt: n.readAt || new Date().toISOString() }))
      );
      setUnreadCount(0);
      toast.success("All notifications marked as read");
    } catch {
      toast.error("Failed to mark all as read");
    } finally {
      setMarkingAll(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "RENTAL_REQUEST":
        return "📦";
      case "ORDER_UPDATE":
        return "🔄";
      case "NEW_MESSAGE":
        return "💬";
      case "REVIEW_RECEIVED":
        return "⭐";
      case "REPORT_RESOLVED":
        return "🛡️";
      case "ITEM_APPROVED":
        return "✅";
      case "ITEM_REJECTED":
        return "❌";
      case "SYSTEM":
        return "🔔";
      default:
        return "📌";
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Bell className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          {unreadCount > 0 && (
            <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold text-white bg-primary rounded-full min-w-[1.5rem]">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            disabled={markingAll}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-primary hover:bg-primary-50 rounded-lg transition-colors disabled:opacity-50"
          >
            {markingAll ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            Mark all as read
          </button>
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Bell className="w-12 h-12 text-muted mb-4" />
          <p className="text-muted-dark mb-4">{error}</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && notifications.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Inbox className="w-16 h-16 text-muted mb-4" />
          <h2 className="text-lg font-semibold text-foreground mb-2">
            No notifications yet
          </h2>
          <p className="text-muted-dark">
            When you receive notifications, they will appear here.
          </p>
        </div>
      )}

      {/* Notification list */}
      {!loading && !error && notifications.length > 0 && (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <button
              key={notification.id}
              onClick={() => handleMarkAsRead(notification)}
              className={`w-full text-left flex items-start gap-4 p-4 rounded-xl border transition-colors ${
                notification.readAt
                  ? "bg-white border-surface-dark hover:bg-surface"
                  : "bg-primary-50/50 border-primary/20 hover:bg-primary-50"
              }`}
            >
              <span className="text-2xl flex-shrink-0 mt-0.5">
                {getTypeIcon(notification.type)}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3
                    className={`text-sm font-semibold truncate ${
                      notification.readAt ? "text-foreground" : "text-primary"
                    }`}
                  >
                    {notification.title}
                  </h3>
                  {!notification.readAt && (
                    <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                  )}
                </div>
                <p className="text-sm text-muted-dark mt-0.5 line-clamp-2">
                  {notification.message}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <Clock className="w-3 h-3 text-muted" />
                  <span className="text-xs text-muted">
                    {timeAgo(notification.createdAt)}
                  </span>
                </div>
              </div>
              {notification.actionUrl && (
                <ExternalLink className="w-4 h-4 text-muted flex-shrink-0 mt-1" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => { const newPage = page - 1; setPage(newPage); fetchNotifications(newPage); }}
            disabled={page === 1}
            className="px-3 py-2 text-sm font-medium rounded-lg border border-surface-dark hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <span className="text-sm text-muted-dark">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => { const newPage = page + 1; setPage(newPage); fetchNotifications(newPage); }}
            disabled={page === totalPages}
            className="px-3 py-2 text-sm font-medium rounded-lg border border-surface-dark hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
