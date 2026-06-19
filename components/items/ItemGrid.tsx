"use client";

import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";
import ItemCard from "@/components/items/ItemCard";
import { useUIStore } from "@/lib/store";

interface ItemGridProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: any[];
  viewMode?: "grid" | "list";
  onToggleFavorite?: (itemId: string) => void;
  className?: string;
}

export default function ItemGrid({
  items,
  viewMode,
  onToggleFavorite,
  className,
}: ItemGridProps) {
  const { viewMode: storeViewMode, setViewMode } = useUIStore();
  const currentViewMode = viewMode ?? storeViewMode;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-muted text-sm">No items found</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {!viewMode && (
        <div className="flex items-center justify-end gap-1 mb-4">
          <button
            onClick={() => setViewMode("grid")}
            className={cn(
              "p-2 rounded-lg transition-colors",
              currentViewMode === "grid"
                ? "bg-primary text-white"
                : "text-muted hover:bg-surface"
            )}
            aria-label="Grid view"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={cn(
              "p-2 rounded-lg transition-colors",
              currentViewMode === "list"
                ? "bg-primary text-white"
                : "text-muted hover:bg-surface"
            )}
            aria-label="List view"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      )}

      <AnimatePresence mode="wait">
        {currentViewMode === "grid" ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.25 }}
              >
                <ItemCard item={item} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-3"
          >
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03, duration: 0.2 }}
              >
                <ItemCard item={item} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
