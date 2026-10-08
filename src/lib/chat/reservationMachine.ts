import { checkOperatingHours } from "./knowledge";
import type { BookingDraft, CardPayload } from "./types";

export type ReservationStep =
  | "IDLE"
  | "ASK_DATE"
  | "ASK_TIME"
  | "ASK_PARTY"
  | "ASK_NAME"
  | "CONFIRMATION"
  | "CONFIRMED";

export interface ReservationMachineState {
  step: ReservationStep;
  draft: BookingDraft;
  dateObj?: string; // ISO string
  reference?: string;
}

export const INITIAL_RESERVATION_STATE: ReservationMachineState = {
  step: "IDLE",
  draft: {
    date: "",
    time: "",
    partySize: 2,
    name: ""
  }
};

function formatDateHuman(d: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric"
  };
  return d.toLocaleDateString("en-US", options);
}

function getTodayString(): string {
  const d = new Date();
  return d.toISOString().split("T")[0];
}

function getTomorrowString(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

/**
 * Initiates the reservation flow.
 */
export function startReservation(): {
  state: ReservationMachineState;
  reply: string;
  quickReplies: string[];
} {
  const state: ReservationMachineState = {
    step: "ASK_DATE",
    draft: {
      date: "",
      time: "",
      partySize: 2,
      name: ""
    }
  };

  return {
    state,
    reply: "We would be honored to hold a seat for you. Which day would you like to visit Shizuka?",
    quickReplies: ["Today", "Tomorrow", "This Saturday", "This Sunday"]
  };
}

/**
 * Handles each step of the reservation flow.
 */
export function handleReservationInput(
  rawInput: string,
  currentState: ReservationMachineState
): {
  state: ReservationMachineState;
  reply: string;
  quickReplies?: string[];
  card?: CardPayload;
  isFinished?: boolean;
} {
  const text = rawInput.trim();
  const lower = text.toLowerCase();

  // Allow canceling the flow at any point
  if (lower === "cancel" || lower === "never mind" || lower === "stop booking") {
    return {
      state: INITIAL_RESERVATION_STATE,
      reply: "The reservation has been quietly cancelled. Let me know if you would like to explore our menu, hours, or beans instead.",
      quickReplies: ["Menu", "Opening hours", "Recommend a coffee", "Our beans"]
    };
  }

  switch (currentState.step) {
    case "ASK_DATE": {
      let targetDate: Date = new Date();
      let dateLabel = "";

      if (lower.includes("today")) {
        targetDate = new Date();
        dateLabel = `Today (${formatDateHuman(targetDate)})`;
      } else if (lower.includes("tomorrow")) {
        targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 1);
        dateLabel = `Tomorrow (${formatDateHuman(targetDate)})`;
      } else if (lower.includes("saturday")) {
        targetDate = new Date();
        const day = targetDate.getDay();
        const diff = (6 - day + 7) % 7 || 7;
        targetDate.setDate(targetDate.getDate() + diff);
        dateLabel = formatDateHuman(targetDate);
      } else if (lower.includes("sunday")) {
        targetDate = new Date();
        const day = targetDate.getDay();
        const diff = (7 - day) % 7 || 7;
        targetDate.setDate(targetDate.getDate() + diff);
        dateLabel = formatDateHuman(targetDate);
      } else {
        // Try parsing user provided date
        const parsed = new Date(text);
        if (!isNaN(parsed.getTime())) {
          targetDate = parsed;
          dateLabel = formatDateHuman(targetDate);
        } else {
          dateLabel = text;
        }
      }

      // Format date for state
      const year = targetDate.getFullYear();
      const month = String(targetDate.getMonth() + 1).padStart(2, "0");
      const day = String(targetDate.getDate()).padStart(2, "0");
      const dateIso = `${year}-${month}-${day}`;

      const { suggestedSlots } = checkOperatingHours(targetDate, "12:00");

      const nextState: ReservationMachineState = {
        ...currentState,
        step: "ASK_TIME",
        dateObj: targetDate.toISOString(),
        draft: {
          ...currentState.draft,
          date: dateLabel || dateIso
        }
      };

      return {
        state: nextState,
        reply: `A calm visit for ${dateLabel || dateIso}. What time would suit your schedule?`,
        quickReplies: suggestedSlots
      };
    }

    case "ASK_TIME": {
      // Clean time input (e.g. "2:00 PM" -> "14:00", "14:00" -> "14:00")
      let cleanTime = text;
      const match12 = text.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i);
      if (match12) {
        let hr = parseInt(match12[1], 10);
        const mn = match12[2] ? match12[2] : "00";
        const ampm = match12[3].toLowerCase();
        if (ampm === "pm" && hr < 12) hr += 12;
        if (ampm === "am" && hr === 12) hr = 0;
        cleanTime = `${String(hr).padStart(2, "0")}:${mn}`;
      } else {
        const match24 = text.match(/(\d{1,2}):(\d{2})/);
        if (match24) {
          cleanTime = `${String(parseInt(match24[1], 10)).padStart(2, "0")}:${match24[2]}`;
        }
      }

      const date = currentState.dateObj ? new Date(currentState.dateObj) : new Date();
      const hoursCheck = checkOperatingHours(date, cleanTime);

      if (!hoursCheck.isValid) {
        return {
          state: currentState,
          reply: `${hoursCheck.reason || "That slot falls outside our operating hours."} Please choose an available time:`,
          quickReplies: hoursCheck.suggestedSlots
        };
      }

      const nextState: ReservationMachineState = {
        ...currentState,
        step: "ASK_PARTY",
        draft: {
          ...currentState.draft,
          time: cleanTime
        }
      };

      return {
        state: nextState,
        reply: `Table at ${cleanTime} noted. How many guests will be joining?`,
        quickReplies: ["1 guest", "2 guests", "3 guests", "4 guests", "5 guests", "6+ guests"]
      };
    }

    case "ASK_PARTY": {
      const match = text.match(/\d+/);
      const party = match ? parseInt(match[0], 10) : 2;

      if (party > 8) {
        return {
          state: currentState,
          reply: "For gatherings larger than 8 guests, please reach out to us directly at hello@shizukacafe.com to arrange a private seating. For online booking, our maximum is 8 guests.",
          quickReplies: ["2 guests", "4 guests", "6 guests", "8 guests"]
        };
      }

      const nextState: ReservationMachineState = {
        ...currentState,
        step: "ASK_NAME",
        draft: {
          ...currentState.draft,
          partySize: Math.max(1, party)
        }
      };

      return {
        state: nextState,
        reply: "Under whose name may we hold the table?",
        quickReplies: []
      };
    }

    case "ASK_NAME": {
      const name = text.replace(/^(my name is|name is|i am)\s+/i, "").trim() || "Guest";

      const updatedDraft: BookingDraft = {
        ...currentState.draft,
        name
      };

      const nextState: ReservationMachineState = {
        ...currentState,
        step: "CONFIRMATION",
        draft: updatedDraft
      };

      return {
        state: nextState,
        reply: `Thank you, ${name}. Please review your reservation details below:`,
        quickReplies: ["Confirm Reservation", "Change details", "Cancel"],
        card: {
          type: "booking_summary",
          data: updatedDraft
        }
      };
    }

    case "CONFIRMATION": {
      if (lower.includes("confirm") || lower.includes("yes") || lower.includes("proceed")) {
        // Generate pseudo-random reference code e.g. SHZ-4821
        const refCode = `SHZ-${Math.floor(1000 + Math.random() * 9000)}`;

        const nextState: ReservationMachineState = {
          ...currentState,
          step: "CONFIRMED",
          reference: refCode
        };

        return {
          state: nextState,
          reply: `ご予約ありがとうございます (Thank you for reserving). A quiet table has been set aside under reference ${refCode}. We look forward to welcoming you.`,
          quickReplies: ["Add to calendar", "Menu", "Opening hours", "Our beans"],
          card: {
            type: "booking_confirmed",
            data: {
              booking: currentState.draft,
              reference: refCode
            }
          },
          isFinished: true
        };
      } else if (lower.includes("change") || lower.includes("edit")) {
        return startReservation();
      } else {
        return {
          state: currentState,
          reply: "Would you like to confirm this reservation or make any adjustments?",
          quickReplies: ["Confirm Reservation", "Change details", "Cancel"],
          card: {
            type: "booking_summary",
            data: currentState.draft
          }
        };
      }
    }

    default:
      return startReservation();
  }
}

