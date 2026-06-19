"use client";

import { PackageSearch, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface GearChecklistCardProps {
  id: string;
  name: string;
  description: string;
  icon?: string;
  importance: "ESSENTIAL" | "RECOMMENDED" | "WEATHER_SPECIFIC";
  status: "HAVE" | "NEED" | "RESERVED";
  rentableItemCount?: number;
  onStatusChange?: (id: string, status: "HAVE" | "NEED" | "RESERVED") => void;
  onViewItems?: (id: string) => void;
  className?: string;
}

const importanceBadge: Record<string, { variant: "danger" | "warning" | "info"; label: string }> = {
  ESSENTIAL: { variant: "danger", label: "Essential" },
  RECOMMENDED: { variant: "warning", label: "Recommended" },
  WEATHER_SPECIFIC: { variant: "info", label: "Weather-Specific" },
};

const statusOptions: { value: "HAVE" | "NEED" | "RESERVED"; label: string; color: string }[] = [
  { value: "HAVE", label: "I Have", color: "bg-success-light text-success border-success/30" },
  { value: "NEED", label: "I Need", color: "bg-warning-light text-accent-darker border-accent/30" },
  { value: "RESERVED", label: "Reserved", color: "bg-info-light text-info border-info/30" },
];

export default function GearChecklistCard({
  id,
  name,
  description,
  importance,
  status,
  rentableItemCount = 0,
  onStatusChange,
  onViewItems,
  className,
}: GearChecklistCardProps) {
  const imp = importanceBadge[importance] || importanceBadge.RECOMMENDED;

  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-surface-dark p-4 shadow-sm",
        status === "HAVE" && "border-success/20",
        status === "NEED" && "border-accent/20",
        status === "RESERVED" && "border-info/20",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
              importance === "ESSENTIAL" && "bg-error-light text-error",
              importance === "RECOMMENDED" && "bg-warning-light text-accent",
              importance === "WEATHER_SPECIFIC" && "bg-info-light text-info"
            )}
          >
            {importance === "ESSENTIAL" ? (
              <AlertCircle className="w-5 h-5" />
            ) : importance === "WEATHER_SPECIFIC" ? (
              <Info className="w-5 h-5" />
            ) : (
              <PackageSearch className="w-5 h-5" />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h4 className="text-sm font-semibold text-foreground">{name}</h4>
              <Badge variant={imp.variant}>
                {imp.label}
              </Badge>
            </div>
            <p className="text-xs text-muted leading-relaxed">{description}</p>
          </div>
        </div>
      </div>

      {/* Status selector */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs text-muted-dark font-medium mr-1">Status:</span>
        {statusOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onStatusChange?.(id, opt.value)}
            className={cn(
              "px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors",
              status === opt.value
                ? opt.color + " border-current"
                : "bg-surface text-muted-light border-transparent hover:border-surface-darker"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* View items button */}
      {rentableItemCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          className="w-full"
          onClick={() => onViewItems?.(id)}
        >
          View {rentableItemCount} Rentable Item{rentableItemCount > 1 ? "s" : ""}
        </Button>
      )}
    </div>
  );
}
