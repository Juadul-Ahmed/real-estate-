"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Property } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import { ListingCard } from "@/components/listing-card";
import { RoleGuard } from "@/lib/role-guard";
import { InquiryList } from "@/components/inquiry-list";

function BuyerHome() {
  const { user } = useAuth();
  const [saved, setSaved] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const ids = user?.favorites || [];
    Promise.all(
      ids.map((fid) =>
        api.get<{ property: Property }>(`/properties/${fid}`).then((d) => d.property).catch(() => null)
      )
    )
      .then((list) => {
        if (active) setSaved(list.filter(Boolean) as Property[]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [user]);

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-12 bg-canvas text-title">
      <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
      <p className="text-muted">Browse listings, save favorites, and track your inquiries.</p>

      <div className="mt-8 grid md:grid-cols-3 gap-4">
        <div className="bg-surface border border-border rounded-xl p-5 card-hover">
          <p className="text-3xl font-bold text-title">{saved.length}</p>
          <p className="text-muted text-sm">Saved properties</p>
        </div>
        <a href="#inquiries" className="bg-surface border border-border rounded-xl p-5 hover:border-primary card-hover">
          <p className="text-3xl font-bold text-primary">My</p>
          <p className="text-muted text-sm">Inquiries &amp; messages</p>
        </a>
        <Link href="/listings" className="bg-surface border border-border rounded-xl p-5 hover:border-primary card-hover">
          <p className="text-3xl font-bold text-title">→</p>
          <p className="text-muted text-sm">Browse all listings</p>
        </Link>
      </div>

      <h2 className="text-xl font-semibold mt-10 mb-4">Saved Properties</h2>
      {loading ? (
        <p className="text-muted">Loading...</p>
      ) : saved.length === 0 ? (
        <p className="text-muted">No saved properties yet. <Link href="/listings" className="text-title underline">Browse listings</Link>.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {saved.map((p) => (
            <ListingCard key={p._id} property={p} />
          ))}
        </div>
      )}

      <div id="inquiries" className="mt-10">
        <h2 className="text-xl font-semibold mb-4">My Inquiries</h2>
        <InquiryList role="buyer" />
      </div>
    </div>
  );
}

export default function BuyerPage() {
  return (
    <RoleGuard roles={["buyer"]}>
      <BuyerHome />
    </RoleGuard>
  );
}
