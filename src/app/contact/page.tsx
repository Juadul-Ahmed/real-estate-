"use client";

import { useState } from "react";
import { ApiError } from "@/lib/api";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [busy, setBusy] = useState(false);

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      setSuccess(true);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to send message");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-canvas text-title">
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80"
          alt="Office"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30" />
        <div className="relative z-10 text-center px-6 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white leading-tight" style={{ fontFamily: "var(--font-display)" }}>
            Contact <span className="text-primary">Us</span>
          </h1>
          <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
            Have a question or feedback? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-semibold mb-4" style={{ fontFamily: "var(--font-display)" }}>Get in Touch</h2>
            <div className="w-12 h-0.5 bg-primary mb-8" />
            <p className="text-muted text-lg leading-relaxed mb-10">
              Whether you&apos;re a buyer, broker, or just curious about EstateHub — our team is here to help. Fill out the form and we&apos;ll get back to you within 24 hours.
            </p>
            <div className="space-y-6">
              {[
                { t: "Email", d: "support@estatehub.com" },
                { t: "Phone", d: "+1 (555) 123-4567" },
                { t: "Office", d: "123 Market Street, Suite 400 San Francisco, CA 94105" },
              ].map((item) => (
                <div key={item.t} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary text-sm font-semibold">@</span>
                  </div>
                  <div>
                    <p className="font-semibold text-title text-sm uppercase tracking-widest">{item.t}</p>
                    <p className="text-muted text-sm mt-0.5">{item.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <form onSubmit={submit} className="bg-surface border border-border rounded-xl p-8 card-hover">
              {error && <p className="text-error text-sm mb-4">{error}</p>}
              {success && <p className="text-success text-sm mb-4">Thanks! We&apos;ll be in touch soon.</p>}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-muted mb-1 uppercase tracking-widest">Full Name</label>
                  <input required className="w-full border border-border rounded-lg px-4 py-2.5 bg-canvas text-title focus:outline-none focus:ring-2 focus:ring-primary" value={form.name} onChange={(e) => set("name", e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1 uppercase tracking-widest">Email</label>
                  <input type="email" required className="w-full border border-border rounded-lg px-4 py-2.5 bg-canvas text-title focus:outline-none focus:ring-2 focus:ring-primary" value={form.email} onChange={(e) => set("email", e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1 uppercase tracking-widest">Subject</label>
                  <input required className="w-full border border-border rounded-lg px-4 py-2.5 bg-canvas text-title focus:outline-none focus:ring-2 focus:ring-primary" value={form.subject} onChange={(e) => set("subject", e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1 uppercase tracking-widest">Message</label>
                  <textarea required rows={5} className="w-full border border-border rounded-lg px-4 py-2.5 bg-canvas text-title focus:outline-none focus:ring-2 focus:ring-primary resize-none" value={form.message} onChange={(e) => set("message", e.target.value)} />
                </div>
                <button type="submit" disabled={busy} className="w-full px-8 py-3.5 bg-primary text-white rounded-full font-medium uppercase tracking-wide btn-interactive hover:bg-primary-hover disabled:opacity-60">
                  {busy ? "Sending..." : "Send Message"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
