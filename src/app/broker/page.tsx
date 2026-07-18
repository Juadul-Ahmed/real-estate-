"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Property } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import { RoleGuard } from "@/lib/role-guard";
import { formatPrice } from "@/lib/format";

function BrokerHome() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, inquiries: 0 });
  const [listings, setListings] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<{ total: number; pending: number; approved: number; inquiries: number }>("/properties/broker/stats"),
      api.get<{ properties: Property[] }>("/properties?owner=" + user?.id),
    ])
      .then(([s, l]) => {
        setStats(s);
        setListings(l.properties);
      })
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-12 bg-canvas text-title">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Broker Dashboard</h1>
          <p className="text-muted">Welcome, {user?.name}</p>
        </div>
        <Link href="/broker/listings/new" className="px-8 py-3.5 bg-primary text-white rounded-full text-sm font-medium uppercase tracking-wide btn-interactive hover:bg-primary-hover">
          + New Listing
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link href="/broker/listings" className="bg-surface border border-border rounded-xl p-5 card-hover block">
          <p className="text-3xl font-bold text-title">{stats.total}</p>
          <p className="text-muted text-sm">Listings</p>
        </Link>
        <div className="bg-surface border border-border rounded-xl p-5 card-hover">
          <p className="text-3xl font-bold text-title">{stats.approved}</p>
          <p className="text-muted text-sm">Approved</p>
        </div>
        <div className="bg-surface border border-border rounded-xl p-5 card-hover">
          <p className="text-3xl font-bold text-warning">{stats.pending}</p>
          <p className="text-muted text-sm">Pending</p>
        </div>
        <Link href="/broker/inquiries" className="bg-surface border border-border rounded-xl p-5 card-hover block">
          <p className="text-3xl font-bold text-primary">{stats.inquiries}</p>
          <p className="text-muted text-sm">Inquiries</p>
        </Link>
      </div>

      <h2 className="text-xl font-semibold mt-10 mb-4">My Listings</h2>
      {loading ? (
        <p className="text-muted">Loading...</p>
      ) : listings.length === 0 ? (
        <p className="text-muted">No listings yet.</p>
      ) : (
        <div className="space-y-3">
          {listings.map((p) => (
            <div key={p._id} className="bg-surface border border-border rounded-xl p-4 flex items-center justify-between card-hover">
              <div>
                <p className="font-semibold">{p.title}</p>
                <p className="text-sm text-muted">{formatPrice(p)} · {p.city}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-1 rounded-full ${p.status === "approved" ? "bg-success/10 text-success" : p.status === "pending" ? "bg-warning/10 text-warning" : "bg-error/10 text-error"}`}>
                  {p.status}
                </span>
                <Link href={`/broker/listings/${p._id}`} className="text-title text-sm hover:underline">Edit</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function BrokerPage() {
  return (
    <RoleGuard roles={["broker"]}>
      <BrokerHome />
    </RoleGuard>
  );
}
