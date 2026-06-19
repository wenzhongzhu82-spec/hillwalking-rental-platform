import Link from "next/link";
import { ShieldOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getSession } from "@/lib/session";

export default async function ForbiddenPage() {
  const session = await getSession();

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-cream px-4">
      <div className="w-full max-w-lg text-center">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-warning-light">
            <ShieldOff className="h-16 w-16 text-warning" />
          </div>
        </div>

        {/* 403 text */}
        <h1 className="bg-gradient-to-r from-warning via-accent to-accent-dark bg-clip-text text-8xl font-extrabold text-transparent sm:text-9xl">
          403
        </h1>

        {/* Title */}
        <h2 className="mt-4 text-2xl font-bold text-foreground sm:text-3xl">
          Access Denied
        </h2>

        {/* Description */}
        <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-muted-dark sm:text-lg">
          {session
            ? "You do not have permission to access this page. This may be because your account has not been verified yet, your role does not have access, or you are trying to view someone else's content."
            : "You don't have permission to access this page. This could be because you are not logged in, your account has not been verified yet, or you are trying to access someone else's content."}
        </p>

        {/* Contextual message */}
        <div className="mt-6 rounded-2xl border border-surface-dark bg-surface px-6 py-4">
          {!session ? (
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <ShieldOff className="h-5 w-5 flex-shrink-0 text-muted-light" />
              <p className="text-sm text-muted sm:text-base">
                Please log in to continue
              </p>
            </div>
          ) : !session.verified ? (
            <p className="text-sm text-muted sm:text-base">
              Your account is pending verification. Once an admin verifies your
              account, you will gain full access to the platform.
            </p>
          ) : (
            <p className="text-sm text-muted sm:text-base">
              If you believe this is a mistake, please contact the admin team at{" "}
              <span className="font-medium text-primary">
                hillwalking@scie.com.cn
              </span>
              .
            </p>
          )}
        </div>

        {/* Action buttons */}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          {session ? (
            <>
              <Link href="/">
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  Go Home
                </Button>
              </Link>
              <Link href="/marketplace">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Browse Marketplace
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Go Home
                </Button>
              </Link>
              <Link href="/api/auth/signin">
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  Login / Register
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Subtle footer decoration */}
        <div className="mt-16">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-light">
            <ShieldOff className="h-4 w-4" />
            <span>Hillwalking Rental</span>
            <span className="mx-1">&#183;</span>
            <span>SCIE Gear Exchange</span>
          </div>
        </div>
      </div>
    </div>
  );
}
