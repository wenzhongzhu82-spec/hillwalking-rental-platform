"use client";

import { useEffect } from "react";
import { Mountain, RefreshCw, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Page error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-error-light flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-error" />
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-2">
          Something went wrong
        </h1>

        <p className="text-sm text-muted mb-2">
          An unexpected error occurred. Please try again or return to the home
          page.
        </p>

        {error.digest && (
          <p className="text-xs text-muted-light mb-6 font-mono">
            Error ID: {error.digest}
          </p>
        )}

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary-light transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-primary text-primary text-sm font-medium rounded-xl hover:bg-primary-50 transition-colors"
          >
            <Mountain className="w-4 h-4" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
