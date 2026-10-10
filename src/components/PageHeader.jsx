import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import SeigaihaBackground from "@/components/SeigaihaBackground";
import { cn } from "@/lib/utils";

/**
 * PageHeader Component
 *
 * Generously proportioned dark espresso header with edge-to-edge Seigaiha dark wave pattern,
 * anchored to the bottom edge (center bottom) so the last visible row of scales ends cleanly
 * at the straight 1px antique gold bottom border (#A88A4E at ~0.5 opacity).
 *
 * Height:
 * - Mobile (<768px): min-h-[300px] (10 whole 30px tile rows)
 * - Tablet (768–1023px): min-h-[340px]
 * - Desktop (≥1024px): min-h-[400px] (10 whole 40px tile rows)
 */
export default function PageHeader({
  eyebrow,
  title,
  jp,
  className = "",
}) {
  const reduce = useReducedMotion();

  return (
    <section
      data-dark-header="true"
      className={cn(
        "relative w-full bg-zen-espresso text-zen-paper border-b border-[#A88A4E]/50",
        "min-h-[300px] md:min-h-[340px] lg:min-h-[400px]",
        "flex flex-col items-center justify-center",
        "pt-[104px] pb-12 md:pt-32 md:pb-16 lg:pt-[140px] lg:pb-20 px-6",
        className
      )}
    >
      {/* Edge-to-edge dark Seigaiha wave background anchored to center bottom for whole-scale alignment */}
      <SeigaihaBackground
        variant="dark"
        mask="radial-center"
        position="center bottom"
        drift={!reduce}
      />

      {/* Centered Typography: Label -> Title -> Japanese Subtitle */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center text-center max-w-4xl mx-auto"
        initial={reduce ? { opacity: 1 } : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      >
        {eyebrow && (
          <p className="label-eyebrow text-[#C9A96A] text-[11px] sm:text-xs tracking-[0.28em] uppercase font-medium">
            {eyebrow}
          </p>
        )}
        <h1
          className="mt-4 font-heading font-light text-zen-paper tracking-[0.02em] leading-[1.08] select-none text-[2.5rem] sm:text-5xl md:text-6xl lg:text-[4.25rem]"
          style={{ fontSize: "clamp(2.5rem, 5.2vw, 4.25rem)" }}
        >
          {title}
        </h1>
        {jp && (
          <p className="mt-3.5 font-jp text-xs sm:text-sm md:text-base tracking-[0.4em] text-zen-paper/75">
            {jp}
          </p>
        )}
      </motion.div>
    </section>
  );
}