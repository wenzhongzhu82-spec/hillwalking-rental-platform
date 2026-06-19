"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye, Heart, MapPin, Calendar, Shield, MessageSquare, Star, ArrowLeft
} from "lucide-react";
import { formatPrice, formatDate, cn } from "@/lib/utils";
import { PriceBadge, StatusBadge, ConditionBadge, RatingStars, VerifiedBadge } from "@/components/ui/badges";
import { PageLoading } from "@/components/ui/loading";
import toast from "react-hot-toast";

interface ItemPageProps {
  params: Promise<{ id: string }>;
}

export default function ItemDetailPage({ params }: ItemPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => setUser(d.user)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/items/${id}`)
      .then(r => r.json())
      .then(d => {
        setItem(d.item);
        // Check favorite status if logged in
        if (d.item && user) {
          fetch(`/api/favorites?itemId=${d.item.id}`)
            .then(r => r.json())
            .then(f => setIsFavorite(f.isFavorite))
            .catch(() => {});
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id, user]);

  if (loading) return <PageLoading />;
  if (!item) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">Item Not Found</h1>
        <p className="text-muted mb-4">This item may have been removed or is no longer available.</p>
        <Link href="/marketplace" className="text-primary font-medium hover:underline">Back to Marketplace</Link>
      </div>
    );
  }

  const handleFavorite = async () => {
    if (!user) { router.push("/login"); return; }
    try {
      const res = await fetch("/api/favorites", {
        method: isFavorite ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: item.id }),
      });
      if (res.ok) {
        setIsFavorite(!isFavorite);
        toast.success(isFavorite ? "Removed from favorites" : "Added to favorites");
      }
    } catch { toast.error("Something went wrong"); }
  };

  const handleContact = async () => {
    if (!user) { router.push("/login"); return; }
    if (user.id === item.ownerId) { toast.error("You can't contact yourself"); return; }
    try {
      const res = await fetch("/api/messages/threads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: item.id, lenderId: item.ownerId }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push(`/messages/${data.thread.id}`);
      } else {
        toast.error(data.error || "Failed to start conversation");
      }
    } catch { toast.error("Something went wrong"); }
  };

  const tags: string[] = (() => { try { return JSON.parse(item.tags); } catch { return []; } })();
  const images: string[] = (() => { try { return JSON.parse(item.images); } catch { return []; } })();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/marketplace" className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Marketplace
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image */}
          <div className="aspect-video bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl flex items-center justify-center">
            <span className="text-6xl">🎒</span>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{item.title}</h1>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <StatusBadge status={item.status} />
                <ConditionBadge condition={item.condition} />
                {item.isHillwalkingRecommended && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent text-white text-xs font-semibold">⛰️ Hillwalking Recommended</span>
                )}
              </div>
            </div>
          </div>

          <PriceBadge price={item.dailyPrice} deposit={item.deposit} />

          {/* Description */}
          <div>
            <h3 className="font-semibold text-foreground mb-2">Description</h3>
            <p className="text-sm text-muted-dark leading-relaxed whitespace-pre-line">{item.description}</p>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-4">
            {item.brand && <div><span className="text-xs text-muted">Brand</span><p className="text-sm font-medium">{item.brand}</p></div>}
            {item.size && <div><span className="text-xs text-muted">Size</span><p className="text-sm font-medium">{item.size}</p></div>}
            <div><span className="text-xs text-muted">Category</span><p className="text-sm font-medium">{item.category?.name || "—"}</p></div>
            <div><span className="text-xs text-muted">Available</span><p className="text-sm font-medium">{formatDate(item.availableFrom)} – {formatDate(item.availableTo)}</p></div>
          </div>

          {/* Pickup */}
          <div>
            <h3 className="font-semibold text-foreground mb-2">Pickup & Return</h3>
            <div className="flex items-center gap-2 text-sm text-muted-dark">
              <MapPin className="w-4 h-4" />
              <span>{item.pickupLocation}</span>
              {item.returnLocation && <span>→ {item.returnLocation}</span>}
            </div>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((t: string) => (
                <span key={t} className="px-2 py-1 rounded-full bg-surface text-xs text-muted-dark">{t}</span>
              ))}
            </div>
          )}

          {/* Safety Notes */}
          {item.safetyNotes && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-warning-light border border-warning/20">
              <Shield className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-warning">Safety Notes</p>
                <p className="text-xs text-muted-dark mt-0.5">{item.safetyNotes}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right: Owner & Actions */}
        <div className="space-y-4">
          {/* Owner card */}
          <div className="bg-white rounded-xl border border-surface-dark p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">Posted by</h3>
            <Link href={`/profile/${item.owner?.id}`} className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                {item.owner?.name?.charAt(0).toUpperCase() || "?"}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-semibold group-hover:text-primary transition-colors">{item.owner?.name}</span>
                  {item.owner?.verified && <VerifiedBadge />}
                </div>
                {item.owner?.rating > 0 && <RatingStars rating={item.owner.rating} size="sm" />}
              </div>
            </Link>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl border border-surface-dark p-4 space-y-3">
            <button
              onClick={handleContact}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-light transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              Contact Lender
            </button>
            <button
              onClick={handleFavorite}
              className={cn(
                "w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold border transition-colors",
                isFavorite
                  ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
                  : "border-surface-dark text-muted-dark hover:bg-surface"
              )}
            >
              <Heart className={cn("w-4 h-4", isFavorite && "fill-red-500")} />
              {isFavorite ? "Saved" : "Save to Favorites"}
            </button>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-xl border border-surface-dark p-4">
            <h3 className="text-sm font-semibold text-foreground mb-2">Stats</h3>
            <div className="flex items-center gap-4 text-xs text-muted">
              <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{item.viewCount} views</span>
              <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{item.favoriteCount} saves</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
