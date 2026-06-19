"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mountain,
  Search,
  Shield,
  Umbrella,
  Snowflake,
  Wind,
  Thermometer,
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock,
  PackageSearch,
  LogIn,
  ChevronUp,
  ChevronDown,
  Star,
  Dumbbell,
  Footprints,
  Tent,
  Flashlight,
  Ruler,
  Droplets,
  Map,
  Compass,
  Lightbulb,
  Shirt,
  Radio,
  HelpCircle,
  Heart,
  Bike,
  Wrench,
  FlaskConical,
  Waves,
  Sun,
  CloudRain,
  CloudSnow,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface GearItem {
  id: string;
  name: string;
  category: string;
  importance: number;
  description: string | null;
  recommendedForWeather: string | null;
  icon: string | null;
}

type TabKey = "ESSENTIAL" | "RECOMMENDED" | "WEATHER_SPECIFIC";
type StatusKey = "HAVE" | "NEED" | "RESERVED" | "RECEIVED" | "RETURNED";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  mountain: Mountain,
  backpack: PackageSearch,
  tent: Tent,
  flashlight: Flashlight,
  ruler: Ruler,
  droplets: Droplets,
  map: Map,
  compass: Compass,
  lightbulb: Lightbulb,
  shirt: Shirt,
  radio: Radio,
  heart: Heart,
  wrench: Wrench,
  "flask-conical": FlaskConical,
  waves: Waves,
  sun: Sun,
  "cloud-rain": CloudRain,
  "cloud-snow": CloudSnow,
  zap: Zap,
  shield: Shield,
  umbrella: Umbrella,
  snowflake: Snowflake,
  wind: Wind,
  thermometer: Thermometer,
  dumbbell: Dumbbell,
  footprints: Footprints,
};

function getIconForItem(
  name: string,
  iconStr: string | null,
  className: string
) {
  const key = iconStr?.toLowerCase() || "";
  const lowerName = name.toLowerCase();
  const MatchedIcon =
    ICON_MAP[key] ||
    (lowerName.includes("boot") || lowerName.includes("shoe")
      ? Footprints
      : lowerName.includes("tent")
        ? Tent
        : lowerName.includes("flashlight") || lowerName.includes("headlamp")
          ? Flashlight
          : lowerName.includes("jacket") || lowerName.includes("coat")
            ? Shirt
            : lowerName.includes("map")
              ? Map
              : lowerName.includes("compass")
                ? Compass
                : lowerName.includes("rain") || lowerName.includes("waterproof")
                  ? CloudRain
                  : lowerName.includes("sun") || lowerName.includes("sunscreen")
                    ? Sun
                    : lowerName.includes("bag") || lowerName.includes("pack")
                      ? PackageSearch
                      : lowerName.includes("pole") ||
                          lowerName.includes("stick")
                        ? Ruler
                        : lowerName.includes("sleeping")
                          ? Tent
                          : lowerName.includes("kit") ||
                              lowerName.includes("first")
                            ? Heart
                            : PackageSearch);

  return <MatchedIcon className={className} />;
}

const STATUS_CONFIG: Record<
  StatusKey,
  { label: string; color: string; bg: string }
> = {
  HAVE: { label: "I Have This", color: "text-success", bg: "bg-success-light" },
  NEED: { label: "Need to Rent", color: "text-accent-darker", bg: "bg-warning-light" },
  RESERVED: { label: "Reserved", color: "text-info", bg: "bg-info-light" },
  RECEIVED: { label: "Received", color: "text-primary", bg: "bg-primary-50" },
  RETURNED: { label: "Returned", color: "text-muted-dark", bg: "bg-surface-dark" },
};

function getImportanceBadge(importance: number) {
  if (importance >= 3) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-error bg-error-light px-2 py-0.5 rounded-full">
        <Star className="w-3 h-3 fill-error" />
        Must Have
      </span>
    );
  }
  if (importance === 2) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-warning bg-warning-light px-2 py-0.5 rounded-full">
        Recommended
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-muted bg-surface-dark px-2 py-0.5 rounded-full">
      Nice to Have
    </span>
  );
}

function getWeatherIcon(weather: string | null) {
  if (!weather) return null;
  const w = weather.toLowerCase();
  if (w.includes("rain")) return <CloudRain className="w-4 h-4 text-info" />;
  if (w.includes("snow") || w.includes("cold"))
    return <CloudSnow className="w-4 h-4 text-info" />;
  if (w.includes("sun") || w.includes("hot"))
    return <Sun className="w-4 h-4 text-accent" />;
  if (w.includes("wind")) return <Wind className="w-4 h-4 text-info" />;
  return <HelpCircle className="w-4 h-4 text-muted" />;
}

export function GearChecklistClient({
  gearItems,
  userChecklist,
  isLoggedIn,
}: {
  gearItems: GearItem[];
  userChecklist: Record<string, string>;
  isLoggedIn: boolean;
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("ESSENTIAL");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [localChecklist, setLocalChecklist] = useState(userChecklist);

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    {
      key: "ESSENTIAL",
      label: "Essential",
      icon: <Shield className="w-4 h-4" />,
    },
    {
      key: "RECOMMENDED",
      label: "Recommended",
      icon: <Star className="w-4 h-4" />,
    },
    {
      key: "WEATHER_SPECIFIC",
      label: "Weather-Specific",
      icon: <CloudRain className="w-4 h-4" />,
    },
  ];

  const filteredItems = gearItems.filter(
    (item) => item.category === activeTab
  );

  const updateStatus = useCallback(
    async (gearItemId: string, status: string) => {
      setUpdatingId(gearItemId);
      try {
        const res = await fetch("/api/hillwalking/checklist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ gearItemId, status }),
        });
        if (res.ok) {
          setLocalChecklist((prev) => ({ ...prev, [gearItemId]: status }));
          router.refresh();
        }
      } catch {
        // silently fail
      } finally {
        setUpdatingId(null);
      }
    },
    [router]
  );

  const tabCounts = {
    ESSENTIAL: gearItems.filter((i) => i.category === "ESSENTIAL").length,
    RECOMMENDED: gearItems.filter((i) => i.category === "RECOMMENDED").length,
    WEATHER_SPECIFIC: gearItems.filter((i) => i.category === "WEATHER_SPECIFIC")
      .length,
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-primary-gradient py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-3">
            <Mountain className="w-8 h-8 text-accent" />
            <h1 className="text-3xl font-bold text-white">
              Hillwalking Gear Checklist
            </h1>
          </div>
          <p className="text-white/80 max-w-2xl">
            Browse the complete gear checklist for SCIE Hillwalking. Each item
            is categorized by importance — make sure you have everything before
            the trip.
          </p>
        </div>
      </section>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        <div className="bg-white rounded-xl border border-border-light shadow-md p-1.5 flex gap-1">
          {tabs.map((tab) => {
            const count = tabCounts[tab.key];
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-all",
                  activeTab === tab.key
                    ? "bg-primary text-white shadow-sm"
                    : "text-muted-dark hover:text-foreground hover:bg-surface"
                )}
              >
                {tab.icon}
                {tab.label}
                <span
                  className={cn(
                    "inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs",
                    activeTab === tab.key
                      ? "bg-white/20 text-white"
                      : "bg-surface-dark text-muted"
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Gear List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isLoggedIn && (
          <div className="mb-8 bg-warning-light border border-accent/20 rounded-xl p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LogIn className="w-5 h-5 text-accent" />
              <div>
                <p className="text-sm font-medium text-accent-darker">
                  Log in to track your preparation
                </p>
                <p className="text-xs text-muted">
                  Mark items as owned, needed, or reserved to keep track of your
                  gear.
                </p>
              </div>
            </div>
            <Link
              href="/login"
              className="flex-shrink-0 px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent-dark transition-colors"
            >
              Log In
            </Link>
          </div>
        )}

        <div className="space-y-4">
          {filteredItems.map((item) => {
            const currentStatus =
              (localChecklist[item.id] as StatusKey | undefined) || null;
            const statusConfig = currentStatus
              ? STATUS_CONFIG[currentStatus]
              : null;
            const isUpdating = updatingId === item.id;

            return (
              <div
                key={item.id}
                className="group bg-white rounded-xl border border-border-light shadow-sm hover:shadow-md hover:border-primary-light transition-all p-5"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-100 transition-colors">
                    {getIconForItem(
                      item.name,
                      item.icon,
                      "w-6 h-6 text-primary"
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start flex-wrap gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">
                        {item.name}
                      </h3>
                      {getImportanceBadge(item.importance)}
                      {item.recommendedForWeather && (
                        <span className="inline-flex items-center gap-1 text-xs text-muted-dark bg-surface px-2 py-0.5 rounded-full">
                          {getWeatherIcon(item.recommendedForWeather)}
                          {item.recommendedForWeather}
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-sm text-muted mb-3">
                        {item.description}
                      </p>
                    )}

                    <div className="flex items-center flex-wrap gap-3">
                      {/* View Rentable Items Button */}
                      <Link
                        href={`/marketplace?search=${encodeURIComponent(item.name)}`}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-light transition-colors"
                      >
                        <Search className="w-4 h-4" />
                        View Rentable Items
                        <ArrowRight className="w-4 h-4" />
                      </Link>

                      {/* Status Dropdown (logged in only) */}
                      {isLoggedIn && (
                        <div className="relative">
                          <select
                            value={currentStatus || "NEED"}
                            disabled={isUpdating}
                            onChange={(e) =>
                              updateStatus(item.id, e.target.value)
                            }
                            className={cn(
                              "appearance-none text-sm font-medium px-3 py-1.5 rounded-lg border cursor-pointer transition-colors",
                              statusConfig
                                ? `${statusConfig.bg} border-transparent ${statusConfig.color}`
                                : "bg-surface border-border-light text-muted-dark hover:border-primary"
                            )}
                          >
                            <option value="NEED">Need to Rent</option>
                            <option value="HAVE">I Have This</option>
                            <option value="RESERVED">Reserved</option>
                            <option value="RECEIVED">Received</option>
                            <option value="RETURNED">Returned</option>
                          </select>
                          {isUpdating && (
                            <span className="absolute right-2 top-1/2 -translate-y-1/2">
                              <Clock className="w-4 h-4 animate-spin text-muted" />
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status indicator on right */}
                  {isLoggedIn && currentStatus && currentStatus !== "NEED" && (
                    <div
                      className={cn(
                        "flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium",
                        statusConfig?.bg,
                        statusConfig?.color
                      )}
                    >
                      {statusConfig?.label}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {filteredItems.length === 0 && (
            <div className="text-center py-16">
              <PackageSearch className="w-12 h-12 text-muted-light mx-auto mb-3" />
              <p className="text-muted">
                No gear items found in this category.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
