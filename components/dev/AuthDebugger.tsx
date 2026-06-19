"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: string;
  verified: boolean;
  avatar: string | null;
  grade: string;
  house: string;
  rating: number;
  creditScore: number;
}

export default function AuthDebugger() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => { setUser(d.user); setLoading(false); })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white shadow-lg rounded-xl p-4 border text-xs font-mono max-w-sm">
      <p className="font-bold mb-1">Auth Debug</p>
      {loading && <p className="text-muted">Loading session...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {user ? (
        <>
          <p className="text-green-700">✅ {user.name} ({user.role})</p>
          <p className="text-muted">{user.email} · {user.grade} · {user.house}</p>
          <p className="text-muted">Verified: {String(user.verified)} · Score: {user.creditScore}</p>
          <Link href="/admin" className="text-primary underline">Admin?</Link>
        </>
      ) : !loading && (
        <>
          <p className="text-orange-600">Not logged in</p>
          <Link href="/login" className="text-primary underline">Login</Link>
        </>
      )}
    </div>
  );
}
