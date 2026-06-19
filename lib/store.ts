"use client";

import { create } from "zustand";

export interface AuthUser {
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

interface UIStore {
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
}

interface AuthStore {
  user: AuthUser | null;
  isLoading: boolean;
  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

export const useUIStore = create<UIStore>((set) => ({
  isMobileMenuOpen: false,
  toggleMobileMenu: () =>
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  viewMode: "grid",
  setViewMode: (mode) => set({ viewMode: mode }),
}));

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
  logout: async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    set({ user: null, isLoading: false });
  },
  refresh: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      set({ user: data.user || null, isLoading: false });
    } catch {
      set({ user: null, isLoading: false });
    }
  },
}));
