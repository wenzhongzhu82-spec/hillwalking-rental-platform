"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
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
  const initialLoadDone = useRef(false);

  const fetchItems = useCallback(async (opts: {
    search: string; categoryId: string; sort: string; page: number;
  }) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (opts.search) params.set("search", opts.search);
      if (opts.categoryId) params.set("categoryId", opts.categoryId);
      params.set("sort", opts.sort);
      params.set("page", String(opts.page));
      params.set("limit", "12");
      const res = await fetch(`/api/items?${params}`);
      const data = await res.json();
      if (data.items) {
        setItems(data.items);
      } else {
        setItems([]);
      }
      if (data.pagination) {
        setTotalPages(data.pagination.totalPages || 1);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load categories once on mount
  useEffect(function loadCategories() {
    let cancelled = false;
    fetch("/api/items?limit=100")
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (cancelled) return;
        const catMap = new Map<string, Category>();
        (data.items || []).forEach(function (i: Item) {
          if (i.category && !catMap.has(i.category.slug)) {
            catMap.set(i.category.slug, i.category);
          }
        });
        setCategories(Array.from(catMap.values()));
      })
      .catch(function () { /* ignore */ });
    return function () { cancelled = true; };
  }, []);

  // Fetch items on mount
  useEffect(() => {
    if (initialLoadDone.current) return;
    initialLoadDone.current = true;
    fetchItems({ search: "", categoryId: "", sort: "newest", page: 1 });
  }, [fetchItems]);

  function doSearch() {
    setPage(1);
    fetchItems({ search, categoryId, sort, page: 1 });
  }

  function changeCategory(id: string) {
    setCategoryId(id);
    setPage(1);
    fetchItems({ search, categoryId: id, sort, page: 1 });
  }

  function changeSort(s: string) {
    setSort(s);
    setPage(1);
    fetchItems({ search, categoryId, sort: s, page: 1 });
  }

  function goToPage(p: number) {
    setPage(p);
    fetchItems({ search, categoryId, sort, page: p });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Marketplace</h1>
        <p className="text-sm text-muted mt-1">Browse hillwalking gear from people near you</p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Search gear..."
            value={search}
            onChange={function (e) { setSearch(e.target.value); }}
            onKeyDown={function (e) { if (e.key === "Enter") doSearch(); }}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <button
          onClick={doSearch}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Search
        </button>

        <select
          value={categoryId}
          onChange={function (e) { changeCategory(e.target.value); }}
          className="px-3 py-2 rounded-lg border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="">All Categories</option>
          {categories.map(function (c) {
            return (
              <option key={c.id} value={c.id}>{c.name}</option>
            );
          })}
        </select>

        <select
          value={sort}
          onChange={function (e) { changeSort(e.target.value); }}
          className="px-3 py-2 rounded-lg border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="most_viewed">Most Viewed</option>
          <option value="most_favorited">Most Favorited</option>
        </select>

        <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-card text-sm text-foreground hover:bg-muted transition-colors">
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Results */}
      {loading ? (
        <PageLoading />
      ) : items.length === 0 ? (
        <EmptyState
          icon={<Search className="w-12 h-12" />}
          title="No items found"
          description="Try adjusting your search or filters"
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(function (item) {
              return (
                <ItemCard key={item.id} item={item as any} />
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                disabled={page <= 1}
                onClick={function () { goToPage(page - 1); }}
                className="px-3 py-1.5 rounded-lg border border-border text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted transition-colors"
              >
                Previous
              </button>
              {Array.from({ length: Math.min(totalPages, 7) }, function (_, i) {
                let pageNum: number;
                if (totalPages <= 7) {
                  pageNum = i + 1;
                } else if (page <= 4) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 3) {
                  pageNum = totalPages - 6 + i;
                } else {
                  pageNum = page - 3 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={function () { goToPage(pageNum); }}
                    className={"px-3 py-1.5 rounded-lg text-sm transition-colors " + (
                      pageNum === page
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "border border-border hover:bg-muted"
                    )}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                disabled={page >= totalPages}
                onClick={function () { goToPage(page + 1); }}
                className="px-3 py-1.5 rounded-lg border border-border text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted transition-colors"
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
