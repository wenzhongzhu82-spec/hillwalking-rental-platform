import Link from "next/link";
import {
  Mountain,
  ClipboardCheck,
  CalendarSearch,
  Backpack,
  ArrowRight,
  Megaphone,
  TrendingUp,
  Package,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HillwalkingPage() {
  const session = await getSession();

  const [
    totalItems,
    hillwalkingRecommendedCount,
    upcomingEventsCount,
    recentAnnouncements,
  ] = await Promise.all([
    prisma.item.count({ where: { status: "AVAILABLE" } }),
    prisma.item.count({
      where: { status: "AVAILABLE", isHillwalkingRecommended: true },
    }),
    prisma.hillwalkingEvent.count({
      where: { eventDate: { gte: new Date() }, isActive: true },
    }),
    prisma.announcement.findMany({
      where: { type: "HILLWALKING" },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  let userChecklistStats = null;
  if (session) {
    const [total, prepared] = await Promise.all([
      prisma.gearChecklistItem.count(),
      prisma.userGearChecklist.count({
        where: {
          userId: session.id,
          status: { in: ["HAVE", "RESERVED", "RECEIVED"] },
        },
      }),
    ]);
    userChecklistStats = { total, prepared };
  }

  const features = [
    {
      title: "Gear Checklist",
      description:
        "Browse the complete gear checklist for Hillwalking. Filter by essential, recommended, and weather-specific items.",
      href: "/hillwalking/checklist",
      icon: ClipboardCheck,
      gradient: "from-primary to-primary-light",
    },
    {
      title: "Rent Before Event",
      description:
        "Quickly find and rent gear before your next hillwalking event. Check availability for your trip dates.",
      href: "/hillwalking/rent-before-event",
      icon: CalendarSearch,
      gradient: "from-accent to-accent-dark",
    },
    {
      title: "My Preparation",
      description:
        "Track your hillwalking preparation status. See what you have, what you need, and what you've reserved.",
      href: "/hillwalking/my-preparation",
      icon: Backpack,
      gradient: "from-primary-dark to-primary",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-primary-gradient">
        {/* Decorative mountain pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute bottom-0 left-1/4 w-96 h-64 bg-white rounded-t-full"
            style={{ transform: "translateX(-50%)" }}
          />
          <div
            className="absolute bottom-0 left-3/4 w-80 h-48 bg-white rounded-t-full"
            style={{ transform: "translateX(-50%)" }}
          />
          <div
            className="absolute -bottom-8 left-1/2 w-[600px] h-40 bg-white rounded-t-full"
            style={{ transform: "translateX(-50%)" }}
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <Mountain className="w-5 h-5 text-accent" />
              <span className="text-sm font-medium text-white/90">
                SCIE Hillwalking Preparation Center
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
              Hillwalking Gear Hub
            </h1>
            <p className="mt-4 max-w-2xl text-lg sm:text-xl text-white/80">
              Prepare for your next SCIE Hillwalking adventure. Check the gear
              checklist, find available rentals, and track your preparation
              — all in one place.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
              <Link
                href="/hillwalking/checklist"
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-semibold rounded-xl hover:bg-accent-dark transition-colors shadow-lg shadow-accent/25"
              >
                View Gear Checklist
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/hillwalking/rent-before-event"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-semibold rounded-xl border-2 border-white/30 hover:bg-white/20 transition-colors backdrop-blur-sm"
              >
                Rent Before Event
              </Link>
            </div>
          </div>
        </div>
        {/* Wave separator */}
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
      </section>

      {/* Quick Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-4 bg-white rounded-xl border border-border-light shadow-sm p-5">
            <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
              <Package className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {totalItems}
              </p>
              <p className="text-sm text-muted">Gear Items Available</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white rounded-xl border border-border-light shadow-sm p-5">
            <div className="w-12 h-12 rounded-xl bg-accent-50 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {hillwalkingRecommendedCount}
              </p>
              <p className="text-sm text-muted">Hillwalking Recommended</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white rounded-xl border border-border-light shadow-sm p-5">
            <div className="w-12 h-12 rounded-xl bg-info-light flex items-center justify-center flex-shrink-0">
              <CalendarSearch className="w-6 h-6 text-info" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {upcomingEventsCount}
              </p>
              <p className="text-sm text-muted">Upcoming Events</p>
            </div>
          </div>
        </div>
      </section>

      {/* User Checklist Progress (if logged in) */}
      {session && userChecklistStats && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="bg-white rounded-xl border border-border-light shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Backpack className="w-5 h-5 text-primary" />
                Your Preparation Progress
              </h2>
              <Link
                href="/hillwalking/my-preparation"
                className="text-sm text-primary hover:text-primary-light font-medium flex items-center gap-1"
              >
                View Details <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-3 bg-surface-dark rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{
                    width: `${userChecklistStats.total > 0 ? Math.round((userChecklistStats.prepared / userChecklistStats.total) * 100) : 0}%`,
                  }}
                />
              </div>
              <span className="text-sm font-semibold text-foreground whitespace-nowrap">
                {userChecklistStats.prepared} / {userChecklistStats.total} items
              </span>
            </div>
            <p className="mt-3 text-sm text-muted">
              {userChecklistStats.prepared === userChecklistStats.total
                ? "You're fully prepared! Have a great hillwalking trip."
                : userChecklistStats.prepared === 0
                  ? "Start preparing by checking the gear checklist below."
                  : `Keep going — you have ${userChecklistStats.total - userChecklistStats.prepared} more items to prepare.`}
            </p>
          </div>
        </section>
      )}

      {/* Feature Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          Preparation Tools
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Link
              key={feature.href}
              href={feature.href}
              className="group bg-white rounded-xl border border-border-light shadow-sm hover:shadow-lg hover:border-primary-light transition-all duration-300 overflow-hidden flex flex-col"
            >
              <div
                className={`h-2 bg-gradient-to-r ${feature.gradient}`}
              />
              <div className="p-6 flex flex-col flex-1">
                <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted flex-1">
                  {feature.description}
                </p>
                <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:text-primary-light transition-colors">
                  Get Started
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Announcements */}
      {recentAnnouncements.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-accent" />
            Hillwalking Announcements
          </h2>
          <div className="space-y-3">
            {recentAnnouncements.map((announcement) => (
              <div
                key={announcement.id}
                className="bg-white rounded-xl border border-border-light shadow-sm p-5 hover:border-primary-light transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {announcement.title}
                    </h3>
                    <p className="text-sm text-muted mt-1 line-clamp-2">
                      {announcement.content}
                    </p>
                  </div>
                  <span className="text-xs text-muted-light whitespace-nowrap">
                    {formatDate(announcement.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      {!session && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="bg-gradient-to-r from-primary-dark to-primary rounded-2xl p-8 sm:p-10 text-center">
            <Mountain className="w-10 h-10 text-accent mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-3">
              Ready to Prepare for Hillwalking?
            </h2>
            <p className="text-white/80 max-w-md mx-auto mb-6">
              Log in to track your gear preparation, mark items as owned, and
              find rentals before your next adventure.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link
                href="/login"
                className="px-6 py-3 bg-white text-primary font-semibold rounded-xl hover:bg-surface transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="px-6 py-3 bg-accent text-white font-semibold rounded-xl hover:bg-accent-dark transition-colors"
              >
                Register
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
