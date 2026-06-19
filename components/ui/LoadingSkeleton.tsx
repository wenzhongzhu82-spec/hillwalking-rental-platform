import { cn } from "@/lib/utils";

/**
 * Skeleton loading placeholder.
 * Usage: <Skeleton className="w-64 h-4" />
 */
export default function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-surface-dark",
        className
      )}
    />
  );
}

/** Pre-built skeleton for an item card layout */
export function ItemCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-surface-dark overflow-hidden shadow-sm">
      <Skeleton className="w-full aspect-[4/3] rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="w-3/4 h-4" />
        <Skeleton className="w-1/2 h-3" />
        <div className="flex items-center gap-2 pt-2">
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="w-20 h-3" />
        </div>
      </div>
    </div>
  );
}

/** Pre-built skeleton for a text line */
export function TextSkeleton({
  lines = 1,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn("h-3", i === lines - 1 ? "w-2/3" : "w-full")}
        />
      ))}
    </div>
  );
}

/** Pre-built skeleton for an avatar */
export function AvatarSkeleton({
  size = "md",
}: {
  size?: "sm" | "md" | "lg";
}) {
  const sizeMap = { sm: "w-7 h-7", md: "w-10 h-10", lg: "w-14 h-14" };
  return <Skeleton className={cn("rounded-full", sizeMap[size])} />;
}
