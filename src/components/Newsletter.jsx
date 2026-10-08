import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | error | done
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!ok) {
      setStatus("error");
      setError("Please enter a valid email address.");
      return;
    }
    setStatus("done");
    setError("");
  };

  return (
    <section className="bg-zen-surface">
      <div className="mx-auto max-w-3xl px-6 py-22 text-center md:py-30">
        <p className="label-eyebrow">Stay close</p>
        <h2 className="mt-4 font-heading text-4xl text-zen-charcoal md:text-5xl">Letters from the roastery</h2>
        <p className="mx-auto mt-5 max-w-xl text-zen-muted">
          A quiet note now and then — new harvests, seasonal drinks, and the occasional brewing guide. No noise.
        </p>

        {status === "done" ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            className="mt-10 flex items-center justify-center gap-2 text-zen-sage"
          >
            <Check className="h-5 w-5" strokeWidth={1.5} />
            <span className="font-heading text-xl">Thank you. Watch your inbox.</span>
          </motion.div>
        ) : (
          <form onSubmit={submit} className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row" noValidate>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
              placeholder="you@example.com"
              aria-label="Email address"
              className="flex-1 border border-zen-hairline bg-zen-paper px-4 py-3 text-sm focus:border-zen-charcoal focus:outline-none"
            />
            <button
              type="submit"
              className="bg-zen-charcoal px-6 py-3 text-xs uppercase tracking-[0.25em] text-zen-paper transition-colors hover:bg-zen-espresso"
            >
              Subscribe
            </button>
          </form>
        )}
        {status === "error" && <p className="mt-3 text-sm text-red-700">{error}</p>}
      </div>
    </section>
  );
}