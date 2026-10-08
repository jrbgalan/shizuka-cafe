import React from "react";
import { Link } from "react-router-dom";

export default function PageNotFound() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-zen-paper paper-grain px-6 text-center">
      <p className="font-jp text-sm tracking-[0.4em] text-zen-muted">迷いましたか</p>
      <h1 className="mt-4 font-heading text-7xl text-zen-charcoal md:text-9xl">404</h1>
      <p className="mt-6 max-w-md text-zen-muted">
        This page has wandered off — perhaps for a quiet cup. Let's find your way back.
      </p>
      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <Link to="/" className="bg-zen-charcoal px-7 py-3.5 text-xs uppercase tracking-[0.25em] text-zen-paper hover:bg-zen-espresso transition-colors">Return home</Link>
        <Link to="/shop" className="border border-zen-charcoal px-7 py-3.5 text-xs uppercase tracking-[0.25em] text-zen-charcoal hover:bg-zen-charcoal hover:text-zen-paper transition-colors">Visit the roastery</Link>
      </div>
    </section>
  );
}