import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import SettingsClient from "./SettingsClient";

export default async function SettingsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  // Fetch full user data
  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      grade: true,
      house: true,
      role: true,
      verified: true,
      rating: true,
      creditScore: true,
      bio: true,
      createdAt: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Account Settings</h1>
        <p className="text-sm text-muted mt-1">
          Manage your profile, password, and account preferences
        </p>
      </div>

      <SettingsClient user={{ ...user, grade: user.grade ?? null, house: user.house ?? null, createdAt: user.createdAt.toISOString() }} />
    </div>
  );
}
