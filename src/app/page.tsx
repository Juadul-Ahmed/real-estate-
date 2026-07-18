"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Property } from "@/lib/types";
import { ListingCard } from "@/components/listing-card";
import { useAuth } from "@/lib/auth-context";

const features = [
  { t: "Verified Listings", d: "Every property is reviewed by our admin team before going live." },
  { t: "Trusted Brokers", d: "Connect with licensed professionals who know your market." },
  { t: "Smart Filters", d: "Find exactly what you need with price, location, and type filters." },
  { t: "Direct Messaging", d: "Chat with brokers or buyers directly through our secure platform." },
  { t: "Free to Browse", d: "Buyers can search and inquire at no cost." },
  { t: "Mobile Friendly", d: "Browse listings on any device, anywhere, anytime." },
];

const steps = [
  { t: "Create Account", d: "Sign up as a buyer, broker, or admin in seconds." },
  { t: "Search or List", d: "Browse properties or publish your own listings." },
  { t: "Connect & Close", d: "Message, schedule viewings, and finalize deals." },
];

const testimonials = [
  { n: "Sarah M.", r: "Buyer", q: "Found my dream apartment in under a week. The filters made it so easy!" },
  { n: "James K.", r: "Broker", q: "EstateHub helped me reach more buyers and manage inquiries efficiently." },
  { n: "Amina R.", r: "Buyer", q: "I love that every listing is verified. It made the whole process trustworthy." },
];

const faqs = [
  { q: "How do I list a property?", a: "Sign up as a broker, go to your dashboard, and click 'Add Property'. Fill in the details and submit for admin approval." },
  { q: "Is it free for buyers?", a: "Yes, browsing and inquiring about properties is completely free for buyers." },
  { q: "How are brokers verified?", a: "Admins review broker registrations and may request license details before approval." },
  { q: "Can I schedule a viewing?", a: "Yes, use the inquiry form on any property to request a viewing time with the broker." },
];

export default function HomePage() {
  const { user } = useAuth();
  const [featured, setFeatured] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    api
      .get<{ properties: Property[] }>("/properties?status=approved")
      .then((d) => setFeatured(d.properties.slice(0, 6)))
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false));
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
    setEmail("");
  };

  return (
    <div>
      <section className="relative bg-canvas overflow-hidden" style={{ minHeight: "70vh", maxHeight: "85vh" }}>
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center" style={{ minHeight: "70vh", maxHeight: "85vh" }}>
            <div className="py-12 lg:py-0 animate-fade-in-up">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.1] tracking-tight text-title" style={{ fontFamily: "var(--font-display)" }}>
                Find your next <span className="text-primary">chapter</span>
              </h1>
              <p className="mt-6 text-lg md:text-xl text-muted max-w-lg leading-relaxed">
                Browse rentals and homes for sale. Connect with verified brokers. Listed by people you can trust.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/listings" className="px-8 py-3.5 bg-primary text-white rounded-full font-medium hover:bg-primary-hover transition btn-interactive shadow-sm">
                  Browse Listings
                </Link>
                {!user && (
                  <Link href="/register" className="px-8 py-3.5 border-2 border-primary text-primary rounded-full font-medium hover:bg-primary hover:text-white transition btn-interactive">
                    Get Started
                  </Link>
                )}
              </div>
            </div>
            <div className="relative h-[300px] lg:h-[500px] rounded-2xl overflow-hidden animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <img
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"
                alt="Luxury home"
                className="w-full h-full object-cover animate-ken-burns"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      <section id="featured" className="mx-auto max-w-[1280px] px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-semibold text-title" style={{ fontFamily: "var(--font-display)" }}>Featured Properties</h2>
            <div className="mt-3 w-12 h-0.5 bg-primary" />
          </div>
          <Link href="/listings" className="text-primary font-medium hover:underline text-sm tracking-wide uppercase">
            View all
          </Link>
        </div>
        {loading ? (
          <p className="text-muted">Loading...</p>
        ) : featured.length === 0 ? (
          <p className="text-muted">No properties available yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featured.map((p, idx) => (
              <div key={p._id} className="animate-fade-in-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                <ListingCard property={p} />
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="bg-surface">
        <div className="mx-auto max-w-[1280px] px-6 py-20">
          <h2 className="text-3xl md:text-4xl font-semibold text-center text-title mb-4" style={{ fontFamily: "var(--font-display)" }}>Why EstateHub</h2>
          <div className="mx-auto w-12 h-0.5 bg-primary mb-6" />
          <p className="text-muted text-center max-w-2xl mx-auto mb-16 text-lg">
            We make renting and buying simpler, safer, and faster.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f) => (
              <div key={f.t} className="bg-canvas border border-border rounded-xl p-8 card-hover">
                <h3 className="font-semibold text-lg text-title mb-2">{f.t}</h3>
                <p className="text-muted text-sm leading-relaxed">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-semibold text-center text-title mb-4" style={{ fontFamily: "var(--font-display)" }}>Trusted by Thousands</h2>
        <div className="mx-auto w-12 h-0.5 bg-primary mb-6" />
        <p className="text-muted text-center max-w-2xl mx-auto mb-16 text-lg">
          Our community is growing fast. Here is what we have achieved together.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { v: "2,500+", l: "Properties Listed" },
            { v: "1,200+", l: "Happy Clients" },
            { v: "350+", l: "Verified Brokers" },
            { v: "98%", l: "Satisfaction Rate" },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <p className="text-4xl md:text-5xl font-semibold text-primary mb-2" style={{ fontFamily: "var(--font-display)" }}>{s.v}</p>
              <p className="text-sm text-muted tracking-wide uppercase">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-surface border-y border-border">
        <div className="mx-auto max-w-[1280px] px-6 py-20">
          <h2 className="text-3xl md:text-4xl font-semibold text-center text-title mb-4" style={{ fontFamily: "var(--font-display)" }}>How It Works</h2>
          <div className="mx-auto w-12 h-0.5 bg-primary mb-6" />
          <p className="text-muted text-center max-w-2xl mx-auto mb-16 text-lg">
            Getting started takes just a few minutes.
          </p>
          <div className="grid md:grid-cols-3 gap-12">
            {steps.map((s, i) => (
              <div key={s.t} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary text-white text-xl font-semibold mb-6" style={{ fontFamily: "var(--font-display)" }}>
                  {i + 1}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-title">{s.t}</h3>
                <p className="text-muted text-sm leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-semibold text-center text-title mb-4" style={{ fontFamily: "var(--font-display)" }}>What Our Users Say</h2>
        <div className="mx-auto w-12 h-0.5 bg-primary mb-6" />
        <p className="text-muted text-center max-w-2xl mx-auto mb-16 text-lg">
          Real stories from real people who found success with EstateHub.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div key={t.n} className="bg-surface border border-border rounded-xl p-8 card-hover">
              <p className="text-title text-sm mb-6 leading-relaxed">{"{t.q}"}</p>
              <div>
                <p className="font-semibold text-title">{t.n}</p>
                <p className="text-xs text-muted tracking-wide uppercase">{t.r}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-canvas">
        <div className="mx-auto max-w-[1280px] px-6 py-20">
          <h2 className="text-3xl md:text-4xl font-semibold text-center text-title mb-12" style={{ fontFamily: "var(--font-display)" }}>Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto grid gap-4">
            {faqs.map((f) => (
              <details key={f.q} className="bg-surface border border-border rounded-xl p-6 group">
                <summary className="font-semibold text-title cursor-pointer list-none flex items-center justify-between">
                  {f.q}
                  <span className="text-primary transition group-open:rotate-180">▼</span>
                </summary>
                <p className="text-muted text-sm mt-4 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 py-20">
        <div className="bg-surface border border-border rounded-2xl p-8 md:p-16 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-title mb-4" style={{ fontFamily: "var(--font-display)" }}>Stay in the Loop</h2>
          <div className="mx-auto w-12 h-0.5 bg-primary mb-6" />
          <p className="text-muted max-w-xl mx-auto mb-10 text-lg">
            Get the latest listings, market tips, and exclusive updates delivered to your inbox.
          </p>
          {subscribed ? (
            <p className="text-primary font-medium">Thanks for subscribing!</p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-5 py-3.5 rounded-lg border border-border bg-canvas text-title placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button type="submit" className="px-8 py-3.5 bg-primary text-white rounded-full font-medium hover:bg-primary-hover transition btn-interactive">
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>

      <section className="bg-surface border-t border-border">
        <div className="mx-auto max-w-[1280px] px-6 py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-title mb-4" style={{ fontFamily: "var(--font-display)" }}>Ready to Find Your Place?</h2>
          <div className="mx-auto w-12 h-0.5 bg-primary mb-6" />
          <p className="text-muted max-w-xl mx-auto mb-10 text-lg">
            Join thousands of happy buyers and brokers. Your next chapter starts here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/listings" className="px-8 py-3.5 bg-primary text-white rounded-full font-medium hover:bg-primary-hover transition btn-interactive shadow-sm">
              Browse Properties
            </Link>
            {!user && (
              <Link href="/register" className="px-8 py-3.5 border-2 border-primary text-primary rounded-full font-medium hover:bg-primary hover:text-white transition btn-interactive">
                Create Free Account
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
