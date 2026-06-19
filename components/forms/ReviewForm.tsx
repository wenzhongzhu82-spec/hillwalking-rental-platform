"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface ReviewFormProps {
  orderId: string;
  targetUserId: string;
  targetUserName: string;
  itemTitle: string;
}

export default function ReviewForm({
  orderId,
  targetUserName,
  itemTitle,
}: ReviewFormProps) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState("");
  const [punctuality, setPunctuality] = useState(3);
  const [itemAccuracy, setItemAccuracy] = useState(3);
  const [communication, setCommunication] = useState(3);
  const [recommended, setRecommended] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setFormError("");

    if (rating === 0) {
      setErrors({ rating: "Please select a rating" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          rating,
          content: content || undefined,
          punctuality,
          itemAccuracy,
          communication,
          recommended,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "Failed to submit review");
        return;
      }

      router.refresh();
      router.push(`/orders/${orderId}`);
    } catch {
      setFormError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const SliderRow = ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: number;
    onChange: (v: number) => void;
  }) => (
    <div className="flex items-center gap-4">
      <span className="text-sm text-muted-dark w-32 flex-shrink-0">{label}</span>
      <div className="flex items-center gap-2 flex-1">
        <input
          type="range"
          min="1"
          max="5"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="flex-1 h-2 rounded-full bg-surface-dark appearance-none cursor-pointer accent-primary"
        />
        <span className="text-sm font-medium text-foreground w-6 text-right">
          {value}
        </span>
      </div>
    </div>
  );

  const fieldClass =
    "w-full px-4 py-3 bg-white border border-surface-dark rounded-xl text-sm resize-y placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors";
  const labelClass = "block text-sm font-medium text-foreground mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-1">
          Leave a Review
        </h3>
        <p className="text-sm text-muted">
          Review {targetUserName} for {itemTitle}
        </p>
      </div>

      {formError && (
        <div className="p-4 rounded-xl bg-error-light border border-error/20 text-sm text-error">
          {formError}
        </div>
      )}

      {/* Star Rating */}
      <div>
        <label className={labelClass}>Overall Rating *</label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => {
                setRating(star);
                setErrors((prev) => {
                  const next = { ...prev };
                  delete next.rating;
                  return next;
                });
              }}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1 transition-transform hover:scale-110"
            >
              <Star
                className={cn(
                  "w-8 h-8 transition-colors",
                  (hoverRating || rating) >= star
                    ? "text-accent fill-accent"
                    : "text-surface-darker"
                )}
              />
            </button>
          ))}
          {rating > 0 && (
            <span className="ml-2 text-sm font-medium text-muted-dark">
              {rating}/5
            </span>
          )}
        </div>
        {errors.rating && <p className="text-xs text-error mt-1">{errors.rating}</p>}
      </div>

      {/* Aspect Ratings */}
      <div className="p-4 rounded-xl bg-surface space-y-4">
        <h4 className="text-sm font-semibold text-foreground">
          Rate Your Experience
        </h4>
        <SliderRow
          label="Punctuality"
          value={punctuality}
          onChange={setPunctuality}
        />
        <SliderRow
          label="Item Accuracy"
          value={itemAccuracy}
          onChange={setItemAccuracy}
        />
        <SliderRow
          label="Communication"
          value={communication}
          onChange={setCommunication}
        />
      </div>

      {/* Review Text */}
      <div>
        <label className={labelClass}>Your Review (optional)</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your experience with this rental..."
          className={cn(fieldClass, "h-28")}
          maxLength={500}
        />
        <p className="text-xs text-muted-light mt-1">{content.length}/500</p>
      </div>

      {/* Recommend */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={recommended}
            onChange={(e) => setRecommended(e.target.checked)}
            className="w-5 h-5 rounded border-surface-darker text-primary focus:ring-primary/30"
          />
          <div>
            <span className="text-sm font-medium text-foreground">
              I recommend this lender
            </span>
            <p className="text-xs text-muted">
              This helps other students find reliable lenders
            </p>
          </div>
        </label>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        loading={loading}
      >
        Submit Review
      </Button>
    </form>
  );
}
