import { Suspense } from "react";
import Link from "next/link";
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { consumeVerificationToken } from "@/lib/token-store";

interface PageProps {
  searchParams: Promise<{ token?: string }>;
}

async function VerifyEmailContent({ token }: { token: string | undefined }) {
  if (!token) {
    return (
      <div className="bg-white rounded-xl border border-surface-dark p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-warning-light flex items-center justify-center mx-auto mb-4">
          <XCircle className="w-8 h-8 text-warning" />
        </div>
        <h2 className="text-lg font-semibold text-foreground mb-2">
          Missing Verification Token
        </h2>
        <p className="text-sm text-muted mb-6">
          No verification token was provided. Please check your email for the
          verification link or request a new one.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-light transition-colors"
        >
          Back to Sign In
        </Link>
      </div>
    );
  }

  // Try to consume the verification token
  const record = consumeVerificationToken(token);

  if (!record) {
    return (
      <div className="bg-white rounded-xl border border-surface-dark p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-error-light flex items-center justify-center mx-auto mb-4">
          <XCircle className="w-8 h-8 text-error" />
        </div>
        <h2 className="text-lg font-semibold text-foreground mb-2">
          Invalid or Expired Token
        </h2>
        <p className="text-sm text-muted mb-6 leading-relaxed">
          This verification link is no longer valid. It may have expired or already
          been used. Please request a new verification email.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-light transition-colors"
        >
          Request New Verification Link
        </Link>
      </div>
    );
  }

  // Token is valid - mark user as verified in the database
  try {
    await prisma.user.update({
      where: { id: record.userId },
      data: { verified: true },
    });
  } catch {
    // User might not exist anymore, but the token was valid
  }

  return (
    <div className="bg-white rounded-xl border border-surface-dark p-8 text-center">
      <div className="w-16 h-16 rounded-full bg-success-light flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="w-8 h-8 text-success" />
      </div>
      <h2 className="text-lg font-semibold text-foreground mb-2">
        Email Verified Successfully
      </h2>
      <p className="text-sm text-muted mb-6 leading-relaxed">
        Thank you for verifying your email address. Your account is now fully active
        and you can start using the platform.
      </p>
      <Link
        href="/login"
        className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-light transition-colors"
      >
        Continue to Sign In
      </Link>
    </div>
  );
}

function VerifyEmailFallback() {
  return (
    <div className="bg-white rounded-xl border border-surface-dark p-8 text-center">
      <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
      <p className="text-sm text-muted mt-4">Verifying your email...</p>
    </div>
  );
}

export default async function VerifyEmailPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-3">
            <Mail className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Verify Your Email</h1>
          <p className="text-sm text-muted mt-1">
            Confirm your email address to activate your account
          </p>
        </div>

        <Suspense fallback={<VerifyEmailFallback />}>
          <VerifyEmailContent token={params.token} />
        </Suspense>
      </div>
    </div>
  );
}
