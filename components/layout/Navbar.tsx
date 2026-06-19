"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mountain, Menu, X, ChevronDown, User, LayoutDashboard, Package, ClipboardList, Heart, LogOut, MessageSquare, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/lib/store";

interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: string;
  verified: boolean;
  avatar: string | null;
}

export default function Navbar() {
  const router = useRouter();
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useUIStore();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          setIsLoggedIn(true);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setIsLoggedIn(false);
    setUser(null);
    router.push("/");
  };

  const navLinks = [
    { href: "/marketplace", label: "Marketplace" },
    { href: "/hillwalking", label: "Hillwalking Checklist" },
    { href: "/rent-before-event", label: "Rent Before Event" },
    { href: "/messages", label: "Messages", icon: MessageSquare },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-surface-dark shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-primary hover:text-primary-light transition-colors"
            onClick={closeMobileMenu}
          >
            <Mountain className="w-7 h-7" />
            <span className="text-lg font-bold tracking-tight">Hillwalking Rental</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-muted-dark hover:text-primary rounded-lg hover:bg-primary-50 transition-colors"
              >
                {link.icon && <link.icon className="w-4 h-4" />}
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn && user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-surface transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      user.name?.charAt(0).toUpperCase() || "U"
                    )}
                  </div>
                  <ChevronDown className={cn("w-4 h-4 text-muted transition-transform", isDropdownOpen && "rotate-180")} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-surface-dark shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2 border-b border-surface-dark">
                      <p className="text-sm font-medium text-foreground">{user.name}</p>
                      <p className="text-xs text-muted">{user.email}</p>
                      {user.role === "ADMIN" && (
                        <span className="inline-flex items-center gap-1 mt-1 text-xs text-accent-dark font-medium">
                          <ShieldCheck className="w-3 h-3" />
                          Admin
                        </span>
                      )}
                    </div>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-muted-dark hover:bg-surface transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <Link
                      href="/my-items"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-muted-dark hover:bg-surface transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Package className="w-4 h-4" />
                      My Items
                    </Link>
                    <Link
                      href="/orders"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-muted-dark hover:bg-surface transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <ClipboardList className="w-4 h-4" />
                      Orders
                    </Link>
                    <Link
                      href="/favorites"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-muted-dark hover:bg-surface transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Heart className="w-4 h-4" />
                      Favorites
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-error hover:bg-error-light transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-primary hover:bg-primary-50 rounded-lg transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-light rounded-lg transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg text-muted-dark hover:bg-surface transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-surface-dark bg-white animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-muted-dark hover:text-primary hover:bg-primary-50 rounded-lg transition-colors"
                onClick={closeMobileMenu}
              >
                {link.icon && <link.icon className="w-4 h-4" />}
                {link.label}
              </Link>
            ))}
          </div>
          <div className="px-4 py-3 border-t border-surface-dark">
            {isLoggedIn && user ? (
              <div className="space-y-1">
                <div className="flex items-center gap-2 px-3 py-2">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted">{user.email}</p>
                  </div>
                </div>
                <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2.5 text-sm text-muted-dark hover:bg-surface rounded-lg" onClick={closeMobileMenu}>
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
                <Link href="/my-items" className="flex items-center gap-2 px-3 py-2.5 text-sm text-muted-dark hover:bg-surface rounded-lg" onClick={closeMobileMenu}>
                  <Package className="w-4 h-4" /> My Items
                </Link>
                <Link href="/orders" className="flex items-center gap-2 px-3 py-2.5 text-sm text-muted-dark hover:bg-surface rounded-lg" onClick={closeMobileMenu}>
                  <ClipboardList className="w-4 h-4" /> Orders
                </Link>
                <Link href="/favorites" className="flex items-center gap-2 px-3 py-2.5 text-sm text-muted-dark hover:bg-surface rounded-lg" onClick={closeMobileMenu}>
                  <Heart className="w-4 h-4" /> Favorites
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-error hover:bg-error-light rounded-lg">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2.5 text-center text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary-50 transition-colors"
                  onClick={closeMobileMenu}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2.5 text-center text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-light transition-colors"
                  onClick={closeMobileMenu}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
