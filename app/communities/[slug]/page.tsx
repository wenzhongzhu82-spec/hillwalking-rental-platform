"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Users, MapPin, CheckCircle, ArrowLeft, Plus, LogIn, LogOut,
  Building2, GraduationCap, Globe, Users2, Circle, Package,
} from "lucide-react";
import ItemCard from "@/components/items/ItemCard";
import { EmptyState, PageLoading } from "@/components/ui/loading";

interface Community {
  id: string;
  name: string;
  slug: string;
  type: string;
  description: string | null;
  location: string | null;
  verified: boolean;
  image: string | null;
  createdAt: string;
  _count: {
    members: number;
    items: number;
  };
}

interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: string;
  verified: boolean;
  avatar: string | null;
  communityId: string | null;
}

const TYPE_LABELS: Record<string, string> = {
  SCHOOL: "School",
  CLUB: "Club",
  CITY: "City",
  ORGANIZATION: "Organization",
  OTHER: "Other",
};

const TYPE_ICONS: Record<string, React.ReactNode> = {
  SCHOOL: <GraduationCap className="w-5 h-5" />,
  CLUB: <Users2 className="w-5 h-5" />,
  CITY: <Building2 className="w-5 h-5" />,
  ORGANIZATION: <Globe className="w-5 h-5" />,
  OTHER: <Circle className="w-5 h-5" />,
};

export default function CommunityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [community, setCommunity] = useState<Community | null>(null);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [joinLoading, setJoinLoading] = useState(false);
  const initialLoadDone = useRef(false);

  const fetchCommunityItems = useCallback(async (communityId: string) => {
    try {
      const res = await fetch(
        `/api/items?communityId=${communityId}&status=AVAILABLE&limit=12`
      );
      const data = await res.json();
      setItems(data.items || []);
    } catch {
      // ignore
    }
  }, []);

  const fetchCommunity = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/communities/${slug}`);
      if (!res.ok) {
        if (res.status === 404) throw new Error("Community not found");
        throw new Error("Failed to fetch community");
      }
      const data = await res.json();
      setCommunity(data.community);
      // Fetch items for this community
      fetchCommunityItems(data.community.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load community");
    } finally {
      setLoading(false);
    }
  }, [slug]);

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.user) setUser(data.user);
    } catch {
      // not logged in
    }
  }, []);



  useEffect(() => {
    if (initialLoadDone.current) return;
    initialLoadDone.current = true;
    fetchCommunity();
    fetchUser();
  }, [fetchCommunity, fetchUser]);


  async function handleJoinLeave() {
    if (!community || !user) return;
    setJoinLoading(true);
    try {
      const isMember = user.communityId === community.id;
      const res = await fetch("/api/communities", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          communityId: community.id,
          action: isMember ? "LEAVE" : "JOIN",
        }),
      });
      const data = await res.json();
      if (res.ok) {
        // Refresh community and user
        fetchCommunity();
        fetchUser();
        // Refresh items in case community items changed
        if (community) fetchCommunityItems(community.id);
      } else {
        alert(data.error || "Action failed");
      }
    } catch {
      alert("Network error");
    } finally {
      setJoinLoading(false);
    }
  }

  if (loading) return <PageLoading />;

  if (error || !community) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <EmptyState
          icon={<Users className="w-12 h-12" />}
          title="Community not found"
          description={error || "The community you're looking for doesn't exist"}
          action={
            <Link
              href="/communities"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Communities
            </Link>
          }
        />
      </div>
    );
  }

  const isMember = user?.communityId === community.id;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back link */}
      <Link
        href="/communities"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Communities
      </Link>

      {/* Community Header */}
      <div className="bg-card rounded-2xl border border-border shadow-sm p-6 sm:p-8 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-flex items-center gap-1.5 text-sm font-medium bg-surface px-3 py-1 rounded-full text-muted-dark">
                {TYPE_ICONS[community.type]}
                {TYPE_LABELS[community.type] || community.type}
              </span>
              {community.verified && (
                <span className="inline-flex items-center gap-1 text-sm font-medium bg-success-light text-success px-3 py-1 rounded-full">
                  <CheckCircle className="w-4 h-4" />
                  Verified
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-3">
              {community.name}
            </h1>
            {community.description && (
              <p className="text-muted text-base mb-4 max-w-2xl">
                {community.description}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-5 text-sm text-muted">
              {community.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {community.location}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                {community._count.members} member{community._count.members !== 1 ? "s" : ""}
              </span>
              <span className="flex items-center gap-1.5">
                <Package className="w-4 h-4" />
                {community._count.items} item{community._count.items !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* Join / Leave button */}
          {user && (
            <div className="flex-shrink-0">
              <button
                onClick={handleJoinLeave}
                disabled={joinLoading}
                className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isMember
                    ? "bg-error-light text-error hover:bg-red-200"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                } disabled:opacity-50`}
              >
                {joinLoading ? (
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : isMember ? (
                  <LogOut className="w-4 h-4" />
                ) : (
                  <LogIn className="w-4 h-4" />
                )}
                {isMember ? "Leave Community" : "Join Community"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Items Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Community Items</h2>
          {user && (
            <Link
              href="/my-items/new"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary-light font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              List an Item
            </Link>
          )}
        </div>

        {items.length === 0 ? (
          <EmptyState
            icon={<Package className="w-12 h-12" />}
            title="No items in this community yet"
            description="Items listed by community members will appear here"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
