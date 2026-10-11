import React, { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: string;
}

// Slow fade-and-rise reveal on scroll. Honors prefers-reduced-motion.
export default function ScrollReveal({
  children,
  delay = 0,
  y = 24,
  className,
  as = "div"
}: ScrollRevealProps): JSX.Element {
  const reduce = useReducedMotion();
  const MotionTag = (motion as Record<string, any>)[as] || motion.div;

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

