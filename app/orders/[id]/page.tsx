import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { OrderDetailClient } from "./OrderDetailClient";

export const dynamic = "force-dynamic";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      item: {
        include: {
          category: { select: { id: true, name: true, slug: true } },
          owner: {
            select: {
              id: true,
              name: true,
              avatar: true,
              rating: true,
              grade: true,
              house: true,
            },
          },
        },
      },
      borrower: {
        select: {
          id: true,
          name: true,
          avatar: true,
          rating: true,
          grade: true,
          house: true,
        },
      },
      lender: {
        select: {
          id: true,
          name: true,
          avatar: true,
          rating: true,
          grade: true,
          house: true,
        },
      },
      reviews: {
        select: {
          id: true,
          rating: true,
          content: true,
          reviewerId: true,
          revieweeId: true,
          createdAt: true,
          punctuality: true,
          itemAccuracy: true,
          communication: true,
          recommended: true,
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  // Check permission
  if (
    order.borrowerId !== session.id &&
    order.lenderId !== session.id &&
    session.role !== "ADMIN"
  ) {
    notFound();
  }

  // Determine user's role
  const userRole: "borrower" | "lender" | "admin" =
    session.role === "ADMIN"
      ? "admin"
      : order.borrowerId === session.id
        ? "borrower"
        : "lender";

  // Check if user has reviewed the other party
  const existingUserReview = order.reviews.find(
    (r) => r.reviewerId === session.id
  );

  // Serialize
  const serializedOrder = JSON.parse(JSON.stringify(order));

  return (
    <OrderDetailClient
      order={serializedOrder}
      userId={session.id}
      userRole={userRole}
      existingUserReview={existingUserReview || null}
    />
  );
}
