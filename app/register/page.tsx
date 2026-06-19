"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mountain, Mail, Lock, User, School, Home, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { GRADES, HOUSES } from "@/lib/constants";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [grade, setGrade] = useState("G1");
  const [house, setHouse] = useState("None");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, confirmPassword, grade, house }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || data.details?.[0]?.message || "Registration failed");
        return;
      }
      toast.success("Account created! Please sign in.");
      router.push("/login");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Mountain className="w-12 h-12 text-primary mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-foreground">Join the Community</h1>
          <p className="text-sm text-muted mt-1">
            Anyone can register with any email — create your account to start renting gear
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-surface-dark p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-error-light text-error text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-surface-dark bg-surface text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-surface-dark bg-surface text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" required className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-surface-dark bg-surface text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repeat your password" required className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-surface-dark bg-surface text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
            </div>
          </div>

          {/* Grade & House */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Grade</label>
              <div className="relative">
                <School className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <select value={grade} onChange={(e) => setGrade(e.target.value)} className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-surface-dark bg-surface text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none">
                  {GRADES.map((g) => (<option key={g} value={g}>{g}</option>))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">House</label>
              <div className="relative">
                <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <select value={house} onChange={(e) => setHouse(e.target.value)} className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-surface-dark bg-surface text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none">
                  {HOUSES.map((h) => (<option key={h} value={h}>{h}</option>))}
                </select>
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-light disabled:opacity-50 transition-colors">
            {loading ? "Creating account..." : "Create Account"}
          </button>

          <p className="text-center text-sm text-muted">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
