import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { ShieldCheck, Menu, X } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login?redirect=/admin");
  }

  if (session.role !== "ADMIN") {
    redirect("/forbidden");
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      {/* Sidebar - hidden on mobile, visible on desktop */}
      <div className="hidden lg:block">
        <AdminSidebar
          userName={session.name}
          userEmail={session.email}
          userAvatar={session.avatar}
        />
      </div>

      {/* Main content area */}
      <div className="flex-1 bg-surface min-w-0">
        {/* Mobile admin header */}
        <div className="lg:hidden bg-white border-b border-border-light px-4 py-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <span className="font-bold text-primary">Admin Panel</span>
            <span className="text-sm text-muted ml-auto">{session.name}</span>
          </div>
        </div>

        {/* Mobile nav - horizontal scroll tabs */}
        <div className="lg:hidden bg-white border-b border-border-light px-2 overflow-x-auto">
          <nav className="flex gap-1 py-2">
            {[
              { href: "/admin", label: "Dashboard" },
              { href: "/admin/items", label: "Items" },
              { href: "/admin/users", label: "Users" },
              { href: "/admin/reports", label: "Reports" },
              { href: "/admin/communities", label: "Communities" },
              { href: "/admin/announcements", label: "Announcements" },
              { href: "/admin/settings", label: "Settings" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 text-xs font-medium text-muted-dark hover:text-primary hover:bg-primary-50 rounded-lg whitespace-nowrap transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Page content */}
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
