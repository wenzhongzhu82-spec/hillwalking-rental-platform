import { z } from "zod/v4";
import { SCHOOL_EMAIL_DOMAINS } from "./constants";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name too long"),
    email: z
      .string()
      .email("Please enter a valid email")
      .refine(
        (email) => {
          // In dev, accept any valid email
          if (process.env.NODE_ENV === "development") return true;
          return SCHOOL_EMAIL_DOMAINS.some((domain) =>
            email.endsWith(domain)
          );
        },
        {
          message: `Email must be a school email (${SCHOOL_EMAIL_DOMAINS.join(", ")})`,
        }
      ),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    grade: z.enum(["G1", "G2", "A1", "A2", "Teacher", "Staff"]),
    house: z.enum(["Fire", "Water", "Wood", "Metal", "None"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const itemSchema = z
  .object({
    title: z.string().min(2, "Title must be at least 2 characters").max(80, "Title too long"),
    description: z.string().min(10, "Description must be at least 10 characters").max(2000),
    categoryId: z.string().min(1, "Please select a category"),
    brand: z.string().max(50).optional().or(z.literal("")),
    size: z.string().max(30).optional().or(z.literal("")),
    condition: z.enum(["NEW", "LIKE_NEW", "LIGHTLY_USED", "VISIBLY_USED", "FUNCTIONAL"]),
    dailyPrice: z.number().min(0, "Daily price cannot be negative"),
    deposit: z.number().min(0, "Deposit cannot be negative"),
    pickupLocation: z.string().min(1, "Please select a pickup location"),
    returnLocation: z.string().optional().or(z.literal("")),
    availableFrom: z.string().min(1, "Start date is required"),
    availableTo: z.string().min(1, "End date is required"),
    safetyNotes: z.string().max(500).optional().or(z.literal("")),
    tags: z.array(z.string()).max(10, "Maximum 10 tags"),
    isHillwalkingRecommended: z.boolean(),
  })
  .refine(
    (data) => {
      if (data.availableFrom && data.availableTo) {
        return new Date(data.availableTo) > new Date(data.availableFrom);
      }
      return true;
    },
    {
      message: "End date must be after start date",
      path: ["availableTo"],
    }
  );

export const orderSchema = z
  .object({
    itemId: z.string(),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    borrowerNote: z.string().max(500).optional().or(z.literal("")),
    pickupTime: z.string().optional().or(z.literal("")),
    returnTime: z.string().optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return new Date(data.endDate) > new Date(data.startDate);
      }
      return true;
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    }
  );

export const messageSchema = z.object({
  content: z.string().min(1, "Message cannot be empty").max(2000),
});

export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  content: z.string().max(500).optional().or(z.literal("")),
  punctuality: z.number().min(1).max(5),
  itemAccuracy: z.number().min(1).max(5),
  communication: z.number().min(1).max(5),
  recommended: z.boolean(),
});

export const reportSchema = z.object({
  itemId: z.string().optional().or(z.literal("")),
  reason: z.enum([
    "FAKE_ITEM",
    "UNREASONABLE_PRICE",
    "DANGEROUS",
    "NOT_SUITABLE",
    "FAKE_IMAGE",
    "OTHER",
  ]),
  description: z.string().max(500).optional().or(z.literal("")),
});

export const announcementSchema = z.object({
  title: z.string().min(2).max(100),
  content: z.string().min(10).max(5000),
  type: z.enum(["GENERAL", "HILLWALKING", "SAFETY", "RULES", "LOST_FOUND"]),
});

export const profileSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  bio: z.string().max(300).optional().or(z.literal("")),
  grade: z.enum(["G1", "G2", "A1", "A2", "Teacher", "Staff"]).optional(),
  house: z.enum(["Fire", "Water", "Wood", "Metal", "None"]).optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ItemInput = z.infer<typeof itemSchema>;
export type OrderInput = z.infer<typeof orderSchema>;
export type MessageInput = z.infer<typeof messageSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type ReportInput = z.infer<typeof reportSchema>;
export type AnnouncementInput = z.infer<typeof announcementSchema>;
