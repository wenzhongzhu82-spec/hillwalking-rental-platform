import { Suspense } from "react";
import Link from "next/link";
import { Lock, Loader2, Mountain, ArrowLeft, CheckCircle, XCircle, Eye, EyeOff } from "lucide-react";
import ResetPasswordClient from "./ResetPasswordClient";

interface PageProps {
  searchParams: Promise<{ token?: string }>;
}

function ResetPasswordFallback() {
  return (
    <div className="bg-white rounded-xl border border-surface-dark p-8 text-center">
      <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
      <p className="text-sm text-muted mt-4">Validating reset link...</p>
    </div>
  );
}

function ResetPasswordForm({ token }: { token: string }) {
  return <ResetPasswordClient token={token} />;
}

export default async function ResetPasswordPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const token = params.token;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Mountain className="w-12 h-12 text-primary mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-foreground">Set New Password</h1>
          <p className="text-sm text-muted mt-1">
            {token
              ? "Choose a new password for your account"
              : "You need a valid reset token to continue"}
          </p>
        </div>

        <Suspense fallback={<ResetPasswordFallback />}>
          <ResetPasswordForm token={token ?? ""} />
        </Suspense>
      </div>
    </div>
  );
}
