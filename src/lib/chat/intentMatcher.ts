import type { Intent, RecommendationFacet } from "./types";

export interface MatchResult {
  intent: Intent;
  score: number;
  facet?: RecommendationFacet;
  keywordMatch?: string;
}

interface IntentDefinition {
  intent: Intent;
  exactPhrases?: string[];
  keywords: Array<{ word: string; weight: number }>;
  facet?: RecommendationFacet;
}

const INTENT_DEFINITIONS: IntentDefinition[] = [
  // Greetings
  {
    intent: "greeting",
    exactPhrases: ["hi", "hello", "hey", "good morning", "good afternoon", "good evening", "konnichiwa", "yo"],
    keywords: [
      { word: "hello", weight: 10 },
      { word: "hi", weight: 10 },
      { word: "hey", weight: 9 },
      { word: "morning", weight: 8 },
      { word: "afternoon", weight: 8 },
      { word: "konnichiwa", weight: 12 },
      { word: "greetings", weight: 9 }
    ]
  },

  // Breakfast
  {
    intent: "menu_breakfast",
    exactPhrases: [
      "what s for breakfast",
      "whats for breakfast",
      "what is for breakfast",
      "breakfast menu",
      "breakfast",
      "morning menu"
    ],
    keywords: [
      { word: "breakfast", weight: 16 },
      { word: "morning", weight: 8 },
      { word: "sando", weight: 8 },
      { word: "tamago", weight: 8 },
      { word: "french", weight: 7 },
      { word: "toast", weight: 7 },
      { word: "pancake", weight: 7 },
      { word: "teishoku", weight: 8 },
      { word: "granola", weight: 7 }
    ]
  },

  // Lunch
  {
    intent: "menu_lunch",
    exactPhrases: [
      "what s for lunch",
      "whats for lunch",
      "what is for lunch",
      "lunch menu",
      "lunch"
    ],
    keywords: [
      { word: "lunch", weight: 16 },
      { word: "curry", weight: 8 },
      { word: "katsu", weight: 8 },
      { word: "ikura", weight: 8 },
      { word: "soba", weight: 8 }
    ]
  },

  // Dinner
  {
    intent: "menu_dinner",
    exactPhrases: [
      "is dinner being served",
      "is dinner served",
      "is dinner available",
      "dinner menu",
      "dinner hours",
      "dinner time",
      "dinner",
      "what s for dinner",
      "whats for dinner"
    ],
    keywords: [
      { word: "dinner", weight: 16 },
      { word: "served", weight: 7 },
      { word: "evening", weight: 8 },
      { word: "shogayaki", weight: 8 }
    ]
  },

  // Spicy
  {
    intent: "menu_spicy",
    exactPhrases: [
      "anything spicy",
      "is anything spicy",
      "something spicy",
      "spicy food",
      "spicy dishes",
      "spicy"
    ],
    keywords: [
      { word: "spicy", weight: 18 },
      { word: "spice", weight: 14 },
      { word: "chili", weight: 12 },
      { word: "gochujang", weight: 14 },
      { word: "kimchi", weight: 12 },
      { word: "tteokbokki", weight: 14 }
    ]
  },

  // Vegetarian
  {
    intent: "menu_vegetarian",
    exactPhrases: [
      "something vegetarian",
      "anything vegetarian",
      "vegetarian food",
      "vegetarian options",
      "vegetarian dishes",
      "vegetarian",
      "veggie"
    ],
    keywords: [
      { word: "vegetarian", weight: 18 },
      { word: "veggie", weight: 14 },
      { word: "meatless", weight: 12 }
    ]
  },

  // Popular
  {
    intent: "menu_popular",
    exactPhrases: [
      "what s your most popular dish",
      "whats your most popular dish",
      "what is your most popular dish",
      "most popular dish",
      "popular dish",
      "popular dishes",
      "most popular",
      "bestseller",
      "signature dish",
      "best dish"
    ],
    keywords: [
      { word: "popular", weight: 16 },
      { word: "bestseller", weight: 14 },
      { word: "signature", weight: 12 },
      { word: "favorite", weight: 9 }
    ]
  },

  // Specific Dish Query
  {
    intent: "menu_item_query",
    exactPhrases: [
      "how much is the ramen",
      "how much is ramen",
      "ramen price",
      "what s in the bibimbap",
      "whats in the bibimbap",
      "what is in the bibimbap",
      "bibimbap ingredients",
      "tell me about bibimbap",
      "how much is bibimbap"
    ],
    keywords: [
      { word: "ramen", weight: 16 },
      { word: "bibimbap", weight: 16 },
      { word: "udon", weight: 12 },
      { word: "soba", weight: 12 },
      { word: "shoyu", weight: 12 },
      { word: "curry", weight: 8 },
      { word: "ingredients", weight: 9 },
      { word: "price", weight: 8 },
      { word: "cost", weight: 8 }
    ]
  },

  // Menu general
  {
    intent: "menu",
    exactPhrases: ["menu", "drinks", "food", "what do you serve", "see menu", "drink menu", "food menu"],
    keywords: [
      { word: "menu", weight: 12 },
      { word: "drinks", weight: 9 },
      { word: "food", weight: 9 },
      { word: "serve", weight: 7 },
      { word: "pastry", weight: 7 },
      { word: "pastries", weight: 7 },
      { word: "tea", weight: 6 },
      { word: "latte", weight: 6 },
      { word: "matcha", weight: 7 },
      { word: "brunch", weight: 7 },
      { word: "prices", weight: 8 }
    ]
  },

  // Recommendations: Dairy-free
  {
    intent: "recommendation",
    facet: "dairy_free",
    exactPhrases: [
      "do you have anything dairy-free",
      "do you have anything dairy free",
      "anything dairy-free",
      "anything dairy free",
      "dairy free",
      "dairy-free",
      "vegan",
      "plant based",
      "oat milk",
      "non dairy"
    ],
    keywords: [
      { word: "dairy", weight: 15 },
      { word: "dairy-free", weight: 16 },
      { word: "vegan", weight: 10 },
      { word: "oat", weight: 9 },
      { word: "lactose", weight: 14 },
      { word: "plant", weight: 8 }
    ]
  },

  // Recommendations: Sweet
  {
    intent: "recommendation",
    facet: "sweet",
    exactPhrases: ["sweet", "sweet coffee", "sweet drink", "dessert"],
    keywords: [
      { word: "sweet", weight: 11 },
      { word: "sugar", weight: 9 },
      { word: "honey", weight: 8 },
      { word: "syrup", weight: 8 },
      { word: "dessert", weight: 8 },
      { word: "chocolate", weight: 7 },
      { word: "pastry", weight: 6 }
    ]
  },

  // Recommendations: Strong
  {
    intent: "recommendation",
    facet: "strong",
    exactPhrases: ["strong coffee", "bold coffee", "caffeine", "high caffeine"],
    keywords: [
      { word: "strong", weight: 11 },
      { word: "bold", weight: 10 },
      { word: "caffeine", weight: 10 },
      { word: "intense", weight: 9 },
      { word: "espresso", weight: 8 },
      { word: "dark", weight: 7 }
    ]
  },

  // Recommendations: Light / Floral
  {
    intent: "recommendation",
    facet: "light",
    exactPhrases: ["light coffee", "tea like", "floral coffee", "mild coffee"],
    keywords: [
      { word: "light", weight: 10 },
      { word: "delicate", weight: 10 },
      { word: "floral", weight: 10 },
      { word: "mild", weight: 9 },
      { word: "jasmine", weight: 8 },
      { word: "fruity", weight: 8 }
    ]
  },

  // Recommendations: Cold / Iced
  {
    intent: "recommendation",
    facet: "cold",
    exactPhrases: ["iced coffee", "cold drink", "cold brew", "iced drink"],
    keywords: [
      { word: "iced", weight: 11 },
      { word: "cold", weight: 10 },
      { word: "chilled", weight: 9 },
      { word: "refreshing", weight: 8 },
      { word: "summer", weight: 7 }
    ]
  },

  // Recommendations: Hot / Comforting
  {
    intent: "recommendation",
    facet: "hot",
    exactPhrases: ["hot coffee", "warm drink", "steamed"],
    keywords: [
      { word: "hot", weight: 10 },
      { word: "warm", weight: 10 },
      { word: "steamed", weight: 8 },
      { word: "cortado", weight: 8 }
    ]
  },

  // General Recommendation
  {
    intent: "recommendation",
    facet: "general",
    exactPhrases: ["recommend a coffee", "recommendation", "what should i get", "what do you recommend", "popular"],
    keywords: [
      { word: "recommend", weight: 12 },
      { word: "recommendation", weight: 12 },
      { word: "suggest", weight: 10 },
      { word: "favorite", weight: 8 },
      { word: "popular", weight: 8 },
      { word: "best", weight: 8 }
    ]
  },

  // Hours
  {
    intent: "hours",
    exactPhrases: ["hours", "opening hours", "when are you open", "what time do you open", "closing time", "schedule"],
    keywords: [
      { word: "hours", weight: 12 },
      { word: "open", weight: 10 },
      { word: "opening", weight: 10 },
      { word: "close", weight: 9 },
      { word: "closing", weight: 9 },
      { word: "time", weight: 6 },
      { word: "today", weight: 5 },
      { word: "weekend", weight: 6 },
      { word: "holidays", weight: 6 }
    ]
  },

  // Location
  {
    intent: "location",
    exactPhrases: ["location", "where are you", "address", "directions", "how to get there", "where are you located"],
    keywords: [
      { word: "location", weight: 12 },
      { word: "address", weight: 12 },
      { word: "where", weight: 9 },
      { word: "directions", weight: 10 },
      { word: "poblacion", weight: 11 },
      { word: "makati", weight: 10 },
      { word: "map", weight: 8 },
      { word: "parking", weight: 7 }
    ]
  },

  // Reservation / Booking
  {
    intent: "reservation",
    exactPhrases: ["reserve a table", "reservation", "book a table", "reserve", "book", "table for 2", "booking"],
    keywords: [
      { word: "reserve", weight: 12 },
      { word: "reservation", weight: 13 },
      { word: "book", weight: 11 },
      { word: "booking", weight: 11 },
      { word: "table", weight: 9 },
      { word: "seat", weight: 8 },
      { word: "party", weight: 7 },
      { word: "omakase", weight: 9 }
    ]
  },

  // Roastery / Beans
  {
    intent: "roastery",
    exactPhrases: ["our beans", "beans", "coffee beans", "buy beans", "roastery", "whole bean"],
    keywords: [
      { word: "beans", weight: 12 },
      { word: "bean", weight: 11 },
      { word: "roast", weight: 9 },
      { word: "roastery", weight: 11 },
      { word: "bag", weight: 7 },
      { word: "whole", weight: 7 },
      { word: "ethiopia", weight: 10 },
      { word: "geisha", weight: 10 },
      { word: "kenya", weight: 9 },
      { word: "colombia", weight: 9 },
      { word: "grind", weight: 7 }
    ]
  },

  // Brewing Tips
  {
    intent: "brewing_tips",
    exactPhrases: ["brewing tips", "how to brew", "brew ratio", "v60 recipe", "pour over recipe"],
    keywords: [
      { word: "brew", weight: 11 },
      { word: "brewing", weight: 11 },
      { word: "recipe", weight: 10 },
      { word: "ratio", weight: 10 },
      { word: "v60", weight: 10 },
      { word: "pour-over", weight: 9 },
      { word: "pourover", weight: 9 },
      { word: "temperature", weight: 8 },
      { word: "grinder", weight: 7 }
    ]
  },

  // Shipping
  {
    intent: "shipping",
    exactPhrases: ["shipping", "delivery", "do you ship", "shipping rates", "delivery time"],
    keywords: [
      { word: "ship", weight: 11 },
      { word: "shipping", weight: 12 },
      { word: "delivery", weight: 11 },
      { word: "deliver", weight: 10 },
      { word: "courier", weight: 8 },
      { word: "dispatch", weight: 8 },
      { word: "provincial", weight: 7 },
      { word: "manila", weight: 6 }
    ]
  },

  // Refund / Returns
  {
    intent: "refund",
    exactPhrases: ["refund", "return policy", "returns", "exchange"],
    keywords: [
      { word: "refund", weight: 12 },
      { word: "return", weight: 12 },
      { word: "returns", weight: 12 },
      { word: "exchange", weight: 10 },
      { word: "cancel", weight: 8 },
      { word: "damaged", weight: 8 }
    ]
  },

  // Contact
  {
    intent: "contact",
    exactPhrases: ["contact", "phone number", "email", "how to contact you", "instagram"],
    keywords: [
      { word: "contact", weight: 12 },
      { word: "phone", weight: 11 },
      { word: "email", weight: 11 },
      { word: "call", weight: 8 },
      { word: "instagram", weight: 9 },
      { word: "line", weight: 7 }
    ]
  },

  // Thanks
  {
    intent: "thanks",
    exactPhrases: ["thanks", "thank you", "arigato", "domo", "appreciate it"],
    keywords: [
      { word: "thank", weight: 11 },
      { word: "thanks", weight: 11 },
      { word: "arigato", weight: 12 },
      { word: "arigatou", weight: 12 },
      { word: "appreciate", weight: 9 },
      { word: "helpful", weight: 8 }
    ]
  }
];

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Deterministic scoring matching intent against query.
 */
export function matchIntent(rawText: string): MatchResult {
  const text = normalize(rawText);
  if (!text) {
    return { intent: "fallback", score: 0 };
  }

  const tokens = text.split(" ");
  let highestScore = 0;
  let bestIntent: Intent = "fallback";
  let bestFacet: RecommendationFacet | undefined;

  for (const def of INTENT_DEFINITIONS) {
    let score = 0;

    // 1. Exact phrase match gives an immediate high score bonus
    if (def.exactPhrases) {
      for (const phrase of def.exactPhrases) {
        if (text === phrase) {
          score += 40;
        } else if (text.includes(phrase)) {
          score += 25;
        }
      }
    }

    // 2. Keyword matching
    for (const kw of def.keywords) {
      if (tokens.includes(kw.word)) {
        score += kw.weight;
      } else if (text.includes(kw.word)) {
        score += Math.floor(kw.weight * 0.75);
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestIntent = def.intent;
      bestFacet = def.facet;
    }
  }

  // Threshold check: if score is too low, treat as fallback
  if (highestScore < 8) {
    return { intent: "fallback", score: highestScore };
  }

  return {
    intent: bestIntent,
    score: highestScore,
    facet: bestFacet
  };
}

