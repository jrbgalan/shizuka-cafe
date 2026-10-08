import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

// Rice-paper field, ensō progress ring, soft lift loading screen.
// Plays on page refresh and initial load.
export default function Loader() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
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
      if (p < 1) raf = requestAnimationFrame(tick);
      else finish();
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce]);

  const finish = () => {
    setVisible(false);
  };

  const circumference = 2 * Math.PI * 46;
  const dash = (progress / 100) * circumference;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-zen-paper paper-grain"
          initial={{ opacity: 1 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 1.1, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="relative flex h-40 w-40 items-center justify-center">
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90">
              <circle cx="50" cy="50" r="46" fill="none" stroke="#D1C7B7" strokeWidth="0.5" />
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="#2B211B"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray={`${dash} ${circumference}`}
              />
            </svg>
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
            >
              <p className="font-heading text-3xl text-zen-charcoal leading-none">Shizuka</p>
              <p className="font-jp text-xs tracking-[0.4em] text-zen-muted mt-2">静か 珈琲</p>
            </motion.div>
          </div>
          <motion.p
            className="label-eyebrow mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
          >
            {progress < 100 ? `Brewing · ${progress}%` : "Welcome"}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}