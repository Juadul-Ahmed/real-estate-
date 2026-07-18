"use client";

import { PropertyForm } from "@/components/property-form";
import { RoleGuard } from "@/lib/role-guard";

export default function NewListingPage() {
  return (
    <RoleGuard roles={["broker"]}>
      <div className="mx-auto max-w-5xl px-6 py-12 bg-canvas text-title">
        <h1 className="text-2xl font-bold mb-6">New Listing</h1>
        <PropertyForm onDone={() => (window.location.href = "/broker/listings")} />
      </div>
    </RoleGuard>
  );
}
