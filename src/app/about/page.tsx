"use client";

import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="bg-canvas text-title">
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80"
          alt="Modern architecture"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30" />
        <div className="relative z-10 text-center px-6 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white leading-tight" style={{ fontFamily: "var(--font-display)" }}>
            About <span className="text-primary">EstateHub</span>
          </h1>
          <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
            Redefining the way people find, buy, and sell properties through trust, technology, and transparency.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-6" style={{ fontFamily: "var(--font-display)" }}>Our Story</h2>
          <div className="mx-auto w-12 h-0.5 bg-primary mb-8" />
          <p className="text-muted text-lg leading-relaxed mb-6">
            EstateHub was founded with a simple belief: finding a home should be exciting, not exhausting. Too many people struggle with outdated listings, unresponsive brokers, and a lack of transparency in the real estate process.
          </p>
          <p className="text-muted text-lg leading-relaxed">
            We built a platform that puts people first — verified listings, trusted brokers, and direct communication between buyers and sellers. Whether you&apos;re looking for your first apartment or your forever home, EstateHub is designed to make every step feel effortless.
          </p>
        </div>
      </section>

      <section className="bg-surface border-y border-border">
        <div className="mx-auto max-w-[1280px] px-6 py-20">
          <h2 className="text-3xl font-semibold text-center mb-4" style={{ fontFamily: "var(--font-display)" }}>What We Stand For</h2>
          <div className="mx-auto w-12 h-0.5 bg-primary mb-12" />
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { t: "Trust", d: "Every listing is reviewed and verified by our admin team. We don&apos;t publish anything we wouldn&apos;t stand behind." },
              { t: "Transparency", d: "No hidden fees, no fine print. Clear pricing, honest descriptions, and direct communication with brokers." },
              { t: "Community", d: "We connect buyers, brokers, and admins in one secure space. Relationships matter as much as transactions." },
            ].map((v) => (
              <div key={v.t} className="bg-canvas border border-border rounded-xl p-8 card-hover text-center">
                <h3 className="text-xl font-semibold text-title mb-3">{v.t}</h3>
                <p className="text-muted text-sm leading-relaxed">{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 py-20 text-center">
        <h2 className="text-3xl font-semibold mb-4" style={{ fontFamily: "var(--font-display)" }}>Ready to Get Started?</h2>
        <div className="mx-auto w-12 h-0.5 bg-primary mb-6" />
        <p className="text-muted max-w-xl mx-auto mb-10 text-lg">
          Join thousands of happy buyers and brokers. Your next chapter starts here.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/listings" className="px-8 py-3.5 bg-primary text-white rounded-full font-medium hover:bg-primary-hover transition btn-interactive shadow-sm">
            Browse Properties
          </Link>
          <Link href="/register" className="px-8 py-3.5 border-2 border-primary text-primary rounded-full font-medium hover:bg-primary hover:text-white transition btn-interactive">
            Create Free Account
          </Link>
        </div>
      </section>
    </div>
  );
}
