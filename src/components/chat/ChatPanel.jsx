import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowDown, Minus, RotateCcw, Send, Square, X } from "lucide-react";
import { ChatMessageRow } from "./ChatMessageRow";
import { cn } from "@/lib/utils";

const MAX_CHAR_COUNT = 300;

export default function ChatPanel({
  isOpen,
  onClose,
  messages,
  isStreaming,
  onSendMessage,
  onStopStreaming,
  onClearConversation,
  onConfirmBooking,
  onEditBooking,
  launcherRef
}) {
  const reduce = useReducedMotion();
  const [inputText, setInputText] = useState("");
  const [isScrolledUp, setIsScrolledUp] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const panelRef = useRef(null);
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);

  // Focus input on panel open & trap focus if needed
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        textareaRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    } else {
      // Return focus to launcher on close
      launcherRef?.current?.focus();
    }
  }, [isOpen, launcherRef]);

  // Handle Esc key to close panel
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (showClearConfirm) {
          setShowClearConfirm(false);
        } else if (isOpen) {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, showClearConfirm, onClose]);

  // Auto-scroll handler
  const scrollToBottom = useCallback((smooth = true) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: smooth && !reduce ? "smooth" : "auto",
        block: "end"
      });
      setIsScrolledUp(false);
    }
  }, [reduce]);

  // Detect user scroll
  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setIsScrolledUp(distanceFromBottom > 70);
  };

  // Scroll to bottom when new messages arrive or when streaming updates
  useEffect(() => {
    if (!isScrolledUp) {
      scrollToBottom(false);
    }
  }, [messages, isStreaming, isScrolledUp, scrollToBottom]);

  // Auto-grow textarea
  const handleInputChange = (e) => {
    const val = e.target.value;
    if (val.length <= MAX_CHAR_COUNT) {
      setInputText(val);
    }
    // Auto-adjust height
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 100)}px`;
    }
  };

  const handleSend = () => {
    const trimmed = inputText.trim();
    if (!trimmed || isStreaming) return;
    onSendMessage(trimmed);
    setInputText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickReply = (reply) => {
    if (isStreaming) return;
    onSendMessage(reply);
  };

  // Determine latest quick replies from the last assistant message
  const lastAssistantMessage = [...messages].reverse().find((m) => m.role === "assistant");
  const currentQuickReplies = lastAssistantMessage?.quickReplies || [];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-label="Shizuka AI Assistant"
          aria-modal="true"
          className="fixed inset-0 z-50 flex flex-col bg-zen-paper paper-grain sm:inset-auto sm:bottom-20 sm:right-6 sm:h-[580px] sm:w-[384px] sm:rounded-2xl sm:border sm:border-zen-hairline sm:shadow-xl sm:overflow-hidden"
          initial={
            reduce
              ? { opacity: 0 }
              : { opacity: 0, scale: 0.96, y: 16 }
          }
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={
            reduce
              ? { opacity: 0 }
              : { opacity: 0, scale: 0.96, y: 16 }
          }
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zen-hairline/70 bg-zen-surface/60 px-4 py-3 backdrop-blur-xs select-none">
            <div className="flex items-center gap-2.5">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-zen-charcoal text-zen-paper">
                {/* Ensō symbol */}
                <svg viewBox="0 0 100 100" className="h-4.5 w-4.5">
                  <circle
                    cx="50"
                    cy="52"
                    r="34"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray="205 30"
                  />
                </svg>
                {/* Online indicator */}
                <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-zen-sage ring-2 ring-zen-surface" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 leading-none">
                  <h3 className="font-heading text-lg font-medium text-zen-charcoal">
                    Shizuka
                  </h3>
                  <span className="font-jp text-[10px] tracking-wider text-zen-muted">
                    静か · assistant
                  </span>
                </div>
                <p className="mt-0.5 text-[10px] text-zen-sage font-medium tracking-wide">
                  here to help
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setShowClearConfirm(true)}
                title="Clear conversation"
                aria-label="Clear conversation"
                className="flex h-7 w-7 items-center justify-center rounded-sm text-zen-muted hover:bg-zen-surface hover:text-zen-charcoal transition-colors min-h-[32px] min-w-[32px]"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={onClose}
                title="Minimize assistant"
                aria-label="Minimize assistant"
                className="flex h-7 w-7 items-center justify-center rounded-sm text-zen-muted hover:bg-zen-surface hover:text-zen-charcoal transition-colors min-h-[32px] min-w-[32px]"
              >
                <Minus className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={onClose}
                title="Close assistant"
                aria-label="Close assistant"
                className="flex h-7 w-7 items-center justify-center rounded-sm text-zen-muted hover:bg-zen-surface hover:text-zen-charcoal transition-colors min-h-[32px] min-w-[32px]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5 relative"
            aria-live="polite"
          >
            {messages.map((msg) => (
              <ChatMessageRow
                key={msg.id}
                message={msg}
                onConfirmBooking={onConfirmBooking}
                onEditBooking={onEditBooking}
              />
            ))}

            {/* Typing Indicator while waiting for first token */}
            {isStreaming && (
              <div className="flex items-center gap-2 pt-1 text-zen-muted text-xs">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zen-surface border border-zen-hairline">
                  <svg viewBox="0 0 100 100" className="h-3.5 w-3.5 text-zen-charcoal">
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
                <div className="flex items-center gap-1 rounded-2xl rounded-tl-xs bg-zen-surface px-3 py-2 border border-zen-hairline/60">
                  <span className="h-1.5 w-1.5 rounded-full bg-zen-muted animate-pulse" />
                  <span className="h-1.5 w-1.5 rounded-full bg-zen-muted animate-pulse [animation-delay:200ms]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-zen-muted animate-pulse [animation-delay:400ms]" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Floating 'New Message' scroll-to-bottom pill */}
          {isScrolledUp && (
            <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-20">
              <button
                type="button"
                onClick={() => scrollToBottom(true)}
                className="flex items-center gap-1.5 rounded-full bg-zen-charcoal px-3 py-1.5 text-xs text-zen-paper shadow-md transition-transform hover:scale-105"
              >
                <ArrowDown className="h-3 w-3" />
                <span>New messages</span>
              </button>
            </div>
          )}

          {/* Quick Reply Chips */}
          {currentQuickReplies.length > 0 && !isStreaming && (
            <div className="border-t border-zen-hairline/30 bg-zen-surface/30 px-3 py-2 overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                {currentQuickReplies.map((reply, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleQuickReply(reply)}
                    className="rounded-full border border-zen-hairline bg-zen-paper/90 px-3 py-1 text-xs text-zen-charcoal hover:bg-zen-charcoal hover:text-zen-paper transition-all duration-200 shrink-0 min-h-[30px]"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="border-t border-zen-hairline/60 bg-zen-paper p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]">
            <div className="relative flex items-end gap-2 rounded-xl border border-zen-hairline bg-zen-surface/50 px-3 py-2 focus-within:border-zen-charcoal focus-within:bg-zen-paper transition-colors">
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={isStreaming ? "Responding quietly..." : "Ask about our menu, beans, or hours..."}
                disabled={isStreaming}
                rows={1}
                maxLength={MAX_CHAR_COUNT}
                aria-label="Type your message"
                className="flex-1 max-h-24 resize-none bg-transparent text-xs sm:text-sm text-zen-charcoal placeholder:text-zen-muted focus:outline-none leading-relaxed"
              />

              {/* Character counter (shows near limit) */}
              {inputText.length >= 220 && (
                <span className="text-[10px] text-zen-muted self-end pb-1 tabular-nums">
                  {inputText.length}/{MAX_CHAR_COUNT}
                </span>
              )}

              {/* Send or Stop Button */}
              {isStreaming ? (
                <button
                  type="button"
                  onClick={onStopStreaming}
                  title="Stop generating"
                  aria-label="Stop generating response"
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-zen-charcoal text-zen-paper hover:bg-zen-espresso transition-colors min-h-[32px] min-w-[32px] shrink-0"
                >
                  <Square className="h-3 w-3 fill-current" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={!inputText.trim()}
                  title="Send message"
                  aria-label="Send message"
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-lg transition-colors min-h-[32px] min-w-[32px] shrink-0",
                    inputText.trim()
                      ? "bg-zen-charcoal text-zen-paper hover:bg-zen-espresso"
                      : "bg-zen-hairline/60 text-zen-muted/50 cursor-not-allowed"
                  )}
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Subtle Footer */}
            <p className="mt-1.5 text-center text-[10px] text-zen-muted tracking-wide">
              Demo assistant · responses are scripted
            </p>
          </div>

          {/* Clear Confirmation Dialog */}
          {showClearConfirm && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-zen-espresso/40 backdrop-blur-2xs p-4">
              <div className="w-full max-w-[280px] rounded-xl border border-zen-hairline bg-zen-paper p-4 shadow-lg text-center">
                <h4 className="font-heading text-lg font-medium text-zen-charcoal">
                  Clear Conversation?
                </h4>
                <p className="mt-1.5 text-xs text-zen-muted">
                  This will reset your messages and booking state.
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onClearConversation();
                      setShowClearConfirm(false);
                    }}
                    className="flex-1 rounded-sm bg-zen-charcoal py-2 text-xs font-medium text-zen-paper hover:bg-zen-espresso transition-colors"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowClearConfirm(false)}
                    className="flex-1 rounded-sm border border-zen-hairline py-2 text-xs text-zen-muted hover:text-zen-charcoal transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

