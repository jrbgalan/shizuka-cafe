/**
 * TypeScript definitions for the Shizuka Café AI Chat Assistant.
 * Designed for demo mode with a pluggable provider interface for future LLM integration.
 */

export type Role = "user" | "assistant";

export interface MenuItemCardData {
  id: string;
  name: string;
  jp?: string;
  price: number;
  description: string;
  category?: string;
  dietary?: string[];
  imageLabel?: string;
  imageSrc?: string;
  isSignature?: boolean;
  availableLabel?: string;
}

export interface HoursCardData {
  schedule: Array<{ day: string; time: string }>;
  note?: string;
}

export interface LocationCardData {
  name: string;
  line1: string;
  city: string;
  region: string;
  postcode: string;
  directionsHint: string;
  googleMapsUrl: string;
}

export interface ProductCardData {
  id: string;
  slug: string;
  name: string;
  jp?: string;
  origin: string;
  roast: string;
  process: string;
  price: number;
  tastingNotes: string[];
  imageLabel?: string;
}

export interface BookingDraft {
  date: string;
  time: string;
  partySize: number;
  name: string;
  email?: string;
  notes?: string;
}

export interface BookingConfirmedData {
  booking: BookingDraft;
  reference: string;
}

export type CardPayload =
  | { type: "menu"; data: MenuItemCardData }
  | { type: "hours"; data: HoursCardData }
  | { type: "location"; data: LocationCardData }
  | { type: "product"; data: ProductCardData }
  | { type: "booking_summary"; data: BookingDraft }
  | { type: "booking_confirmed"; data: BookingConfirmedData };

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  createdAt: number;
  quickReplies?: string[];
  card?: CardPayload;
}

export type Intent =
  | "greeting"
  | "menu"
  | "menu_breakfast"
  | "menu_lunch"
  | "menu_dinner"
  | "menu_spicy"
  | "menu_vegetarian"
  | "menu_popular"
  | "menu_item_query"
  | "recommendation"
  | "hours"
  | "location"
  | "reservation"
  | "roastery"
  | "brewing_tips"
  | "shipping"
  | "refund"
  | "contact"
  | "thanks"
  | "fallback";

export type RecommendationFacet =
  | "dairy_free"
  | "sweet"
  | "strong"
  | "light"
  | "cold"
  | "hot"
  | "general";

export type BookingStep =
  | "IDLE"
  | "ASK_DATE"
  | "ASK_TIME"
  | "ASK_PARTY"
  | "ASK_NAME"
  | "CONFIRMATION"
  | "CONFIRMED";

export interface BookingState {
  step: BookingStep;
  draft: BookingDraft;
  lastReference?: string;
}

export interface ChatProvider {
  /**
   * Sends the conversation history to the provider and yields chunks as an async iterable stream.
   * If signal is aborted, the stream terminates cleanly.
   */
  send(
    messages: ChatMessage[],
    options?: {
      signal?: AbortSignal;
      reducedMotion?: boolean;
    }
  ): AsyncIterable<{
    chunk: string;
    finalMeta?: {
      quickReplies?: string[];
      card?: CardPayload;
    };
  }>;
}

