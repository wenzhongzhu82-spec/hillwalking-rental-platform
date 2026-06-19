"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Flag,
  CheckCircle2,
  XCircle,
  MessageSquareText,
  Eye,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn, formatDate, timeAgo, shortenText } from "@/lib/utils";

interface ReportData {
  id: string;
  reason: string;
  description: string | null;
  status: string;
  adminNote: string | null;
  createdAt: string;
  updatedAt: string;
  reporter: { id: string; name: string; email: string };
  item: { id: string; title: string } | null;
  targetUser: { id: string; name: string } | null;
}

const STATUS_FILTERS = [
  { value: "PENDING", label: "Pending", color: "bg-warning-light text-accent-darker" },
  { value: "RESOLVED", label: "Resolved", color: "bg-success-light text-success" },
  { value: "DISMISSED", label: "Dismissed", color: "bg-surface-dark text-muted-dark" },
  { value: "ALL", label: "All", color: "bg-surface text-muted" },
];

const REASON_LABELS: Record<string, string> = {
  FAKE_ITEM: "Fake Item",
  UNREASONABLE_PRICE: "Unreasonable Price",
  DANGEROUS: "Dangerous Item",
  NOT_SUITABLE: "Not Suitable",
  FAKE_IMAGE: "Fake Image",
  OTHER: "Other",
};

const STATUS_BADGE: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Pending", color: "bg-warning-light text-accent-darker" },
  RESOLVED: { label: "Resolved", color: "bg-success-light text-success" },
  DISMISSED: { label: "Dismissed", color: "bg-surface-dark text-muted-dark" },
};

export function AdminReportsClient({
  initialReports,
  totalReports,
  currentPage,
  totalPages,
  currentStatus,
}: {
  initialReports: ReportData[];
  totalReports: number;
  currentPage: number;
  totalPages: number;
  currentStatus: string;
}) {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState(currentStatus);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showNoteModal, setShowNoteModal] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    const params = new URLSearchParams();
    if (status !== "PENDING") params.set("status", status);
    params.set("page", "1");
    router.push(`/admin/reports?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams();
    if (statusFilter !== "PENDING") params.set("status", statusFilter);
    params.set("page", String(page));
    router.push(`/admin/reports?${params.toString()}`);
  };

  const performAction = async (reportId: string, action: string) => {
    try {
      const res = await fetch(`/api/reports/${reportId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, adminNote: noteText }),
      });
      if (res.ok) {
        setShowNoteModal(null);
        setNoteText("");
        router.refresh();
      }
    } catch {}
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Reports Management
        </h1>
        <p className="text-sm text-muted mt-1">
          {totalReports} total reports
        </p>
      </div>

      {/* Status Filters */}
      <div className="bg-white rounded-xl border border-border-light shadow-sm p-4">
        <div className="flex flex-wrap gap-1.5">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => handleStatusFilter(f.value)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5",
                statusFilter === f.value
                  ? "bg-primary text-white"
                  : "bg-surface text-muted-dark hover:bg-surface-dark"
              )}
            >
              {f.value === "PENDING" && <AlertTriangle className="w-3 h-3" />}
              {f.value === "RESOLVED" && <CheckCircle2 className="w-3 h-3" />}
              {f.value === "DISMISSED" && <XCircle className="w-3 h-3" />}
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-3">
        {initialReports.map((report) => {
          const isExpanded = expandedId === report.id;
          const badge = STATUS_BADGE[report.status] || STATUS_BADGE.PENDING;
          const targetLink = report.item
            ? `/items/${report.item.id}`
            : report.targetUser
              ? `/profile/${report.targetUser.id}`
              : null;

          return (
            <div
              key={report.id}
              className="bg-white rounded-xl border border-border-light shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="px-5 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-error bg-error-light px-2 py-0.5 rounded-full">
                        <Flag className="w-3 h-3" />
                        {REASON_LABELS[report.reason] || report.reason}
                      </span>
                      <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", badge.color)}>
                        {badge.label}
                      </span>
                      <span className="text-xs text-muted">
                        {timeAgo(report.createdAt)}
                      </span>
                    </div>

                    <div className="mt-2">
                      <p className="text-sm">
                        <span className="font-medium text-foreground">
                          {report.reporter.name}
                        </span>
                        <span className="text-muted"> reported </span>
                        {report.item && (
                          <Link
                            href={`/items/${report.item.id}`}
                            className="font-medium text-primary hover:underline"
                          >
                            {report.item.title}
                          </Link>
                        )}
                        {report.targetUser && (
                          <Link
                            href={`/profile/${report.targetUser.id}`}
                            className="font-medium text-primary hover:underline"
                          >
                            {report.targetUser.name}
                          </Link>
                        )}
                      </p>
                    </div>

                    {report.description && (
                      <p className="text-sm text-muted mt-1.5 line-clamp-2">
                        {report.description}
                      </p>
                    )}

                    {report.adminNote && (
                      <div className="mt-2 p-2 bg-surface rounded-lg text-xs text-muted-dark">
                        <span className="font-medium">Admin Note:</span>{" "}
                        {report.adminNote}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() =>
                        setExpandedId(isExpanded ? null : report.id)
                      }
                      className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-surface transition-colors"
                      title="Toggle details"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                    {targetLink && (
                      <Link
                        href={targetLink}
                        className="p-1.5 rounded-lg text-muted hover:text-primary hover:bg-primary-50 transition-colors"
                        title="View target"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    )}
                    {report.status === "PENDING" && (
                      <>
                        <button
                          onClick={() => performAction(report.id, "RESOLVE")}
                          className="p-1.5 rounded-lg text-muted hover:text-success hover:bg-success-light transition-colors"
                          title="Resolve"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setShowNoteModal(report.id);
                          }}
                          className="p-1.5 rounded-lg text-muted hover:text-error hover:bg-error-light transition-colors"
                          title="Dismiss"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => {
                        setShowNoteModal(report.id);
                        setNoteText(report.adminNote || "");
                      }}
                      className="p-1.5 rounded-lg text-muted hover:text-info hover:bg-info-light transition-colors"
                      title="Add note"
                    >
                      <MessageSquareText className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div className="px-5 py-4 border-t border-border-light bg-surface/30">
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div>
                      <dt className="text-xs text-muted uppercase tracking-wider font-medium">
                        Report ID
                      </dt>
                      <dd className="text-foreground font-mono text-xs mt-0.5">
                        {report.id}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted uppercase tracking-wider font-medium">
                        Reporter
                      </dt>
                      <dd className="text-foreground mt-0.5">
                        {report.reporter.name} ({report.reporter.email})
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted uppercase tracking-wider font-medium">
                        Created
                      </dt>
                      <dd className="text-foreground mt-0.5">
                        {formatDate(report.createdAt)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted uppercase tracking-wider font-medium">
                        Last Updated
                      </dt>
                      <dd className="text-foreground mt-0.5">
                        {formatDate(report.updatedAt)}
                      </dd>
                    </div>
                    {report.description && (
                      <div className="sm:col-span-2">
                        <dt className="text-xs text-muted uppercase tracking-wider font-medium">
                          Full Description
                        </dt>
                        <dd className="text-foreground mt-1 whitespace-pre-wrap">
                          {report.description}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              )}
            </div>
          );
        })}

        {initialReports.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-border-light">
            <Flag className="w-12 h-12 text-muted-light mx-auto mb-3" />
            <p className="text-muted text-lg">No reports found.</p>
            <p className="text-muted-light text-sm">
              {statusFilter === "PENDING"
                ? "All reports have been handled."
                : "No reports match this filter."}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-xl border border-border-light px-4 py-3">
          <p className="text-sm text-muted">
            Page {currentPage} of {totalPages} ({totalReports} reports)
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

      {/* Dismiss Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-foreground mb-3">
              {noteText ? "Edit Admin Note" : "Add Admin Note"}
            </h3>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Enter resolution note..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-border bg-white text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none transition-colors"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  setShowNoteModal(null);
                  setNoteText("");
                }}
                className="px-4 py-2 text-sm font-medium text-muted-dark hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => performAction(showNoteModal, "DISMISS")}
                className="px-4 py-2 bg-error text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                Dismiss Report
              </button>
              <button
                onClick={() => performAction(showNoteModal, "ADD_NOTE")}
                disabled={!noteText.trim()}
                className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-light disabled:opacity-50 transition-colors"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
