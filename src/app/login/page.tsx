"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api";

function AuthSidebar() {
  const items = [
    { t: "Verified Listings", d: "Every property is reviewed by our admin team before going live." },
    { t: "Trusted Brokers", d: "Connect with licensed professionals who know your market." },
    { t: "Direct Messaging", d: "Chat with brokers or buyers directly through our secure platform." },
    { t: "Free to Browse", d: "Buyers can search and inquire at no cost." },
  ];
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-canvas flex-col justify-center p-10 ">
      <div>
          <Link href="/" className="text-2xl font-semibold text-title" style={{ fontFamily: "var(--font-display)" }}>
          EstateHub
        </Link>
        <div className="mt-12">
          <h2 className="text-3xl font-semibold text-title leading-tight" style={{ fontFamily: "var(--font-display)" }}>
            Find your next <span className="text-primary">chapter</span>
          </h2>
          <p className="mt-4 text-muted text-lg leading-relaxed max-w-md">
            Browse rentals and homes for sale. Connect with verified brokers. Listed by people you can trust.
          </p>
        </div>
        <div className="mt-10 space-y-5">
          {items.map((item) => (
            <div key={item.t} className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-primary text-lg">✓</span>
              </div>
              <div>
                <p className="font-semibold text-title">{item.t}</p>
                <p className="text-sm text-muted mt-0.5">{item.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const u = await login(email, password);
      if (u.role === "admin") router.push("/admin");
      else if (u.role === "broker") router.push("/broker");
      else router.push("/buyer");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Login failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-canvas text-title">
      <AuthSidebar />
      <div className="flex-1 flex items-center justify-center px-4 py-10 lg:w-1/2">
        <div className="w-full max-w-xl">
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="text-2xl font-semibold text-title" style={{ fontFamily: "var(--font-playfair)" }}>
              EstateHub
            </Link>
          </div>
          <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
          <p className="text-muted mb-6">Log in to your EstateHub account</p>
          <form onSubmit={submit} className="bg-surface rounded-xl p-6 space-y-4">
            {error && <p className="text-error text-sm">{error}</p>}
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Email</label>
              <input type="email" required className="w-full border border-border rounded-lg px-3 py-2 bg-canvas text-title focus:ring-2 focus:ring-primary" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Password</label>
              <input type="password" required className="w-full border border-border rounded-lg px-3 py-2 bg-canvas text-title focus:ring-2 focus:ring-primary" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit" disabled={busy} className="w-full px-8 py-3.5 bg-primary text-white rounded-full font-medium uppercase tracking-wide btn-interactive disabled:opacity-60 hover:bg-primary-hover">
              {busy ? "Logging in..." : "Log in"}
            </button>
          </form>
          <p className="text-center text-sm text-muted mt-6">
            No account? <Link href="/register" className="text-primary hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
