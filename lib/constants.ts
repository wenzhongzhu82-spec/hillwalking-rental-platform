// No email domain restrictions — anyone can register with any valid email.
// Kept as empty array for backwards compatibility with any code referencing it.
export const SCHOOL_EMAIL_DOMAINS: readonly string[] = [];

export const GRADES = ["G1", "G2", "A1", "A2", "Teacher", "Staff"] as const;
export const HOUSES = ["Fire", "Water", "Wood", "Metal", "None"] as const;

export const CONDITIONS = [
  "NEW",
  "LIKE_NEW",
  "LIGHTLY_USED",
  "VISIBLY_USED",
  "FUNCTIONAL",
] as const;

export const ITEM_STATUSES = [
  "PENDING_REVIEW",
  "AVAILABLE",
  "RESERVED",
  "RENTED",
  "RETURNED",
  "HIDDEN",
  "BANNED",
] as const;

export const ORDER_STATUSES = [
  "REQUEST_PENDING",
  "ACCEPTED",
  "REJECTED",
  "CANCELLED",
  "WAITING_PICKUP",
  "PICKED_UP",
  "IN_USE",
  "RETURN_REQUESTED",
  "RETURNED",
  "COMPLETED",
  "DISPUTE_OPENED",
] as const;

export const PICKUP_LOCATIONS = [
  "Campus / School",
  "Library",
  "Sports Facility",
  "Cafeteria",
  "Public Space",
  "Dormitory Area",
  "SCIE Antuoshan Campus",
  "Other",
] as const;

export const ITEM_TAGS = [
  "waterproof",
  "lightweight",
  "warm",
  "beginner friendly",
  "recommended for hillwalking",
  "urgent available",
  "free to borrow",
  "deposit required",
  "durable",
  "compact",
  "multi-purpose",
  "quick dry",
] as const;

export const REPORT_REASONS = [
  "FAKE_ITEM",
  "UNREASONABLE_PRICE",
  "DANGEROUS",
  "NOT_SUITABLE",
  "FAKE_IMAGE",
  "OTHER",
] as const;

export const ANNOUNCEMENT_TYPES = [
  "GENERAL",
  "HILLWALKING",
  "SAFETY",
  "RULES",
  "LOST_FOUND",
] as const;

export const GEAR_CATEGORIES = [
  "ESSENTIAL",
  "RECOMMENDED",
  "WEATHER_SPECIFIC",
] as const;

export const GEAR_CHECKLIST_STATUSES = [
  "HAVE",
  "NEED",
  "RESERVED",
  "RECEIVED",
  "RETURNED",
] as const;

export const ROLES = {
  USER: "USER",
  ADMIN: "ADMIN",
} as const;

export const CONDITION_LABELS: Record<string, string> = {
  NEW: "New / 全新",
  LIKE_NEW: "Like New / 几乎全新",
  LIGHTLY_USED: "Lightly Used / 轻微使用痕迹",
  VISIBLY_USED: "Visibly Used / 明显使用痕迹",
  FUNCTIONAL: "Functional / 功能正常但外观旧",
};

export const STATUS_LABELS: Record<string, string> = {
  PENDING_REVIEW: "Pending Review / 待审核",
  AVAILABLE: "Available / 可租",
  RESERVED: "Reserved / 已预约",
  RENTED: "Rented / 已租出",
  RETURNED: "Returned / 已归还",
  HIDDEN: "Hidden / 已隐藏",
  BANNED: "Banned / 已下架",
};

export const ORDER_STATUS_LABELS: Record<string, string> = {
  REQUEST_PENDING: "Request Pending / 等待确认",
  ACCEPTED: "Accepted / 已接受",
  REJECTED: "Rejected / 已拒绝",
  CANCELLED: "Cancelled / 已取消",
  WAITING_PICKUP: "Waiting Pickup / 等待取货",
  PICKED_UP: "Picked Up / 已取货",
  IN_USE: "In Use / 使用中",
  RETURN_REQUESTED: "Return Requested / 请求归还",
  RETURNED: "Returned / 已归还",
  COMPLETED: "Completed / 已完成",
  DISPUTE_OPENED: "Dispute Opened / 争议中",
};

// Grade and House are optional community-specific fields.
// Kept for backwards compatibility with SCIE users.
export const GRADE_LABELS: Record<string, string> = {
  G1: "G1",
  G2: "G2",
  A1: "A1",
  A2: "A2",
  Teacher: "Teacher",
  Staff: "Staff",
};

export const HOUSE_LABELS: Record<string, string> = {
  Fire: "Fire",
  Water: "Water",
  Wood: "Wood",
  Metal: "Metal",
  None: "None",
};

export const REPORT_REASON_LABELS: Record<string, string> = {
  FAKE_ITEM: "Fake Item / 虚假物品",
  UNREASONABLE_PRICE: "Unreasonable Price / 价格不合理",
  DANGEROUS: "Dangerous Item / 危险物品",
  NOT_SUITABLE: "Not Suitable / 不适合校内交易",
  FAKE_IMAGE: "Fake Image / 图片不真实",
  OTHER: "Other / 其他",
};

export const BANNED_KEYWORDS = [
  "knife", "weapon", "gun", "vape", "cigarette", "tobacco",
  "alcohol", "beer", "wine", "medicine", "drug", "pill",
  "exam paper", "answer", "cheat", "fake ID",
  "adult", "porn", "explosive", "firework",
] as const;

export function checkBannedContent(text: string): string | null {
  const lower = text.toLowerCase();
  for (const keyword of BANNED_KEYWORDS) {
    if (lower.includes(keyword)) {
      return `Content may violate platform rules (detected: "${keyword}"). Prohibited items include weapons, drugs, alcohol, tobacco, adult content, cheating materials, and dangerous items.`;
    }
  }
  return null;
}
