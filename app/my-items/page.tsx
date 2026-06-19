"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import ItemCard from "@/components/items/ItemCard";
import { PageLoading, EmptyState } from "@/components/ui/loading";

export default function MyItemsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/items?status=AVAILABLE&limit=50").then(r => r.json()).then(d => {
      fetch("/api/auth/me").then(r => r.json()).then(u => {
        setItems((d.items || []).filter((i: any) => i.ownerId === u.user?.id));
        setLoading(false);
      }).catch(() => setLoading(false));
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <PageLoading />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Items</h1>
          <p className="text-sm text-muted mt-1">Items you&apos;ve posted</p>
        </div>
        <Link href="/my-items/new" className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-light transition-colors">
          <Plus className="w-4 h-4" /> Post New Item
        </Link>
      </div>
      {items.length === 0 ? (
        <EmptyState icon="📦" title="No items posted yet" description="Share your gear with the SCIE community." action={<Link href="/my-items/new" className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-light">Post an Item</Link>} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map((item: any) => <ItemCard key={item.id} item={item} />)}
        </div>
      )}
    </div>
  );
}
