"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Users,
  Flag,
  Megaphone,
  Star,
  ChevronLeft,
  ShieldCheck,
  Mountain,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Avatar from "@/components/ui/Avatar";

const adminLinks = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: "/admin/items",
    label: "Items",
    icon: Package,
  },
  {
    href: "/admin/reviews",
    label: "Reviews",
    description: "Item Approval",
    icon: Star,
  },
  {
    href: "/admin/users",
    label: "Users",
    icon: Users,
  },
  {
    href: "/admin/reports",
    label: "Reports",
    icon: Flag,
  },
  {
    href: "/admin/announcements",
    label: "Announcements",
    icon: Megaphone,
  },
];

interface AdminSidebarProps {
  userName: string;
  userEmail: string;
  userAvatar: string | null;
  onLogout?: () => void;
}

export default function AdminSidebar({
  userName,
  userEmail,
  userAvatar,
  onLogout,
}: AdminSidebarProps) {
  const pathname = usePathname();

  const handleLogout = async () => {
    if (onLogout) {
      onLogout();
    } else {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/";
    }
  };

  return (
    <aside className="w-64 bg-white border-r border-surface-dark flex flex-col h-full min-h-[calc(100vh-64px)]">
      {/* Admin header */}
      <div className="p-5 border-b border-surface-dark">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-primary text-sm">Admin Panel</span>
        </div>
        <div className="flex items-center gap-3">
          <Avatar
            src={userAvatar}
            name={userName}
            size="md"
          />
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {userName}
            </p>
            <p className="text-xs text-muted truncate">{userEmail}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {adminLinks.map((link) => {
          const isActive = link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors group",
                isActive
                  ? "bg-primary-50 text-primary font-medium"
                  : "text-muted-dark hover:text-foreground hover:bg-surface"
              )}
            >
              <link.icon
                className={cn(
                  "w-5 h-5 flex-shrink-0",
                  isActive ? "text-primary" : "text-muted group-hover:text-muted-dark"
                )}
              />
              <div className="min-w-0">
                <span>{link.label}</span>
                {link.description && (
                  <span className="block text-[10px] text-muted-light leading-tight">
                    {link.description}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom links */}
      <div className="p-3 border-t border-surface-dark space-y-1">
        <Link
          href="/hillwalking"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-dark hover:text-foreground hover:bg-surface transition-colors"
        >
          <Mountain className="w-5 h-5 text-muted" />
          Back to Hillwalking
        </Link>
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-dark hover:text-foreground hover:bg-surface transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-muted" />
          Main Site
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-error hover:bg-error-light transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
