"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { REPORT_REASONS, REPORT_REASON_LABELS } from "@/lib/constants";

interface ReportFormProps {
  itemId?: string;
  itemTitle?: string;
  onSuccess?: () => void;
}

export default function ReportForm({ itemId, itemTitle, onSuccess }: ReportFormProps) {
  const router = useRouter();
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setFormError("");

    if (!reason) {
      setErrors({ reason: "Please select a reason" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: itemId || undefined,
          reason,
          description: description || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "Failed to submit report");
        return;
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/marketplace");
      }
      router.refresh();
    } catch {
      setFormError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fieldClass =
    "w-full px-4 py-3 bg-white border border-surface-dark rounded-xl text-sm resize-y placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors";
  const labelClass = "block text-sm font-medium text-foreground mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-warning-light flex items-center justify-center flex-shrink-0 mt-0.5">
          <AlertTriangle className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Report {itemTitle ? `"${itemTitle}"` : "an Issue"}
          </h3>
          <p className="text-sm text-muted mt-0.5">
            Your report is confidential. Admin will review and take action if needed.
          </p>
        </div>
      </div>

      {formError && (
        <div className="p-4 rounded-xl bg-error-light border border-error/20 text-sm text-error">
          {formError}
        </div>
      )}

      {/* Reason */}
      <div>
        <label className={labelClass}>Reason *</label>
        <select
          value={reason}
          onChange={(e) => {
            setReason(e.target.value);
            setErrors((prev) => {
              const next = { ...prev };
              delete next.reason;
              return next;
            });
          }}
          className={cn(
            "w-full h-12 px-4 bg-white border border-surface-dark rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors",
            !reason && "text-muted-light"
          )}
        >
          <option value="">Select a reason</option>
          {REPORT_REASONS.map((r) => (
            <option key={r} value={r}>
              {REPORT_REASON_LABELS[r]}
            </option>
          ))}
        </select>
        {errors.reason && <p className="text-xs text-error mt-1">{errors.reason}</p>}
      </div>

      {/* Description */}
      <div>
        <label className={labelClass}>Description (optional)</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Provide additional details about your report..."
          className={cn(fieldClass, "h-28")}
          maxLength={500}
        />
        <p className="text-xs text-muted-light mt-1">
          {description.length}/500
        </p>
      </div>

      <Button
        type="submit"
        variant="danger"
        size="lg"
        className="w-full"
        loading={loading}
      >
        Submit Report
      </Button>
    </form>
  );
}
