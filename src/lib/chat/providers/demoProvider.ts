import { matchIntent } from "../intentMatcher";
import {
  getHoursCardData,
  getLocationCardData,
  getRecommendations,
  findRoasteryProduct,
  getBreakfastCardData,
  getLunchCardData,
  getDinnerStatusCardData,
  getVegetarianCardData,
  getSpicyCardData,
  getPopularDishCardData,
  getItemQueryCardData
} from "../knowledge";
import {
  startReservation,
  handleReservationInput,
  INITIAL_RESERVATION_STATE,
  type ReservationMachineState
} from "../reservationMachine";
import type {
  CardPayload,
  ChatMessage,
  ChatProvider,
  Intent
} from "../types";

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      return reject(new DOMException("Aborted", "AbortError"));
    }
    const timer = setTimeout(() => {
      resolve();
    }, ms);
    signal?.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });
}

export class DemoProvider implements ChatProvider {
  private reservationState: ReservationMachineState = { ...INITIAL_RESERVATION_STATE };

  public resetState(): void {
    this.reservationState = { ...INITIAL_RESERVATION_STATE };
  }

  public getReservationState(): ReservationMachineState {
    return this.reservationState;
  }

  public setReservationState(state: ReservationMachineState): void {
    this.reservationState = state;
  }

  public async *send(
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
  }> {
    const signal = options?.signal;
    const reducedMotion = !!options?.reducedMotion;

    if (signal?.aborted) return;

    const lastMessage = messages[messages.length - 1];
    const userInput = lastMessage ? lastMessage.content.trim() : "";

    let responseText = "";
    let quickReplies: string[] = ["Menu", "Opening hours", "Recommend a coffee", "Reserve a table", "Our beans"];
    let card: CardPayload | undefined;

    // Check if user is currently inside an active reservation sequence
    const isInReservationFlow =
      this.reservationState.step !== "IDLE" && this.reservationState.step !== "CONFIRMED";

    const isExplicitBookingTrigger =
      userInput.toLowerCase().includes("reserve") ||
      userInput.toLowerCase().includes("book a table") ||
      userInput.toLowerCase().includes("reservation");

    if (isInReservationFlow || isExplicitBookingTrigger) {
      if (!isInReservationFlow && isExplicitBookingTrigger) {
        const start = startReservation();
        this.reservationState = start.state;
        responseText = start.reply;
        quickReplies = start.quickReplies;
      } else {
        const stepResult = handleReservationInput(userInput, this.reservationState);
        this.reservationState = stepResult.state;
        responseText = stepResult.reply;
        if (stepResult.quickReplies) quickReplies = stepResult.quickReplies;
        if (stepResult.card) card = stepResult.card;
      }
    } else {
      // Intent matching
      const match = matchIntent(userInput);
      const intent: Intent = match.intent;

      switch (intent) {
        case "greeting": {
          responseText =
            "いらっしゃいませ (Welcome to Shizuka). I am here to guide you through our quiet roastery, share coffee recommendations, or help hold a table for your visit.";
          quickReplies = ["Menu", "Opening hours", "Recommend a coffee", "Reserve a table", "Our beans"];
          break;
        }

        case "menu": {
          responseText =
            "Our menu is crafted for quiet rituals — single-origin pour overs, ceremonial Uji matcha, and delicate house pastries. Here is a favorite from our bar:";
          const rec = getRecommendations("hot");
          if (rec.item) {
            card = { type: "menu", data: rec.item };
          }
          quickReplies = ["Recommend a coffee", "Opening hours", "Our beans", "Reserve a table"];
          break;
        }

        case "menu_breakfast": {
          const b = getBreakfastCardData();
          responseText = b.message;
          card = { type: "menu", data: b.item };
          quickReplies = b.suggestedReplies;
          break;
        }

        case "menu_lunch": {
          const l = getLunchCardData();
          responseText = l.message;
          card = { type: "menu", data: l.item };
          quickReplies = l.suggestedReplies;
          break;
        }

        case "menu_dinner": {
          const d = getDinnerStatusCardData();
          responseText = d.message;
          card = { type: "menu", data: d.item };
          quickReplies = d.suggestedReplies;
          break;
        }

        case "menu_vegetarian": {
          const v = getVegetarianCardData();
          responseText = v.message;
          card = { type: "menu", data: v.item };
          quickReplies = v.suggestedReplies;
          break;
        }

        case "menu_spicy": {
          const s = getSpicyCardData();
          responseText = s.message;
          card = { type: "menu", data: s.item };
          quickReplies = s.suggestedReplies;
          break;
        }

        case "menu_popular": {
          const p = getPopularDishCardData();
          responseText = p.message;
          card = { type: "menu", data: p.item };
          quickReplies = p.suggestedReplies;
          break;
        }

        case "menu_item_query": {
          const q = getItemQueryCardData(userInput);
          responseText = q.message;
          if (q.item) {
            card = { type: "menu", data: q.item };
          }
          quickReplies = q.suggestedReplies;
          break;
        }

        case "recommendation": {
          const rec = getRecommendations(match.facet || "general");
          responseText = rec.message;
          if (rec.item) {
            card = { type: "menu", data: rec.item };
          } else if (rec.product) {
            card = { type: "product", data: rec.product };
          }
          quickReplies = rec.suggestedReplies;
          break;
        }

        case "hours": {
          responseText =
            "We roast and brew seven days a week. Mornings are calm and laptop-friendly; afternoons transition into screen-light conversation and slow tasting.";
          card = { type: "hours", data: getHoursCardData() };
          quickReplies = ["Where are you located?", "Reserve a table", "Menu"];
          break;
        }

        case "location": {
          responseText =
            "We are tucked along Lantern Lane in Poblacion, Makati. A quiet sanctuary behind a wooden sliding door.";
          card = { type: "location", data: getLocationCardData() };
          quickReplies = ["Opening hours", "Reserve a table", "Menu"];
          break;
        }

        case "reservation": {
          const start = startReservation();
          this.reservationState = start.state;
          responseText = start.reply;
          quickReplies = start.quickReplies;
          break;
        }

        case "roastery": {
          responseText =
            "We roast in small, deliberate batches behind our counter. Every single-origin lot names the farm, altitude, and producer.";
          const bean = findRoasteryProduct(userInput);
          if (bean) {
            card = { type: "product", data: bean };
          }
          quickReplies = ["Brewing tips", "Shipping info", "Menu", "Reserve a table"];
          break;
        }

        case "brewing_tips": {
          responseText =
            "For a clean, articulate cup at home on the Hario V60: use 15g coffee to 240g water (1:16 ratio) at 92°C. Bloom with 45g for 45 seconds with a gentle swirl, then finish with two continuous center-outward spiral pours by 2:45.";
          quickReplies = ["Our beans", "Menu", "Reserve a table"];
          break;
        }

        case "shipping": {
          responseText =
            "We roast fresh in Poblacion and ship nationwide across the Philippines. Metro Manila parcels arrive in 2–3 business days (₱120 standard rate), with complimentary shipping on bean orders above ₱1,500.";
          quickReplies = ["Our beans", "Return policy", "Menu"];
          break;
        }

        case "refund": {
          responseText =
            "Because coffee beans are freshly roasted perishables, we cannot accept returns once opened. For handcrafted ceramics and zakka merchandise, returns or exchanges in original condition are welcome within 14 days.";
          quickReplies = ["Our beans", "Contact", "Menu"];
          break;
        }

        case "contact": {
          responseText =
            "You may reach our team at hello@shizukacafe.com or call us at +63 2 8555 0123 during operating hours. We are always glad to assist.";
          quickReplies = ["Opening hours", "Location", "Reserve a table"];
          break;
        }

        case "thanks": {
          responseText =
            "どういたしまして (You are most welcome). Take your time and enjoy a peaceful moment. ごゆっくりどうぞ。";
          quickReplies = ["Menu", "Our beans", "Reserve a table"];
          break;
        }

        case "fallback":
        default: {
          responseText =
            "Our quiet focus is on coffee, tea, and moments of calm here at Shizuka. While I may not have an answer for that, I would be delighted to guide you through our menu, roastery beans, or reserving a seat.";
          quickReplies = ["Menu", "Opening hours", "Recommend a coffee", "Reserve a table"];
          break;
        }
      }
    }

    // Streaming behavior
    if (reducedMotion) {
      // Yield full response immediately
      yield {
        chunk: responseText,
        finalMeta: {
          quickReplies,
          card
        }
      };
      return;
    }

    // Natural typing delay: 400-600ms before starting
    try {
      await sleep(450, signal);
    } catch {
      return;
    }

    // Tokenize into words
    const words = responseText.split(" ");
    let accumulated = "";

    for (let i = 0; i < words.length; i++) {
      if (signal?.aborted) return;

      const isLast = i === words.length - 1;
      const wordWithSpace = i === 0 ? words[i] : ` ${words[i]}`;
      accumulated += wordWithSpace;

      yield {
        chunk: wordWithSpace,
        finalMeta: isLast
          ? {
              quickReplies,
              card
            }
          : undefined
      };

      if (!isLast) {
        // Natural typing pause per word (25–35ms)
        try {
          await sleep(28, signal);
        } catch {
          return;
        }
      }
    }
  }
}

