"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Mountain, Search, Shield, Clock, Star, MapPin, ArrowRight, Package, ClipboardList, Compass } from "lucide-react";
import ItemCard from "@/components/items/ItemCard";

interface Item {
  id: string; title: string; description: string; dailyPrice: number;
  deposit: number; condition: string; status: string; pickupLocation: string;
  viewCount: number; favoriteCount: number; isHillwalkingRecommended: boolean;
  safetyNotes: string | null; tags: string; images: string; createdAt: string;
  category: { id: string; name: string; slug: string } | null;
  owner: { id: string; name: string; avatar: string | null; rating: number } | null;
}

const CATEGORIES = [
  { name: "Backpacks", slug: "backpacks", icon: "🎒" },
  { name: "Waterproof Gear", slug: "waterproof-gear", icon: "🌧️" },
  { name: "Trekking Poles", slug: "trekking-poles", icon: "🥾" },
  { name: "Camping Gear", slug: "camping-gear", icon: "⛺" },
  { name: "Lighting", slug: "lighting", icon: "🔦" },
  { name: "Warm Clothing", slug: "warm-clothing", icon: "🧥" },
  { name: "Cameras", slug: "cameras", icon: "📷" },
  { name: "Bottles & Hydration", slug: "bottles-hydration", icon: "💧" },
  { name: "Safety Gear", slug: "safety-gear", icon: "🛡️" },
  { name: "Other", slug: "other", icon: "📦" },
];

export default function HomePage() {
  const [items, setItems] = useState<Item[]>([]);
  const [freeItems, setFreeItems] = useState<Item[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/items?limit=8&sort=newest")
      .then((r) => r.json())
      .then((d) => setItems(d.items || []))
      .catch(() => {});
    fetch("/api/items?limit=4&minPrice=0&maxPrice=0")
      .then((r) => r.json())
      .then((d) => setFreeItems(d.items || []))
      .catch(() => {});
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-dark via-primary to-primary-light text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(244,163,64,0.15),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm mb-6">
              <Mountain className="w-4 h-4" />
              Peer-to-Peer Platform
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
              Rent Hillwalking Gear
              <br />
              <span className="text-accent">from People Near You</span>
            </h1>
            <p className="text-lg text-white/80 mb-8 max-w-lg">
              Borrow hiking gear for your next adventure. Affordable, sustainable, and trusted — join a community or use it anywhere.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/marketplace"
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-lg font-semibold hover:bg-accent-dark transition-colors"
              >
                <Search className="w-5 h-5" />
                Browse Gear
              </Link>
              <Link
                href="/my-items/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/30 text-white rounded-lg font-semibold hover:bg-white/20 transition-colors"
              >
                <Package className="w-5 h-5" />
                Post an Item
              </Link>
              <Link
                href="/hillwalking/checklist"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/30 text-white rounded-lg font-semibold hover:bg-white/20 transition-colors"
              >
                <ClipboardList className="w-5 h-5" />
                View Checklist
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Search */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-xl border border-surface-dark shadow-lg p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") window.location.href = `/marketplace?search=${encodeURIComponent(search)}`; }}
              placeholder="Search for gear..."
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-surface-dark bg-surface text-sm text-foreground placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <button
            onClick={() => window.location.href = `/marketplace?search=${encodeURIComponent(search)}`}
            className="px-6 py-3 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-light transition-colors flex-shrink-0"
          >
            Search
          </button>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-foreground">Browse by Category</h2>
          <p className="text-sm text-muted mt-2">Find exactly what you need for your next hillwalk</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/marketplace?category=${cat.slug}`}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-surface-dark bg-white hover:border-primary-light hover:shadow-md transition-all group"
            >
              <span className="text-3xl group-hover:scale-110 transition-transform">{cat.icon}</span>
              <span className="text-sm font-medium text-foreground text-center">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-surface py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-foreground">Trusted Community Platform</h2>
            <p className="text-sm text-muted mt-2">Safety and trust built into every transaction</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: "Verified Users", desc: "Community trust through reviews" },
              { icon: MapPin, title: "Local Pickup", desc: "Meet in public community areas" },
              { icon: Star, title: "Ratings & Reviews", desc: "Build trust through transparent reviews" },
              { icon: Clock, title: "Admin Moderation", desc: "Items reviewed before listing" },
            ].map((t, i) => (
              <div key={i} className="text-center p-6 rounded-xl bg-white border border-surface-dark">
                <t.icon className="w-10 h-10 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-1">{t.title}</h3>
                <p className="text-xs text-muted">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Items */}
      {items.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Latest Gear</h2>
              <p className="text-sm text-muted mt-1">Recently posted by community members</p>
            </div>
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-1 text-primary text-sm font-semibold hover:underline"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* Free to Borrow */}
      {freeItems.length > 0 && (
        <section className="bg-accent-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-foreground">🆓 Free to Borrow</h2>
                <p className="text-sm text-muted mt-1">Generous members sharing gear at no cost</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {freeItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Safety notice */}
      <section className="bg-primary-dark text-white/90 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-accent flex-shrink-0" />
              <div>
                <h3 className="font-semibold">Safety First</h3>
                <p className="text-sm text-white/70">
                  Exchange in public areas. Take photos. Report issues. This platform does not process real payments.
                </p>
              </div>
            </div>
            <Link
              href="/rules"
              className="inline-flex items-center gap-1 px-4 py-2 rounded-lg border border-white/20 text-sm text-white hover:bg-white/10 transition-colors flex-shrink-0"
            >
              Read Platform Rules <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
