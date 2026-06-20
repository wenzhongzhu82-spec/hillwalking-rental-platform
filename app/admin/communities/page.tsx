"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  Search, Users, Package, CheckCircle, XCircle,
  ExternalLink, ShieldCheck,
} from "lucide-react";
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
    items: number;
  };
}

const TYPE_LABELS: Record<string, string> = {
  SCHOOL: "School",
  CLUB: "Club",
  CITY: "City",
  ORGANIZATION: "Organization",
  OTHER: "Other",
};

export default function AdminCommunitiesPage() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [verifiedFilter, setVerifiedFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const initialLoadDone = useRef(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchCommunities = useCallback(async (opts: {
    search: string;
    type: string;
    verified: string;
    page: number;
  }) => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (opts.search) params.set("search", opts.search);
      if (opts.type) params.set("type", opts.type);
      if (opts.verified) params.set("verified", opts.verified);
      params.set("page", String(opts.page));
      params.set("limit", "20");
      const res = await fetch(`/api/admin/communities?${params}`);
      if (!res.ok) {
        if (res.status === 403) throw new Error("Access denied");
        throw new Error("Failed to fetch communities");
      }
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
    fetchCommunities({ search: "", type: "", verified: "", page: 1 });
  }, [fetchCommunities]);

  function doSearch() {
    setPage(1);
    fetchCommunities({ search, type: typeFilter, verified: verifiedFilter, page: 1 });
  }

  function changeType(t: string) {
    setTypeFilter(t);
    setPage(1);
    fetchCommunities({ search, type: t, verified: verifiedFilter, page: 1 });
  }

  function changeVerified(v: string) {
    setVerifiedFilter(v);
    setPage(1);
    fetchCommunities({ search, type: typeFilter, verified: v, page: 1 });
  }

  function goToPage(p: number) {
    setPage(p);
    fetchCommunities({ search, type: typeFilter, verified: verifiedFilter, page: p });
  }

  async function handleVerify(communityId: string, currentlyVerified: boolean) {
    setActionLoading(communityId);
    try {
      const res = await fetch("/api/admin/communities", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          communityId,
          action: currentlyVerified ? "UNVERIFY" : "VERIFY",
        }),
      });
      const data = await res.json();
      if (res.ok) {
        // Update locally
        setCommunities((prev) =>
          prev.map((c) => (c.id === communityId ? data.community : c))
        );
      } else {
        alert(data.error || "Action failed");
      }
    } catch {
      alert("Network error");
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Communities</h1>
        <p className="text-sm text-muted mt-1">
          Manage community verifications and monitor community activity
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-border-light shadow-sm p-4">
        <div className="flex flex-wrap gap-3 items-center">
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
          <select
            value={verifiedFilter}
            onChange={(e) => changeVerified(e.target.value)}
            className="px-3 py-2 rounded-lg border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="">All Status</option>
            <option value="true">Verified</option>
            <option value="false">Unverified</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <PageLoading />
      ) : error ? (
        <EmptyState
          icon={<Search className="w-12 h-12" />}
          title="Error"
          description={error}
        />
      ) : communities.length === 0 ? (
        <EmptyState
          icon={<Users className="w-12 h-12" />}
          title="No communities found"
          description="No communities match your filters"
        />
      ) : (
        <>
          <div className="bg-white rounded-xl border border-border-light shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface border-b border-border-light">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-dark uppercase tracking-wider">
                      Community
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-dark uppercase tracking-wider">
                      Type
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-dark uppercase tracking-wider">
                      Location
                    </th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-muted-dark uppercase tracking-wider">
                      Members
                    </th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-muted-dark uppercase tracking-wider">
                      Items
                    </th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-muted-dark uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-dark uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light">
                  {communities.map((c) => (
                    <tr key={c.id} className="hover:bg-surface/50 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-foreground">{c.name}</p>
                          {c.description && (
                            <p className="text-xs text-muted line-clamp-1 mt-0.5">
                              {c.description}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs bg-surface-dark text-muted-dark px-2 py-0.5 rounded-full">
                          {TYPE_LABELS[c.type] || c.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted">
                        {c.location || "-"}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-muted">
                        {c._count.members}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-muted">
                        {c._count.items}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {c.verified ? (
                          <span className="inline-flex items-center gap-1 text-xs bg-success-light text-success px-2 py-0.5 rounded-full font-medium">
                            <CheckCircle className="w-3 h-3" />
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs bg-warning-light text-accent-darker px-2 py-0.5 rounded-full font-medium">
                            <XCircle className="w-3 h-3" />
                            Unverified
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/communities/${c.slug}`}
                            className="p-1.5 rounded-lg text-muted hover:text-primary hover:bg-primary-50 transition-colors"
                            title="View"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleVerify(c.id, c.verified)}
                            disabled={actionLoading === c.id}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors disabled:opacity-50 ${
                              c.verified
                                ? "bg-warning-light text-accent-darker hover:bg-warning hover:text-white"
                                : "bg-success-light text-success hover:bg-success hover:text-white"
                            }`}
                          >
                            {actionLoading === c.id ? (
                              <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin inline-block" />
                            ) : c.verified ? (
                              "Unverify"
                            ) : (
                              "Verify"
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2">
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
