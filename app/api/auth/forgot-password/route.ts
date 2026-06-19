import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { createResetToken } from "@/lib/token-store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string") {
      return Response.json({ success: true });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: { id: true, email: true },
    });

    // Always return success - don't reveal if user exists
    if (!user) {
      // Simulate delay to prevent timing attacks
      await new Promise((r) => setTimeout(r, 200));
      return Response.json({ success: true });
    }

    const token = createResetToken(user.id, user.email);

    // In dev, log the reset link
    if (process.env.NODE_ENV === "development") {
      const baseUrl = request.nextUrl.origin;
      console.log("=== FORGOT PASSWORD RESET LINK ===");
      console.log(`${baseUrl}/reset-password?token=${token}`);
      console.log("===================================");
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Forgot password error:", error);
    return Response.json({ success: true });
  }
}
