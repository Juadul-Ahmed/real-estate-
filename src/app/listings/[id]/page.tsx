"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api, ApiError } from "@/lib/api";
import { Property } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import { formatPrice } from "@/lib/format";

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user, refresh } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!id) return;
    api
      .get<{ property: Property }>(`/properties/${id}`)
      .then((d) => setProperty(d.property))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const fav = useMemo(
    () => !!(property && user?.favorites && user.favorites.includes(property._id)),
    [property, user]
  );

  const toggleFav = async () => {
    if (!user) return;
    try {
      await api.post(`/auth/favorites/${property!._id}`);
      refresh();
    } catch {
      /* ignore */
    }
  };

  const sendInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/inquiries", { propertyId: property!._id, message });
      setSent(true);
      setMessage("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to send inquiry");
    }
  };

  if (loading) return <div className="p-10 text-center text-muted">Loading...</div>;
  if (error && !property) return <div className="p-10 text-center text-red-600">{error}</div>;
  if (!property) return <div className="p-10 text-center text-muted">Property not found.</div>;

  const owner = typeof property.owner === "object" ? property.owner : null;

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 bg-canvas text-title">
      <Link href="/listings" className="text-title text-sm hover:underline">
        ← Back to listings
      </Link>

      <div className="mt-4 grid md:grid-cols-2 gap-6">
        <div>
          <img
            src={property.images?.[0] || "https://picsum.photos/seed/empty/600/400"}
            alt={property.title}
            className="w-full h-80 object-cover rounded-xl"
          />
          <div className="mt-3 grid grid-cols-3 gap-2">
            {property.images.slice(1, 4).map((img, i) => (
              <img key={i} src={img} alt="" className="h-24 w-full object-cover rounded-lg" />
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 text-xs font-semibold rounded ${property.type === "rent" ? "bg-primary text-white" : "bg-primary text-white"}`}>
              For {property.type === "rent" ? "Rent" : "Sale"}
            </span>
            <span className="text-xs text-muted/70">{property.category}</span>
          </div>
          <h1 className="text-2xl font-bold mt-2">{property.title}</h1>
          <p className="text-muted">{property.address}, {property.city}</p>
          <p className="text-3xl font-bold text-title mt-3">{formatPrice(property)}</p>

          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="bg-surface rounded-lg py-2 border border-border"><p className="font-semibold">{property.bedrooms}</p><p className="text-xs text-muted">Bedrooms</p></div>
            <div className="bg-surface rounded-lg py-2 border border-border"><p className="font-semibold">{property.bathrooms}</p><p className="text-xs text-muted">Bathrooms</p></div>
            <div className="bg-surface rounded-lg py-2 border border-border"><p className="font-semibold">{property.area}</p><p className="text-xs text-muted">sqft</p></div>
          </div>

          <p className="mt-4 text-title">{property.description || "No description provided."}</p>

          {user && (
            <button onClick={toggleFav} className="mt-4 px-8 py-3.5 border border-border rounded-full text-sm btn-interactive hover:bg-surface">
              {fav ? "★ Saved" : "☆ Save"}
            </button>
          )}

          <div className="mt-6 border-t pt-4 border-border">
            <h3 className="font-semibold mb-2">Contact Broker</h3>
            {owner && <p className="text-sm text-muted mb-2">Listed by {owner.name} {owner.phone ? `· ${owner.phone}` : ""}</p>}
            {!user && <p className="text-sm text-muted">Please <Link href="/login" className="text-title underline">log in</Link> to inquire.</p>}
            {user && user.role === "buyer" && (
              sent ? (
                <p className="text-title text-sm font-medium">Inquiry sent! Track it in My Space.</p>
              ) : (
                <form onSubmit={sendInquiry} className="space-y-2">
                  <textarea
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-canvas text-title focus:ring-2 focus:ring-primary"
                    rows={3}
                    placeholder="I'm interested in this property..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                  {error && <p className="text-red-600 text-sm">{error}</p>}
                  <button type="submit" className="px-8 py-3.5 bg-primary text-white rounded-full text-sm font-medium uppercase tracking-wide btn-interactive hover:bg-primary-hover">
                    Send Inquiry
                  </button>
                </form>
              )
            )}
            {user && user.role === "broker" && <p className="text-sm text-muted">Brokers cannot inquire on listings.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
