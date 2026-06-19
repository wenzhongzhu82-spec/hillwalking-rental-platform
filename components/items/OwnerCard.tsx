"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, ShieldCheck, Award } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";

interface OwnerCardProps {
  owner: {
    id: string;
    name: string;
    avatar: string | null;
    rating: number;
    grade: string;
    house: string;
    completedOrders: number;
    creditScore?: number;
    verified?: boolean;
    createdAt?: string;
  };
  showLink?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function OwnerCard({
  owner,
  showLink = true,
  size = "md",
}: OwnerCardProps) {
  const avatarSize = size === "lg" ? "w-16 h-16" : size === "sm" ? "w-8 h-8" : "w-10 h-10";

  const content = (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          "rounded-full bg-primary text-white flex items-center justify-center font-medium flex-shrink-0 overflow-hidden",
          avatarSize,
          size === "lg" ? "text-lg" : size === "sm" ? "text-xs" : "text-sm"
        )}
      >
        {owner.avatar ? (
          <Image
            src={owner.avatar}
            alt={owner.name}
            width={size === "lg" ? 64 : size === "sm" ? 32 : 40}
            height={size === "lg" ? 64 : size === "sm" ? 32 : 40}
            className="object-cover w-full h-full"
          />
        ) : (
          owner.name.charAt(0).toUpperCase()
        )}
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <p
            className={cn(
              "font-medium text-foreground truncate",
              size === "lg" ? "text-base" : "text-sm"
            )}
          >
            {owner.name}
          </p>
          {owner.verified && (
            <ShieldCheck className="w-4 h-4 text-success flex-shrink-0" />
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted mt-0.5">
          <span>
            {owner.grade} | {owner.house}
          </span>
          <span className="flex items-center gap-0.5">
            <Star className="w-3 h-3 text-accent fill-accent" />
            {owner.rating.toFixed(1)}
          </span>
          <span>{owner.completedOrders} orders</span>
        </div>
        {owner.creditScore !== undefined && (
          <div className="flex items-center gap-1 mt-1">
            <Award className="w-3 h-3 text-accent" />
            <span className="text-xs text-muted-dark font-medium">
              Credit: {owner.creditScore}/100
            </span>
          </div>
        )}
      </div>
    </div>
  );

  if (showLink) {
    return (
      <Link href={`/profile/${owner.id}`} className="block hover:opacity-80 transition-opacity">
        {content}
      </Link>
    );
  }

  return <div>{content}</div>;
}
