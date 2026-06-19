"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  Pencil,
  Eye,
  EyeOff,
  Trash2,
  Package,
  Heart,
  ChevronRight,
} from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import StatusBadge from "@/components/ui/StatusBadge";
import { Badge } from "@/components/ui/Badge";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import EmptyState from "@/components/ui/EmptyState";

type MyItem = {
  id: string;
  title: string;
  images: string[];
  dailyPrice: number;
  deposit: number;
  condition: string;
  tags: string[];
  status: string;
  categoryName: string;
  categorySlug: string;
  viewCount: number;
  favoriteCount: number;
};

const TABS = [
  { key: "all", label: "All" },
  { key: "AVAILABLE", label: "Available" },
  { key: "RENTED", label: "Rented" },
  { key: "HIDDEN", label: "Hidden" },
] as const;

export default function MyItemsContent({ items }: { items: MyItem[] }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [localItems, setLocalItems] = useState<MyItem[]>(items);
  const [deleteTarget, setDeleteTarget] = useState<MyItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filteredItems = localItems.filter((item) => {
    if (activeTab === "all") return true;
    if (activeTab === "AVAILABLE") return item.status === "AVAILABLE";
    if (activeTab === "RENTED")
      return item.status === "RENTED" || item.status === "RESERVED";
    if (activeTab === "HIDDEN") return item.status === "HIDDEN";
    return true;
  });

  const handleToggleHide = useCallback(
    async (itemId: string, currentStatus: string) => {
      const newStatus = currentStatus === "HIDDEN" ? "AVAILABLE" : "HIDDEN";
      const toastId = toast.loading(
        newStatus === "HIDDEN" ? "Hiding item..." : "Making item visible..."
      );

      try {
        const res = await fetch(`/api/items/${itemId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to update item");
        }

        setLocalItems((prev) =>
          prev.map((item) =>
            item.id === itemId ? { ...item, status: newStatus } : item
          )
        );

        toast.success(
          newStatus === "HIDDEN"
            ? "Item hidden from marketplace"
            : "Item is now visible",
          { id: toastId }
        );
        router.refresh();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to update item",
          { id: toastId }
        );
      }
    },
    [router]
  );

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setDeleting(true);

    try {
      const res = await fetch(`/api/items/${deleteTarget.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete item");
      }

      setLocalItems((prev) =>
        prev.filter((item) => item.id !== deleteTarget.id)
      );
      toast.success("Item deleted");
      setDeleteTarget(null);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete item"
      );
    } finally {
      setDeleting(false);
    }
  }, [deleteTarget, router]);

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-white rounded-xl border border-surface-dark w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
              activeTab === tab.key
                ? "bg-primary text-white shadow-sm"
                : "text-muted hover:text-foreground hover:bg-surface"
            )}
          >
            {tab.label}
            {tab.key !== "all" && (
              <span className="ml-1.5 text-xs opacity-70">
                (
                {
                  localItems.filter((item) => {
                    if (tab.key === "AVAILABLE")
                      return item.status === "AVAILABLE";
                    if (tab.key === "RENTED")
                      return (
                        item.status === "RENTED" || item.status === "RESERVED"
                      );
                    if (tab.key === "HIDDEN")
                      return item.status === "HIDDEN";
                    return true;
                  }).length
                }
                )
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Items List */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-xl border border-surface-dark">
          <EmptyState
            icon={<Package className="w-12 h-12 text-muted-light" />}
            title="No items found"
            description={
              activeTab === "all"
                ? "You have not posted any items yet. Start by posting your first gear for rent!"
                : `You have no ${activeTab.toLowerCase()} items.`
            }
            actionLabel={activeTab === "all" ? "Post New Item" : undefined}
            actionHref={activeTab === "all" ? "/my-items/new" : undefined}
          />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-surface-dark overflow-hidden shadow-sm">
          {/* Table header - hidden on mobile */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 bg-surface border-b border-surface-dark text-xs font-medium text-muted uppercase tracking-wider">
            <div className="col-span-5">Item</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-1 text-right">Price</div>
            <div className="col-span-2 text-center">Status</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          {/* Item rows */}
          <div className="divide-y divide-surface-dark">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 px-5 py-4 items-center hover:bg-surface/50 transition-colors"
              >
                {/* Item info */}
                <div className="md:col-span-5 flex items-center gap-3">
                  {item.images[0] ? (
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-surface flex items-center justify-center flex-shrink-0">
                      <Package className="w-6 h-6 text-muted-light" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <Link
                      href={`/items/${item.id}`}
                      className="text-sm font-semibold text-foreground hover:text-primary transition-colors truncate block"
                    >
                      {item.title}
                    </Link>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-muted">
                      {item.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="inline-block px-1.5 py-0.5 rounded bg-surface text-[10px]"
                        >
                          {tag}
                        </span>
                      ))}
                      {item.tags.length > 2 && (
                        <span className="text-[10px] text-muted-light">
                          +{item.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Category */}
                <div className="md:col-span-2">
                  <span className="text-sm text-muted-dark">
                    {item.categoryName}
                  </span>
                  {/* Mobile stats */}
                  <div className="flex items-center gap-3 mt-1 md:hidden">
                    <span className="text-xs text-muted">
                      Price: {formatPrice(item.dailyPrice)}
                      {item.dailyPrice > 0 && "/day"}
                    </span>
                    <StatusBadge status={item.status} />
                  </div>
                </div>

                {/* Price - desktop */}
                <div className="hidden md:block md:col-span-1 text-right">
                  <span className="text-sm font-medium text-foreground">
                    {formatPrice(item.dailyPrice)}
                  </span>
                  {item.dailyPrice > 0 && (
                    <span className="text-xs text-muted">/day</span>
                  )}
                </div>

                {/* Status - desktop */}
                <div className="hidden md:flex md:col-span-2 justify-center">
                  <StatusBadge status={item.status} />
                </div>

                {/* Actions */}
                <div className="md:col-span-2 flex items-center gap-1 md:justify-end">
                  <Link
                    href={`/my-items/${item.id}/edit`}
                    className="p-2 rounded-lg text-muted-dark hover:text-primary hover:bg-primary-50 transition-colors"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleToggleHide(item.id, item.status)}
                    className="p-2 rounded-lg text-muted-dark hover:text-accent hover:bg-orange-50 transition-colors"
                    title={
                      item.status === "HIDDEN"
                        ? "Make visible"
                        : "Hide item"
                    }
                  >
                    {item.status === "HIDDEN" ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => setDeleteTarget(item)}
                    className="p-2 rounded-lg text-muted-dark hover:text-error hover:bg-red-50 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  {/* View & favorite stats on desktop */}
                  <div className="hidden md:flex items-center gap-2 ml-2 text-xs text-muted-light">
                    <span className="flex items-center gap-0.5">
                      <Eye className="w-3 h-3" />
                      {item.viewCount}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <Heart className="w-3 h-3" />
                      {item.favoriteCount}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Item"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone. Active rental requests for this item will be cancelled.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}
