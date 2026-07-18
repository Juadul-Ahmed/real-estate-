"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Role } from "@/lib/types";

export function RoleGuard({ roles, children }: { roles: Role[]; children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
    } else if (!roles.includes(user.role)) {
      router.replace("/");
    }
  }, [loading, user, router, roles]);

  if (loading) return <div className="p-10 text-center text-gray-500">Loading...</div>;
  if (!user || !roles.includes(user.role)) return null;
  return <>{children}</>;
}
