"use client";

import { useState } from "react";
import { api, ApiError } from "@/lib/api";
import { Property } from "@/lib/types";

export function PropertyForm({ initial, onDone }: { initial?: Property; onDone: () => void }) {
  const [form, setForm] = useState({
    title: initial?.title || "",
    type: initial?.type || "rent",
    category: initial?.category || "Apartment",
    price: initial?.price || 0,
    rentPrice: initial?.rentPrice || 0,
    city: initial?.city || "",
    address: initial?.address || "",
    bedrooms: initial?.bedrooms || 0,
    bathrooms: initial?.bathrooms || 0,
    area: initial?.area || 0,
    description: initial?.description || "",
    images: initial?.images || [] as string[],
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);

  const set = (k: keyof typeof form, v: string | number | string[]) => setForm((f) => ({ ...f, [k]: v }));
  const isEdit = !!initial;

  const toBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string).split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of files) {
        const base64 = await toBase64(file);
        const res = await api.upload("/upload", base64);
        urls.push(res.url);
      }
      setForm((f) => ({ ...f, images: [...f.images, ...urls] }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (url: string) => {
    setForm((f) => ({ ...f, images: f.images.filter((img) => img !== url) }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    const payload = {
      ...form,
      price: Number(form.price),
      rentPrice: Number(form.rentPrice) || undefined,
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      area: Number(form.area),
    };
    try {
      if (isEdit) await api.put(`/properties/${initial!._id}`, payload);
      else await api.post("/properties", payload);
      onDone();
    } catch (err) {
      if (err instanceof ApiError && err.errors) {
        const flat = err.errors as Record<string, unknown> | undefined;
        const msgs = (flat?.fieldErrors || flat?.formErrors || []) as unknown[];
        setError(Array.isArray(msgs) ? (msgs as string[]).join(", ") : "Validation failed");
      } else {
        setError(err instanceof Error ? err.message : "Save failed");
      }
    } finally {
      setBusy(false);
    }
  };

  const input = "w-full border border-border rounded-lg px-3 py-2 text-sm bg-canvas text-title placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary";
  const label = "block text-xs font-medium text-muted mb-1 uppercase tracking-widest";

  return (
    <form onSubmit={submit} className="bg-surface border border-border rounded-xl p-6 space-y-4 max-w-2xl card-hover">
      {error && <p className="text-error text-sm">{error}</p>}
      <div>
        <label className={label}>Title</label>
        <input required className={input} value={form.title} onChange={(e) => set("title", e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={label}>Type</label>
          <select className={input} value={form.type} onChange={(e) => set("type", e.target.value)}>
            <option value="rent">Rent</option>
            <option value="sale">Sale</option>
          </select>
        </div>
        <div>
          <label className={label}>Category</label>
          <input required className={input} value={form.category} onChange={(e) => set("category", e.target.value)} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={label}>Price (sale) / monthly (rent)</label>
          <input type="number" required min="1" className={input} value={form.price} onChange={(e) => set("price", e.target.value)} />
        </div>
        <div>
          <label className={label}>Rent price (optional)</label>
          <input type="number" min="0" className={input} value={form.rentPrice} onChange={(e) => set("rentPrice", e.target.value)} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={label}>City</label>
          <input required className={input} value={form.city} onChange={(e) => set("city", e.target.value)} />
        </div>
        <div>
          <label className={label}>Address</label>
          <input required className={input} value={form.address} onChange={(e) => set("address", e.target.value)} />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className={label}>Bedrooms</label>
          <input type="number" min="0" className={input} value={form.bedrooms} onChange={(e) => set("bedrooms", e.target.value)} />
        </div>
        <div>
          <label className={label}>Bathrooms</label>
          <input type="number" min="0" className={input} value={form.bathrooms} onChange={(e) => set("bathrooms", e.target.value)} />
        </div>
        <div>
          <label className={label}>Area (sqft)</label>
          <input type="number" min="0" className={input} value={form.area} onChange={(e) => set("area", e.target.value)} />
        </div>
      </div>
      <div>
        <label className={label}>Description</label>
        <textarea className={input} rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} />
      </div>
      <div>
        <label className={label}>Images</label>
        <input type="file" accept="image/*" multiple onChange={handleFiles} className="mb-2" disabled={uploading} />
        {uploading && <p className="text-xs text-muted mb-2">Uploading...</p>}
        {form.images.length > 0 && (
          <div className="flex gap-2 flex-wrap mt-2">
            {form.images.map((url, idx) => (
              <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-border">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeImage(url)} className="absolute top-1 right-1 bg-black/60 text-white text-xs px-1 rounded">✕</button>
              </div>
            ))}
          </div>
        )}
      </div>
      <button type="submit" disabled={busy} className={`px-4 py-2 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary-hover transition btn-interactive ${busy ? "btn-loading" : ""}`}>
        {busy ? (
          <span className="inline-flex items-center gap-2">
            <svg className="animate-spin-slow h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" />
              <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" />
            </svg>
            Saving...
          </span>
        ) : isEdit ? "Update Listing" : "Create Listing"}
      </button>
    </form>
  );
}
