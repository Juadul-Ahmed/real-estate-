"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { User, Property, AnalyticsData } from "@/lib/types";
import { RoleGuard } from "@/lib/role-guard";
import { PropertyForm } from "@/components/property-form";
import Link from "next/link";
import { formatPrice } from "@/lib/format";

type Tab = "analytics" | "users" | "approvals" | "moderation" | "properties";

function AdminHome() {
  const [tab, setTab] = useState<Tab>("analytics");

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-12 bg-canvas text-title">
      <h1 className="text-2xl font-bold">Admin Console</h1>
      <div className="mt-4 flex gap-2 border-b border-border">
        {(["analytics", "users", "approvals", "moderation", "properties"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-8 py-3.5 text-sm font-medium capitalize btn-interactive ${tab === t ? "border-b-2 border-primary text-title" : "text-muted"}`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="mt-6">
        {tab === "analytics" && <Analytics />}
        {tab === "users" && <Users />}
        {tab === "approvals" && <Approvals />}
        {tab === "moderation" && <Moderation />}
        {tab === "properties" && <Properties />}
      </div>
    </div>
  );
}

interface AdminProperty {
  _id: string;
  title: string;
  city: string;
  status: string;
  owner: { name: string } | string;
}

function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.get<AnalyticsData>("/admin/analytics").then((d) => setData(d)).finally(() => setLoading(false));
  }, []);
  if (loading) return <p className="text-muted">Loading...</p>;
  if (!data) return null;

  const cards = [
    ["Users", data.users],
    ["Buyers", data.buyers],
    ["Brokers", data.brokers],
    ["Properties", data.properties],
    ["Approved", data.approved],
    ["Pending", data.pending],
    ["Rejected", data.rejected],
    ["Inquiries", data.inquiries],
    ["Messages", data.messages],
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map(([label, value]) => (
          <div key={label as string} className="bg-surface border border-border rounded-xl p-5 card-hover">
            <p className="text-3xl font-bold text-title">{value as number}</p>
            <p className="text-muted text-sm">{label as string}</p>
          </div>
        ))}
      </div>

      <div className="bg-surface border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-title mb-4">Property Status</h3>
        <PropertyStatusPie approved={data.approved} pending={data.pending} rejected={data.rejected} />
      </div>
    </div>
  );
}

function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const load = () => api.get<{ users: User[] }>("/admin/users").then((d) => setUsers(d.users)).finally(() => setLoading(false));
  useEffect(() => { void load(); }, []);

  const toggleApproval = async (u: User) => {
    await api.put(`/admin/users/${u.id}`, { brokerApproved: !u.brokerApproved });
    load();
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this user and their listings?")) return;
    await api.del(`/admin/users/${id}`);
    load();
  };

  if (loading) return <p className="text-muted">Loading...</p>;
  return (
    <div className="space-y-3">
      {users.map((u) => (
        <div key={u.id} className="bg-surface border border-border rounded-xl p-4 flex items-center justify-between card-hover">
          <div>
            <p className="font-semibold">{u.name} <span className="text-xs text-muted/70">({u.role})</span></p>
            <p className="text-sm text-muted">{u.email}</p>
          </div>
          <div className="flex items-center gap-3">
            {u.role === "broker" && (
              <button onClick={() => toggleApproval(u)} className={`text-xs px-2 py-1 rounded btn-interactive ${u.brokerApproved ? "bg-primary/20 text-title" : "bg-amber-100 text-amber-700"}`}>
                {u.brokerApproved ? "Approved" : "Approve"}
              </button>
            )}
            {u.role !== "admin" && <button onClick={() => remove(u.id)} className="text-red-600 text-sm hover:underline">Delete</button>}
          </div>
        </div>
      ))}
    </div>
  );
}

function Approvals() {
  const [props, setProps] = useState<AdminProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const load = () => api.get<{ properties: AdminProperty[] }>("/admin/properties/pending").then((d) => setProps(d.properties)).finally(() => setLoading(false));
  useEffect(() => { void load(); }, []);

  const setStatus = async (id: string, status: "approved" | "rejected") => {
    await api.put(`/admin/properties/${id}/status`, { status });
    load();
  };

  if (loading) return <p className="text-muted">Loading...</p>;
  if (props.length === 0) return <p className="text-muted">No pending listings.</p>;
  return (
    <div className="space-y-3">
      {props.map((p) => (
        <div key={p._id} className="bg-surface border border-border rounded-xl p-4 flex items-center justify-between card-hover">
          <div>
            <p className="font-semibold">{p.title}</p>
            <p className="text-sm text-muted">{p.city} · {typeof p.owner === "object" ? p.owner.name : ""}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setStatus(p._id, "approved")} className="px-6 py-2.5 bg-primary text-white rounded-full text-sm btn-interactive hover:bg-primary-hover">Approve</button>
            <button onClick={() => setStatus(p._id, "rejected")} className="px-6 py-2.5 bg-red-600 text-white rounded-full text-sm btn-interactive hover:bg-red-700">Reject</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function Moderation() {
  const [props, setProps] = useState<AdminProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const load = () => api.get<{ properties: AdminProperty[] }>("/properties").then((d) => setProps(d.properties)).finally(() => setLoading(false));
  useEffect(() => { void load(); }, []);

  const remove = async (id: string) => {
    if (!confirm("Delete this listing?")) return;
    await api.del(`/admin/properties/${id}`);
    load();
  };

  if (loading) return <p className="text-muted">Loading...</p>;
  return (
    <div className="space-y-3">
      {props.map((p) => (
        <div key={p._id} className="bg-surface border border-border rounded-xl p-4 flex items-center justify-between card-hover">
          <div>
            <p className="font-semibold">{p.title}</p>
            <p className="text-sm text-muted">{p.city} · {p.status}</p>
          </div>
          <button onClick={() => remove(p._id)} className="text-red-600 text-sm hover:underline">Delete</button>
        </div>
      ))}
    </div>
  );
}

function Properties() {
  const [listings, setListings] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const load = () => api.get<{ properties: Property[] }>("/properties").then((d) => setListings(d.properties)).finally(() => setLoading(false));
  useEffect(() => { void load(); }, []);

  const remove = async (id: string) => {
    if (!confirm("Delete this listing?")) return;
    await api.del(`/properties/${id}`);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">All Properties</h2>
        <button onClick={() => setShowForm(!showForm)} className="px-8 py-3.5 bg-primary text-white rounded-full text-sm font-medium uppercase tracking-wide btn-interactive hover:bg-primary-hover">
          {showForm ? "Cancel" : "+ Add Property"}
        </button>
      </div>

      {showForm && (
        <PropertyForm onDone={() => { setShowForm(false); load(); }} />
      )}

      {loading ? <p className="text-muted">Loading...</p> : listings.length === 0 ? <p className="text-muted">No properties yet.</p> : (
        <div className="space-y-3">
          {listings.map((p) => (
            <div key={p._id} className="bg-surface border border-border rounded-xl p-4 flex items-center justify-between card-hover">
              <div>
                <p className="font-semibold">{p.title}</p>
                <p className="text-sm text-muted">{formatPrice(p)} · {p.city} · {p.category}</p>
                <p className="text-xs text-muted/70 mt-1">
                  Owner: {typeof p.owner === "object" ? p.owner.name : p.owner} · Status: {p.status}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-1 rounded ${p.status === "approved" ? "bg-primary/20 text-title" : p.status === "pending" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>{p.status}</span>
                <Link href={`/broker/listings/${p._id}`} className="text-title text-sm hover:underline">Edit</Link>
                <button onClick={() => remove(p._id)} className="text-red-600 text-sm hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PropertyStatusPie({ approved, pending, rejected }: { approved: number; pending: number; rejected: number }) {
  const total = approved + pending + rejected;
  if (total === 0) return <p className="text-muted text-center py-8">No property data</p>;

  const slices = [
    { label: "Approved", value: approved, color: "#2d6a4f" },
    { label: "Pending", value: pending, color: "#c8a951" },
    { label: "Rejected", value: rejected, color: "#dc2626" },
  ];

  let currentAngle = -90;
  const cx = 50;
  const cy = 50;
  const r = 40;

  const polarToCartesian = (angleDeg: number) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  const paths = slices.map((slice) => {
    const pct = slice.value / total;
    const angle = pct * 360;
    const start = polarToCartesian(currentAngle);
    const end = polarToCartesian(currentAngle + angle);
    currentAngle += angle;
    const largeArc = angle > 180 ? 1 : 0;
    const d = pct >= 0.999
      ? `M ${cx} ${cy} m -${r}, 0 a ${r},${r} 0 1,0 ${r * 2},0 a ${r},${r} 0 1,0 -${r * 2},0`
      : `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
    return {
      ...slice,
      d,
      pct: (pct * 100).toFixed(1),
    };
  });

  return (
    <div className="flex flex-col md:flex-row items-center gap-8">
      <svg viewBox="0 0 100 100" className="w-64 h-64">
        {paths.map((p, i) => (
          <path key={i} d={p.d} fill={p.color} stroke="#fff" strokeWidth="0.5" />
        ))}
      </svg>
      <div className="space-y-3">
        {paths.map((p, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: p.color }} />
            <span className="text-sm text-title">{p.label}</span>
            <span className="text-sm text-muted">{p.value} ({p.pct}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <RoleGuard roles={["admin"]}>
      <AdminHome />
    </RoleGuard>
  );
}
