import type { SessionUser } from "./session";

// Type helpers for permission checks
export type AuthUser = SessionUser | null;

/** Unauthenticated users can browse, view items, read rules/about */
export function canViewPublic() {
  return true; // everyone can view public content
}

export function canCreateItem(user: AuthUser): boolean {
  return !!user && user.verified;
}

export function canEditItem(user: AuthUser, ownerId: string): boolean {
  if (!user) return false;
  if (user.role === "ADMIN") return true;
  return user.id === ownerId;
}

export function canDeleteItem(user: AuthUser, ownerId: string): boolean {
  return canEditItem(user, ownerId);
}

export function canRequestRental(user: AuthUser, ownerId: string): boolean {
  if (!user || !user.verified) return false;
  return user.id !== ownerId; // can't rent own item
}

export function canViewOrder(user: AuthUser, borrowerId: string, lenderId: string): boolean {
  if (!user) return false;
  if (user.role === "ADMIN") return true;
  return user.id === borrowerId || user.id === lenderId;
}

export function canUpdateOrderStatus(
  user: AuthUser,
  borrowerId: string,
  lenderId: string
): boolean {
  if (!user) return false;
  if (user.role === "ADMIN") return true;
  return user.id === borrowerId || user.id === lenderId;
}

export function canViewThread(user: AuthUser, borrowerId: string, lenderId: string): boolean {
  if (!user) return false;
  if (user.role === "ADMIN") return true;
  return user.id === borrowerId || user.id === lenderId;
}

export function canSendMessage(user: AuthUser, threadBorrowerId: string, threadLenderId: string): boolean {
  return canViewThread(user, threadBorrowerId, threadLenderId);
}

export function canFavorite(user: AuthUser): boolean {
  return !!user;
}

export function canReviewOrder(user: AuthUser, borrowerId: string, lenderId: string): boolean {
  if (!user) return false;
  return user.id === borrowerId || user.id === lenderId;
}

export function canModerateItems(user: AuthUser): boolean {
  return !!user && user.role === "ADMIN";
}

export function canManageReports(user: AuthUser): boolean {
  return !!user && user.role === "ADMIN";
}

export function canManageUsers(user: AuthUser): boolean {
  return !!user && user.role === "ADMIN";
}

export function canManageAnnouncements(user: AuthUser): boolean {
  return !!user && user.role === "ADMIN";
}

export function canViewAdmin(user: AuthUser): boolean {
  return !!user && user.role === "ADMIN";
}

export function canUpdateProfile(user: AuthUser, targetUserId: string): boolean {
  if (!user) return false;
  if (user.role === "ADMIN") return true;
  return user.id === targetUserId;
}

export function canReportItem(user: AuthUser, ownerId: string): boolean {
  if (!user) return false;
  return user.id !== ownerId; // can't report own item
}

export function canAccessDashboard(user: AuthUser): boolean {
  return !!user;
}

export function canAccessHillwalkingChecklist(user: AuthUser): boolean {
  return !!user && user.verified;
}

export function canManageEvents(user: AuthUser): boolean {
  return !!user && user.role === "ADMIN";
}
