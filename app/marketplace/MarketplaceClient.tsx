"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCallback, useMemo } from "react";
import { Search, SlidersHorizontal, ArrowUpDown, X } from "lucide-react";
import SearchBar from "@/components/ui/SearchBar";
import Pagination from "@/components/ui/Pagination";
import ItemFilterSidebar from "@/components/items/ItemFilterSidebar";
import ItemGrid from "@/components/items/ItemGrid";
import EmptyState from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface MarketplaceItem {
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
  isFavorite?: boolean;
  pickupLocation?: string;
}

interface FilterState {
  categories: string[];
  priceMin: string;
  priceMax: string;
  depositMin: string;
  depositMax: string;
  conditions: string[];
  hillwalkingRecommended: boolean;
  freeOnly: boolean;
}

interface MarketplaceClientProps {
  items: MarketplaceItem[];
  categories: { id: string; name: string }[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  sort: string;
  searchQuery: string;
  filters: FilterState;
}

export default function MarketplaceClient({
  items,
  categories,
  currentPage,
  totalPages,
  totalItems,
  sort,
  searchQuery,
  filters,
}: MarketplaceClientProps) {
  const router = useRouter();

  const updateURL = useCallback(
    (updates: Record<string, string | string[] | undefined>) => {
      const params = new URLSearchParams();
      // Preserve current params
      if (searchQuery) params.set("q", searchQuery);
      if (sort && sort !== "newest") params.set("sort", sort);
      if (filters.categories.length > 0) params.set("categories", filters.categories.join(","));
      if (filters.priceMin) params.set("priceMin", filters.priceMin);
      if (filters.priceMax) params.set("priceMax", filters.priceMax);
      if (filters.depositMin) params.set("depositMin", filters.depositMin);
      if (filters.depositMax) params.set("depositMax", filters.depositMax);
      if (filters.conditions.length > 0) params.set("conditions", filters.conditions.join(","));
      if (filters.hillwalkingRecommended) params.set("hillwalkingRecommended", "1");
      if (filters.freeOnly) params.set("freeOnly", "1");

      // Apply updates
      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === "" || (Array.isArray(value) && value.length === 0)) {
          params.delete(key);
        } else if (Array.isArray(value)) {
          params.set(key, value.join(","));
        } else {
          params.set(key, value);
        }
      });

      // Reset page to 1 on filter/sort/search change unless setting page explicitly
      if (!("page" in updates)) {
        params.delete("page");
      }

      const queryString = params.toString();
      router.push(queryString ? `/marketplace?${queryString}` : "/marketplace");
    },
    [router, searchQuery, sort, filters]
  );

  const handleSearch = useCallback(
    (query: string) => {
      updateURL({ q: query || undefined });
    },
    [updateURL]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      updateURL({ page: String(page) });
    },
    [updateURL]
  );

  const handleSortChange = useCallback(
    (newSort: string) => {
      updateURL({ sort: newSort === "newest" ? undefined : newSort });
    },
    [updateURL]
  );

  const handleFilterChange = useCallback(
    (newFilters: FilterState) => {
      updateURL({
        categories: newFilters.categories.length > 0 ? newFilters.categories.join(",") : undefined,
        priceMin: newFilters.priceMin || undefined,
        priceMax: newFilters.priceMax || undefined,
        depositMin: newFilters.depositMin || undefined,
        depositMax: newFilters.depositMax || undefined,
        conditions: newFilters.conditions.length > 0 ? newFilters.conditions.join(",") : undefined,
        hillwalkingRecommended: newFilters.hillwalkingRecommended ? "1" : undefined,
        freeOnly: newFilters.freeOnly ? "1" : undefined,
      });
    },
    [updateURL]
  );

  const hasActiveFilters = useMemo(() => {
    return (
      filters.categories.length > 0 ||
      filters.priceMin ||
      filters.priceMax ||
      filters.depositMin ||
      filters.depositMax ||
      filters.conditions.length > 0 ||
      filters.hillwalkingRecommended ||
      filters.freeOnly ||
      !!searchQuery
    );
  }, [filters, searchQuery]);

  const handleClearAll = useCallback(() => {
    router.push("/marketplace");
  }, [router]);

  const SortDropdown = () => (
    <div className="flex items-center gap-2">
      <label htmlFor="sort" className="text-xs text-muted hidden sm:block">
        <ArrowUpDown className="w-3.5 h-3.5 inline mr-1" />
        Sort:
      </label>
      <select
        id="sort"
        value={sort}
        onChange={(e) => handleSortChange(e.target.value)}
        className="h-9 pl-3 pr-8 bg-white border border-surface-dark rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236B7280%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_8px_center] bg-no-repeat"
      >
        <option value="newest">Newest</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
        <option value="popular">Most Popular</option>
      </select>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-primary-gradient py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Marketplace</h1>
          <p className="mt-2 text-white/75 text-sm sm:text-base">
            Browse {totalItems} available items from SCIE students
          </p>
        </div>
      </section>

      {/* Search Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5 relative z-10">
        <SearchBar
          placeholder="Search gear by title, brand, or description..."
          defaultValue={searchQuery}
          onSearch={handleSearch}
          className="shadow-lg"
        />
      </section>

      {/* Active Filters Bar */}
      {hasActiveFilters && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted">Active filters:</span>
            {searchQuery && (
              <Badge variant="info" className="gap-1">
                Search: {searchQuery}
                <button onClick={() => handleSearch("")} className="ml-0.5">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {filters.categories.map((catId) => {
              const cat = categories.find((c) => c.id === catId);
              return (
                <Badge key={catId} variant="default" className="gap-1">
                  {cat?.name || catId}
                  <button
                    onClick={() => {
                      const next = filters.categories.filter((c) => c !== catId);
                      handleFilterChange({ ...filters, categories: next });
                    }}
                    className="ml-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              );
            })}
            {filters.freeOnly && (
              <Badge variant="success" className="gap-1">
                Free Only
                <button
                  onClick={() => handleFilterChange({ ...filters, freeOnly: false })}
                  className="ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {filters.hillwalkingRecommended && (
              <Badge variant="warning" className="gap-1">
                HW Recommended
                <button
                  onClick={() => handleFilterChange({ ...filters, hillwalkingRecommended: false })}
                  className="ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            <button
              onClick={handleClearAll}
              className="text-xs text-primary hover:text-primary-light font-medium ml-1"
            >
              Clear all
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Filter Sidebar */}
          <ItemFilterSidebar
            categories={categories}
            filters={filters}
            onFilterChange={handleFilterChange}
          />

          {/* Items Area */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <p className="text-sm text-muted">
                {totalItems} item{totalItems !== 1 ? "s" : ""} found
              </p>
              <SortDropdown />
            </div>

            {/* Items */}
            {items.length > 0 ? (
              <>
                <ItemGrid items={items} />
                <div className="mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              </>
            ) : (
              <EmptyState
                icon={<Search className="w-12 h-12" />}
                title="No items found"
                description={
                  hasActiveFilters
                    ? "Try adjusting your filters or search query."
                    : "No items are currently available in the marketplace. Be the first to post one!"
                }
                action={
                  hasActiveFilters ? (
                    <button onClick={handleClearAll} className="text-primary font-medium text-sm hover:underline">Clear Filters</button>
                  ) : (
                    <Link href="/my-items/new" className="text-primary font-medium text-sm hover:underline">Post an Item</Link>
                  )
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
