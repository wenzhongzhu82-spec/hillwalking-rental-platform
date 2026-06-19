import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { formatDate, parseJson } from "@/lib/utils";
import { ShieldCheck, Award, Calendar, Star } from "lucide-react";
import VerifiedBadge from "@/components/ui/VerifiedBadge";
import RatingStars from "@/components/ui/RatingStars";
import { Badge } from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import EmptyState from "@/components/ui/EmptyState";
import ItemGrid from "@/components/items/ItemGrid";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getUserProfile(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      avatar: true,
      grade: true,
      house: true,
      verified: true,
      rating: true,
      creditScore: true,
      completedOrders: true,
      bio: true,
      createdAt: true,
    },
  });

  if (!user) return null;
  return user;
}

async function getUserItems(userId: string) {
  const items = await prisma.item.findMany({
    where: { ownerId: userId, status: "AVAILABLE" },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          avatar: true,
          verified: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return items.map((item) => ({
    id: item.id,
    title: item.title,
    images: parseJson<string[]>(item.images, []),
    dailyPrice: item.dailyPrice,
    deposit: item.deposit,
    condition: item.condition,
    tags: parseJson<string[]>(item.tags, []),
    owner: {
      id: item.owner.id,
      name: item.owner.name,
      avatar: item.owner.avatar,
      verified: item.owner.verified,
    },
    pickupLocation: item.pickupLocation,
  }));
}

async function getReviews(revieweeId: string) {
  const reviews = await prisma.review.findMany({
    where: { revieweeId },
    include: {
      reviewer: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return reviews;
}

function getCreditScoreColor(score: number): string {
  if (score >= 90) return "bg-success";
  if (score >= 70) return "bg-accent";
  if (score >= 50) return "bg-warning";
  return "bg-error";
}

export default async function ProfilePage({ params }: PageProps) {
  const { id } = await params;
  const session = await getSession();
  const isOwner = session?.id === id;

  const user = await getUserProfile(id);
  if (!user) {
    notFound();
  }

  const [items, reviews] = await Promise.all([
    getUserItems(user.id),
    getReviews(user.id),
  ]);

  const creditColor = getCreditScoreColor(user.creditScore);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl border border-surface-dark p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          {/* Large Avatar */}
          <div className="flex-shrink-0">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-primary-100"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white text-3xl font-bold border-4 border-primary-100">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 space-y-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                  {user.name}
                </h1>
                {user.verified && <VerifiedBadge />}
              </div>
              <div className="flex items-center gap-3 mt-1 text-sm text-muted">
                <span className="font-medium text-foreground">
                  {user.grade}
                </span>
                <span className="text-muted-light">|</span>
                <span>{user.house}</span>
              </div>
            </div>

            {/* Stats Row */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Rating */}
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-accent fill-accent" />
                <RatingStars rating={user.rating} size="sm" />
              </div>

              {/* Credit Score */}
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-accent" />
                <span className="text-sm text-foreground font-medium">
                  Credit Score
                </span>
                <div className="flex items-center gap-1.5">
                  <div className="w-20 h-2 bg-surface rounded-full overflow-hidden">
                    <div
                      className={`h-full ${creditColor} rounded-full transition-all`}
                      style={{ width: `${Math.min(100, user.creditScore)}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {user.creditScore}
                  </span>
                </div>
              </div>

              {/* Completed Orders */}
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-success" />
                <span className="text-sm text-muted">
                  <span className="font-semibold text-foreground">
                    {user.completedOrders}
                  </span>{" "}
                  completed orders
                </span>
              </div>

              {/* Member Since */}
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-muted-light" />
                <span className="text-sm text-muted">
                  Member since {formatDate(user.createdAt)}
                </span>
              </div>
            </div>

            {/* Bio */}
            {user.bio && (
              <div className="pt-2 border-t border-surface-dark">
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                  {user.bio}
                </p>
              </div>
            )}

            {/* Edit button for owner */}
            {isOwner && (
              <div className="pt-2">
                <a
                  href="/settings/profile"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-primary bg-primary-50 border border-primary-100 rounded-lg hover:bg-primary-100 transition-colors"
                >
                  Edit Profile
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Items By This User */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">
            Items by {user.name}
          </h2>
          <span className="text-sm text-muted">
            {items.length} {items.length === 1 ? "item" : "items"} available
          </span>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-xl border border-surface-dark">
            <EmptyState
              icon={<PackageIcon />}
              title="No items available"
              description={
                isOwner
                  ? "You have not posted any items yet."
                  : `${user.name} has not posted any items yet.`
              }
            />
          </div>
        ) : (
          <ItemGrid items={items} />
        )}
      </section>

      {/* Reviews */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">
            Reviews ({reviews.length})
          </h2>
        </div>

        {reviews.length === 0 ? (
          <div className="bg-white rounded-xl border border-surface-dark">
            <EmptyState
              icon={<MessageSquareIcon />}
              title="No reviews yet"
              description="This user has not received any reviews yet."
            />
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-xl border border-surface-dark p-5 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <Avatar
                    src={review.reviewer.avatar}
                    name={review.reviewer.name}
                    size="md"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-foreground">
                        {review.reviewer.name}
                      </span>
                      <RatingStars rating={review.rating} size="sm" showValue />
                    </div>
                    {review.content && (
                      <p className="text-sm text-muted-dark leading-relaxed">
                        {review.content}
                      </p>
                    )}
                    <p className="text-xs text-muted-light mt-2">
                      {formatDate(review.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function PackageIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-muted-light"
    >
      <path d="M16.5 9.4L7.55 4.24" />
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
      <polyline points="3.29 7 12 12 20.71 7" />
      <line x1="12" y1="22" x2="12" y2="12" />
    </svg>
  );
}

function MessageSquareIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-muted-light"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
