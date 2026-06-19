import { cn } from "@/lib/utils";

export function ItemCardSkeleton({ viewMode = "grid" }: { viewMode?: "grid" | "list" }) {
  if (viewMode === "list") {
    return (
      <div className="flex items-center gap-4 bg-white rounded-xl border border-surface-dark p-4 animate-pulse">
        <div className="w-24 h-24 flex-shrink-0 rounded-lg bg-surface-dark" />
        <div className="flex-1 space-y-2.5">
          <div className="flex gap-2">
            <div className="h-4 w-16 bg-surface-dark rounded-full" />
            <div className="h-4 w-20 bg-surface-dark rounded-full" />
          </div>
          <div className="h-5 w-48 bg-surface-dark rounded" />
          <div className="h-3 w-32 bg-surface-dark rounded" />
        </div>
        <div className="text-right space-y-1.5">
          <div className="h-6 w-16 bg-surface-dark rounded ml-auto" />
          <div className="h-3 w-12 bg-surface-dark rounded ml-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-surface-dark overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-surface-dark" />
      <div className="p-4 space-y-3">
        <div className="flex gap-2">
          <div className="h-4 w-16 bg-surface-dark rounded-full" />
          <div className="h-4 w-20 bg-surface-dark rounded-full" />
        </div>
        <div className="h-5 w-full bg-surface-dark rounded" />
        <div className="h-4 w-3/4 bg-surface-dark rounded" />
        <div className="flex gap-1">
          <div className="h-5 w-12 bg-surface-dark rounded" />
          <div className="h-5 w-14 bg-surface-dark rounded" />
        </div>
        <div className="pt-3 border-t border-surface-dark flex justify-between">
          <div className="h-4 w-20 bg-surface-dark rounded" />
          <div className="h-4 w-16 bg-surface-dark rounded" />
        </div>
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      <div className="h-10 w-64 bg-surface-dark rounded-lg mb-2" />
      <div className="h-5 w-96 bg-surface-dark rounded mb-8" />
      <div className="h-12 w-full bg-surface-dark rounded-xl mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <ItemCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
