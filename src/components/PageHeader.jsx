import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import ZenImage from "@/components/ZenImage";

// Slim inner-page hero: clears the fixed header, sets the calm tone.
export default function PageHeader({ eyebrow, title, jp, imageLabel, alt }) {
  const reduce = useReducedMotion();
  return (
    <section className="relative h-[52vh] min-h-[360px] w-full overflow-hidden">
      <div className="absolute inset-0">
        <ZenImage label={imageLabel || title} alt={alt || title} aspect="h-full" className="h-full w-full" overlay priority />
      </div>
      <div className="absolute inset-0 bg-zen-espresso/30" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-zen-paper">
        {eyebrow && (
          <motion.p className="label-eyebrow text-zen-paper/80" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}>
            {eyebrow}
          </motion.p>
        )}
        <motion.h1
          className="mt-4 font-heading text-5xl leading-none text-zen-paper md:text-7xl"
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
        >
          {title}
        </motion.h1>
        {jp && (
          <motion.p className="mt-4 font-jp text-sm tracking-[0.4em] text-zen-paper/80" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.3 }}>
            {jp}
          </motion.p>
        )}
      </div>
    </section>
  );
}