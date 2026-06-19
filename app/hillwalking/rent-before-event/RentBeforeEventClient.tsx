"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  CalendarSearch,
  Mountain,
  ArrowRight,
  Package,
  MapPin,
  Star,
  Zap,
  Clock,
  Gift,
  TrendingUp,
  Tag,
  ShoppingCart,
  Heart,
  ChevronDown,
} from "lucide-react";
import { cn, formatPrice, formatDate } from "@/lib/utils";

interface RentalItem {
  id: string;
  title: string;
  description: string;
  dailyPrice: number;
  deposit: number;
  condition: string;
  pickupLocation: string;
  availableFrom: string;
  availableTo: string;
  matchScore: number;
  isHillwalkingRecommended: boolean;
  images: string;
  tags: string;
  owner: { id: string; name: string; rating: number; grade: string };
  category: { name: string; icon: string | null };
}

interface HillwalkingEvent {
  id: string;
  name: string;
  description: string | null;
  eventDate: string;
}

export function RentBeforeEventClient({
  allItems,
  upcomingEvents,
}: {
  allItems: RentalItem[];
  upcomingEvents: HillwalkingEvent[];
}) {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedEventId, setSelectedEventId] = useState<string>("");

  const handleEventSelect = (eventId: string) => {
    setSelectedEventId(eventId);
    const event = upcomingEvents.find((e) => e.id === eventId);
    if (event) {
      setSelectedDate(event.eventDate.split("T")[0]);
    }
  };

  const filteredItems = useMemo(() => {
    if (!selectedDate) return allItems;

    const targetDate = new Date(selectedDate);
    // We need items available from before the event date
    // and available until at least the event date (the day after for returns)
    const eventEndDate = new Date(targetDate);
    eventEndDate.setDate(eventEndDate.getDate() + 1);

    return allItems.filter((item) => {
      const itemFrom = new Date(item.availableFrom);
      const itemTo = new Date(item.availableTo);
      // Item must be available at least from the day before the event
      // and through the event date
      const neededStart = new Date(targetDate);
      neededStart.setDate(neededStart.getDate() - 1); // pick up day before
      return itemFrom <= neededStart && itemTo >= targetDate;
    });
  }, [allItems, selectedDate]);

  const freeItems = filteredItems.filter((item) => item.dailyPrice === 0);
  const highScoreItems = filteredItems.filter(
    (item) => item.matchScore > 75 && item.dailyPrice > 0
  );
  const nearbyItems = filteredItems.filter(
    (item) =>
      item.pickupLocation.toLowerCase().includes("antuoshan") &&
      item.dailyPrice > 0 &&
      item.matchScore <= 75
  );
  const otherItems = filteredItems.filter(
    (item) =>
      item.dailyPrice > 0 &&
      item.matchScore <= 75 &&
      !item.pickupLocation.toLowerCase().includes("antuoshan")
  );

  // Combine sections preserving recommendation sorting
  const allFiltered = [
    ...freeItems,
    ...highScoreItems,
    ...nearbyItems,
    ...otherItems,
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-primary-gradient py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-3">
            <CalendarSearch className="w-8 h-8 text-accent" />
            <h1 className="text-3xl font-bold text-white">
              Quick Rent Before Hillwalking
            </h1>
          </div>
          <p className="text-white/80 max-w-2xl">
            Select your hillwalking event date and find recommended gear
            available for rent during that period.
          </p>
        </div>
      </section>

      {/* Date Selection */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        <div className="bg-white rounded-xl border border-border-light shadow-md p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-accent" />
            When is your hillwalking event?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date picker */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Select Event Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedEventId("");
                }}
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors outline-none"
              />
            </div>

            {/* Quick select upcoming events */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Or Select Upcoming Event
              </label>
              <div className="relative">
                <select
                  value={selectedEventId}
                  onChange={(e) => handleEventSelect(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors outline-none appearance-none cursor-pointer"
                >
                  <option value="">Choose an event...</option>
                  {upcomingEvents.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.name} — {formatDate(event.eventDate)}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted pointer-events-none" />
              </div>
              {upcomingEvents.length === 0 && (
                <p className="text-xs text-muted mt-1">
                  No upcoming events scheduled.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            {selectedDate
              ? `Available Items for ${formatDate(selectedDate)}`
              : "All Hillwalking Recommended Items"}
          </h2>
          <span className="text-sm text-muted">
            {allFiltered.length} item{allFiltered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {allFiltered.length === 0 && (
          <div className="text-center py-16">
            <Package className="w-12 h-12 text-muted-light mx-auto mb-3" />
            <p className="text-muted text-lg mb-1">
              {selectedDate
                ? "No items available for this date yet."
                : "No Hillwalking recommended items found."}
            </p>
            <p className="text-muted-light text-sm">
              {selectedDate
                ? "Try a different date, or check back later."
                : "Check back soon — items are added regularly."}
            </p>
          </div>
        )}

        {/* Section: Free to Borrow */}
        {freeItems.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Gift className="w-5 h-5 text-success" />
              <h3 className="text-lg font-semibold text-success">
                Free to Borrow
              </h3>
              <span className="text-sm text-muted">
                ({freeItems.length} item{freeItems.length !== 1 ? "s" : ""})
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {freeItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}

        {/* Section: High Match Score */}
        {highScoreItems.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-semibold text-accent-darker">
                High Match Score
              </h3>
              <span className="text-sm text-muted">
                ({highScoreItems.length} item
                {highScoreItems.length !== 1 ? "s" : ""} with 75+ match)
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {highScoreItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}

        {/* Section: Nearby Pickup */}
        {nearbyItems.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-info" />
              <h3 className="text-lg font-semibold text-info">
                Nearby Pickup — Antuoshan Campus
              </h3>
              <span className="text-sm text-muted">
                ({nearbyItems.length} item
                {nearbyItems.length !== 1 ? "s" : ""})
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {nearbyItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}

        {/* Other items */}
        {otherItems.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              More Available Items
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {otherItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function ItemCard({ item }: { item: RentalItem }) {
  const images = useMemo(() => {
    try {
      return JSON.parse(item.images);
    } catch {
      return [];
    }
  }, [item.images]);

  const tags = useMemo(() => {
    try {
      return JSON.parse(item.tags);
    } catch {
      return [];
    }
  }, [item.tags]);

  const firstImage = images[0] || null;

  return (
    <Link
      href={`/items/${item.id}`}
      className="group bg-white rounded-xl border border-border-light shadow-sm hover:shadow-md hover:border-primary-light transition-all overflow-hidden flex flex-col"
    >
      {/* Image */}
      <div className="aspect-[4/3] bg-surface relative overflow-hidden">
        {firstImage ? (
          <img
            src={firstImage}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-10 h-10 text-muted-light" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {item.dailyPrice === 0 && (
            <span className="px-2 py-0.5 bg-success text-white text-xs font-medium rounded-full">
              Free
            </span>
          )}
          {item.matchScore > 75 && (
            <span className="px-2 py-0.5 bg-accent text-white text-xs font-medium rounded-full flex items-center gap-0.5">
              <Zap className="w-3 h-3" /> {item.matchScore}
            </span>
          )}
        </div>

        {/* Condition badge */}
        <span className="absolute top-2 right-2 px-2 py-0.5 bg-white/90 text-xs font-medium rounded-full">
          {item.condition.replace(/_/g, " ")}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
          {item.title}
        </h3>
        <p className="text-sm text-muted mt-1 line-clamp-2 flex-1">
          {item.description}
        </p>

        <div className="flex items-center gap-2 mt-3 text-xs text-muted">
          <MapPin className="w-3.5 h-3.5" />
          <span className="truncate">{item.pickupLocation}</span>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border-light">
          <span className="text-lg font-bold text-primary">
            {formatPrice(item.dailyPrice)}
            {item.dailyPrice > 0 && (
              <span className="text-xs font-normal text-muted">/day</span>
            )}
          </span>
          <div className="flex items-center gap-0.5 text-xs text-muted">
            <Star className="w-3.5 h-3.5 text-accent fill-accent" />
            {item.owner.rating.toFixed(1)}
          </div>
        </div>

        {/* Why Recommended */}
        <div className="mt-2 text-xs text-muted-light flex items-center gap-1">
          <Heart className="w-3 h-3" />
          Hillwalking Recommended
          {item.matchScore > 0 && ` (Score: ${item.matchScore})`}
        </div>
      </div>
    </Link>
  );
}
