import React, { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * JapanesePhotoFrame Component
 * 
 * Encases café photography in a traditional Japanese gold leaf (kinpaku / 金箔) 
 * artisan frame with:
 * - Refined warm brushed-gold border & inner washi mat hairline
 * - Authentic Japanese Sumi-kiri (角切) corner brackets with gold leaf accents
 * - Dynamic scroll-reactive sunlight sheen: as the viewer scrolls, a delicate 
 *   specular light glides across the gold frame and photo, simulating warm sun 
 *   reflecting through café shōji screens
 * - Full accessibility: respects prefers-reduced-motion
 */
export default function JapanesePhotoFrame({
  children,
  className,
  innerClassName,
  aspect,
  showCorners = true,
  showShine = true,
  glow = true,
  style,
}) {
  const containerRef = useRef(null);
  const reduce = useReducedMotion();

  // Scroll tracking across viewport for natural light glinting as user scrolls
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Physically tracks scroll position: from -130% when entering to +230% when exiting
  const shineX = useTransform(scrollYProgress, [0.12, 0.88], ["-130%", "230%"]);
  const shineOpacity = useTransform(
    scrollYProgress,
    [0.08, 0.22, 0.78, 0.92],
    [0, 0.85, 0.85, 0]
  );

  return (
    <div
      ref={containerRef}
      style={style}
      className={cn(
        "group/jp-frame relative overflow-hidden rounded-2xl p-[5px] transition-all duration-700",
        // Japanese Gold Border & Washi Mat styling
        "bg-gradient-to-b from-[#e8dac0]/40 via-zen-surface to-[#dcc79d]/35",
        "border border-[#c5a059]/75 hover:border-[#dfc07b] hover:shadow-[0_12px_36px_-6px_rgba(197,160,89,0.24)]",
        glow && "shadow-[0_6px_26px_rgba(197,160,89,0.12)]",
        className
      )}
    >
      {/* Secondary Inset Gold Hairline */}
      <div className="pointer-events-none absolute inset-[3px] rounded-[13px] border border-[#c5a059]/40 z-20 transition-colors duration-500 group-hover/jp-frame:border-[#dfc07b]/70" />

      {/* Traditional Japanese Corner Accents (Sumi-kiri / Kaku-kanagu) */}
      {showCorners && (
        <div className="pointer-events-none absolute inset-0 z-25" aria-hidden="true">
          {/* Top-Left Corner */}
          <span className="absolute top-2 left-2 block h-3 w-3 border-t-[1.5px] border-l-[1.5px] border-[#c5a059] transition-colors duration-500 group-hover/jp-frame:border-[#e5ca82]">
            <span className="absolute -top-[2px] -left-[2px] block h-1 w-1 bg-[#c5a059] rounded-[0.5px]" />
          </span>

          {/* Top-Right Corner */}
          <span className="absolute top-2 right-2 block h-3 w-3 border-t-[1.5px] border-r-[1.5px] border-[#c5a059] transition-colors duration-500 group-hover/jp-frame:border-[#e5ca82]">
            <span className="absolute -top-[2px] -right-[2px] block h-1 w-1 bg-[#c5a059] rounded-[0.5px]" />
          </span>

          {/* Bottom-Left Corner */}
          <span className="absolute bottom-2 left-2 block h-3 w-3 border-b-[1.5px] border-l-[1.5px] border-[#c5a059] transition-colors duration-500 group-hover/jp-frame:border-[#e5ca82]">
            <span className="absolute -bottom-[2px] -left-[2px] block h-1 w-1 bg-[#c5a059] rounded-[0.5px]" />
          </span>

          {/* Bottom-Right Corner */}
          <span className="absolute bottom-2 right-2 block h-3 w-3 border-b-[1.5px] border-r-[1.5px] border-[#c5a059] transition-colors duration-500 group-hover/jp-frame:border-[#e5ca82]">
            <span className="absolute -bottom-[2px] -right-[2px] block h-1 w-1 bg-[#c5a059] rounded-[0.5px]" />
          </span>
        </div>
      )}

      {/* Inner Image Mat & Content */}
      <div
        className={cn(
          "relative h-full w-full overflow-hidden rounded-xl",
          aspect,
          innerClassName
        )}
      >
        {children}

        {/* Scroll-Driven Light Shine Beam across the gold frame & photo */}
        {showShine && (
          <motion.div
            style={reduce ? undefined : { x: shineX, opacity: shineOpacity }}
            className={cn(
              "pointer-events-none absolute -inset-y-16 -inset-x-32 w-[65%] -rotate-[26deg] z-30",
              "bg-gradient-to-r from-transparent via-[#fff8e1]/30 via-white/85 via-[#fae6b2]/40 to-transparent",
              "mix-blend-overlay blur-[0.5px] will-change-transform"
            )}
            aria-hidden="true"
          />
        )}

        {/* Delicate gold ambient sheen on hover */}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-[#ffd977]/12 to-transparent opacity-0 transition-opacity duration-700 group-hover/jp-frame:opacity-100 z-20"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

