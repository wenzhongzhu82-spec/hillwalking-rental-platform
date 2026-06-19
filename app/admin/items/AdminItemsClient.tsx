"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Package,
  Eye,
  CheckCircle2,
  XCircle,
  Ban,
  ShieldOff,
  MessageSquareText,
  ChevronLeft,
  ChevronRight,
  Filter,
  ImageIcon,
} from "lucide-react";
import { cn, formatPrice, formatDate, timeAgo, shortenText } from "@/lib/utils";

interface ItemData {
  id: string;
  title: string;
  description: string;
  status: string;
  dailyPrice: number;
  deposit: number;
  images: string;
  isHillwalkingRecommended: boolean;
  matchScore: number;
  createdAt: string;
  owner: { id: string; name: string; email: string };
  category: { name: string };
}

const STATUS_BADGE: Record<string, { label: string; color: string }> = {
  PENDING_REVIEW: { label: "Pending", color: "bg-warning-light text-accent-darker" },
  AVAILABLE: { label: "Available", color: "bg-success-light text-success" },
  RESERVED: { label: "Reserved", color: "bg-info-light text-info" },
  RENTED: { label: "Rented", color: "bg-accent-50 text-accent-darker" },
  RETURNED: { label: "Returned", color: "bg-surface-dark text-muted-dark" },
  HIDDEN: { label: "Hidden", color: "bg-surface-dark text-muted-dark" },
  BANNED: { label: "Banned", color: "bg-error-light text-error" },
};

const STATUS_FILTERS = [
  { value: "ALL", label: "All" },
  { value: "PENDING_REVIEW", label: "Pending Review" },
  { value: "AVAILABLE", label: "Available" },
  { value: "RENTED", label: "Rented" },
  { value: "RETURNED", label: "Returned" },
  { value: "HIDDEN", label: "Hidden" },
  { value: "BANNED", label: "Banned" },
];

export function AdminItemsClient({
  initialItems,
  totalItems,
  currentPage,
  totalPages,
  currentSearch,
  currentStatus,
}: {
  initialItems: ItemData[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  currentSearch: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [items, setItems] = useState<ItemData[]>(initialItems);
  const [search, setSearch] = useState(currentSearch);
  const [statusFilter, setStatusFilter] = useState(currentStatus);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (statusFilter !== "ALL") params.set("status", statusFilter);
    params.set("page", "1");
    router.push(`/admin/items?${params.toString()}`);
  }, [search, statusFilter, router]);

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (status !== "ALL") params.set("status", status);
    params.set("page", "1");
    router.push(`/admin/items?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (statusFilter !== "ALL") params.set("status", statusFilter);
    params.set("page", String(page));
    router.push(`/admin/items?${params.toString()}`);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === items.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(items.map((i) => i.id)));
    }
  };

  const performAction = async (action: string, itemId: string) => {
    try {
      const res = await fetch(`/api/admin/items`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, action }),
      });
      if (res.ok) {
        router.refresh();
      }
    } catch {}
  };

  const performBulkAction = async (action: string) => {
    if (selectedIds.size === 0) return;
    setIsBulkProcessing(true);
    try {
      const res = await fetch("/api/admin/items", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemIds: Array.from(selectedIds),
          action,
        }),
      });
      if (res.ok) {
        setSelectedIds(new Set());
        router.refresh();
      }
    } catch {
    } finally {
      setIsBulkProcessing(false);
    }
  };

  const addAdminNote = async (itemId: string) => {
    if (!noteText.trim()) return;
    try {
      await fetch("/api/admin/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, note: noteText, action: "ADD_NOTE" }),
      });
      setShowNoteModal(null);
      setNoteText("");
      router.refresh();
    } catch {}
  };

  const getFirstImage = (imagesJson: string): string | null => {
    try {
      const arr = JSON.parse(imagesJson);
      return arr[0] || null;
    } catch {
      return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Items Management
          </h1>
          <p className="text-sm text-muted mt-1">
            {totalItems} total items
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl border border-border-light shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-light" />
            <input
              type="text"
              placeholder="Search by title or owner..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-white text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
            />
          </div>

          {/* Filter by status */}
          <div className="flex flex-wrap gap-1.5">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => handleStatusFilter(f.value)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap",
                  statusFilter === f.value
                    ? "bg-primary text-white"
                    : "bg-surface text-muted-dark hover:bg-surface-dark"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleSearch}
            className="px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary-light transition-colors"
          >
            Search
          </button>
        </div>

        {/* Bulk Actions */}
        {selectedIds.size > 0 && (
          <div className="mt-3 pt-3 border-t border-border-light flex items-center gap-2">
            <span className="text-sm text-muted">
              {selectedIds.size} selected
            </span>
            <button
              onClick={() => performBulkAction("APPROVE")}
              disabled={isBulkProcessing}
              className="px-3 py-1.5 bg-success text-white text-xs font-medium rounded-lg hover:bg-success/90 transition-colors disabled:opacity-50"
            >
              Batch Approve
            </button>
            <button
              onClick={() => performBulkAction("REJECT")}
              disabled={isBulkProcessing}
              className="px-3 py-1.5 bg-error text-white text-xs font-medium rounded-lg hover:bg-error/90 transition-colors disabled:opacity-50"
            >
              Batch Reject
            </button>
            <button
              onClick={() => setSelectedIds(new Set())}
              className="px-3 py-1.5 text-xs text-muted hover:text-foreground"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Items Table */}
      <div className="bg-white rounded-xl border border-border-light shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-light bg-surface/50">
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === items.length && items.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-border text-primary focus:ring-primary"
                  />
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-muted-dark uppercase tracking-wider">
                  Item
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-muted-dark uppercase tracking-wider hidden md:table-cell">
                  Category
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-muted-dark uppercase tracking-wider hidden lg:table-cell">
                  Owner
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-muted-dark uppercase tracking-wider">
                  Price
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-muted-dark uppercase tracking-wider">
                  Status
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-muted-dark uppercase tracking-wider hidden lg:table-cell">
                  Created
                </th>
                <th className="px-3 py-3 text-right text-xs font-semibold text-muted-dark uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {items.map((item) => {
                const badge = STATUS_BADGE[item.status] || STATUS_BADGE.PENDING_REVIEW;
                const firstImage = getFirstImage(item.images);
                return (
                  <tr
                    key={item.id}
                    className="hover:bg-surface/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(item.id)}
                        onChange={() => toggleSelect(item.id)}
                        className="rounded border-border text-primary focus:ring-primary"
                      />
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center overflow-hidden flex-shrink-0">
                          {firstImage ? (
                            <img
                              src={firstImage}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="w-5 h-5 text-muted-light" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-foreground truncate max-w-[200px]">
                              {item.title}
                            </p>
                            {item.isHillwalkingRecommended && (
                              <span className="text-[10px] bg-accent-50 text-accent-darker px-1.5 py-0.5 rounded font-medium flex-shrink-0 hidden sm:inline">
                                HW
                              </span>
                            )}
                          </div>
                          {item.matchScore > 0 && (
                            <p className="text-xs text-muted">
                              Score: {item.matchScore}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 hidden md:table-cell">
                      <span className="text-sm text-muted">
                        {item.category.name}
                      </span>
                    </td>
                    <td className="px-3 py-3 hidden lg:table-cell">
                      <span className="text-sm text-muted truncate max-w-[120px] block">
                        {item.owner.name}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span className="text-sm font-medium text-foreground">
                        {formatPrice(item.dailyPrice)}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={cn(
                          "inline-flex px-2 py-0.5 rounded-full text-xs font-medium",
                          badge.color
                        )}
                      >
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-3 py-3 hidden lg:table-cell">
                      <span className="text-xs text-muted">
                        {formatDate(item.createdAt)}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/items/${item.id}`}
                          className="p-1.5 rounded-lg text-muted hover:text-primary hover:bg-primary-50 transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        {item.status === "PENDING_REVIEW" && (
                          <>
                            <button
                              onClick={() => performAction("APPROVE", item.id)}
                              className="p-1.5 rounded-lg text-muted hover:text-success hover:bg-success-light transition-colors"
                              title="Approve"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => performAction("REJECT", item.id)}
                              className="p-1.5 rounded-lg text-muted hover:text-error hover:bg-error-light transition-colors"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {item.status !== "BANNED" && (
                          <button
                            onClick={() => performAction("BAN", item.id)}
                            className="p-1.5 rounded-lg text-muted hover:text-error hover:bg-error-light transition-colors"
                            title="Ban"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        )}
                        {item.status === "BANNED" && (
                          <button
                            onClick={() => performAction("UNBAN", item.id)}
                            className="p-1.5 rounded-lg text-muted hover:text-success hover:bg-success-light transition-colors"
                            title="Unban"
                          >
                            <ShieldOff className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => setShowNoteModal(item.id)}
                          className="p-1.5 rounded-lg text-muted hover:text-info hover:bg-info-light transition-colors"
                          title="Add Admin Note"
                        >
                          <MessageSquareText className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {items.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-10 h-10 text-muted-light mx-auto mb-3" />
            <p className="text-muted">No items found.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border-light">
            <p className="text-sm text-muted">
              Page {currentPage} of {totalPages} ({totalItems} items)
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={cn(
                      "w-8 h-8 rounded-lg text-sm font-medium transition-colors",
                      pageNum === currentPage
                        ? "bg-primary text-white"
                        : "text-muted-dark hover:bg-surface"
                    )}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Admin Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-foreground mb-3">
              Add Admin Note
            </h3>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Enter admin note..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-border bg-white text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none transition-colors"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  setShowNoteModal(null);
                  setNoteText("");
                }}
                className="px-4 py-2 text-sm font-medium text-muted-dark hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => addAdminNote(showNoteModal)}
                disabled={!noteText.trim()}
                className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-light disabled:opacity-50 transition-colors"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
