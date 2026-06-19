import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminStatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    positive: boolean;
  };
  className?: string;
}

export default function AdminStatsCard({
  label,
  value,
  icon: Icon,
  trend,
  className,
}: AdminStatsCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-surface-dark p-5 shadow-sm hover:shadow-md transition-shadow",
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <p className="text-sm text-muted mb-1">{label}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </div>
      {trend && (
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "text-xs font-medium",
              trend.positive ? "text-success" : "text-error"
            )}
          >
            {trend.positive ? "+" : "-"}
            {trend.value}
          </span>
          <span className="text-xs text-muted-light">vs last month</span>
        </div>
      )}
    </div>
  );
}
