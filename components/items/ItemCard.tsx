"use client";

import Link from "next/link";
import { Heart, Eye, MapPin, ShieldAlert } from "lucide-react";
import { cn, formatPrice, timeAgo } from "@/lib/utils";
import { PriceBadge, StatusBadge, ConditionBadge } from "@/components/ui/badges";
import { RatingStars } from "@/components/ui/badges";

interface ItemCardProps {
  item: {
    id: string;
    title: string;
    description: string;
    dailyPrice: number;
    deposit: number;
    condition: string;
    status: string;
    pickupLocation: string;
    viewCount: number;
    favoriteCount: number;
    isHillwalkingRecommended: boolean;
    safetyNotes: string | null;
    tags: string;
    images: string;
    createdAt: string;
    category?: { id: string; name: string; slug: string } | null;
    owner?: {
      id: string;
      name: string;
      avatar: string | null;
      rating: number;
    } | null;
  };
  isFavorite?: boolean;
  className?: string;
}

export default function ItemCard({ item, isFavorite, className }: ItemCardProps) {
  const images: string[] = (() => {
    try { return JSON.parse(item.images); } catch { return []; }
  })();
  const firstImage = images[0] || "/placeholder-gear.jpg";

  return (
    <Link
      href={`/items/${item.id}`}
      className={cn(
        "group block bg-white border border-surface-dark rounded-xl overflow-hidden hover:border-primary-light hover:shadow-lg transition-all duration-200",
        className
      )}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-surface overflow-hidden">
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
          <span className="text-4xl">🎒</span>
        </div>
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <StatusBadge status={item.status} />
          {item.isHillwalkingRecommended && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent text-white text-xs font-semibold">
              ⛰️ Hillwalking
            </span>
          )}
        </div>
        {isFavorite !== undefined && (
          <div className="absolute top-2 right-2">
            <Heart
              className={cn(
                "w-5 h-5 drop-shadow",
                isFavorite
                  ? "fill-red-500 text-red-500"
                  : "text-white/80"
              )}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {item.title}
          </h3>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <PriceBadge price={item.dailyPrice} deposit={item.deposit} />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <ConditionBadge condition={item.condition} />
          {item.category && (
            <span className="text-xs text-muted">{item.category.name}</span>
          )}
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 text-xs text-muted">
          <MapPin className="w-3 h-3" />
          <span className="truncate">{item.pickupLocation}</span>
        </div>

        {/* Safety notice */}
        {item.safetyNotes && (
          <div className="flex items-start gap-1 text-xs text-accent-dark">
            <ShieldAlert className="w-3 h-3 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-1">{item.safetyNotes}</span>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-1 border-t border-surface-dark">
          {item.owner && (
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-medium">
                {item.owner.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs text-muted-dark">{item.owner.name}</span>
            </div>
          )}
          <div className="flex items-center gap-3 text-xs text-muted">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {item.viewCount}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              {item.favoriteCount}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
