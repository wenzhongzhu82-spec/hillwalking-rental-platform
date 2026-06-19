// Shared in-memory token store for password reset and email verification.
// In production, replace with a proper database table (e.g., Token / VerificationToken).

type TokenRecord = {
  userId: string;
  email: string;
  expiresAt: Date;
};

const resetTokens = new Map<string, TokenRecord>();
const verificationTokens = new Map<string, TokenRecord>();

export function createResetToken(userId: string, email: string): string {
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  resetTokens.set(token, { userId, email, expiresAt });
  return token;
}

export function consumeResetToken(token: string): TokenRecord | null {
  const record = resetTokens.get(token);
  if (!record) return null;
  if (record.expiresAt < new Date()) {
    resetTokens.delete(token);
    return null;
  }
  resetTokens.delete(token);
  return record;
}

export function createVerificationToken(userId: string, email: string): string {
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  verificationTokens.set(token, { userId, email, expiresAt });
  return token;
}

export function consumeVerificationToken(token: string): TokenRecord | null {
  const record = verificationTokens.get(token);
  if (!record) return null;
  if (record.expiresAt < new Date()) {
    verificationTokens.delete(token);
    return null;
  }
  verificationTokens.delete(token);
  return record;
}
