import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { ChevronRight, AlertCircle } from "lucide-react";
import ItemForm from "@/components/forms/ItemForm";

export default async function NewItemPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const categories = await prisma.category.findMany({
    select: { id: true, name: true, slug: true },
    orderBy: { name: "asc" },
  });

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
        <span className="text-foreground font-medium">New Item</span>
      </div>

      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Post an Item for Rent
        </h1>
        <p className="text-muted mt-1">
          Fill in the details below to list your gear on the marketplace.
          All items are reviewed before becoming visible.
        </p>
      </div>

      {/* Unverified Warning */}
      {!session.verified && (
        <div className="flex items-start gap-3 p-4 bg-warning-light border border-warning rounded-xl">
          <AlertCircle className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground">
              Your account is not yet verified
            </p>
            <p className="text-xs text-muted-dark mt-0.5">
              Items posted by unverified users will be held for review before
              appearing on the marketplace. To get verified, contact an
              administrator or complete more rentals.
            </p>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-2xl border border-surface-dark shadow-sm p-1">
        <ItemForm categories={categories} isEditing={false} />
      </div>
    </div>
  );
}
