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

    const rows = await prisma.$queryRawUnsafe<
      { value: string }[]
    >(`SELECT value FROM _Session WHERE id = ? AND expiresAt > datetime('now')`, sessionId);

    if (!rows || rows.length === 0) return null;
    const data = JSON.parse(rows[0].value) as { userId: string };

    const user = await prisma.user.findUnique({
      where: { id: data.userId },
      select: {
        id: true, name: true, email: true, role: true,
        verified: true, avatar: true, grade: true, house: true,
        rating: true, creditScore: true,
      },
    });
    return user;
  } catch {
    return null;
  }
}

export async function createSession(userId: string): Promise<void> {
  const sessionId = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  try {
    await prisma.$executeRawUnsafe(
      `INSERT OR REPLACE INTO _Session (id, value, expiresAt) VALUES (?, ?, ?)`,
      sessionId, JSON.stringify({ userId }), expiresAt
    );
  } catch {
    // fallback: maybe table doesn't exist yet
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
    try { await prisma.$executeRawUnsafe(`DELETE FROM _Session WHERE id = ?`, sessionId); } catch {}
  }
  cookieStore.set(SESSION_COOKIE, "", { maxAge: 0, path: "/" });
}
