"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { Search, Users, MapPin, Plus, Building2, GraduationCap, Globe, Users2, Circle } from "lucide-react";
import { EmptyState, PageLoading } from "@/components/ui/loading";

interface Community {
  id: string;
  name: string;
  slug: string;
  type: string;
  description: string | null;
  location: string | null;
  verified: boolean;
  image: string | null;
  createdAt: string;
  _count: {
    members: number;
  };
}

const TYPE_LABELS: Record<string, string> = {
  SCHOOL: "School",
  CLUB: "Club",
  CITY: "City",
  ORGANIZATION: "Organization",
  OTHER: "Other",
};

const TYPE_ICONS: Record<string, React.ReactNode> = {
  SCHOOL: <GraduationCap className="w-4 h-4" />,
  CLUB: <Users2 className="w-4 h-4" />,
  CITY: <Building2 className="w-4 h-4" />,
  ORGANIZATION: <Globe className="w-4 h-4" />,
  OTHER: <Circle className="w-4 h-4" />,
};

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const initialLoadDone = useRef(false);

  const fetchCommunities = useCallback(async (opts: {
    search: string;
    type: string;
    page: number;
  }) => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (opts.search) params.set("search", opts.search);
      if (opts.type) params.set("type", opts.type);
      params.set("page", String(opts.page));
      params.set("limit", "12");
      const res = await fetch(`/api/communities?${params}`);
      if (!res.ok) throw new Error("Failed to fetch communities");
      const data = await res.json();
      setCommunities(data.communities || []);
      if (data.pagination) {
        setTotalPages(data.pagination.totalPages || 1);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load communities");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialLoadDone.current) return;
    initialLoadDone.current = true;
    fetchCommunities({ search: "", type: "", page: 1 });
  }, [fetchCommunities]);

  function doSearch() {
    setPage(1);
    fetchCommunities({ search, type: typeFilter, page: 1 });
  }

  function changeType(t: string) {
    setTypeFilter(t);
    setPage(1);
    fetchCommunities({ search, type: t, page: 1 });
  }

  function goToPage(p: number) {
    setPage(p);
    fetchCommunities({ search, type: typeFilter, page: p });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Communities</h1>
          <p className="text-sm text-muted mt-1">
            Connect with groups near you and share gear locally
          </p>
        </div>
        <Link
          href="/communities/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors self-start"
        >
          <Plus className="w-4 h-4" />
          Create Community
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Search communities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") doSearch(); }}
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
          value={typeFilter}
          onChange={(e) => changeType(e.target.value)}
          className="px-3 py-2 rounded-lg border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="">All Types</option>
          <option value="SCHOOL">School</option>
          <option value="CLUB">Club</option>
          <option value="CITY">City</option>
          <option value="ORGANIZATION">Organization</option>
          <option value="OTHER">Other</option>
        </select>
      </div>

      {/* Results */}
      {loading ? (
        <PageLoading />
      ) : error ? (
        <EmptyState
          icon={<Search className="w-12 h-12" />}
          title="Error loading communities"
          description={error}
        />
      ) : communities.length === 0 ? (
        <EmptyState
          icon={<Search className="w-12 h-12" />}
          title="No communities found"
          description="Try adjusting your search or create a new community"
          action={
            <Link
              href="/communities/new"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Community
            </Link>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {communities.map((community) => (
              <Link
                key={community.id}
                href={`/communities/${community.slug}`}
                className="group bg-card rounded-xl border border-border shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200 p-6"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-xs font-medium bg-surface px-2 py-0.5 rounded-full text-muted-dark">
                      {TYPE_ICONS[community.type]}
                      {TYPE_LABELS[community.type] || community.type}
                    </span>
                  </div>
                  {community.verified && (
                    <span className="text-xs bg-success-light text-success font-medium px-2 py-0.5 rounded-full">
                      Verified
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                  {community.name}
                </h3>
                {community.description && (
                  <p className="text-sm text-muted line-clamp-2 mb-3">
                    {community.description}
                  </p>
                )}
                <div className="flex items-center gap-4 text-xs text-muted">
                  {community.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {community.location}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {community._count.members} member{community._count.members !== 1 ? "s" : ""}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                disabled={page <= 1}
                onClick={() => goToPage(page - 1)}
                className="px-3 py-1.5 rounded-lg border border-border text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted transition-colors"
              >
                Previous
              </button>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
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
                    onClick={() => goToPage(pageNum)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      pageNum === page
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "border border-border hover:bg-muted"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                disabled={page >= totalPages}
                onClick={() => goToPage(page + 1)}
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
