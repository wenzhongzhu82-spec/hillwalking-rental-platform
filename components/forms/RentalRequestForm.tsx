"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface RentalRequestFormProps {
  itemId: string;
  itemTitle: string;
  dailyPrice: number;
  deposit: number;
  minDays?: number;
  maxDays?: number;
}

export default function RentalRequestForm({
  itemId,
  itemTitle,
  dailyPrice,
  deposit,
}: RentalRequestFormProps) {
  const router = useRouter();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  // Calculate total price
  const totalDays =
    startDate && endDate
      ? Math.max(
          0,
          Math.ceil(
            (new Date(endDate).getTime() - new Date(startDate).getTime()) /
              (1000 * 60 * 60 * 24)
          ) + 1
        )
      : 0;
  const totalPrice = totalDays * dailyPrice;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setFormError("");

    // Client-side validation
    const newErrors: Record<string, string> = {};
    if (!startDate) newErrors.startDate = "Start date is required";
    if (!endDate) newErrors.endDate = "End date is required";
    if (startDate && endDate && new Date(endDate) <= new Date(startDate)) {
      newErrors.endDate = "End date must be after start date";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId,
          startDate,
          endDate,
          borrowerNote: message,
          pickupTime: pickupTime || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "Failed to submit rental request");
        return;
      }

      router.push(`/orders/${data.id}`);
      router.refresh();
    } catch {
      setFormError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fieldClass =
    "w-full h-12 px-4 bg-white border border-surface-dark rounded-xl text-sm text-foreground placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors";
  const labelClass = "block text-sm font-medium text-foreground mb-1.5";
  const errorClass = "text-xs text-error mt-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-1">
          Request to Rent
        </h3>
        <p className="text-sm text-muted">{itemTitle}</p>
      </div>

      {formError && (
        <div className="p-4 rounded-xl bg-error-light border border-error/20 text-sm text-error">
          {formError}
        </div>
      )}

      {/* Dates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>
            <CalendarDays className="w-4 h-4 inline mr-1.5" />
            Start Date *
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setErrors((prev) => {
                const next = { ...prev };
                delete next.startDate;
                delete next.endDate;
                return next;
              });
            }}
            min={new Date().toISOString().split("T")[0]}
            className={fieldClass}
          />
          {errors.startDate && <p className={errorClass}>{errors.startDate}</p>}
        </div>
        <div>
          <label className={labelClass}>
            <CalendarDays className="w-4 h-4 inline mr-1.5" />
            End Date *
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setErrors((prev) => {
                const next = { ...prev };
                delete next.endDate;
                return next;
              });
            }}
            min={startDate || new Date().toISOString().split("T")[0]}
            className={fieldClass}
          />
          {errors.endDate && <p className={errorClass}>{errors.endDate}</p>}
        </div>
      </div>

      {/* Pickup Time */}
      <div>
        <label className={labelClass}>
          <Clock className="w-4 h-4 inline mr-1.5" />
          Preferred Pickup Time (optional)
        </label>
        <input
          type="time"
          value={pickupTime}
          onChange={(e) => setPickupTime(e.target.value)}
          className={fieldClass}
        />
      </div>

      {/* Message */}
      <div>
        <label className={labelClass}>Message to Lender</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Introduce yourself, suggest a meeting time, or ask questions..."
          className={cn(fieldClass, "h-24 py-3 resize-y")}
          maxLength={500}
        />
        <p className="text-xs text-muted-light mt-1">{message.length}/500</p>
      </div>

      {/* Summary */}
      {totalDays > 0 && (
        <div className="p-4 rounded-xl bg-surface border border-surface-dark">
          <h4 className="text-sm font-semibold text-foreground mb-3">
            Rental Summary
          </h4>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between text-muted-dark">
              <span>Duration</span>
              <span>{totalDays} day{totalDays > 1 ? "s" : ""}</span>
            </div>
            {dailyPrice > 0 ? (
              <div className="flex justify-between text-muted-dark">
                <span>Daily Rate</span>
                <span>¥{dailyPrice}</span>
              </div>
            ) : null}
            {dailyPrice > 0 && (
              <div className="flex justify-between font-semibold text-foreground pt-2 border-t border-surface-dark">
                <span>Total</span>
                <span>¥{totalPrice}</span>
              </div>
            )}
            {dailyPrice === 0 && (
              <div className="flex justify-between font-semibold text-success pt-2 border-t border-surface-dark">
                <span>Total</span>
                <span>Free</span>
              </div>
            )}
            {deposit > 0 && (
              <div className="flex justify-between text-muted-dark pt-2 border-t border-surface-dark">
                <span>Deposit</span>
                <span>¥{deposit}</span>
              </div>
            )}
          </div>
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        loading={loading}
      >
        Send Rental Request
      </Button>
    </form>
  );
}
