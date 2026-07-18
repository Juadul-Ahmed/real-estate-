"use client";

import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const link = (href: string, label: string) => {
    const active = pathname === href;
    return (
      <Link
        href={href}
        className={`px-3 py-2 text-sm font-medium transition-colors btn-interactive relative ${
          active ? "text-primary" : "text-muted hover:text-title"
        }`}
      >
        {label}
        {active && <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary" />}
      </Link>
    );
  };

  return (
    <header className="bg-canvas border-b border-border sticky top-0 z-50">
      <nav className="mx-auto max-w-[1280px] px-6 flex items-center justify-between h-20">
        <Link href="/" className="text-2xl font-semibold text-title" style={{ fontFamily: "var(--font-playfair)" }}>
          EstateHub
        </Link>

        <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {link("/", "Home")}
          {link("/listings", "Listings")}
          {link("/about", "About")}
          {link("/contact", "Contact")}
          {user?.role === "buyer" && link("/buyer", "My Space")}
          {user?.role === "broker" && link("/broker", "Broker")}
          {user?.role === "broker" && link("/broker/inquiries", "Inquiries")}
          {user?.role === "broker" && link("/broker/profile", "Broker Profile")}
          {user?.role === "admin" && link("/admin", "Admin")}
        </div>

        <div className="flex items-center gap-3">
          {!user && link("/login", "Login")}
          {!user && link("/register", "Sign up")}
          {user && (
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg text-sm font-medium text-error hover:bg-surface transition-colors btn-interactive"
            >
              Logout
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
