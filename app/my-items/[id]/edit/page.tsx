import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { ChevronRight, ShieldAlert } from "lucide-react";
import ItemForm from "@/components/forms/ItemForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getItem(id: string) {
  const item = await prisma.item.findUnique({
    where: { id },
    include: {
      category: {
        select: { id: true, name: true, slug: true },
      },
    },
  });

  if (!item) return null;
  return item;
}

export default async function EditItemPage({ params }: PageProps) {
  const { id } = await params;
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const [item, categories] = await Promise.all([
    getItem(id),
    prisma.category.findMany({
      select: { id: true, name: true, slug: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!item) {
    notFound();
  }

  // Check ownership
  if (item.ownerId !== session.id) {
    redirect("/my-items");
  }

  // Don't allow editing banned items
  if (item.status === "BANNED") {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-start gap-3 p-6 bg-red-50 border border-error rounded-2xl">
          <ShieldAlert className="w-6 h-6 text-error mt-0.5 flex-shrink-0" />
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              This item has been banned
            </h2>
            <p className="text-sm text-muted-dark mt-1">
              Banned items cannot be edited. Please contact an administrator if
              you believe this was a mistake.
            </p>
            <Link
              href="/my-items"
              className="inline-block mt-3 text-sm font-medium text-primary hover:text-primary-light"
            >
              Back to My Items
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Format dates for the form (to "YYYY-MM-DD" strings)
  const availableFrom =
    item.availableFrom instanceof Date
      ? item.availableFrom.toISOString().split("T")[0]
      : String(item.availableFrom).split("T")[0];

  const availableTo =
    item.availableTo instanceof Date
      ? item.availableTo.toISOString().split("T")[0]
      : String(item.availableTo).split("T")[0];

  const initialData = {
    id: item.id,
    title: item.title,
    description: item.description,
    categoryId: item.categoryId,
    brand: item.brand,
    size: item.size,
    condition: item.condition,
    dailyPrice: item.dailyPrice,
    deposit: item.deposit,
    pickupLocation: item.pickupLocation,
    returnLocation: item.returnLocation,
    availableFrom,
    availableTo,
    safetyNotes: item.safetyNotes,
    tags: item.tags, // JSON string, ItemForm will parse it
    isHillwalkingRecommended: item.isHillwalkingRecommended,
    images: item.images, // JSON string
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-muted">
        <Link href="/dashboard" className="hover:text-primary transition-colors">
          Dashboard
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/my-items" className="hover:text-primary transition-colors">
          My Items
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-foreground font-medium truncate max-w-[200px]">
          Edit: {item.title}
        </span>
      </div>

      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Edit Item
        </h1>
        <p className="text-muted mt-1">
          Update your item details below. Changes may require re-review by
          moderators.
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl border border-surface-dark shadow-sm p-1">
        <ItemForm
          initialData={initialData}
          categories={categories}
          isEditing={true}
        />
      </div>
    </div>
  );
}
