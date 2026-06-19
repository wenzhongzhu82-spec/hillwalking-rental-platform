import { Mountain } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[70vh]">
      {/* Hero skeleton */}
      <div className="bg-gradient-to-r from-primary-dark to-primary py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center animate-pulse">
            <div className="w-32 h-8 bg-white/20 rounded-full mb-6" />
            <div className="w-96 h-10 bg-white/20 rounded-lg mb-4 max-w-full" />
            <div className="w-[500px] h-5 bg-white/10 rounded mb-8 max-w-full" />
          </div>
        </div>
        {/* Wave */}
        <div className="relative h-16">
          <svg
            className="absolute bottom-0 w-full h-16 text-cream"
            preserveAspectRatio="none"
            viewBox="0 0 1440 54"
            fill="currentColor"
          >
            <path d="M0 24C240 54 480 54 720 36S1200 0 1440 18V54H0V24Z" />
          </svg>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading spinner */}
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Mountain className="w-10 h-10 text-primary animate-pulse" />
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-8 bg-accent/30 rounded-full animate-pulse" />
            </div>
            <p className="text-sm text-muted animate-pulse">Loading...</p>
          </div>
        </div>

        {/* Skeleton cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-border-light p-6"
            >
              <div className="w-10 h-10 bg-surface-dark rounded-xl mb-4" />
              <div className="w-3/4 h-5 bg-surface-dark rounded mb-2" />
              <div className="w-full h-4 bg-surface rounded mb-1" />
              <div className="w-2/3 h-4 bg-surface rounded" />
            </div>
          ))}
        </div>

        {/* Skeleton list */}
        <div className="mt-8 space-y-3 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-border-light p-5 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-surface-dark flex-shrink-0" />
              <div className="flex-1">
                <div className="w-1/3 h-4 bg-surface-dark rounded mb-1" />
                <div className="w-2/3 h-3 bg-surface rounded" />
              </div>
              <div className="w-20 h-6 bg-surface rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Footer skeleton */}
      <div className="bg-primary-dark py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-white/20 rounded" />
            <div className="w-36 h-5 bg-white/20 rounded" />
          </div>
          <div className="w-72 h-4 bg-white/10 rounded mb-2" />
          <div className="w-48 h-3 bg-white/10 rounded" />
        </div>
      </div>
    </div>
  );
}
