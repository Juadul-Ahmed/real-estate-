"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Property } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import { RoleGuard } from "@/lib/role-guard";
import { formatPrice } from "@/lib/format";

function ManageListings() {
  const { user } = useAuth();
  const [listings, setListings] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    api.get<{ properties: Property[] }>("/properties?owner=" + user?.id).then((d) => setListings(d.properties)).finally(() => setLoading(false));
  };

  useEffect(load, [user]);

  const remove = async (id: string) => {
    if (!confirm("Delete this listing?")) return;
    await api.del(`/properties/${id}`);
    load();
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 bg-canvas text-title">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Listings</h1>
        <Link href="/broker/listings/new" className="px-8 py-3.5 bg-primary text-white rounded-full text-sm font-medium uppercase tracking-wide btn-interactive hover:bg-primary-hover">+ New Listing</Link>
      </div>
      {loading ? <p className="text-muted mt-4">Loading...</p> : listings.length === 0 ? <p className="text-muted mt-4">No listings yet.</p> : (
        <div className="mt-6 space-y-3">
          {listings.map((p) => (
            <div key={p._id} className="bg-surface border border-border rounded-xl p-4 flex items-center justify-between card-hover">
              <div>
                <p className="font-semibold">{p.title}</p>
                <p className="text-sm text-muted">{formatPrice(p)} · {p.city} · {p.category}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-1 rounded-full ${p.status === "approved" ? "bg-success/10 text-success" : p.status === "pending" ? "bg-warning/10 text-warning" : "bg-error/10 text-error"}`}>{p.status}</span>
                <Link href={`/broker/listings/${p._id}`} className="text-title text-sm hover:underline">Edit</Link>
                <button onClick={() => remove(p._id)} className="text-error text-sm hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Page() {
  return <RoleGuard roles={["broker"]}><ManageListings /></RoleGuard>;
}
