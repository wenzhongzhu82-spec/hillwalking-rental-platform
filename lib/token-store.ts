// Token store backed by Prisma VerificationToken model.
// Works with both SQLite and PostgreSQL — survives server restarts.

import { prisma } from "./prisma";

type TokenRecord = {
  userId: string;
  email: string;
};

export function createResetToken(userId: string, email: string): string {
  // We use a DB-backed VerificationToken model instead of in-memory Map.
  // Return the token synchronously (the caller is responsible for storing it).
  return crypto.randomUUID();
}

export async function storeResetToken(
  token: string,
  userId: string,
  email: string
): Promise<void> {
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  await prisma.verificationToken.create({
    data: {
      identifier: `reset:${email}`,
      token,
      expires,
    },
  });
}

export function createVerificationToken(userId: string, email: string): string {
  return crypto.randomUUID();
}

export async function storeVerificationToken(
  token: string,
  userId: string,
  email: string
): Promise<void> {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  await prisma.verificationToken.create({
    data: {
      identifier: `verify:${email}`,
      token,
      expires,
    },
  });
}

export async function consumeVerificationToken(
  token: string
): Promise<TokenRecord | null> {
  const record = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!record) return null;
  if (record.expires < new Date()) {
    // Expired — clean up
    await prisma.verificationToken.delete({ where: { token } }).catch(() => {});
    return null;
  }

  // Valid — delete (consume) the token
  await prisma.verificationToken.delete({ where: { token } }).catch(() => {});

  // Extract userId from identifier: "verify:email@example.com"
  const email = record.identifier.replace(/^(reset|verify):/, "");
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true },
  });

  if (!user) return null;
  return { userId: user.id, email: user.email };
}

export async function consumeResetToken(
  token: string
): Promise<TokenRecord | null> {
  const record = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!record) return null;
  if (record.expires < new Date()) {
    await prisma.verificationToken.delete({ where: { token } }).catch(() => {});
    return null;
  }

  // Valid — delete (consume) the token
  await prisma.verificationToken.delete({ where: { token } }).catch(() => {});

  const email = record.identifier.replace(/^(reset|verify):/, "");
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true },
  });

  if (!user) return null;
  return { userId: user.id, email: user.email };
}
