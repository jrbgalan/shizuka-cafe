import { useState, useEffect, useRef, useCallback, Suspense, lazy } from "react";
import { ChatLauncher } from "./ChatLauncher";
import { createChatProvider } from "@/lib/chat/providers";
import { useReducedMotion } from "framer-motion";
import { ChatMessage, ChatProvider } from "@/lib/chat/types";

// Lazy-load ChatPanel dynamically so the bundle isn't parsed until needed
const ChatPanel = lazy(() => import("./ChatPanel"));

const STORAGE_KEY = "shizuka_chat_history_v1";

const DEFAULT_WELCOME_MESSAGE: ChatMessage = {
  id: "msg-welcome-0",
  role: "assistant",
  content:
    "いらっしゃいませ (Welcome). I am the Shizuka demo assistant. How may I help you enjoy a quiet moment today?",
  createdAt: Date.now(),
  quickReplies: ["Menu", "Opening hours", "Recommend a coffee", "Reserve a table", "Our beans"]
};

function loadStoredMessages(): ChatMessage[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    /* ignore session storage read errors */
  }
  return [DEFAULT_WELCOME_MESSAGE];
}

interface PluggableChatProvider extends ChatProvider {
  resetState?: () => void;
}

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window !== "undefined" && window.location.search.includes("chat=open")) return true;
    return false;
  });
  const [messages, setMessages] = useState<ChatMessage[]>(loadStoredMessages);
  const [isStreaming, setIsStreaming] = useState(false);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const providerRef = useRef<PluggableChatProvider | null>(null);
  const reduce = useReducedMotion();

  // Initialize provider once
  if (!providerRef.current) {
    providerRef.current = createChatProvider() as PluggableChatProvider;
  }

  // Persist messages in sessionStorage on update
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      /* ignore storage quota or private browsing errors */
    }
  }, [messages]);

  // Clean up abort controller on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const handleStopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
  }, []);

  const handleSendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isStreaming) return;

      const userMsgId = `usr-${Date.now()}`;
      const userMsg: ChatMessage = {
        id: userMsgId,
        role: "user",
        content: text.trim(),
        createdAt: Date.now()
      };

      const assistantMsgId = `asst-${Date.now() + 1}`;
      const assistantMsg: ChatMessage = {
        id: assistantMsgId,
        role: "assistant",
        content: "",
        createdAt: Date.now() + 1
      };

      // Append user message + empty assistant placeholder
      const updatedMessages = [...messages, userMsg, assistantMsg];
      setMessages(updatedMessages);
      setIsStreaming(true);

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        if (!providerRef.current) return;
        const stream = providerRef.current.send(
          [...messages, userMsg],
          {
            signal: controller.signal,
            reducedMotion: !!reduce
          }
        );

        let accumulatedContent = "";
        let meta: { quickReplies?: string[]; card?: ChatMessage["card"] } | undefined = undefined;

        for await (const chunkData of stream) {
          if (controller.signal.aborted) break;

          accumulatedContent += chunkData.chunk;
          if (chunkData.finalMeta) {
            meta = chunkData.finalMeta;
          }

          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsgId
                ? {
                    ...m,
                    content: accumulatedContent,
                    quickReplies: meta?.quickReplies || m.quickReplies,
                    card: meta?.card || m.card
                  }
                : m
            )
          );
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== "AbortError") {
          console.error("Chat error:", err);
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsgId
                ? {
                    ...m,
                    content:
                      m.content ||
                      "A quiet pause occurred. Please feel free to ask again in a moment.",
                    quickReplies: ["Menu", "Opening hours", "Our beans"]
                  }
                : m
            )
          );
        }
      } finally {
        setIsStreaming(false);
        abortControllerRef.current = null;
      }
    },
    [isStreaming, messages, reduce]
  );

  const handleClearConversation = useCallback(() => {
    handleStopStreaming();
    if (typeof providerRef.current?.resetState === "function") {
      providerRef.current.resetState();
    }
    const reset: ChatMessage[] = [{ ...DEFAULT_WELCOME_MESSAGE, createdAt: Date.now() }];
    setMessages(reset);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, [handleStopStreaming]);

  const handleConfirmBooking = useCallback(() => {
    handleSendMessage("Confirm Reservation");
  }, [handleSendMessage]);

  const handleEditBooking = useCallback(() => {
    handleSendMessage("Change details");
  }, [handleSendMessage]);

  return (
    <>
      <ChatLauncher
        ref={launcherRef}
        isOpen={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
      />

      {isOpen && (
        <Suspense fallback={null}>
          <ChatPanel
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            messages={messages}
            isStreaming={isStreaming}
            onSendMessage={handleSendMessage}
            onStopStreaming={handleStopStreaming}
            onClearConversation={handleClearConversation}
            onConfirmBooking={handleConfirmBooking}
            onEditBooking={handleEditBooking}
            launcherRef={launcherRef}
          />
        </Suspense>
      )}
    </>
  );
}

