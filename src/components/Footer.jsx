import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { site, navLinks, currencies, languages } from "@/data/site";
import { PAYMENT_METHODS } from "@/components/PaymentIcons";
import { useCurrency } from "@/context/CurrencyContext";

function Dropdown({ label, value, options, onSelect }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 border border-zen-hairline px-3 py-2 text-xs text-zen-muted transition-colors hover:text-zen-charcoal min-h-[44px]"
      >
        <span className="tracking-[0.18em] uppercase">{label}</span>
        <span className="text-zen-charcoal">{value}</span>
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute bottom-full left-0 z-20 mb-2 min-w-[180px] border border-zen-hairline bg-zen-paper py-1 shadow-sm">
            {options.map((o) => (
              <button
                key={o.value}
                onClick={() => { onSelect(o.value); setOpen(false); }}
                className="block w-full px-3 py-2 text-left text-xs text-zen-muted transition-colors hover:bg-zen-surface hover:text-zen-charcoal"
              >
                {o.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const footerNav = navLinks.slice(1); // About through Contact

export default function Footer() {
  const { currency, setCurrency } = useCurrency();

  return (
    <footer className="mt-30">
      {/* Arrow-link strip above the dark footer */}
      <div className="border-y border-zen-hairline bg-zen-paper">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-5 py-8 md:flex-row md:items-center md:justify-between md:px-10">
          <Link to="/visit" className="label-eyebrow link-underline text-zen-charcoal">View more →</Link>
          <a href={`tel:${site.phone}`} className="label-eyebrow link-underline text-zen-charcoal">Contact {site.phoneDisplay} →</a>
          <a href={`mailto:${site.email}`} className="label-eyebrow link-underline text-zen-charcoal">{site.email} →</a>
        </div>
      </div>

      {/* TOP FOOTER — espresso brown, three columns */}
      <div className="bg-zen-espresso text-zen-paper">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 divide-y divide-zen-paper/10 md:grid-cols-3 md:divide-x md:divide-y-0">
          <div className="px-6 py-12 md:px-10">
            <p className="label-eyebrow text-zen-clay">Hours</p>
            <div className="mt-5 space-y-2">
              {site.hours.map((h) => (
                <div key={h.day} className="flex items-baseline justify-between gap-4">
                  <span className="text-sm text-zen-paper/80">{h.day}</span>
                  <span className="font-heading text-lg text-zen-paper">{h.time}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-zen-paper/50">Last orders thirty minutes before close.</p>
          </div>

          <div className="px-6 py-12 md:px-10">
            <p className="label-eyebrow text-zen-clay">Location</p>
            <p className="mt-5 font-heading text-2xl leading-snug text-zen-paper">
              {site.address.line1}<br />{site.address.city}
            </p>
            <p className="mt-3 text-sm text-zen-paper/60">{site.address.region}, {site.address.country}</p>
          </div>

          <div className="px-6 py-12 md:px-10">
            <p className="label-eyebrow text-zen-clay">Contact</p>
            <div className="mt-5 space-y-3">
              <a href={`tel:${site.phone}`} className="block font-heading text-lg text-zen-paper link-underline w-fit">{site.phoneDisplay}</a>
              <a href={`mailto:${site.email}`} className="block text-sm text-zen-paper/70 link-underline w-fit">{site.email}</a>
            </div>
            <div className="mt-6 flex gap-5">
              {site.socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="label-eyebrow text-zen-paper/70 hover:text-zen-paper link-underline">
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* darker band: brand wordmark on left, nav links on right in line with tagline */}
        <div className="border-t border-zen-paper/10 bg-black/20">
          <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-6 py-10 md:flex-row md:items-end md:justify-between md:px-10 md:py-16">
            <div>
              <h2
                className="font-heading font-light uppercase text-zen-paper/90"
                style={{ fontSize: "clamp(1.125rem, 1.5vw, 1.5rem)", letterSpacing: "0.14em", lineHeight: 1.3 }}
              >
                SHIZUKA CAFÉ COFFEE ROASTERY
              </h2>
              <p
                className="mt-2 uppercase text-zen-muted"
                style={{ fontSize: "10px", letterSpacing: "0.22em", lineHeight: 1.4 }}
              >
                {site.tagline.toUpperCase()}
              </p>
            </div>

            {/* Nav links on the right side, in line with the tagline on desktop */}
            <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 pb-0.5">
              {footerNav.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="label-eyebrow text-zen-paper/75 hover:text-zen-paper link-underline transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* LOWER FOOTER — light, clean */}
      <div className="bg-zen-surface text-zen-charcoal">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <div className="hairline h-px w-full" />
        </div>

        {/* Dropdowns + payment badges */}
        <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-6 px-6 py-8 md:flex-row md:items-center md:justify-between md:px-10">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Dropdown
              label="Country / Region"
              value={`${currencies.find((c) => c.code === currency).label} | ${currency} ${currencies.find((c) => c.code === currency).symbol}`}
              options={currencies.map((c) => ({ value: c.code, label: `${c.label} | ${c.code} ${c.symbol}` }))}
              onSelect={setCurrency}
            />
            <Dropdown
              label="Language"
              value={languages[0].label}
              options={languages.map((l) => ({ value: l.code, label: l.label }))}
              onSelect={() => {}}
            />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {PAYMENT_METHODS.map(({ id, name, component: IconComponent }) => (
              <span key={id} title={name} className="inline-flex items-center shadow-xs transition-opacity hover:opacity-85">
                <IconComponent className="h-6 w-auto" />
              </span>
            ))}
          </div>
        </div>

        {/* Copyright + policy links */}
        <div className="border-t border-zen-hairline">
          <div className="mx-auto max-w-[1400px] px-6 py-6 text-center md:px-10">
            <p className="text-xs text-zen-muted">© 2026 John Romeo Galan — Portfolio Project. Not a real business.</p>
            <p className="mt-2 flex flex-wrap justify-center gap-x-2 gap-y-1 text-xs text-zen-muted">
              <Link to="/privacy" className="hover:text-zen-charcoal">Privacy policy</Link><span>·</span>
              <Link to="/refund" className="hover:text-zen-charcoal">Refund policy</Link><span>·</span>
              <Link to="/terms" className="hover:text-zen-charcoal">Terms of service</Link><span>·</span>
              <Link to="/legal" className="hover:text-zen-charcoal">Legal notice</Link><span>·</span>
              <Link to="/shipping" className="hover:text-zen-charcoal">Shipping policy</Link><span>·</span>
              <Link to="/cookies" className="hover:text-zen-charcoal">Cookie policy</Link><span>·</span>
              <Link to="/contact" className="hover:text-zen-charcoal">Contact information</Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}