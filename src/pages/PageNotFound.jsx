import React from "react";
import { Link } from "react-router-dom";
import SeigaihaBackground from "@/components/SeigaihaBackground";

export default function PageNotFound() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center bg-[#ECEBE1] px-6 text-center overflow-hidden">
      {/* Full sage variant Seigaiha background */}
      <SeigaihaBackground variant="sage" mask="none" />

      {/* Opaque rice-paper plate ensuring content sits clearly on plain paper */}
      <div className="relative z-10 max-w-lg rounded-3xl bg-zen-paper p-10 md:p-14 border border-zen-hairline/80 shadow-lg">
        <p className="font-jp text-sm tracking-[0.4em] text-zen-muted">迷いましたか</p>
        <h1 className="mt-4 font-heading text-7xl text-zen-charcoal md:text-8xl">404</h1>
        <p className="mt-6 text-zen-muted leading-relaxed">
          This page has wandered off — perhaps for a quiet cup. Let's find your way back.
        </p>
        <div className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:justify-center">
          <Link
            to="/"
            className="bg-zen-charcoal px-7 py-3.5 text-xs uppercase tracking-[0.25em] text-zen-paper hover:bg-zen-espresso transition-colors"
          >
            Return home
          </Link>
          <Link
            to="/shop"
            className="border border-zen-charcoal px-7 py-3.5 text-xs uppercase tracking-[0.25em] text-zen-charcoal hover:bg-zen-charcoal hover:text-zen-paper transition-colors"
          >
            Visit the roastery
          </Link>
        </div>
      </div>
    </section>
  );
}