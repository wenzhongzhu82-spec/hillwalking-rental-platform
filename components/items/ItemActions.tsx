"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  Star,
  MessageSquare,
  ClipboardList,
  Heart,
  Flag,
  Shield,
  Loader2,
} from "lucide-react";
import { cn, formatPrice, formatDateTime } from "@/lib/utils";
import { CONDITION_LABELS, STATUS_LABELS } from "@/lib/constants";

interface ItemDetailData {
  id: string;
  title: string;
  description: string;
  dailyPrice: number;
  deposit: number;
  condition: string;
  status: string;
  images: string;
  tags: string;
  viewCount: number;
  favoriteCount: number;
  pickupLocation: string;
  returnLocation: string | null;
  availableFrom: string;
  availableTo: string;
  brand: string | null;
  size: string | null;
  safetyNotes: string | null;
  isHillwalkingRecommended: boolean;
  createdAt: string;
  owner: {
    id: string;
    name: string;
    avatar: string | null;
    rating: number;
    grade: string;
    house: string;
    completedOrders: number;
    createdAt: string;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

export default function ItemActions({
  item,
  sessionId,
}: {
  item: ItemDetailData;
  sessionId: string | null;
}) {
  const router = useRouter();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isOwner = sessionId === item.owner.id;

  const handleStartRental = () => {
    if (!sessionId) {
      toast.error("Please log in to start a rental request");
      router.push("/login");
      return;
    }
    // Navigate to orders/create or open modal
    router.push(
      `/orders/create?itemId=${item.id}&startDate=${item.availableFrom.split("T")[0]}&endDate=${item.availableTo.split("T")[0]}`
    );
  };

  const handleContactOwner = () => {
    if (!sessionId) {
      toast.error("Please log in to message");
      router.push("/login");
      return;
    }
    router.push(`/messages/new?itemId=${item.id}&userId=${item.owner.id}`);
  };

  const handleFavorite = async () => {
    if (!sessionId) {
      toast.error("Please log in to save favorites");
      router.push("/login");
      return;
    }
    try {
      const res = await fetch(`/api/items/${item.id}/favorite`, {
        method: "POST",
      });
      if (res.ok) {
        setIsFavorited(!isFavorited);
        toast.success(isFavorited ? "Removed from favorites" : "Added to favorites");
      }
    } catch {
      toast.error("Failed to update favorite");
    }
  };

  const handleReport = () => {
    if (!sessionId) {
      toast.error("Please log in to report");
      router.push("/login");
      return;
    }
    router.push(`/report?itemId=${item.id}`);
  };

  return (
    <div className="space-y-3">
      {/* Main CTA */}
      {!isOwner && item.status === "AVAILABLE" && (
        <button
          onClick={handleStartRental}
          className="w-full py-3 px-6 text-sm font-semibold text-white bg-accent hover:bg-accent-dark rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
        >
          <ClipboardList className="w-4 h-4" />
          Start Rental Request
        </button>
      )}

      {/* Contact Owner */}
      {!isOwner && (
        <button
          onClick={handleContactOwner}
          className="w-full py-2.5 px-6 text-sm font-medium text-primary bg-primary-50 hover:bg-primary-100 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <MessageSquare className="w-4 h-4" />
          Contact Owner
        </button>
      )}

      {/* Secondary actions row */}
      <div className="flex gap-2">
        <button
          onClick={handleFavorite}
          className={cn(
            "flex-1 py-2 px-4 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5",
            isFavorited
              ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
              : "bg-white text-muted-dark border border-surface-dark hover:bg-surface hover:text-foreground"
          )}
        >
          <Heart
            className={cn("w-4 h-4", isFavorited && "fill-red-500 text-red-500")}
          />
          {isFavorited ? "Favorited" : "Favorite"}
        </button>

        <button
          onClick={handleReport}
          className="flex-1 py-2 px-4 text-xs font-medium text-muted-dark bg-white border border-surface-dark rounded-lg hover:bg-surface hover:text-foreground transition-colors flex items-center justify-center gap-1.5"
        >
          <Flag className="w-4 h-4" />
          Report
        </button>
      </div>

      {/* Status info */}
      <div className="p-3 bg-surface rounded-lg text-xs text-muted-dark space-y-1.5">
        <div className="flex items-center justify-between">
          <span>Status</span>
          <span
            className={cn(
              "font-medium px-2 py-0.5 rounded-full",
              item.status === "AVAILABLE"
                ? "bg-success-light text-success"
                : item.status === "RESERVED"
                ? "bg-warning-light text-warning"
                : item.status === "RENTED"
                ? "bg-info-light text-info"
                : "bg-surface-dark text-muted-dark"
            )}
          >
            {STATUS_LABELS[item.status] || item.status}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Views</span>
          <span className="font-medium">{item.viewCount}</span>
        </div>
        {item.isHillwalkingRecommended && (
          <div className="flex items-center justify-between text-accent-dark">
            <span>HW Recommended</span>
            <Shield className="w-3.5 h-3.5" />
          </div>
        )}
      </div>
    </div>
  );
}
