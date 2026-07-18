"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { api, ApiError } from "@/lib/api";
import { RoleGuard } from "@/lib/role-guard";

function BrokerProfile() {
  const { user, refresh } = useAuth();
  const [form, setForm] = useState({ name: "", phone: "", bio: "" });
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || "", phone: user.phone || "", bio: user.bio || "" });
    }
  }, [user]);

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMsg("");
    setSaving(true);
    try {
      await api.put("/auth/profile", form);
      await refresh();
      setMsg("Profile updated successfully.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-12 bg-canvas text-title">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Broker Profile</h1>
          <p className="text-muted mt-1">Manage your public profile information</p>
        </div>
        <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${user.brokerApproved ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>
          {user.brokerApproved ? "Verified Broker" : "Pending Approval"}
        </span>
      </div>

      {user && !user.brokerApproved && (
        <div className="mb-6 bg-warning/10 border border-warning/20 rounded-xl px-6 py-4 text-sm text-warning">
          Your broker account is pending admin approval. Your listings will show as "pending" until approved.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-surface border border-border rounded-xl p-6 card-hover">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary mb-4">
                {initials}
              </div>
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-sm text-muted mt-1">{user.email}</p>
              <span className="mt-3 text-xs px-3 py-1 rounded-full bg-primary/10 text-title capitalize">{user.role}</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <form onSubmit={save} className="bg-surface border border-border rounded-xl p-6 space-y-5 card-hover">
            <h3 className="text-lg font-semibold border-b border-border pb-3">Profile Information</h3>

            {msg && (
              <div className="bg-success/10 border border-success/20 text-success rounded-lg px-4 py-3 text-sm">
                {msg}
              </div>
            )}
            {error && (
              <div className="bg-error/10 border border-error/20 text-error rounded-lg px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-title mb-1.5">Full Name</label>
                <input
                  className="w-full border border-border rounded-lg px-4 py-2.5 bg-canvas text-title focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-title mb-1.5">Phone</label>
                <input
                  className="w-full border border-border rounded-lg px-4 py-2.5 bg-canvas text-title focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-title mb-1.5">Bio</label>
              <textarea
                className="w-full border border-border rounded-lg px-4 py-2.5 bg-canvas text-title focus:ring-2 focus:ring-primary focus:border-primary transition-colors resize-none"
                rows={4}
                value={form.bio}
                onChange={(e) => set("bio", e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-3 bg-primary text-white rounded-full text-sm font-medium uppercase tracking-wide btn-interactive hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              {msg && (
                <span className="text-sm text-success">Changes saved</span>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return <RoleGuard roles={["broker"]}><BrokerProfile /></RoleGuard>;
}
