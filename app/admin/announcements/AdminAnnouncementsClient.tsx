"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Megaphone,
  Plus,
  Pencil,
  Trash2,
  X,
  AlertTriangle,
} from "lucide-react";
import { cn, formatDate, timeAgo, shortenText } from "@/lib/utils";

interface AnnouncementData {
  id: string;
  title: string;
  content: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  createdBy: { name: string };
}

const TYPE_BADGES: Record<string, { label: string; color: string }> = {
  GENERAL: { label: "General", color: "bg-surface-dark text-muted-dark" },
  HILLWALKING: { label: "Hillwalking", color: "bg-success-light text-success" },
  SAFETY: { label: "Safety", color: "bg-error-light text-error" },
  RULES: { label: "Rules", color: "bg-info-light text-info" },
  LOST_FOUND: { label: "Lost & Found", color: "bg-warning-light text-accent-darker" },
};

const ANNOUNCEMENT_TYPES = [
  { value: "GENERAL", label: "General" },
  { value: "HILLWALKING", label: "Hillwalking" },
  { value: "SAFETY", label: "Safety" },
  { value: "RULES", label: "Rules" },
  { value: "LOST_FOUND", label: "Lost & Found" },
];

export function AdminAnnouncementsClient({
  initialAnnouncements,
}: {
  initialAnnouncements: AnnouncementData[];
}) {
  const router = useRouter();
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("GENERAL");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openCreate = () => {
    setEditingId(null);
    setTitle("");
    setContent("");
    setType("GENERAL");
    setShowCreate(true);
  };

  const openEdit = (ann: AnnouncementData) => {
    setEditingId(ann.id);
    setTitle(ann.title);
    setContent(ann.content);
    setType(ann.type);
    setShowCreate(true);
  };

  const closeForm = () => {
    setShowCreate(false);
    setEditingId(null);
    setTitle("");
    setContent("");
    setType("GENERAL");
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) return;
    setIsSubmitting(true);
    try {
      const url = editingId
        ? `/api/admin/announcements?id=${editingId}`
        : "/api/admin/announcements";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, type }),
      });
      if (res.ok) {
        closeForm();
        router.refresh();
      }
    } catch {
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      const res = await fetch(`/api/admin/announcements?id=${deleteConfirmId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setDeleteConfirmId(null);
        router.refresh();
      }
    } catch {}
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Announcements
          </h1>
          <p className="text-sm text-muted mt-1">
            {initialAnnouncements.length} announcement
            {initialAnnouncements.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary-light transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Announcement
        </button>
      </div>

      {/* Create / Edit Form */}
      {showCreate && (
        <div className="bg-white rounded-xl border border-border-light shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-accent" />
              {editingId ? "Edit Announcement" : "Create Announcement"}
            </h3>
            <button
              onClick={closeForm}
              className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-surface transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Announcement title..."
                maxLength={100}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Type
              </label>
              <div className="flex flex-wrap gap-2">
                {ANNOUNCEMENT_TYPES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setType(t.value)}
                    className={cn(
                      "px-3 py-1.5 text-sm font-medium rounded-lg transition-colors",
                      type === t.value
                        ? "bg-primary text-white"
                        : "bg-surface text-muted-dark hover:bg-surface-dark"
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your announcement..."
                rows={6}
                maxLength={5000}
                className="w-full px-4 py-3 rounded-xl border border-border bg-white text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none transition-colors"
              />
              <p className="text-xs text-muted mt-1">
                {content.length}/5000 characters
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={closeForm}
                className="px-4 py-2 text-sm font-medium text-muted-dark hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!title.trim() || !content.trim() || isSubmitting}
                className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-light disabled:opacity-50 transition-colors"
              >
                {isSubmitting
                  ? "Saving..."
                  : editingId
                    ? "Update"
                    : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Announcements Table */}
      <div className="bg-white rounded-xl border border-border-light shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border-light bg-surface/50">
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-dark uppercase tracking-wider">
                Title
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-muted-dark uppercase tracking-wider hidden sm:table-cell">
                Type
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-muted-dark uppercase tracking-wider hidden lg:table-cell">
                Created By
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-muted-dark uppercase tracking-wider hidden md:table-cell">
                Date
              </th>
              <th className="px-3 py-3 text-right text-xs font-semibold text-muted-dark uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light">
            {initialAnnouncements.map((ann) => {
              const badge = TYPE_BADGES[ann.type] || TYPE_BADGES.GENERAL;
              return (
                <tr
                  key={ann.id}
                  className="hover:bg-surface/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="max-w-xs">
                      <p className="text-sm font-medium text-foreground truncate">
                        {ann.title}
                      </p>
                      <p className="text-xs text-muted mt-0.5 line-clamp-1">
                        {ann.content}
                      </p>
                    </div>
                  </td>
                  <td className="px-3 py-3 hidden sm:table-cell">
                    <span
                      className={cn(
                        "inline-flex px-2 py-0.5 rounded-full text-xs font-medium",
                        badge.color
                      )}
                    >
                      {badge.label}
                    </span>
                  </td>
                  <td className="px-3 py-3 hidden lg:table-cell">
                    <span className="text-sm text-muted">
                      {ann.createdBy.name}
                    </span>
                  </td>
                  <td className="px-3 py-3 hidden md:table-cell">
                    <span className="text-xs text-muted">
                      {formatDate(ann.createdAt)}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEdit(ann)}
                        className="p-1.5 rounded-lg text-muted hover:text-primary hover:bg-primary-50 transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(ann.id)}
                        className="p-1.5 rounded-lg text-muted hover:text-error hover:bg-error-light transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {initialAnnouncements.length === 0 && (
          <div className="text-center py-12">
            <Megaphone className="w-10 h-10 text-muted-light mx-auto mb-3" />
            <p className="text-muted">No announcements yet.</p>
            <button
              onClick={openCreate}
              className="mt-2 text-sm text-primary hover:text-primary-light font-medium"
            >
              Create your first announcement
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-error-light flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-error" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Delete Announcement
                </h3>
                <p className="text-sm text-muted">
                  This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-sm font-medium text-muted-dark hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-error text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
