import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { consumeVerificationToken } from "@/lib/token-store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token || typeof token !== "string") {
      return Response.json({ error: "Token is required" }, { status: 400 });
    }

    const record = consumeVerificationToken(token);

    if (!record) {
      return Response.json(
        { error: "Token is invalid or has expired" },
        { status: 400 }
      );
    }

    // Mark user as verified
    await prisma.user.update({
      where: { id: record.userId },
      data: { verified: true },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Verify email error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
