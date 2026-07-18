"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { Property, PaginatedProperties } from "@/lib/types";
import { ListingCard } from "@/components/listing-card";

export default function ListingsPage() {
  return (
    <Suspense fallback={<p className="mx-auto max-w-[1280px] px-6 py-8 text-muted">Loading...</p>}>
      <ListingsContent />
    </Suspense>
  );
}

function ListingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [type, setType] = useState(searchParams.get("type") || "");
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [bedrooms, setBedrooms] = useState(searchParams.get("bedrooms") || "");

  function buildQuery(pageNum: number) {
    const params = new URLSearchParams();
    params.set("status", "approved");
    if (type) params.set("type", type);
    if (city) params.set("city", city);
    if (category) params.set("category", category);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (bedrooms) params.set("bedrooms", bedrooms);
    if (pageNum > 1) params.set("page", String(pageNum));
    params.set("limit", "9");
    return params.toString();
  }

  function loadPage(pageNum: number) {
    setLoading(true);
    setPage(pageNum);
    const q = buildQuery(pageNum);
    router.push(`/listings?${q}`);
    api
      .get<PaginatedProperties>(`/properties?${q}`)
      .then((d) => {
        setProperties(d.properties);
        setTotalPages(d.totalPages);
        setTotal(d.total);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }

  function apply() {
    loadPage(1);
  }

  useEffect(() => {
    const q = buildQuery(page);
    api
      .get<PaginatedProperties>(`/properties?${q}`)
      .then((d) => {
        setProperties(d.properties);
        setTotalPages(d.totalPages);
        setTotal(d.total);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const input = "w-full border border-border rounded-lg px-3 py-2 text-sm bg-canvas text-title focus:outline-primary focus:ring-2 focus:ring-primary";
  const label = "block text-xs font-medium text-muted mb-1";

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-12 bg-canvas text-title">
      <h1 className="text-2xl font-bold mb-6">Browse Properties</h1>

      <div className="bg-surface rounded-xl border border-border p-4 mb-6 grid grid-cols-2 md:grid-cols-6 gap-3 items-end card-hover">
        <div>
          <label className={label}>Type</label>
          <select className={input} value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">All</option>
            <option value="rent">Rent</option>
            <option value="sale">Sale</option>
          </select>
        </div>
        <div>
          <label className={label}>City</label>
          <input className={input} value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. New York" />
        </div>
        <div>
          <label className={label}>Category</label>
          <input className={input} value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Apartment" />
        </div>
        <div>
          <label className={label}>Min Price</label>
          <input className={input} type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
        </div>
        <div>
          <label className={label}>Max Price</label>
          <input className={input} type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
        </div>
        <div>
          <label className={label}>Bedrooms</label>
          <input className={input} type="number" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} />
        </div>
        <div className="col-span-2 md:col-span-6 flex gap-2">
          <button onClick={apply} className="px-8 py-3.5 bg-primary text-white rounded-full text-sm font-medium uppercase tracking-wide btn-interactive hover:bg-primary-hover">
            Apply Filters
          </button>
          <button
            onClick={() => {
              setType(""); setCity(""); setCategory(""); setMinPrice(""); setMaxPrice(""); setBedrooms("");
              loadPage(1);
            }}
            className="px-8 py-3.5 border border-border rounded-full text-sm font-medium btn-interactive hover:bg-surface"
          >
            Reset
          </button>
        </div>
      </div>

      {error && <p className="text-error mb-4">{error}</p>}
      {loading ? (
        <p className="text-muted">Loading...</p>
      ) : properties.length === 0 ? (
        <p className="text-muted">No properties match your filters.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((p) => (
              <ListingCard key={p._id} property={p} />
            ))}
          </div>

          <div className="mt-10 flex items-center justify-between">
            <p className="text-sm text-muted">
              Showing {properties.length} of {total} properties
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => loadPage(page - 1)}
                disabled={page <= 1}
                className="px-5 py-2.5 border border-border rounded-full text-sm font-medium btn-interactive hover:bg-surface disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-muted">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => loadPage(page + 1)}
                disabled={page >= totalPages}
                className="px-5 py-2.5 border border-border rounded-full text-sm font-medium btn-interactive hover:bg-surface disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
