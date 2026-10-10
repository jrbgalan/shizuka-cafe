import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import SeigaihaBackground from "@/components/SeigaihaBackground";

/**
 * Loader Component
 *
 * Welcome screen animation featuring:
 * - Solid rice-paper background (zen-paper #F5F1EA, exact site token)
 * - Seamless light gold Seigaiha wave pattern filling the whole screen via SEIGAIHA_LIGHT_GOLD
 * - Central radial calm zone mask keeping the central ensō ring and brand mark crisp
 * - 0.6s pattern opacity fade-in while the dark espresso ensō ring draws
 * - GPU transform-only slow drift (1 tile per ~60s, disabled on prefers-reduced-motion)
 * - Full WCAG AAA contrast for logo mark and progress ring on light paper
 * - Seamless lift-away exit revealing the underlying page and header
 */
export default function Loader({ forceShow = false, onComplete }) {
  const [visible, setVisible] = useState(() => {
    if (forceShow) return true;
    if (typeof window !== "undefined" && window.location.search.includes("no-loader")) return false;
    return true;
  });
  const [progress, setProgress] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (forceShow) {
      setVisible(true);
      setProgress(0);
    }
  }, [forceShow]);

  useEffect(() => {
    if (!visible) return;

    if (reduce) {
      setProgress(100);
      const t = setTimeout(() => finish(), 600);
      return () => clearTimeout(t);
    }

    let raf;
    const start = performance.now();
    const duration = 1400;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      // ease-out
      const eased = 1 - Math.pow(1 - p, 3);
      setProgress(Math.round(eased * 100));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        finish();
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce, visible]);

  const finish = () => {
    setVisible(false);
    if (onComplete) onComplete();
  };

  const circumference = 2 * Math.PI * 46;
  const dash = (progress / 100) * circumference;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-zen-paper paper-grain overflow-hidden select-none"
          initial={{ opacity: 1 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 1.1, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Edge-to-edge light gold Seigaiha pattern fading in over 0.6s with calm center mask */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={reduce ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <SeigaihaBackground
              variant="lightGold"
              mask="radial-center"
              drift={!reduce}
            />
          </motion.div>

          {/* Central Ensō Ring & Brand Mark (dark espresso with full contrast on rice paper) */}
          <div className="relative z-10 flex h-40 w-40 items-center justify-center">
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90">
              {/* Subtle hairline background track */}
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="#D1C7B7"
                strokeWidth="0.8"
              />
              {/* Ensō progress stroke in dark espresso */}
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="#2B211B"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeDasharray={`${dash} ${circumference}`}
              />
            </svg>
            <motion.div
              className="text-center"
              initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
            >
              <p className="font-heading text-3xl text-zen-charcoal leading-none">Shizuka</p>
              <p className="font-jp text-xs tracking-[0.4em] text-zen-muted mt-2">静か 珈琲</p>
            </motion.div>
          </div>

          {/* Progress / Status label */}
          <motion.p
            className="relative z-10 label-eyebrow text-zen-muted mt-10 tracking-[0.32em] font-medium"
            initial={reduce ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            {progress < 100 ? `Brewing · ${progress}%` : "Welcome"}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}