import { site } from "@/data/site";
import { menuItems } from "@/data/menu";
import { products } from "@/data/products";
import { faqs } from "@/data/content";
import type {
  HoursCardData,
  LocationCardData,
  MenuItemCardData,
  ProductCardData,
  RecommendationFacet
} from "./types";

/**
 * Knowledge Base for Shizuka Café Demo AI Engine.
 * Reuses site configurations, menu items, and roastery products.
 */

export const CAFE_INFO = {
  name: site.name,
  nameJP: site.nameJP,
  tagline: site.tagline,
  established: site.established,
  phone: site.phone,
  email: site.email,
  address: site.address,
  hours: site.hours,
  socials: site.socials
};

export const BREWING_GUIDES = [
  {
    method: "Hario V60",
    ratio: "1:16 (15g coffee to 240g water)",
    temp: "92°C – 93°C",
    grind: "Medium-fine (like sea salt)",
    time: "2:30 – 2:45 min",
    notes: "Bloom with 45g water for 45 seconds with a gentle swirl. Pour remaining water in two slow spiral pulses."
  },
  {
    method: "French Press / Cafetière",
    ratio: "1:15 (20g coffee to 300g water)",
    temp: "94°C",
    grind: "Coarse",
    time: "4:00 min",
    notes: "Steep 4 minutes, gently break the crust, skim foam, and plunge slowly without compressing the bed."
  },
  {
    method: "Kyoto Cold Drip / Cold Brew",
    ratio: "1:8 (50g coffee to 400ml cold water)",
    temp: "Chilled filtered water",
    grind: "Coarse",
    time: "16 – 18 hours",
    notes: "Steep in refrigerator. Filter through a fine paper or cloth dripper for a wine-like, chocolate-rich cup."
  }
];

export const POLICIES = {
  reservations: {
    rule: "Walk-ins are warmly welcomed. Reservations are recommended for the Omakase tasting bar and weekend brunch.",
    duration: "90 minutes per seating to preserve calm for all guests.",
    maxOnlineParty: 8,
    leadTime: "Up to 30 days in advance."
  },
  shipping: {
    philippines: "We deliver across Metro Manila in 2–3 business days, and provincial areas in 4–7 business days.",
    rates: "Standard delivery ₱120 within Metro Manila. Complimentary shipping on coffee bean orders over ₱1,500.",
    roasting: "All beans are roasted in small batches in Poblacion and dispatched within 48 hours of roast date."
  },
  refund: {
    beans: "Because coffee beans are freshly roasted perishables, we cannot accept returns once opened.",
    merchandise: "Ceramics and zakka homewares in original unused condition may be returned or exchanged within 14 days."
  }
};

/**
 * Returns formatted hours card data
 */
export function getHoursCardData(): HoursCardData {
  return {
    schedule: site.hours,
    note: "Last seating & final espresso orders taken 30 minutes before closing."
  };
}

/**
 * Returns location card data
 */
export function getLocationCardData(): LocationCardData {
  return {
    name: "Shizuka Café & Roastery",
    line1: site.address.line1,
    city: site.address.city,
    region: site.address.region,
    postcode: site.address.postcode,
    directionsHint: "Tucked quietly into Poblacion, near the lantern crossing. Bicycle rack available out front.",
    googleMapsUrl: "https://maps.google.com/?q=12+Lantern+Lane+Poblacion+Makati+City"
  };
}

/**
 * Helper to convert a MenuItem to Chat MenuItemCardData
 */
export function toMenuItemCardData(item: any): MenuItemCardData {
  return {
    id: item.id,
    name: item.name,
    jp: item.jp || item.japaneseName,
    price: item.price,
    description: item.description,
    category: item.category,
    dietary: item.dietary,
    imageLabel: item.imageLabel,
    imageSrc: item.image?.src || (item.slug ? `/images/menu/${item.slug}.webp` : undefined),
    isSignature: item.isSignature,
    availableLabel:
      item.available === "all-day"
        ? "All Day"
        : typeof item.available === "object"
        ? `${item.available.from} – ${item.available.to}`
        : undefined
  };
}

/**
 * Retrieves recommendations matched to a specific facet.
 */
export function getRecommendations(facet: RecommendationFacet): {
  message: string;
  item?: MenuItemCardData;
  product?: ProductCardData;
  suggestedReplies: string[];
} {
  switch (facet) {
    case "dairy_free": {
      const match =
        menuItems.find((i) => i.slug === "cold-sesame-soba") ||
        menuItems.find((i) => i.dietary?.includes("dairy-free")) ||
        menuItems[6];
      return {
        message:
          "We offer nourishing dairy-free dishes including our Cold Sesame Soba, Mushroom Udon, and Salmon Ikura Don. For beverages, our Ceremonial Matcha and single-origin pour overs are completely plant-based, and oat milk is gladly provided for all espresso lattes.",
        item: toMenuItemCardData(match),
        suggestedReplies: ["Something vegetarian", "What's in the bibimbap?", "Our beans", "Opening hours"]
      };
    }

    case "sweet": {
      const match = menuItems.find((i) => i.id === "m11") || menuItems.find((i) => i.category === "noncoffee");
      return {
        message: "If you are craving a gentle sweetness, the Honey Yuzu Tonic balances bright citrus and raw local honey. Or pair your cup with our thick-cut Nagasaki Castella.",
        item: match ? toMenuItemCardData(match) : undefined,
        suggestedReplies: ["Tell me about Castella", "Coffee recommendations", "Menu"]
      };
    }

    case "strong": {
      const espresso = menuItems.find((i) => i.id === "m2") || menuItems[1];
      const blend = products.find((p) => p.roast.includes("Medium-Dark") || p.name.includes("Espresso")) || products[5];
      return {
        message: "For a deep, focused cup, our house Espresso pulls a double ristretto with dark cocoa richness. If brewing at home, our Shizuka Espresso Blend carries notes of roasted hazelnut and dark chocolate.",
        item: {
          id: espresso.id,
          name: espresso.name,
          jp: espresso.jp,
          price: espresso.price,
          description: espresso.description,
          dietary: espresso.dietary,
          imageLabel: espresso.imageLabel
        },
        product: {
          id: blend.id,
          slug: blend.slug,
          name: blend.name,
          jp: blend.jp,
          origin: blend.origin,
          roast: blend.roast,
          process: blend.process,
          price: blend.price,
          tastingNotes: blend.tastingNotes,
          imageLabel: blend.imageLabel
        },
        suggestedReplies: ["View Espresso Blend", "Flat White", "Menu"]
      };
    }

    case "light": {
      const pourOver = menuItems.find((i) => i.id === "m1") || menuItems[0];
      const ethiopia = products.find((p) => p.slug.includes("ethiopia")) || products[0];
      return {
        message: "For something delicate and tea-like, our Ethiopia Yirgacheffe Pour Over offers jasmine florals, bergamot, and sweet stone fruit with a feather-light finish.",
        item: {
          id: pourOver.id,
          name: pourOver.name,
          jp: pourOver.jp,
          price: pourOver.price,
          description: pourOver.description,
          dietary: pourOver.dietary,
          imageLabel: pourOver.imageLabel
        },
        product: {
          id: ethiopia.id,
          slug: ethiopia.slug,
          name: ethiopia.name,
          jp: ethiopia.jp,
          origin: ethiopia.origin,
          roast: ethiopia.roast,
          process: ethiopia.process,
          price: ethiopia.price,
          tastingNotes: ethiopia.tastingNotes,
          imageLabel: ethiopia.imageLabel
        },
        suggestedReplies: ["Our beans", "Ceremonial Matcha", "Reserve a table"]
      };
    }

    case "cold": {
      const coldBrew = menuItems.find((i) => i.id === "m5") || menuItems[4];
      return {
        message: "On warmer days, our 18-hour slow steeped Cold Brew served over a single clear ice block is remarkably smooth, with notes of cacao nib and dried fig.",
        item: {
          id: coldBrew.id,
          name: coldBrew.name,
          jp: coldBrew.jp,
          price: coldBrew.price,
          description: coldBrew.description,
          dietary: coldBrew.dietary,
          imageLabel: coldBrew.imageLabel
        },
        suggestedReplies: ["Sudachi Soda", "Menu", "Opening hours"]
      };
    }

    case "hot":
    default: {
      const cortado = menuItems.find((i) => i.id === "m3") || menuItems[2];
      return {
        message: "A favorite quiet companion is our Cortado — equal parts espresso and warm silky milk in an amber glass, offering warmth without heaviness.",
        item: {
          id: cortado.id,
          name: cortado.name,
          jp: cortado.jp,
          price: cortado.price,
          description: cortado.description,
          dietary: cortado.dietary,
          imageLabel: cortado.imageLabel
        },
        suggestedReplies: ["Menu", "Our beans", "Reserve a table", "Opening hours"]
      };
    }
  }
}

/**
 * Searches roastery products by keyword.
 */
export function findRoasteryProduct(query: string): ProductCardData | undefined {
  const q = query.toLowerCase();
  const match = products.find(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.origin.toLowerCase().includes(q) ||
      p.tastingNotes.some((t) => t.toLowerCase().includes(q)) ||
      p.roast.toLowerCase().includes(q)
  );

  const chosen = match || products[0];
  return {
    id: chosen.id,
    slug: chosen.slug,
    name: chosen.name,
    jp: chosen.jp,
    origin: chosen.origin,
    roast: chosen.roast,
    process: chosen.process,
    price: chosen.price,
    tastingNotes: chosen.tastingNotes,
    imageLabel: chosen.imageLabel
  };
}

/**
 * Validates if a reservation slot is within operating hours.
 */
export function checkOperatingHours(
  date: Date,
  timeString: string
): { isValid: boolean; reason?: string; suggestedSlots: string[] } {
  const day = date.getDay(); // 0 is Sunday, 6 is Saturday
  const [hourStr, minStr] = timeString.split(":");
  const hour = parseInt(hourStr, 10);
  const min = parseInt(minStr || "0", 10);
  const timeInMinutes = hour * 60 + min;

  // Weekdays: Mon(1) - Fri(5): 7:30 - 19:00 (last booking 18:00 = 1080 mins)
  // Saturday: 8:00 - 20:00 (last booking 19:00 = 1140 mins)
  // Sunday: 8:00 - 18:00 (last booking 17:00 = 1020 mins)

  let openMins = 7 * 60 + 30;
  let lastBookingMins = 18 * 60;
  let closeTimeStr = "19:00";
  let suggested = ["10:30", "12:00", "14:30", "16:00", "17:30"];

  if (day === 6) {
    // Saturday
    openMins = 8 * 60;
    lastBookingMins = 19 * 60;
    closeTimeStr = "20:00";
    suggested = ["10:00", "12:30", "15:00", "17:00", "18:30"];
  } else if (day === 0) {
    // Sunday
    openMins = 8 * 60;
    lastBookingMins = 17 * 60;
    closeTimeStr = "18:00";
    suggested = ["09:30", "11:30", "13:30", "15:00", "16:30"];
  }

  if (isNaN(timeInMinutes)) {
    return {
      isValid: false,
      reason: "Please select a standard time format like 14:00 or 2:00 PM.",
      suggestedSlots: suggested
    };
  }

  if (timeInMinutes < openMins) {
    return {
      isValid: false,
      reason: `We open at ${Math.floor(openMins / 60)}:${(openMins % 60).toString().padStart(2, "0")} AM on this day.`,
      suggestedSlots: suggested
    };
  }

  if (timeInMinutes > lastBookingMins) {
    return {
      isValid: false,
      reason: `Our roastery closes at ${closeTimeStr}. The last reserved seating is at ${Math.floor(lastBookingMins / 60)}:${(lastBookingMins % 60).toString().padStart(2, "0")}.`,
      suggestedSlots: suggested
    };
  }

  return {
    isValid: true,
    suggestedSlots: suggested
  };
}

/**
 * Returns breakfast menu highlight and card data
 */
export function getBreakfastCardData(): {
  message: string;
  item: MenuItemCardData;
  suggestedReplies: string[];
} {
  const item =
    menuItems.find((m) => m.slug === "tamago-sando") ||
    menuItems.find((m) => m.category === "breakfast") ||
    menuItems[0];
  return {
    message:
      "Breakfast at Shizuka is served daily from 7:30 to 11:00 AM. We prepare calming morning plates including our cloud-like Tamago Sando (玉子サンド), thick Shokupan French Toast dusted with kinako, and the traditional Asa Teishoku breakfast set with grilled salmon and miso soup.",
    item: toMenuItemCardData(item),
    suggestedReplies: ["Something vegetarian", "Is dinner being served?", "Most popular dish", "Reserve a table"]
  };
}

/**
 * Returns lunch menu highlight and card data
 */
export function getLunchCardData(): {
  message: string;
  item: MenuItemCardData;
  suggestedReplies: string[];
} {
  const item =
    menuItems.find((m) => m.slug === "chicken-katsu-curry") ||
    menuItems.find((m) => m.category === "lunch") ||
    menuItems[0];
  return {
    message:
      "Lunch is served daily from 11:00 AM to 3:00 PM. Guest favorites include our Chicken Katsu Curry, Bibimbap with seasonal namul, Salmon Ikura Don, and refreshing Cold Sesame Soba.",
    item: toMenuItemCardData(item),
    suggestedReplies: ["What's in the bibimbap?", "Something vegetarian", "How much is the ramen?", "Reserve a table"]
  };
}

/**
 * Returns vegetarian menu highlight and card data
 */
export function getVegetarianCardData(): {
  message: string;
  item: MenuItemCardData;
  suggestedReplies: string[];
} {
  const item =
    menuItems.find((m) => m.slug === "mushroom-udon") ||
    menuItems.find((m) => m.dietary?.includes("vegetarian")) ||
    menuItems[0];
  return {
    message:
      "For vegetarian dining, we offer satisfying dishes crafted with mindfulness: our Mushroom Udon in fragrant kombu dashi, Tamago Sando on Japanese milk bread, Cold Sesame Soba, and Cheese Gimbap.",
    item: toMenuItemCardData(item),
    suggestedReplies: ["Anything spicy", "What's in the bibimbap?", "Do you have anything dairy-free?", "Menu"]
  };
}

/**
 * Returns spicy dishes highlight and card data
 */
export function getSpicyCardData(): {
  message: string;
  item: MenuItemCardData;
  suggestedReplies: string[];
} {
  const item =
    menuItems.find((m) => m.slug === "bibimbap") ||
    menuItems.find((m) => m.dietary?.includes("spicy")) ||
    menuItems[0];
  return {
    message:
      "If you crave warm heat, our kitchen features Beef Bibimbap with house gochujang, chewy Tteokbokki rice cakes in sweet-chili broth, and aged Kimchi Fried Rice topped with a sunny farm egg.",
    item: toMenuItemCardData(item),
    suggestedReplies: ["What's in the bibimbap?", "How much is the ramen?", "What's for breakfast?", "Menu"]
  };
}

/**
 * Returns most popular dish highlight and card data
 */
export function getPopularDishCardData(): {
  message: string;
  item: MenuItemCardData;
  suggestedReplies: string[];
} {
  const item =
    menuItems.find((m) => m.slug === "chicken-katsu-curry") ||
    menuItems.find((m) => m.isSignature) ||
    menuItems[0];
  return {
    message:
      "Our most popular dish is the Chicken Katsu Curry (₱385) — crisp panko chicken cutlet over steamed rice with our rich 12-spice Japanese curry sauce. Other guest favorites include our Shoyu Ramen and Miso-Glazed Cod.",
    item: toMenuItemCardData(item),
    suggestedReplies: ["How much is the ramen?", "What's in the bibimbap?", "Is dinner being served?", "Reserve a table"]
  };
}

/**
 * Returns specific item query info and card data (ramen, bibimbap, etc.)
 */
export function getItemQueryCardData(query: string): {
  message: string;
  item?: MenuItemCardData;
  suggestedReplies: string[];
} {
  const q = query.toLowerCase();

  // Specific check for ramen
  if (q.includes("ramen")) {
    const ramen =
      menuItems.find((m) => m.slug === "shoyu-ramen") ||
      menuItems.find((m) => m.name.toLowerCase().includes("ramen"));
    if (ramen) {
      return {
        message: `Our Shoyu Ramen (醤油ラーメン) is ₱${ramen.price}. It features springy artisan wheat noodles in a 12-hour chicken and dashi broth, topped with slow-braised pork belly chashu, seasoned ajitama egg, menma bamboo shoots, and scallions.`,
        item: toMenuItemCardData(ramen),
        suggestedReplies: ["What's in the bibimbap?", "Most popular dish", "Is dinner being served?", "Reserve a table"]
      };
    }
  }

  // Specific check for bibimbap
  if (q.includes("bibimbap") || q.includes("bibim")) {
    const bibim =
      menuItems.find((m) => m.slug === "bibimbap") ||
      menuItems.find((m) => m.name.toLowerCase().includes("bibimbap"));
    if (bibim) {
      const ingList = bibim.ingredients ? bibim.ingredients.join(", ") : "beef, seasoned vegetables, egg, gochujang";
      return {
        message: `Our Bibimbap (비빔밥, ₱${bibim.price}) is crafted with: ${ingList}. Served in a warm bowl with fragrant toasted sesame oil and artisanal gochujang sauce.`,
        item: toMenuItemCardData(bibim),
        suggestedReplies: ["Anything spicy", "How much is the ramen?", "Something vegetarian", "Reserve a table"]
      };
    }
  }

  // General lookup across menuItems
  const matched = menuItems.find(
    (m) =>
      m.name.toLowerCase().includes(q) ||
      (m.slug && m.slug.toLowerCase().includes(q)) ||
      (m.jp && m.jp.includes(query))
  );

  if (matched) {
    const isPriceQuery = q.includes("how much") || q.includes("price") || q.includes("cost");
    const isIngredientQuery = q.includes("ingredient") || q.includes("what is in") || q.includes("what's in");

    let reply = `Our ${matched.name} (${matched.jp || ""}) is ₱${matched.price}. ${matched.description}`;
    if (isIngredientQuery && matched.ingredients) {
      reply = `Our ${matched.name} is prepared with: ${matched.ingredients.join(", ")}. ${matched.description}`;
    } else if (isPriceQuery) {
      reply = `The ${matched.name} is priced at ₱${matched.price}. ${matched.description}`;
    }

    return {
      message: reply,
      item: toMenuItemCardData(matched),
      suggestedReplies: ["What's for breakfast?", "Something vegetarian", "Menu", "Reserve a table"]
    };
  }

  return {
    message:
      "We have a curated selection of Japanese and Korean specialties, artisan coffees, and house pastries. Would you like to explore our full menu?",
    suggestedReplies: ["Menu", "What's for breakfast?", "Most popular dish", "Reserve a table"]
  };
}

/**
 * Returns current dinner service status and card data (time-aware)
 */
export function getDinnerStatusCardData(now: Date = new Date()): {
  message: string;
  item: MenuItemCardData;
  suggestedReplies: string[];
} {
  const day = now.getDay(); // 0 is Sunday, 6 is Saturday
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // Serving times: Dinner 17:00 until 30 minutes before close
  // Weekdays (Mon-Fri): close 19:00 -> last dinner order 18:30 (1110 min)
  // Saturday: close 20:00 -> last dinner order 19:30 (1170 min)
  // Sunday: close 18:00 -> last dinner order 17:30 (1050 min)
  const dinnerStartMinutes = 17 * 60;
  let lastDinnerMinutes = 18 * 60 + 30;
  let lastDinnerTimeStr = "18:30";

  if (day === 6) {
    lastDinnerMinutes = 19 * 60 + 30;
    lastDinnerTimeStr = "19:30";
  } else if (day === 0) {
    lastDinnerMinutes = 17 * 60 + 30;
    lastDinnerTimeStr = "17:30";
  }

  const cod =
    menuItems.find((m) => m.slug === "miso-glazed-cod") ||
    menuItems.find((m) => m.category === "dinner") ||
    menuItems[0];
  const dinnerCard = toMenuItemCardData(cod);

  if (currentMinutes >= dinnerStartMinutes && currentMinutes <= lastDinnerMinutes) {
    return {
      message: `Yes! Dinner is currently being served. Our evening kitchen is open until ${lastDinnerTimeStr} tonight (30 minutes before closing). We invite you to enjoy our Miso-Glazed Cod, Beef Bulgogi Rice Set, or hot Shoyu Ramen.`,
      item: dinnerCard,
      suggestedReplies: ["Reserve a table", "How much is the ramen?", "Opening hours", "Menu"]
    };
  }

  if (currentMinutes < dinnerStartMinutes) {
    return {
      message: `Dinner service begins at 17:00 this evening (and runs until ${lastDinnerTimeStr}). Right now, our daytime café and lunch menu are being served. Would you like to reserve a table for tonight?`,
      item: dinnerCard,
      suggestedReplies: ["Reserve a table", "Lunch menu", "Opening hours", "Menu"]
    };
  }

  return {
    message: `Dinner service has concluded for today (dinner is served 17:00 until ${lastDinnerTimeStr}). Our roastery reopens tomorrow at 7:30 AM with our breakfast menu, and dinner will return at 17:00.`,
    item: dinnerCard,
    suggestedReplies: ["Reserve a table", "Opening hours", "What's for breakfast?", "Menu"]
  };
}

export { faqs };

