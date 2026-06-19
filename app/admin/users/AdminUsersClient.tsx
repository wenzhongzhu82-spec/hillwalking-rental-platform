"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Users,
  User,
  ShieldCheck,
  ShieldOff,
  CheckCircle2,
  XCircle,
  Eye,
  ChevronLeft,
  ChevronRight,
  Star,
  Mail,
} from "lucide-react";
import { cn, formatDate, getInitials } from "@/lib/utils";

interface UserData {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  grade: string;
  house: string;
  role: string;
  verified: boolean;
  rating: number;
  creditScore: number;
  createdAt: string;
  bio: string | null;
  _count: {
    items: number;
    rentalRequestsAsBorrower: number;
  };
}

const GRADE_LABELS: Record<string, string> = {
  G1: "G1", G2: "G2", A1: "A1", A2: "A2", Teacher: "Teacher", Staff: "Staff",
};

export function AdminUsersClient({
  initialUsers,
  totalUsers,
  currentPage,
  totalPages,
  currentSearch,
  currentRole,
  currentGrade,
  currentHouse,
}: {
  initialUsers: UserData[];
  totalUsers: number;
  currentPage: number;
  totalPages: number;
  currentSearch: string;
  currentRole: string;
  currentGrade: string;
  currentHouse: string;
}) {
  const router = useRouter();
  const [search, setSearch] = useState(currentSearch);
  const [roleFilter, setRoleFilter] = useState(currentRole);
  const [gradeFilter, setGradeFilter] = useState(currentGrade);
  const [houseFilter, setHouseFilter] = useState(currentHouse);

  const applyFilters = useCallback(
    (overrides?: { search?: string; role?: string; grade?: string; house?: string }) => {
      const s = overrides?.search ?? search;
      const r = overrides?.role ?? roleFilter;
      const g = overrides?.grade ?? gradeFilter;
      const h = overrides?.house ?? houseFilter;
      const params = new URLSearchParams();
      if (s) params.set("search", s);
      if (r !== "ALL") params.set("role", r);
      if (g !== "ALL") params.set("grade", g);
      if (h !== "ALL") params.set("house", h);
      params.set("page", "1");
      router.push(`/admin/users?${params.toString()}`);
    },
    [search, roleFilter, gradeFilter, houseFilter, router]
  );

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (roleFilter !== "ALL") params.set("role", roleFilter);
    if (gradeFilter !== "ALL") params.set("grade", gradeFilter);
    if (houseFilter !== "ALL") params.set("house", houseFilter);
    params.set("page", String(page));
    router.push(`/admin/users?${params.toString()}`);
  };

  const performUserAction = async (userId: string, action: string) => {
    try {
      await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action }),
      });
      router.refresh();
    } catch {}
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Users Management
        </h1>
        <p className="text-sm text-muted mt-1">{totalUsers} total users</p>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl border border-border-light shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-light" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyFilters()}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-white text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              applyFilters({ role: e.target.value });
            }}
            className="px-3 py-2.5 rounded-xl border border-border bg-white text-sm text-foreground cursor-pointer outline-none focus:border-primary"
          >
            <option value="ALL">All Roles</option>
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>
          <select
            value={gradeFilter}
            onChange={(e) => {
              setGradeFilter(e.target.value);
              applyFilters({ grade: e.target.value });
            }}
            className="px-3 py-2.5 rounded-xl border border-border bg-white text-sm text-foreground cursor-pointer outline-none focus:border-primary"
          >
            <option value="ALL">All Grades</option>
            <option value="G1">G1</option>
            <option value="G2">G2</option>
            <option value="A1">A1</option>
            <option value="A2">A2</option>
            <option value="Teacher">Teacher</option>
            <option value="Staff">Staff</option>
          </select>
          <select
            value={houseFilter}
            onChange={(e) => {
              setHouseFilter(e.target.value);
              applyFilters({ house: e.target.value });
            }}
            className="px-3 py-2.5 rounded-xl border border-border bg-white text-sm text-foreground cursor-pointer outline-none focus:border-primary"
          >
            <option value="ALL">All Houses</option>
            <option value="Fire">Fire</option>
            <option value="Water">Water</option>
            <option value="Wood">Wood</option>
            <option value="Metal">Metal</option>
            <option value="None">None</option>
          </select>
          <button
            onClick={() => applyFilters()}
            className="px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary-light transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-border-light shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-light bg-surface/50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-dark uppercase tracking-wider">
                  User
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-muted-dark uppercase tracking-wider hidden md:table-cell">
                  Grade
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-muted-dark uppercase tracking-wider hidden lg:table-cell">
                  House
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-muted-dark uppercase tracking-wider hidden sm:table-cell">
                  Role
                </th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-muted-dark uppercase tracking-wider hidden lg:table-cell">
                  Verified
                </th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-muted-dark uppercase tracking-wider hidden lg:table-cell">
                  Credit
                </th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-muted-dark uppercase tracking-wider hidden md:table-cell">
                  Items
                </th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-muted-dark uppercase tracking-wider hidden md:table-cell">
                  Orders
                </th>
                <th className="px-3 py-3 text-right text-xs font-semibold text-muted-dark uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {initialUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-surface/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium flex-shrink-0">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-9 h-9 rounded-full object-cover"
                          />
                        ) : (
                          getInitials(user.name)
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-medium text-foreground truncate">
                            {user.name}
                          </p>
                          {user.role === "ADMIN" && (
                            <ShieldCheck className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-muted truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 hidden md:table-cell">
                    <span className="text-sm text-muted">
                      {GRADE_LABELS[user.grade] || user.grade}
                    </span>
                  </td>
                  <td className="px-3 py-3 hidden lg:table-cell">
                    <span
                      className={cn(
                        "inline-flex px-2 py-0.5 rounded-full text-xs font-medium",
                        user.house === "Fire"
                          ? "bg-error-light text-error"
                          : user.house === "Water"
                            ? "bg-info-light text-info"
                            : user.house === "Wood"
                              ? "bg-success-light text-success"
                              : user.house === "Metal"
                                ? "bg-surface-dark text-muted-dark"
                                : "bg-surface text-muted"
                      )}
                    >
                      {user.house}
                    </span>
                  </td>
                  <td className="px-3 py-3 hidden sm:table-cell">
                    <span
                      className={cn(
                        "inline-flex px-2 py-0.5 rounded-full text-xs font-medium",
                        user.role === "ADMIN"
                          ? "bg-accent-50 text-accent-darker"
                          : "bg-surface-dark text-muted-dark"
                      )}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center hidden lg:table-cell">
                    {user.verified ? (
                      <CheckCircle2 className="w-4 h-4 text-success mx-auto" />
                    ) : (
                      <XCircle className="w-4 h-4 text-muted-light mx-auto" />
                    )}
                  </td>
                  <td className="px-3 py-3 text-center hidden lg:table-cell">
                    <span
                      className={cn(
                        "text-sm font-medium",
                        user.creditScore >= 90
                          ? "text-success"
                          : user.creditScore >= 70
                            ? "text-accent-darker"
                            : "text-error"
                      )}
                    >
                      {user.creditScore}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center hidden md:table-cell">
                    <span className="text-sm text-muted">
                      {user._count.items}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center hidden md:table-cell">
                    <span className="text-sm text-muted">
                      {user._count.rentalRequestsAsBorrower}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/profile/${user.id}`}
                        className="p-1.5 rounded-lg text-muted hover:text-primary hover:bg-primary-50 transition-colors"
                        title="View Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      {user.verified ? (
                        <button
                          onClick={() => performUserAction(user.id, "UNVERIFY")}
                          className="p-1.5 rounded-lg text-muted hover:text-error hover:bg-error-light transition-colors"
                          title="Unverify"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => performUserAction(user.id, "VERIFY")}
                          className="p-1.5 rounded-lg text-muted hover:text-success hover:bg-success-light transition-colors"
                          title="Verify"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      )}
                      {user.role !== "ADMIN" ? (
                        <button
                          onClick={() => performUserAction(user.id, "PROMOTE_ADMIN")}
                          className="p-1.5 rounded-lg text-muted hover:text-accent hover:bg-accent-50 transition-colors"
                          title="Promote to Admin"
                        >
                          <ShieldCheck className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => performUserAction(user.id, "DEMOTE_ADMIN")}
                          className="p-1.5 rounded-lg text-muted hover:text-muted-dark hover:bg-surface transition-colors"
                          title="Remove Admin"
                        >
                          <ShieldOff className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {initialUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-10 h-10 text-muted-light mx-auto mb-3" />
            <p className="text-muted">No users found.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border-light">
            <p className="text-sm text-muted">
              Page {currentPage} of {totalPages} ({totalUsers} users)
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) pageNum = i + 1;
                else if (currentPage <= 3) pageNum = i + 1;
                else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                else pageNum = currentPage - 2 + i;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={cn(
                      "w-8 h-8 rounded-lg text-sm font-medium transition-colors",
                      pageNum === currentPage
                        ? "bg-primary text-white"
                        : "text-muted-dark hover:bg-surface"
                    )}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
