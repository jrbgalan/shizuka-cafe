import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import ZenImage from "@/components/ZenImage";
import { cn } from "@/lib/utils";

// Reusable hover-zoom image frame (benchmarkcoffee style).
// Mouse: zooms on hover. Touch: zooms when entering viewport.
// Frame stays fixed; only the inner image scales. Respects reduced motion.
export default function ZoomImage({
  src,
  alt,
  label,
  children,
  aspect = "aspect-[4/5]",
  overlay = false,
  className,
  frameClassName,
  zoom = 1.12,
  duration = 0.9,
  priority = false
}) {
  const reduce = useReducedMotion();
  const [isTouch] = useState(
    () =>
      typeof window !== "undefined" &&
      ("ontouchstart" in window || navigator.maxTouchPoints > 0)
  );

  const inner = children || (
    <ZenImage
      src={src}
      alt={alt}
      label={label}
      aspect="h-full"
      overlay={overlay}
      className="h-full w-full"
      priority={priority}
    />
  );

  if (reduce) {
    return (
      <div className={cn("overflow-hidden", aspect, frameClassName, className)}>
        {inner}
      </div>
    );
  }

  return (
    <div className={cn("overflow-hidden", aspect, frameClassName, className)}>
      <motion.div
        className="h-full w-full will-change-transform"
        whileHover={!isTouch ? { scale: zoom } : undefined}
        whileInView={isTouch ? { scale: zoom } : undefined}
        viewport={isTouch ? { once: true, margin: "-80px" } : undefined}
        transition={{ duration, ease: [0.16, 1, 0.3, 1] }}
      >
        {inner}
      </motion.div>
    </div>
  );
}