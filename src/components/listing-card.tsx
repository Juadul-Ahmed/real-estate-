import Link from "next/link";
import { Property } from "@/lib/types";

const fallback = "https://picsum.photos/seed/empty/600/400";

export function ListingCard({ property }: { property: Property }) {
  const img = property.images?.[0] || fallback;
  const ownerName = typeof property.owner === "object" ? property.owner.name : "Broker";
  return (
    <Link
      href={`/listings/${property._id}`}
      className="group block bg-canvas border border-border rounded-xl overflow-hidden card-hover"
    >
      <div className="relative h-52 bg-surface">
        <img src={img} alt={property.title} className="w-full h-full object-cover property-card-image" />
        <span
          className={`absolute top-4 left-4 px-3 py-1 text-xs font-medium rounded-full ${
            property.type === "rent" ? "bg-primary text-white" : "bg-title text-white"
          }`}
        >
          For {property.type === "rent" ? "Rent" : "Sale"}
        </span>
        {property.status === "pending" && (
          <span className="absolute top-4 right-4 px-3 py-1 text-xs font-medium rounded-full bg-warning text-white">
            Pending
          </span>
        )}
      </div>
      <div className="p-6">
        <h3 className="font-semibold text-lg text-title mb-1 truncate">{property.title}</h3>
        <p className="text-sm text-muted mb-3">
          {property.city} · {property.category}
        </p>
        <div className="flex items-center justify-between">
          <p className="text-2xl font-semibold text-primary" style={{ fontFamily: "var(--font-display)" }}>
            ${property.type === "rent" ? `${property.rentPrice || property.price}/mo` : property.price.toLocaleString()}
          </p>
          <p className="text-xs text-muted">
            {property.bedrooms}bd · {property.bathrooms}ba
          </p>
        </div>
        <p className="mt-2 text-xs text-muted">by {ownerName}</p>
      </div>
    </Link>
  );
}
