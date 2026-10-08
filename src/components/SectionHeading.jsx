import React from "react";
import ScrollReveal from "@/components/ScrollReveal";
import { cn } from "@/lib/utils";

// Consistent section heading: eyebrow, serif title, optional JP/KR accent.
export default function SectionHeading({
  eyebrow,
  title,
  jp,
  align = "left",
  className,
  titleClassName,
  eyebrowClassName,
  jpClassName
}) {
  const isDark =
    className?.includes("text-zen-paper") ||
    className?.includes("text-white") ||
    className?.includes("dark");

  return (
    <ScrollReveal className={cn(align === "center" ? "text-center" : "text-left", className)}>
      {eyebrow && (
        <p className={cn("label-eyebrow", isDark ? "text-zen-clay" : "", eyebrowClassName)}>
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "mt-4 font-heading text-4xl leading-[1.05] md:text-6xl",
          isDark ? "text-zen-paper" : "text-zen-charcoal",
          titleClassName
        )}
      >
        {title}
      </h2>
      {jp && (
        <p
          className={cn(
            "mt-3 font-jp text-sm tracking-[0.3em]",
            isDark ? "text-zen-paper/70" : "text-zen-muted",
            jpClassName
          )}
        >
          {jp}
        </p>
      )}
    </ScrollReveal>
  );
}