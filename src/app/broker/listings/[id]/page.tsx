"use client";

import { useParams } from "next/navigation";
import { PropertyForm } from "@/components/property-form";
import { RoleGuard } from "@/lib/role-guard";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import { Property } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";

function EditListing() {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    api.get<{ property: Property }>(`/properties/${id}`).then((d) => setProperty(d.property)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-10 text-center text-muted">Loading...</div>;
  if (!property) return <div className="p-10 text-center text-muted">Not found</div>;

  const redirect = user?.role === "admin" ? "/admin" : "/broker/listings";

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 bg-canvas text-title">
      <h1 className="text-2xl font-bold mb-6">Edit Listing</h1>
      <PropertyForm initial={property} onDone={() => (window.location.href = redirect)} />
    </div>
  );
}

export default function Page() {
  return (
    <RoleGuard roles={["broker", "admin"]}>
      <EditListing />
    </RoleGuard>
  );
}
