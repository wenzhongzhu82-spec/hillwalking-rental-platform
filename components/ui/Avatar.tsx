"use client";

import { User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Avatar({
  src,
  name,
  size = "md",
}: {
  src?: string | null;
  name?: string | null;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = { sm: "w-7 h-7 text-xs", md: "w-9 h-9 text-sm", lg: "w-12 h-12 text-base" };
  const initial = name?.charAt(0).toUpperCase() || "?";

  if (src) {
    return (
      <img
        src={src}
        alt={name || "User"}
        className={cn("rounded-full object-cover flex-shrink-0", sizes[size])}
      />
    );
  }

  return (
    <div className={cn("rounded-full bg-primary text-white flex items-center justify-center font-bold flex-shrink-0", sizes[size])}>
      {initial}
    </div>
  );
}
