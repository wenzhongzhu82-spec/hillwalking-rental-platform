export const SCHOOL_EMAIL_DOMAINS = [
  "@scie.com.cn",
  "@stu.scie.com.cn",
  "@scie.test", // dev/testing
] as const;

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
  "SCIE Antuoshan Campus",
  "Dormitory Area",
  "Library Entrance",
  "Sports Field",
  "Cafeteria",
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
  NEW: "全新",
  LIKE_NEW: "几乎全新",
  LIGHTLY_USED: "轻微使用痕迹",
  VISIBLY_USED: "明显使用痕迹",
  FUNCTIONAL: "功能正常但外观旧",
};

export const STATUS_LABELS: Record<string, string> = {
  PENDING_REVIEW: "待审核",
  AVAILABLE: "可租",
  RESERVED: "已预约",
  RENTED: "已租出",
  RETURNED: "已归还",
  HIDDEN: "已隐藏",
  BANNED: "已下架",
};

export const ORDER_STATUS_LABELS: Record<string, string> = {
  REQUEST_PENDING: "等待确认",
  ACCEPTED: "已接受",
  REJECTED: "已拒绝",
  CANCELLED: "已取消",
  WAITING_PICKUP: "等待取货",
  PICKED_UP: "已取货",
  IN_USE: "使用中",
  RETURN_REQUESTED: "请求归还",
  RETURNED: "已归还",
  COMPLETED: "已完成",
  DISPUTE_OPENED: "争议中",
};

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
  FAKE_ITEM: "虚假物品",
  UNREASONABLE_PRICE: "价格不合理",
  DANGEROUS: "危险物品",
  NOT_SUITABLE: "不适合校内交易",
  FAKE_IMAGE: "图片不真实",
  OTHER: "其他",
};
