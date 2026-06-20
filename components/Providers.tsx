"use client";

import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from "react";
import { Toaster } from "react-hot-toast";

interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: string;
  verified: boolean;
  avatar: string | null;
  grade?: string;
  house?: string;
  rating?: number;
  creditScore?: number;
}

interface SessionContextValue {
  user: SessionUser | null;
  loading: boolean;
  refresh: () => void;
}

const SessionContext = createContext<SessionContextValue>({
  user: null,
  loading: true,
  refresh: () => {},
});

export function useSession() {
  return useContext(SessionContext);
}

export default function Providers({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false);

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      setUser(data.user || null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // useRef guard prevents double-fetch in dev mode (StrictMode)
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    fetchUser();
  }, [fetchUser]);

  return (
    <SessionContext.Provider value={{ user, loading, refresh: fetchUser }}>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#1E3D1A",
            color: "#FEFDF9",
            border: "1px solid #2D5A27",
            borderRadius: "0.5rem",
            fontSize: "0.875rem",
          },
          success: {
            iconTheme: {
              primary: "#F4A340",
              secondary: "#1E3D1A",
            },
          },
          error: {
            iconTheme: {
              primary: "#DC2626",
              secondary: "#FEFDF9",
            },
          },
        }}
      />
      {children}
    </SessionContext.Provider>
  );
}
