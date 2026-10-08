import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Menu, X, ShoppingBag } from "lucide-react";
import { navLinks, site } from "@/data/site";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";

function BrandMark({ className, sub = true }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <svg viewBox="0 0 100 100" className="h-7 w-7 text-zen-charcoal" aria-hidden="true">
        <circle cx="50" cy="52" r="34" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeDasharray="205 30" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className="font-heading text-xl tracking-wide text-zen-charcoal">Shizuka</span>
        {sub && <span className="font-jp text-[10px] tracking-[0.3em] text-zen-muted mt-0.5">静か · 珈琲</span>}
      </span>
    </span>
  );
}

export default function Header() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const { scrollY } = useScroll();
  const reduce = useReducedMotion();
  const { count, openCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  // Hooks must run unconditionally — compute the scroll-linked values always,
  // then decide at render whether to apply them (home) or hold visible (inner).
  const chromeMotion = useTransform(scrollY, [80, 240], [0, 1]);
  const logoMotion = useTransform(scrollY, [80, 240], [0, 1]);
  const chromeOpacity = reduce || !isHome ? 1 : chromeMotion;
  const logoOpacity = reduce || !isHome ? 1 : logoMotion;

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50"
      >
        {/* blurred rice-paper background, fades in on scroll (home) or always (inner) */}
        <motion.div
          className="absolute inset-0 -z-10 border-b border-zen-hairline/60 bg-zen-paper/80 backdrop-blur-md"
          style={{ opacity: reduce ? (isHome ? 1 : 1) : chromeOpacity }}
        />
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-4 md:px-10 md:py-5">
          <motion.div style={{ opacity: reduce ? (isHome ? 1 : 1) : logoOpacity }}>
            <Link to="/" aria-label="Shizuka Café — home">
              <BrandMark />
            </Link>
          </motion.div>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  "label-eyebrow link-underline transition-colors",
                  location.pathname === l.to ? "text-zen-charcoal" : "text-zen-muted hover:text-zen-charcoal"
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={openCart}
              aria-label={`Open cart, ${count} items`}
              className="relative text-zen-charcoal transition-opacity hover:opacity-60"
            >
              <ShoppingBag className="h-5 w-5" strokeWidth={1.25} />
              {count > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-zen-charcoal px-1 text-[10px] font-medium text-zen-paper">
                  {count}
                </span>
              )}
            </button>
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="text-zen-charcoal lg:hidden"
            >
              <Menu className="h-5 w-5" strokeWidth={1.25} />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile full-screen overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col bg-zen-paper paper-grain lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="flex items-center justify-between px-5 py-4">
              <BrandMark />
              <button onClick={() => setMenuOpen(false)} aria-label="Close menu" className="text-zen-charcoal">
                <X className="h-5 w-5" strokeWidth={1.25} />
              </button>
            </div>
            <nav className="flex flex-1 flex-col justify-center gap-7 px-8">
              {navLinks.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.07, duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                >
                  <Link
                    to={l.to}
                    onClick={() => setMenuOpen(false)}
                    className="font-heading text-4xl text-zen-charcoal"
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="px-8 pb-10">
              <p className="label-eyebrow">{site.tagline}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}