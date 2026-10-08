import React, { useState } from "react";
import { useCafeTime } from "@/hooks/useCafeTime";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

/**
 * Japanese/Zen aesthetic live café time component
 * Variants: "header" | "card" | "inline"
 */
export default function CafeLiveTime({ variant = "header", className = "" }) {
  const {
    formattedTime,
    timeWithSeconds,
    dayOfWeek,
    isOpen,
    isClosingSoon,
    statusText,
    statusDetail,
    todayHoursLabel,
    timeZone
  } = useCafeTime();

  const [showTooltip, setShowTooltip] = useState(false);

  // Status indicator colors
  const dotColor = isClosingSoon
    ? "bg-amber-600"
    : isOpen
    ? "bg-zen-sage"
    : "bg-zen-clay";

  const dotPingColor = isClosingSoon
    ? "bg-amber-500"
    : isOpen
    ? "bg-zen-sage"
    : "bg-zen-clay";

  if (variant === "header") {
    return (
      <div
        className={cn("relative inline-flex items-center", className)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div className="flex items-center gap-2 rounded-full border border-zen-hairline/70 bg-zen-surface/60 px-2.5 py-1 text-xs backdrop-blur-xs transition-colors hover:border-zen-charcoal/40 shadow-2xs select-none">
          {/* Live pulsing status dot */}
          <span className="relative flex h-2 w-2">
            <span
              className={cn(
                "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                dotPingColor
              )}
            />
            <span className={cn("relative inline-flex rounded-full h-2 w-2", dotColor)} />
          </span>

          {/* Time display */}
          <span className="font-heading text-xs sm:text-sm font-semibold tracking-wide text-zen-charcoal">
            {formattedTime}
          </span>

          <span className="h-2.5 w-px bg-zen-hairline/80" />

          {/* Status */}
          <span
            className={cn(
              "text-[10px] uppercase tracking-wider font-medium",
              isOpen ? "text-zen-charcoal" : "text-zen-muted"
            )}
          >
            {statusText}
          </span>
        </div>

        {/* Hover details tooltip */}
        {showTooltip && (
          <div className="absolute top-full right-0 mt-2 z-50 w-52 rounded-xl border border-zen-hairline/80 bg-zen-paper p-3 text-left shadow-lg backdrop-blur-md animate-fade-in pointer-events-none">
            <div className="flex items-center justify-between pb-1.5 border-b border-zen-hairline/50">
              <span className="font-heading text-sm font-semibold text-zen-charcoal">
                Shizuka Roastery
              </span>
              <span className="text-[10px] font-mono text-zen-muted">{timeZone}</span>
            </div>
            <p className="mt-1.5 text-xs text-zen-charcoal font-medium">
              Today ({dayOfWeek}): {todayHoursLabel}
            </p>
            <p className="mt-0.5 text-[11px] text-zen-muted">
              {statusDetail} · Poblacion, Makati
            </p>
          </div>
        )}
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div
        className={cn(
          "rounded-2xl border border-zen-hairline/80 bg-zen-surface/50 p-5 shadow-2xs",
          className
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-zen-clay" strokeWidth={1.5} />
            <span className="label-eyebrow text-[11px] text-zen-muted">
              Live Roastery Time
            </span>
          </div>
          <span className="text-[10px] font-mono tracking-wider text-zen-clay uppercase">
            {timeZone}
          </span>
        </div>

        <div className="mt-3 flex items-baseline justify-between gap-4">
          <h4 className="font-heading text-3xl sm:text-4xl font-medium tracking-tight text-zen-charcoal">
            {timeWithSeconds}
          </h4>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border shadow-2xs",
              isOpen
                ? "bg-zen-sage/15 border-zen-sage/30 text-[#476041]"
                : "bg-zen-surface border-zen-hairline text-zen-muted"
            )}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full", dotColor)} />
            {statusText}
          </span>
        </div>

        <p className="mt-2 text-xs text-zen-muted leading-relaxed">
          {dayOfWeek} schedule: <strong className="text-zen-charcoal">{todayHoursLabel}</strong>. {statusDetail}.
        </p>
      </div>
    );
  }

  // "inline" variant for footer or sidebars
  return (
    <div className={cn("inline-flex items-center gap-2 text-xs text-zen-muted", className)}>
      <span className="relative flex h-2 w-2">
        <span
          className={cn(
            "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
            dotPingColor
          )}
        />
        <span className={cn("relative inline-flex rounded-full h-2 w-2", dotColor)} />
      </span>
      <span>
        Local time: <strong className="text-zen-charcoal font-medium">{formattedTime}</strong> ({timeZone}) · {statusText}
      </span>
    </div>
  );
}

