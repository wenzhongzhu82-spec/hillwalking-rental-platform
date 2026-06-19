"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import ItemCard from "@/components/items/ItemCard";
import { EmptyState, PageLoading } from "@/components/ui/loading";

interface Item {
  id: string; title: string; description: string; dailyPrice: number;
  deposit: number; condition: string; status: string; pickupLocation: string;
  viewCount: number; favoriteCount: number; isHillwalkingRecommended: boolean;
  safetyNotes: string | null; tags: string; images: string; createdAt: string;
  category: { id: string; name: string; slug: string } | null;
  owner: { id: string; name: string; avatar: string | null; rating: number } | null;
}

interface Category {
  id: string; name: string; slug: string;
}

export default function MarketplacePage() {
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (categoryId) params.set("categoryId", categoryId);
      params.set("sort", sort);
      params.set("page", String(page));
      params.set("limit", "12");
      const res = await fetch(`/api/items?${params}`);
      const data = await res.json();
      setItems(data.items || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [search, categoryId, sort, page]);

  useEffect(() => {
    fetch("/api/items?limit=1").then(r => r.json()).catch(() => {});
    // Fetch categories (just use what we have)
    const catMap = new Map<string, Category>();
    items.forEach(i => { if (i.category && !catMap.has(i.category.slug)) catMap.set(i.category.slug, i.category); });
    setCategories(Array.from(catMap.values()));
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Marketplace</h1>
        <p className="text-sm text-muted mt-1">Browse hillwalking gear from SCIE students</p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search gear..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-surface-dark bg-white text-sm text-foreground placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <select
          value={categoryId}
          onChange={(e) => { setCategoryId(e.target.value); setPage(1); }}
          className="px-4 py-2.5 rounded-lg border border-surface-dark bg-white text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => { setSort(e.target.value); setPage(1); }}
          className="px-4 py-2.5 rounded-lg border border-surface-dark bg-white text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="most_viewed">Most Viewed</option>
          <option value="most_favorited">Most Favorited</option>
        </select>
      </div>

      {/* Results */}
      {loading ? (
        <PageLoading />
      ) : items.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No items found"
          description={search ? `No results for "${search}". Try a different search.` : "No gear available right now. Be the first to post!"}
          action={
            <a href="/my-items/new" className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-light transition-colors">
              Post an Item
            </a>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page <= 1}
                className="px-3 py-1.5 text-sm rounded-lg border border-surface-dark disabled:opacity-30 hover:bg-surface transition-colors"
              >
                Previous
              </button>
              <span className="text-sm text-muted">Page {page} of {totalPages}</span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1.5 text-sm rounded-lg border border-surface-dark disabled:opacity-30 hover:bg-surface transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
