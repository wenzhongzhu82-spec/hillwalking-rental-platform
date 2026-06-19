"use client";

import { ShieldCheck } from "lucide-react";

export default function VerifiedBadge({ size }: { size?: string }) {
  return (
    <span className="inline-flex items-center text-primary" title="SCIE Verified">
      <ShieldCheck className="w-4 h-4" />
    </span>
  );
}
