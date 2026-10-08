import type { ChatProvider } from "../types";
import { DemoProvider } from "./demoProvider";
import { LiveProvider } from "./liveProvider";

/**
 * Chat Provider Factory.
 * Selects between DemoProvider (local scripted engine) and LiveProvider (backend streaming proxy)
 * based on the environment flag `VITE_CHAT_MODE` (or `NEXT_PUBLIC_CHAT_MODE`).
 * Defaults strictly to "demo".
 */

export function createChatProvider(): ChatProvider {
  const metaEnv = typeof import.meta !== "undefined" ? (import.meta as unknown as { env?: Record<string, string> }).env : undefined;
  const mode = metaEnv?.VITE_CHAT_MODE || metaEnv?.NEXT_PUBLIC_CHAT_MODE || "demo";

  if (mode.toLowerCase() === "live") {
    return new LiveProvider();
  }

  return new DemoProvider();
}

export { DemoProvider, LiveProvider };
