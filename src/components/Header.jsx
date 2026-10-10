import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag } from "lucide-react";
import { navLinks, site } from "@/data/site";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";
import CafeLiveTime from "@/components/CafeLiveTime";

function BrandMark({ className, sub = true, isDark = false }) {
  return (
    <span className={cn("flex items-center gap-2.5 transition-colors duration-300", className)}>
      <svg
        viewBox="0 0 100 100"
        className={cn(
          "h-7 w-7 transition-colors duration-300",
          isDark ? "text-zen-paper" : "text-zen-charcoal"
        )}
        aria-hidden="true"
      >
        <circle
          cx="50"
          cy="52"
          r="34"
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="205 30"
        />
      </svg>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-heading text-xl tracking-wide transition-colors duration-300",
            isDark ? "text-zen-paper" : "text-zen-charcoal"
          )}
        >
          Shizuka
        </span>
        {sub && (
          <span
            className={cn(
              "font-jp text-[10px] tracking-[0.3em] mt-0.5 transition-colors duration-300",
              isDark ? "text-zen-paper/75" : "text-zen-muted"
            )}
          >
            静か · 珈琲
          </span>
        )}
      </span>
    </span>
  );
}

export default function Header() {
  const location = useLocation();
  const { count, openCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isOverDark, setIsOverDark] = useState(false);

  useEffect(() => {
    const updateHeaderTheme = () => {
      // Locate the dark header/hero sentinel element
      const darkHeader = document.querySelector('[data-dark-header="true"]');
      if (!darkHeader) {
        setIsOverDark(false);
        return;
      }
      const rect = darkHeader.getBoundingClientRect();
      // Site header height is ~72px. While the bottom of the dark header
      // is below 72px, the site header is positioned over the dark surface.
      setIsOverDark(rect.bottom > 72);
    };

    updateHeaderTheme();

    window.addEventListener("scroll", updateHeaderTheme, { passive: true });
    window.addEventListener("resize", updateHeaderTheme);

    const observer = new MutationObserver(updateHeaderTheme);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("scroll", updateHeaderTheme);
      window.removeEventListener("resize", updateHeaderTheme);
      observer.disconnect();
    };
  }, [location.pathname]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        {/* Blurred rice-paper background when scrolled past dark header, or on light pages */}
        <div
          className={cn(
            "absolute inset-0 -z-10 transition-all duration-300 ease-zen",
            isOverDark
              ? "opacity-0 pointer-events-none"
              : "opacity-100 border-b border-zen-hairline/60 bg-zen-paper/90 backdrop-blur-md"
          )}
        />

        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-4 md:px-10 md:py-5">
          <div>
            <Link to="/" aria-label="Shizuka Café — home">
              <BrandMark isDark={isOverDark} />
            </Link>
          </div>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((l) => {
              const isActive = location.pathname === l.to;
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={cn(
                    "label-eyebrow relative py-1 transition-colors duration-300",
                    isOverDark
                      ? isActive
                        ? "text-zen-paper font-medium"
                        : "text-zen-paper/85 hover:text-zen-paper"
                      : isActive
                        ? "text-zen-charcoal font-medium"
                        : "text-zen-muted hover:text-zen-charcoal"
                  )}
                >
                  {l.label}
                  {isActive && (
                    <span
                      className={cn(
                        "absolute -bottom-1 left-0 right-0 h-[2px] transition-colors duration-300",
                        isOverDark ? "bg-[#C9A96A]" : "bg-zen-charcoal"
                      )}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3.5 sm:gap-5">
            {/* Live Cafe Time Pill */}
            <div className="hidden sm:block">
              <CafeLiveTime variant="header" isDark={isOverDark} />
            </div>

            <button
              onClick={openCart}
              aria-label={`Open cart, ${count} items`}
              className={cn(
                "relative transition-colors duration-300",
                isOverDark
                  ? "text-zen-paper hover:text-white"
                  : "text-zen-charcoal hover:opacity-60"
              )}
            >
              <ShoppingBag className="h-5 w-5" strokeWidth={1.25} />
              {count > 0 && (
                <span
                  className={cn(
                    "absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold transition-colors duration-300",
                    isOverDark
                      ? "bg-[#C9A96A] text-zen-espresso"
                      : "bg-zen-charcoal text-zen-paper"
                  )}
                >
                  {count}
                </span>
              )}
            </button>

            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className={cn(
                "lg:hidden transition-colors duration-300",
                isOverDark ? "text-zen-paper hover:text-white" : "text-zen-charcoal"
              )}
            >
              <Menu className="h-5 w-5" strokeWidth={1.25} />
            </button>
          </div>
        </div>
      </header>

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
              <BrandMark isDark={false} />
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="text-zen-charcoal"
              >
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
            <div className="px-8 pb-10 flex flex-col gap-3">
              <CafeLiveTime variant="inline" />
              <p className="label-eyebrow">{site.tagline}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}