import { cookies } from "next/headers";
import { prisma } from "./prisma";

const SESSION_COOKIE = "hw_session";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  verified: boolean;
  avatar: string | null;
  grade: string | null;
  house: string | null;
  rating: number;
  creditScore: number;
};

export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
    if (!sessionId) return null;

    // Use Prisma model instead of raw SQL — works with both SQLite and PostgreSQL
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      select: { value: true, expiresAt: true },
    });

    if (!session) return null;
    if (session.expiresAt < new Date()) {
      // Clean up expired session
      try {
        await prisma.session.delete({ where: { id: sessionId } });
      } catch {
        /* ignore */
      }
      return null;
    }

    const data = JSON.parse(session.value) as { userId: string };

    const user = await prisma.user.findUnique({
      where: { id: data.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        verified: true,
        avatar: true,
        grade: true,
        house: true,
        rating: true,
        creditScore: true,
      },
    });
    return user;
  } catch {
    return null;
  }
}

export async function createSession(userId: string): Promise<void> {
  const sessionId = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  try {
    // Use upsert so it works with both SQLite and PostgreSQL
    await prisma.session.upsert({
      where: { id: sessionId },
      update: {
        value: JSON.stringify({ userId }),
        expiresAt,
      },
      create: {
        id: sessionId,
        value: JSON.stringify({ userId }),
        expiresAt,
      },
    });
  } catch {
    // fallback: session table may not exist yet
    console.error("Failed to create session — _Session table may be missing");
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  if (sessionId) {
    try {
      await prisma.session.delete({ where: { id: sessionId } });
    } catch {
      /* ignore */
    }
  }
  cookieStore.set(SESSION_COOKIE, "", { maxAge: 0, path: "/" });
}
