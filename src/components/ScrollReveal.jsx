import React from "react";
import { motion, useReducedMotion } from "framer-motion";

// Slow fade-and-rise reveal on scroll. Honors prefers-reduced-motion.
export default function ScrollReveal({ children, delay = 0, y = 24, className, as = "div" }) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as] || motion.div;

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1, ease: [0.4, 0, 0.2, 1], delay }}
    >
      {children}
    </MotionTag>
  );
}