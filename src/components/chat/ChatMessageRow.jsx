import React from "react";
import { ChatCard } from "./ChatCards";
import { cn } from "@/lib/utils";

/**
 * Format timestamp (e.g. "2:45 PM")
 */
function formatTime(timestamp) {
  if (!timestamp) return "";
  const d = new Date(timestamp);
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function ChatMessageRowComponent({
  message,
  onConfirmBooking,
  onEditBooking
}) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex w-full flex-col",
        isUser ? "items-end" : "items-start"
      )}
    >
      <div className="flex items-start gap-2 max-w-[88%]">
        {!isUser && (
          <div
            className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zen-surface border border-zen-hairline text-zen-charcoal"
            aria-hidden="true"
          >
            {/* Small Ensō glyph */}
            <svg viewBox="0 0 100 100" className="h-4 w-4">
              <circle
                cx="50"
                cy="52"
                r="34"
                fill="none"
                stroke="currentColor"
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray="205 30"
              />
            </svg>
          </div>
        )}

        <div className="flex flex-col">
          <div
            className={cn(
              "px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words transition-colors",
              isUser
                ? "bg-zen-charcoal text-zen-paper rounded-2xl rounded-tr-xs"
                : "bg-zen-surface/90 text-zen-charcoal border border-zen-hairline/70 rounded-2xl rounded-tl-xs shadow-2xs"
            )}
          >
            {message.content}
          </div>

          {/* Render Rich Card if attached */}
          {message.card && (
            <div className="w-full max-w-sm">
              <ChatCard
                card={message.card}
                onConfirmBooking={onConfirmBooking}
                onEditBooking={onEditBooking}
              />
            </div>
          )}

          {/* Timestamp */}
          <span
            className={cn(
              "mt-1 text-[10px] text-zen-muted px-1.5",
              isUser ? "text-right" : "text-left"
            )}
          >
            {formatTime(message.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
}

// Memoized to avoid re-rendering earlier messages while new tokens stream
export const ChatMessageRow = React.memo(ChatMessageRowComponent);

