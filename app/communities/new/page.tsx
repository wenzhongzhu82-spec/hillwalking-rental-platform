"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { z } from "zod/v4";

const communitySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name too long"),
  type: z.enum(["SCHOOL", "CLUB", "CITY", "ORGANIZATION", "OTHER"]),
  description: z.string().max(1000).optional().or(z.literal("")),
  location: z.string().max(200).optional().or(z.literal("")),
});

interface FormErrors {
  name?: string;
  type?: string;
  description?: string;
  location?: string;
}

export default function NewCommunityPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [type, setType] = useState("OTHER");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [authChecking, setAuthChecking] = useState(true);

  // Check auth on mount
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (!data.user) {
          router.replace("/login?redirect=/communities/new");
        } else {
          setAuthChecking(false);
        }
      })
      .catch(() => {
        router.replace("/login?redirect=/communities/new");
      });
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");

    const parsed = communitySchema.safeParse({
      name,
      type,
      description: description || undefined,
      location: location || undefined,
    });

    if (!parsed.success) {
      const fieldErrors: FormErrors = {};
      parsed.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof FormErrors;
        if (path && !fieldErrors[path]) {
          fieldErrors[path] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const res = await fetch("/api/communities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error || "Failed to create community");
        return;
      }

      router.push(`/communities/${data.community.slug}`);
    } catch {
      setServerError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (authChecking) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/communities"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Communities
      </Link>

      <h1 className="text-2xl font-bold text-foreground mb-1">Create Community</h1>
      <p className="text-sm text-muted mb-8">
        Create a community to connect members and share gear locally
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {serverError && (
          <div className="bg-error-light text-error text-sm rounded-lg px-4 py-3">
            {serverError}
          </div>
        )}

        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">
            Community Name <span className="text-error">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Outdoor Adventure Club"
            className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          {errors.name && (
            <p className="text-error text-xs mt-1">{errors.name}</p>
          )}
        </div>

        {/* Type */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-foreground mb-1.5">
            Type <span className="text-error">*</span>
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="SCHOOL">School</option>
            <option value="CLUB">Club</option>
            <option value="CITY">City</option>
            <option value="ORGANIZATION">Organization</option>
            <option value="OTHER">Other</option>
          </select>
          {errors.type && (
            <p className="text-error text-xs mt-1">{errors.type}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-foreground mb-1.5">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what this community is about..."
            rows={4}
            className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y"
          />
          {errors.description && (
            <p className="text-error text-xs mt-1">{errors.description}</p>
          )}
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-foreground mb-1.5">
            Location
          </label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., Shenzhen"
            className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          {errors.location && (
            <p className="text-error text-xs mt-1">{errors.location}</p>
          )}
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
          >
            {submitting && (
              <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            )}
            Create Community
          </button>
          <Link
            href="/communities"
            className="px-6 py-2.5 border border-border text-foreground text-sm font-medium rounded-lg hover:bg-muted transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
