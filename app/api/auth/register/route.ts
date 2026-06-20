import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";
import { hashPassword } from "@/lib/auth";
import { registerRateLimit } from "@/lib/rate-limit";
import { createVerificationToken, storeVerificationToken } from "@/lib/token-store";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { name, email, password, grade, house } = parsed.data;

    // Rate limit by IP
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const rl = registerRateLimit(ip);
    if (!rl.success) {
      return Response.json(
        { error: "Too many registration attempts. Please try again later." },
        { status: 429 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return Response.json(
        { error: "Email is already registered" },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        grade: grade || "G1",
        house: house || "None",
        role: "USER",
        verified: false,
      },
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

    // Create email verification token and send verification email
    const token = createVerificationToken(user.id, user.email);
    await storeVerificationToken(token, user.id, user.email);
    const appUrl = request.nextUrl.origin;
    const emailResult = await sendVerificationEmail(user.email, token, appUrl);

    // In dev mode, include the token in the response so it can be used directly
    let devToken: string | undefined;
    if (!emailResult.success || emailResult.devPreview) {
      if (process.env.NODE_ENV === "development") {
        console.log("=== VERIFICATION LINK ===");
        console.log(`${appUrl}/verify-email?token=${token}`);
        console.log("=========================");
        devToken = token;
      }
    }

    return Response.json(
      { user, ...(devToken ? { devVerificationToken: devToken } : {}) },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
