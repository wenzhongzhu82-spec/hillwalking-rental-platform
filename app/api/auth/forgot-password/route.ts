import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { createResetToken, storeResetToken } from "@/lib/token-store";
import { passwordResetRateLimit } from "@/lib/rate-limit";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string") {
      return Response.json({ success: true });
    }

    // Rate limit by IP
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const rl = passwordResetRateLimit(ip);
    if (!rl.success) {
      return Response.json({ success: true });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true, email: true },
    });

    // Always return success - don't reveal if user exists
    if (!user) {
      // Simulate delay to prevent timing attacks
      await new Promise((r) => setTimeout(r, 200));
      return Response.json({ success: true });
    }

    const token = createResetToken(user.id, user.email);
    await storeResetToken(token, user.id, user.email);
    const appUrl = request.nextUrl.origin;

    // Attempt to send password reset email
    const emailResult = await sendPasswordResetEmail(user.email, token, appUrl);

    // In dev, log the reset link
    if (process.env.NODE_ENV === "development") {
      console.log("=== FORGOT PASSWORD RESET LINK ===");
      console.log(`${appUrl}/reset-password?token=${token}`);
      console.log("===================================");
    }

    // In dev without email configured, include the token in response
    let devToken: string | undefined;
    if (!emailResult.success || emailResult.devPreview) {
      if (process.env.NODE_ENV === "development") {
        devToken = token;
      }
    }

    return Response.json({
      success: true,
      ...(devToken ? { devResetToken: devToken } : {}),
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return Response.json({ success: true });
  }
}
