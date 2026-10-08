import React, { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Minimalist steam-cup SVG icon
 */
export function SteamCupIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Gentle rising steam ribbons */}
      <path d="M8 2.5c-.8.8-.8 1.8 0 2.6" />
      <path d="M12 1.5c-.8.8-.8 2 0 2.8" />
      <path d="M16 2.5c-.8.8-.8 1.8 0 2.6" />
      {/* Cup bowl & base */}
      <path d="M4 8h13v6.5a4.5 4.5 0 0 1-4.5 4.5h-4A4.5 4.5 0 0 1 4 14.5V8Z" />
      {/* Delicate handle */}
      <path d="M17 10h1.5a2.5 2.5 0 0 1 0 5H17" />
      {/* Saucer */}
      <path d="M3 21h15" />
    </svg>
  );
}

export const ChatLauncher = React.forwardRef(function ChatLauncher(
  { isOpen, onClick, unreadCount = 0 },
  ref
) {
  const reduce = useReducedMotion();
  const [hasPulsed, setHasPulsed] = useState(false);

  useEffect(() => {
    // Soft pulse once on mount
    const timer = setTimeout(() => {
      setHasPulsed(true);
    }, 2400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <motion.button
        ref={ref}
        type="button"
        onClick={onClick}
        aria-label={isOpen ? "Close Shizuka Assistant" : "Open Shizuka AI Assistant"}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className={cn(
          "group relative flex h-12 w-12 items-center justify-center rounded-full border border-zen-hairline/80 shadow-md transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zen-clay",
          isOpen
            ? "bg-zen-surface text-zen-charcoal hover:bg-zen-paper"
            : "bg-zen-charcoal text-zen-paper hover:bg-zen-espresso"
        )}
        whileHover={reduce ? undefined : { scale: 1.05 }}
        whileTap={reduce ? undefined : { scale: 0.95 }}
      >
        {/* Soft pulse glow once on initial load */}
        {!hasPulsed && !reduce && !isOpen && (
          <span
            className="absolute -inset-1 rounded-full bg-zen-clay/30 animate-ping pointer-events-none"
            style={{ animationIterationCount: 2, animationDuration: "1.4s" }}
            aria-hidden="true"
          />
        )}

        {isOpen ? (
          /* Close X icon */
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5 transition-transform group-hover:rotate-90 duration-300"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        ) : (
          <SteamCupIcon className="h-5 w-5" />
        )}

        {/* Small notification badge if unread */}
        {unreadCount > 0 && !isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-zen-clay text-[9px] font-medium text-zen-paper">
            {unreadCount}
          </span>
        )}
      </motion.button>
    </div>
  );
});

