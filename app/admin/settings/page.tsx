import { redirect } from "next/navigation";
import {
  Settings,
  Mail,
  MapPin,
  ShieldAlert,
  Info,
  Database,
  Server,
} from "lucide-react";
import { getSession } from "@/lib/session";
import {
  SCHOOL_EMAIL_DOMAINS,
  PICKUP_LOCATIONS,
  ITEM_TAGS,
  REPORT_REASONS,
  ANNOUNCEMENT_TYPES,
} from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    if (!session) redirect("/login?redirect=/admin/settings");
    redirect("/forbidden");
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Platform Settings
        </h1>
        <p className="text-sm text-muted mt-1">
          View and manage platform configuration.
        </p>
      </div>

      {/* Settings info banner */}
      <div className="bg-info-light border border-info/20 rounded-xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-info flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-info">
            Settings are defined in code
          </p>
          <p className="text-xs text-info/70 mt-0.5">
            Platform settings are currently managed through environment variables
            and source code configuration files. A database-backed settings
            system can be implemented in a future update.
          </p>
        </div>
      </div>

      {/* School Email Domains */}
      <div className="bg-white rounded-xl border border-border-light shadow-sm">
        <div className="px-5 py-4 border-b border-border-light">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            School Email Domains
          </h3>
          <p className="text-xs text-muted mt-0.5">
            Accepted email domains for user registration.
          </p>
        </div>
        <div className="px-5 py-4">
          <div className="flex flex-wrap gap-2">
            {SCHOOL_EMAIL_DOMAINS.map((domain) => (
              <span
                key={domain}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface rounded-lg text-sm font-mono text-foreground border border-border-light"
              >
                <Mail className="w-3.5 h-3.5 text-primary" />
                {domain}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Pickup Locations */}
      <div className="bg-white rounded-xl border border-border-light shadow-sm">
        <div className="px-5 py-4 border-b border-border-light">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <MapPin className="w-5 h-5 text-accent" />
            Default Pickup Locations
          </h3>
          <p className="text-xs text-muted mt-0.5">
            Available pickup locations for item listings.
          </p>
        </div>
        <div className="px-5 py-4">
          <div className="flex flex-wrap gap-2">
            {PICKUP_LOCATIONS.map((loc) => (
              <span
                key={loc}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface rounded-lg text-sm text-foreground border border-border-light"
              >
                <MapPin className="w-3.5 h-3.5 text-accent" />
                {loc}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Prohibited Keywords / Item Tags */}
      <div className="bg-white rounded-xl border border-border-light shadow-sm">
        <div className="px-5 py-4 border-b border-border-light">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-error" />
            Item Tags
          </h3>
          <p className="text-xs text-muted mt-0.5">
            Available tags that can be assigned to items.
          </p>
        </div>
        <div className="px-5 py-4">
          <div className="flex flex-wrap gap-2">
            {ITEM_TAGS.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1.5 bg-surface rounded-lg text-sm text-foreground border border-border-light"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Report Reasons */}
      <div className="bg-white rounded-xl border border-border-light shadow-sm">
        <div className="px-5 py-4 border-b border-border-light">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-warning" />
            Report Reasons
          </h3>
          <p className="text-xs text-muted mt-0.5">
            Valid reasons users can select when reporting items.
          </p>
        </div>
        <div className="px-5 py-4">
          <div className="flex flex-wrap gap-2">
            {REPORT_REASONS.map((reason) => (
              <span
                key={reason}
                className="inline-flex items-center px-3 py-1.5 bg-surface rounded-lg text-sm font-mono text-foreground border border-border-light"
              >
                {reason}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Announcement Types */}
      <div className="bg-white rounded-xl border border-border-light shadow-sm">
        <div className="px-5 py-4 border-b border-border-light">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Database className="w-5 h-5 text-info" />
            Announcement Types
          </h3>
          <p className="text-xs text-muted mt-0.5">
            Available announcement categories.
          </p>
        </div>
        <div className="px-5 py-4">
          <div className="flex flex-wrap gap-2">
            {ANNOUNCEMENT_TYPES.map((type) => (
              <span
                key={type}
                className="inline-flex items-center px-3 py-1.5 bg-surface rounded-lg text-sm text-foreground border border-border-light"
              >
                {type}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* System Info */}
      <div className="bg-white rounded-xl border border-border-light shadow-sm">
        <div className="px-5 py-4 border-b border-border-light">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Server className="w-5 h-5 text-success" />
            Site Configuration
          </h3>
          <p className="text-xs text-muted mt-0.5">
            Basic platform information.
          </p>
        </div>
        <div className="px-5 py-4 space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-border-light">
            <span className="text-sm text-muted">Site Name</span>
            <span className="text-sm font-medium text-foreground">
              SCIE Hillwalking Rental
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border-light">
            <span className="text-sm text-muted">Environment</span>
            <span className="text-sm font-medium text-foreground">
              {process.env.NODE_ENV || "development"}
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border-light">
            <span className="text-sm text-muted">Database</span>
            <span className="text-sm font-medium text-foreground">
              SQLite (via Prisma)
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border-light">
            <span className="text-sm text-muted">Framework</span>
            <span className="text-sm font-medium text-foreground">
              Next.js 16 (App Router)
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border-light">
            <span className="text-sm text-muted">Styling</span>
            <span className="text-sm font-medium text-foreground">
              Tailwind CSS v4
            </span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-muted">Session Duration</span>
            <span className="text-sm font-medium text-foreground">
              7 days
            </span>
          </div>
        </div>
      </div>

      {/* Settings note */}
      <div className="text-center py-4">
        <p className="text-xs text-muted-light flex items-center justify-center gap-1">
          <Settings className="w-3 h-3" />
          Settings are managed through source code configuration files
        </p>
      </div>
    </div>
  );
}
