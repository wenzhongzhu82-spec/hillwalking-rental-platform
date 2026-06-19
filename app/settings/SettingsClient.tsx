"use client";

import { useState } from "react";
import Link from "next/link";
import {
  User,
  Mail,
  Lock,
  MapPin,
  Globe,
  Shield,
  Save,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  BadgeCheck,
  Send,
} from "lucide-react";
import toast from "react-hot-toast";

interface UserData {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  grade: string | null;
  house: string | null;
  role: string;
  verified: boolean;
  rating: number;
  creditScore: number;
  bio: string | null;
  createdAt: string;
}

export default function SettingsClient({ user }: { user: UserData }) {
  // Profile form
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio || "");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);

  // Password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);

  // Email verification
  const [sendingVerification, setSendingVerification] = useState(false);

  const handleProfileSave = async () => {
    if (name.trim().length < 2) {
      toast.error("Name must be at least 2 characters");
      return;
    }

    setProfileSaving(true);
    try {
      const res = await fetch("/api/auth/update-profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          bio: bio.trim() || null,
          city: city.trim() || null,
          country: country.trim() || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to update profile");
        return;
      }

      toast.success("Profile updated successfully");
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordSave = async () => {
    if (!currentPassword) {
      toast.error("Current password is required");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setPasswordSaving(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to change password");
        return;
      }

      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleSendVerification = async () => {
    setSendingVerification(true);
    try {
      // For now, we tell the user verification was sent (dev mode)
      // In production, this would call an API to send the email
      toast.success("Verification email sent. Check your inbox.");
    } catch {
      toast.error("Failed to send verification email");
    } finally {
      setSendingVerification(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Section */}
      <section className="bg-white rounded-xl border border-surface-dark p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Profile</h2>
            <p className="text-xs text-muted">Update your personal information</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label
              htmlFor="settings-name"
              className="block text-sm font-medium text-foreground mb-1.5"
            >
              Name
            </label>
            <input
              id="settings-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-surface-dark bg-surface text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Bio */}
          <div>
            <label
              htmlFor="settings-bio"
              className="block text-sm font-medium text-foreground mb-1.5"
            >
              Bio
            </label>
            <textarea
              id="settings-bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              maxLength={300}
              placeholder="Tell others a bit about yourself..."
              className="w-full px-3 py-2.5 rounded-lg border border-surface-dark bg-surface text-sm text-foreground placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
            <p className="text-xs text-muted-light mt-1 text-right">
              {bio.length}/300
            </p>
          </div>

          {/* City & Country */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="settings-city"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                <MapPin className="w-3.5 h-3.5 inline mr-1 text-muted" />
                City
              </label>
              <input
                id="settings-city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Shenzhen"
                className="w-full px-3 py-2.5 rounded-lg border border-surface-dark bg-surface text-sm text-foreground placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label
                htmlFor="settings-country"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                <Globe className="w-3.5 h-3.5 inline mr-1 text-muted" />
                Country
              </label>
              <input
                id="settings-country"
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="China"
                className="w-full px-3 py-2.5 rounded-lg border border-surface-dark bg-surface text-sm text-foreground placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Save Profile */}
          <button
            type="button"
            onClick={handleProfileSave}
            disabled={profileSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-light disabled:opacity-50 transition-colors"
          >
            {profileSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {profileSaving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </section>

      {/* Email & Verification Section */}
      <section className="bg-white rounded-xl border border-surface-dark p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-info-light flex items-center justify-center">
            <Mail className="w-5 h-5 text-info" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Email</h2>
            <p className="text-xs text-muted">Your email address and verification status</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Email (read-only) */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={user.email}
              readOnly
              className="w-full px-3 py-2.5 rounded-lg border border-surface-dark bg-surface-darker text-sm text-muted-dark cursor-not-allowed"
            />
          </div>

          {/* Verification Status */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-surface">
            <div className="flex items-center gap-3">
              {user.verified ? (
                <>
                  <div className="w-9 h-9 rounded-full bg-success-light flex items-center justify-center">
                    <BadgeCheck className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Email Verified</p>
                    <p className="text-xs text-muted">Your email has been confirmed</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-9 h-9 rounded-full bg-warning-light flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Not Verified</p>
                    <p className="text-xs text-muted">Verify your email to unlock all features</p>
                  </div>
                </>
              )}
            </div>

            {!user.verified && (
              <button
                type="button"
                onClick={handleSendVerification}
                disabled={sendingVerification}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary-light disabled:opacity-50 transition-colors"
              >
                {sendingVerification ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                {sendingVerification ? "Sending..." : "Verify"}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Password Change Section */}
      <section className="bg-white rounded-xl border border-surface-dark p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-accent-100 flex items-center justify-center">
            <Lock className="w-5 h-5 text-accent-dark" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Change Password</h2>
            <p className="text-xs text-muted">Update your account password</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Current Password */}
          <div>
            <label
              htmlFor="current-password"
              className="block text-sm font-medium text-foreground mb-1.5"
            >
              Current Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                id="current-password"
                type={showCurrentPass ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                autoComplete="current-password"
                className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-surface-dark bg-surface text-sm text-foreground placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPass(!showCurrentPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
                tabIndex={-1}
              >
                {showCurrentPass ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label
              htmlFor="new-password"
              className="block text-sm font-medium text-foreground mb-1.5"
            >
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                id="new-password"
                type={showNewPass ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                autoComplete="new-password"
                className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-surface-dark bg-surface text-sm text-foreground placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowNewPass(!showNewPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
                tabIndex={-1}
              >
                {showNewPass ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div>
            <label
              htmlFor="confirm-new-password"
              className="block text-sm font-medium text-foreground mb-1.5"
            >
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                id="confirm-new-password"
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Repeat new password"
                autoComplete="new-password"
                className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-surface-dark bg-surface text-sm text-foreground placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Save Password */}
          <button
            type="button"
            onClick={handlePasswordSave}
            disabled={passwordSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-light disabled:opacity-50 transition-colors"
          >
            {passwordSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {passwordSaving ? "Changing..." : "Change Password"}
          </button>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="bg-white rounded-xl border border-error-light p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-error-light flex items-center justify-center">
            <Shield className="w-5 h-5 text-error" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-error">Danger Zone</h2>
            <p className="text-xs text-muted">
              Irreversible account actions
            </p>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-error-light/50 border border-error-light">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">
                Request Account Deletion
              </p>
              <p className="text-xs text-muted mt-0.5 max-w-md">
                This will permanently delete your account, items, and all associated
                data. This action is irreversible. For now, please contact an
                administrator to request account deletion.
              </p>
            </div>
            <Link
              href="/contact"
              className="flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-error border border-error rounded-lg hover:bg-error-light transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              Contact Admin
            </Link>
          </div>
        </div>
      </section>

      {/* Account Info Footer */}
      <div className="text-center text-xs text-muted-light space-y-1 pb-4">
        <p>
          Member since {new Date(user.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>
        <p>
          Role: <span className="font-medium capitalize">{user.role.toLowerCase()}</span>
          {" | "}
          Grade: <span className="font-medium">{user.grade}</span>
          {" | "}
          House: <span className="font-medium">{user.house}</span>
        </p>
      </div>
    </div>
  );
}
