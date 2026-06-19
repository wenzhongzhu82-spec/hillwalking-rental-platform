"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Heart, PackageSearch } from "lucide-react";
import toast from "react-hot-toast";
import ItemCard from "@/components/items/ItemCard";
import ItemGrid from "@/components/items/ItemGrid";
import EmptyState from "@/components/ui/EmptyState";

interface ItemData {
  id: string;
  title: string;
  images: string[];
  dailyPrice: number;
  deposit: number;
  condition: string;
  tags: string[];
  owner: {
    id: string;
    name: string;
    avatar: string | null;
    verified: boolean;
  };
  isFavorite: boolean;
  pickupLocation?: string;
}

interface FavoritesContentProps {
  initialItems: ItemData[];
}

export default function FavoritesContent({ initialItems }: FavoritesContentProps) {
  const router = useRouter();
  const [items, setItems] = useState<ItemData[]>(initialItems);

  const handleToggleFavorite = useCallback(
    async (itemId: string) => {
      // Optimistic removal
      const item = items.find((i) => i.id === itemId);
      setItems((prev) => prev.filter((i) => i.id !== itemId));

      try {
        const res = await fetch(`/api/favorites/${itemId}`, {
          method: "DELETE",
        });
        if (!res.ok) {
          // Revert on failure
          if (item) {
            setItems((prev) => [...prev, item]);
          }
          const data = await res.json().catch(() => ({}));
          toast.error(data.error || "Failed to remove favorite");
          return;
        }
        toast.success("Removed from favorites");
        router.refresh();
      } catch {
        if (item) {
          setItems((prev) => [...prev, item]);
        }
        toast.error("Network error. Please try again.");
      }
    },
    [items, router]
  );

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <section className="bg-primary-gradient py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-7 h-7 text-accent" />
            <h1 className="text-3xl font-bold text-white">My Favorites</h1>
          </div>
          <p className="text-white/80">
            {items.length} item{items.length !== 1 ? "s" : ""} saved for later
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <EmptyState
              icon={<Heart className="w-16 h-16" />}
              title="No favorites yet"
              description="Browse the marketplace to find gear you like. Tap the heart icon to save items for later."
              action={<a href="/marketplace" className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-light transition-colors">Browse Marketplace</a>}
            />
          </motion.div>
        ) : (
          <ItemGrid
            items={items}
            onToggleFavorite={handleToggleFavorite}
          />
        )}
      </div>

      <div className="h-12" />
    </div>
  );
}
