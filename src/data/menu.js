// @ts-check
import { getUnsplashImageUrl } from "@/lib/unsplash";

/**
 * Unified Source of Truth for Shizuka Café Menu Data.
 * Extended with full breakfast, lunch, dinner, and snack offerings.
 */

/**
 * Calculates average rating rounded to 1 decimal place.
 * @param {Array<{ rating: number }>} reviews
 * @returns {number}
 */
export function calculateRating(reviews) {
  if (!reviews || reviews.length === 0) return 5.0;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}

/**
 * Checks whether an item is currently available based on its serving hours.
 * @param {{ from: string, to: string } | "all-day"} available
 * @param {Date} [now]
 * @returns {{ isAvailable: boolean, label: string }}
 */
export function getAvailabilityInfo(available, now = new Date()) {
  if (available === "all-day" || !available) {
    return { isAvailable: true, label: "Available all day" };
  }

  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const [fromH, fromM] = available.from.split(":").map(Number);
  const [toH, toM] = available.to.split(":").map(Number);
  const fromMinutes = fromH * 60 + (fromM || 0);
  const toMinutes = toH * 60 + (toM || 0);

  if (currentMinutes >= fromMinutes && currentMinutes <= toMinutes) {
    return { isAvailable: true, label: "Available now" };
  }

  if (currentMinutes < fromMinutes) {
    return { isAvailable: false, label: `Served from ${available.from}` };
  }

  return { isAvailable: false, label: `Served ${available.from} – ${available.to}` };
}

export const menuCategories = [
  { id: "all", label: "All", jp: "すべて", hours: "Full Range" },
  { id: "breakfast", label: "Breakfast", jp: "朝食", hours: "7:30 – 11:00" },
  { id: "lunch", label: "Lunch", jp: "昼食", hours: "11:00 – 15:00" },
  { id: "dinner", label: "Dinner", jp: "夕食", hours: "17:00 – Close" },
  { id: "snacks", label: "Snacks", jp: "軽食", hours: "All Day" },
  { id: "coffee", label: "Coffee", jp: "珈琲", hours: "All Day" },
  { id: "tea", label: "Tea & Matcha", jp: "茶", hours: "All Day" },
  { id: "pastries", label: "Pastries & Cakes", jp: "菓子", hours: "All Day" },
  { id: "seasonal", label: "Seasonal", jp: "季節", hours: "Limited" }
];

export const dietaryIcons = {
  vegetarian: { label: "Vegetarian", color: "#8A9A82", short: "VEG" },
  vegan: { label: "Vegan", color: "#5C7157", short: "VGN" },
  "dairy-free": { label: "Dairy-Free", color: "#8C8378", short: "DF" },
  spicy: { label: "Spicy", color: "#B85C4F", short: "SPICY" },
  "contains-pork": { label: "Contains Pork", color: "#A87C68", short: "PORK" },
  "contains-seafood": { label: "Contains Seafood", color: "#5E8A99", short: "FISH" },
  // Backward compatibility aliases
  v: { label: "Vegetarian", color: "#8A9A82", short: "VEG" },
  vg: { label: "Vegan", color: "#5C7157", short: "VGN" },
  gf: { label: "Gluten-Free", color: "#B8A995", short: "GF" },
  df: { label: "Dairy-Free", color: "#8C8378", short: "DF" }
};

const rawMenuItems = [
  // ══════════════════════════════════════════
  // BREAKFAST (7:30 – 11:00)
  // ══════════════════════════════════════════
  {
    id: "bf-1",
    slug: "tamago-sando",
    name: "Tamago Sando",
    japaneseName: "玉子サンド",
    category: "breakfast",
    price: 285,
    description: "Soft Japanese egg salad nestled between thick, pillow-soft slices of house shokupan with creamy Kewpie mayo and whipped butter.",
    ingredients: ["House shokupan milk bread", "Free-range eggs", "Kewpie mayonnaise", "Cultured butter", "White pepper", "Dijon mustard", "Maldon sea salt"],
    allergens: ["gluten", "egg", "dairy", "soy"],
    dietary: ["vegetarian"],
    image: { src: "/images/menu/tamago-sando.webp", alt: "Tamago Sando egg salad sandwich on shokupan" },
    imageLabel: "tamago-sando",
    available: { from: "07:30", to: "11:00" },
    isSignature: true,
    reviews: [
      { id: "r-bf1-1", author: "Aria T.", rating: 5, date: "2026-08-14", comment: "The softest shokupan I have ever tasted. The egg salad has the perfect hint of white pepper." },
      { id: "r-bf1-2", author: "Kenji M.", rating: 5, date: "2026-08-28", comment: "A quiet morning essential. Simple ingredients done with extraordinary discipline." },
      { id: "r-bf1-3", author: "Sofia R.", rating: 4, date: "2026-09-11", comment: "Very generous egg filling. Pairs wonderfully with their Ethiopia pour-over." },
      { id: "r-bf1-4", author: "David L.", rating: 5, date: "2026-09-29", comment: "Reminds me of quiet mornings in Kamakura. Truly comforting." }
    ]
  },
  {
    id: "bf-2",
    slug: "shokupan-french-toast",
    name: "Shokupan French Toast",
    japaneseName: "生食パンのフレンチトースト",
    category: "breakfast",
    price: 325,
    description: "Thick-cut milk bread soaked in rich egg custard, griddled golden and finished with roasted kinako powder, maple syrup, and whipped cultured butter.",
    ingredients: ["Shokupan milk bread", "Organic egg custard", "Whole milk", "Madagascar vanilla bean", "Kinako (roasted soybean flour)", "Pure maple syrup", "Whipped butter"],
    allergens: ["gluten", "egg", "dairy", "soy"],
    dietary: ["vegetarian"],
    image: { src: "/images/menu/shokupan-french-toast.webp", alt: "Golden shokupan French toast with kinako and butter" },
    imageLabel: "shokupan-french-toast",
    available: { from: "07:30", to: "11:00" },
    reviews: [
      { id: "r-bf2-1", author: "Mateo D.", rating: 5, date: "2026-08-02", comment: "The crust is delicately caramelized while the center remains like bread pudding. Divine." },
      { id: "r-bf2-2", author: "Hana S.", rating: 5, date: "2026-08-19", comment: "The kinako dusting gives it an earthy, nutty aroma that balances the maple sweetness." },
      { id: "r-bf2-3", author: "Oliver C.", rating: 4, date: "2026-09-04", comment: "Very decadent breakfast. Ideal to share with someone over a dark roast." }
    ]
  },
  {
    id: "bf-3",
    slug: "matcha-pancake-stack",
    name: "Matcha Pancake Stack",
    japaneseName: "抹茶パンケーキ",
    category: "breakfast",
    price: 345,
    description: "Fluffy soufflé-style ceremonial Uji matcha pancakes served with sweet Hokkaido azuki red bean paste, fresh whipped cream, and pure maple syrup.",
    ingredients: ["Ceremonial Uji matcha", "Wheat flour", "Buttermilk", "Farm eggs", "Hokkaido azuki beans", "Cane sugar", "Whipped cream", "Pure maple syrup"],
    allergens: ["gluten", "egg", "dairy", "soy"],
    dietary: ["vegetarian"],
    image: { src: "/images/menu/matcha-pancake-stack.webp", alt: "Fluffy green matcha pancakes with azuki and whipped cream" },
    imageLabel: "matcha-pancake-stack",
    available: { from: "07:30", to: "11:00" },
    reviews: [
      { id: "r-bf3-1", author: "Chloe W.", rating: 5, date: "2026-07-22", comment: "The matcha flavor is deep and authentic, not overly sweet. Soufflé texture is heavenly." },
      { id: "r-bf3-2", author: "Yuki N.", rating: 4, date: "2026-08-15", comment: "Beautiful presentation on ceramic tableware. The azuki beans are cooked to perfection." },
      { id: "r-bf3-3", author: "Marcus B.", rating: 4, date: "2026-09-18", comment: "Very light despite the generous three-pancake stack." }
    ]
  },
  {
    id: "bf-4",
    slug: "asa-teishoku",
    name: "Asa Teishoku",
    japaneseName: "朝定食",
    category: "breakfast",
    price: 395,
    description: "Traditional Japanese breakfast set featuring slow-grilled salted salmon, steamed Koshihikari rice, dashi miso soup, rolled tamagoyaki, and seasonal house pickles.",
    ingredients: ["Atlantic salmon", "Koshihikari rice", "Red miso", "Kombu dashi", "Silken tofu", "Farm eggs", "Mirin", "House-pickled daikon & cucumber"],
    allergens: ["fish", "egg", "soy"],
    dietary: ["contains-seafood", "dairy-free"],
    image: { src: "/images/menu/asa-teishoku.webp", alt: "Traditional Japanese breakfast tray with salmon, rice, tamagoyaki and miso soup" },
    imageLabel: "asa-teishoku",
    available: { from: "07:30", to: "11:00" },
    isSignature: true,
    reviews: [
      { id: "r-bf4-1", author: "Ren K.", rating: 5, date: "2026-08-10", comment: "An extraordinarily balanced breakfast. The salmon skin is crisp and the rice has remarkable texture." },
      { id: "r-bf4-2", author: "Elena M.", rating: 5, date: "2026-08-30", comment: "Eating this feels like starting the morning with quiet clarity. The miso soup is deeply comforting." },
      { id: "r-bf4-3", author: "Jonathan V.", rating: 4, date: "2026-09-12", comment: "Fresh pickles and sweet dashi tamagoyaki. Best Japanese breakfast in Makati." },
      { id: "r-bf4-4", author: "Mei L.", rating: 5, date: "2026-09-24", comment: "Authentic, serene, and nourishing." }
    ]
  },
  {
    id: "bf-5",
    slug: "yuzu-avocado-toast",
    name: "Yuzu Avocado Toast",
    japaneseName: "柚子アボカドトースト",
    category: "breakfast",
    price: 310,
    description: "Crusty artisan sourdough topped with crushed ripe avocado, fragrant green yuzu kosho citrus paste, toasted sesame seeds, and garden microgreens.",
    ingredients: ["Artisan sourdough bread", "Hass avocado", "Green yuzu kosho", "Extra virgin olive oil", "Toasted sesame seeds", "Lemon juice", "Microgreens", "Sea salt"],
    allergens: ["gluten", "sesame"],
    dietary: ["vegan", "dairy-free"],
    image: { src: "/images/menu/yuzu-avocado-toast.webp", alt: "Artisan avocado toast with yuzu kosho and microgreens" },
    imageLabel: "yuzu-avocado-toast",
    available: { from: "07:30", to: "11:00" },
    reviews: [
      { id: "r-bf5-1", author: "Liam P.", rating: 5, date: "2026-08-05", comment: "The yuzu kosho adds an aromatic citrus heat that completely transforms everyday avocado toast." },
      { id: "r-bf5-2", author: "Claire D.", rating: 4, date: "2026-08-26", comment: "Crisp crust on the sourdough and plenty of ripe avocado. Refreshing and light." },
      { id: "r-bf5-3", author: "Noah H.", rating: 3, date: "2026-09-14", comment: "Great flavor, though the yuzu kosho can be a bit spicy if you are sensitive to chili." }
    ]
  },
  {
    id: "bf-6",
    slug: "seasonal-fruit-granola-bowl",
    name: "Seasonal Fruit Granola Bowl",
    japaneseName: "グラノーラボウル",
    category: "breakfast",
    price: 245,
    description: "House-toasted buckwheat and oat granola layered over velvety Greek yogurt, topped with ripe seasonal fruit and a drizzle of raw forest honey.",
    ingredients: ["Rolled oats", "Toasted buckwheat", "Greek yogurt", "Wildflower honey", "Seasonal berries", "Sliced banana", "Pumpkin seeds", "Almond flakes"],
    allergens: ["dairy", "tree nut"],
    dietary: ["vegetarian"],
    image: { src: "/images/menu/seasonal-fruit-granola-bowl.webp", alt: "Yogurt bowl with granola, fresh fruit and honey" },
    imageLabel: "seasonal-fruit-granola-bowl",
    available: { from: "07:30", to: "11:00" },
    reviews: [
      { id: "r-bf6-1", author: "Grace K.", rating: 5, date: "2026-07-31", comment: "The toasted buckwheat gives a delightful crisp crunch that does not get soggy. Very fresh." },
      { id: "r-bf6-2", author: "Ethan B.", rating: 4, date: "2026-08-22", comment: "Wholesome morning meal. The local honey is wonderfully floral." },
      { id: "r-bf6-3", author: "Mia T.", rating: 5, date: "2026-09-17", comment: "Beautiful presentation in a rustic stoneware bowl." }
    ]
  },

  // ══════════════════════════════════════════
  // LUNCH (11:00 – 15:00)
  // ══════════════════════════════════════════
  {
    id: "lu-1",
    slug: "chicken-katsu-curry",
    name: "Chicken Katsu Curry",
    japaneseName: "チキンカツカレー",
    category: "lunch",
    price: 385,
    description: "Panko-crusted chicken cutlet fried crisp, served over steamed rice with a slow-simmered, aromatic Japanese vegetable curry and pickled fukujinzuke radish.",
    ingredients: ["Chicken thigh", "Panko breadcrumbs", "Koshihikari rice", "House Japanese curry roux", "Caramelized onions", "Carrots", "Potatoes", "Fukujinzuke pickles"],
    allergens: ["gluten", "egg", "soy"],
    dietary: ["dairy-free"],
    image: { src: "/images/menu/chicken-katsu-curry.webp", alt: "Golden chicken katsu over rice with rich Japanese curry" },
    imageLabel: "chicken-katsu-curry",
    available: { from: "11:00", to: "15:00" },
    reviews: [
      { id: "r-lu1-1", author: "Daniel S.", rating: 5, date: "2026-08-11", comment: "The curry sauce is simmered for hours—rich, slightly sweet with deep umami. Cutlet remained crunchy." },
      { id: "r-lu1-2", author: "Yumi K.", rating: 5, date: "2026-08-25", comment: "Comfort food at its absolute peak. Generous portion for lunch." },
      { id: "r-lu1-3", author: "Carlos V.", rating: 4, date: "2026-09-08", comment: "Pickled radish cuts through the richness nicely. Will order again." }
    ]
  },
  {
    id: "lu-2",
    slug: "bibimbap",
    name: "Bibimbap",
    japaneseName: "ビビンバ",
    category: "lunch",
    price: 395,
    description: "Warm rice bowl adorned with tender marinated bulgogi beef, assorted seasoned namul vegetables, toasted nori, a sunny-side egg, and artisanal gochujang.",
    ingredients: ["Koshihikari rice", "Marinated beef sirloin", "Seasoned spinach", "Bean sprouts", "Shiitake mushrooms", "Zucchini", "Farm egg", "Artisanal gochujang", "Toasted sesame oil"],
    allergens: ["gluten", "egg", "soy", "sesame"],
    dietary: ["spicy"],
    image: { src: "/images/menu/bibimbap.webp", alt: "Korean bibimbap bowl with beef, colorful vegetables and fried egg" },
    imageLabel: "bibimbap",
    available: { from: "11:00", to: "15:00" },
    isSignature: true,
    reviews: [
      { id: "r-lu2-1", author: "Jin H.", rating: 5, date: "2026-08-07", comment: "Each vegetable retains its individual texture and seasoning. The house gochujang sauce has exceptional depth." },
      { id: "r-lu2-2", author: "Patricia G.", rating: 5, date: "2026-08-29", comment: "Mixing everything together with the runny egg yolk and sesame oil is pure comfort." },
      { id: "r-lu2-3", author: "Lucas A.", rating: 4, date: "2026-09-16", comment: "Great spice balance—warm and satisfying without overwhelming your palate." },
      { id: "r-lu2-4", author: "Kenji T.", rating: 5, date: "2026-09-30", comment: "Shizuka's Korean-Japanese bridge dishes are flawless." }
    ]
  },
  {
    id: "lu-3",
    slug: "salmon-ikura-don",
    name: "Salmon Ikura Don",
    japaneseName: "サーモンイクラ丼",
    category: "lunch",
    price: 445,
    description: "Lightly torched Atlantic salmon sashimi and glistening ikura salmon roe nestled on seasoned sushi rice with cucumber, nori strips, and soy-mirin glaze.",
    ingredients: ["Seasoned sushi rice", "Atlantic salmon sashimi", "Cured salmon roe (ikura)", "Japanese cucumber", "Toasted nori", "Soy sauce", "Mirin glaze", "Fresh wasabi"],
    allergens: ["fish", "soy", "gluten"],
    dietary: ["contains-seafood", "dairy-free"],
    image: { src: "/images/menu/salmon-ikura-don.webp", alt: "Salmon ikura rice bowl with seared sashimi and nori" },
    imageLabel: "salmon-ikura-don",
    available: { from: "11:00", to: "15:00" },
    reviews: [
      { id: "r-lu3-1", author: "Sora K.", rating: 5, date: "2026-08-16", comment: "The aburi sear on the salmon melts in your mouth, and the pop of the ikura is so satisfying." },
      { id: "r-lu3-2", author: "Elijah C.", rating: 4, date: "2026-09-02", comment: "Very fresh seafood and the seasoned sushi rice has the right touch of vinegar." },
      { id: "r-lu3-3", author: "Anika N.", rating: 5, date: "2026-09-21", comment: "Tastes like a high-end Ginza counter lunch. Worth every peso." }
    ]
  },
  {
    id: "lu-4",
    slug: "cold-sesame-soba",
    name: "Cold Sesame Soba",
    japaneseName: "胡麻だれ冷やし蕎麦",
    category: "lunch",
    price: 325,
    description: "Chilled hand-cut buckwheat noodles tossed in a velvety toasted sesame sauce with crisp cucumber ribbons, scallions, nori, and roasted sesame seeds.",
    ingredients: ["Buckwheat soba noodles", "Toasted white sesame paste", "Soy sauce", "Rice vinegar", "Cucumber ribbons", "Scallions", "Shredded nori", "Sesame oil"],
    allergens: ["gluten", "soy", "sesame"],
    dietary: ["vegan", "dairy-free"],
    image: { src: "/images/menu/cold-sesame-soba.webp", alt: "Chilled buckwheat soba noodles with creamy sesame sauce and nori" },
    imageLabel: "cold-sesame-soba",
    available: { from: "11:00", to: "15:00" },
    reviews: [
      { id: "r-lu4-1", author: "Mina Y.", rating: 5, date: "2026-08-09", comment: "Incredibly refreshing on a warm Manila afternoon. The sesame tare is nutty and aromatic." },
      { id: "r-lu4-2", author: "Gabriel T.", rating: 4, date: "2026-08-27", comment: "Soba has great chew and snap (al dente). Pure and clean vegan dish." },
      { id: "r-lu4-3", author: "Isla B.", rating: 5, date: "2026-09-19", comment: "Pairs exceptionally well with the cold brew or iced sencha." }
    ]
  },
  {
    id: "lu-5",
    slug: "katsu-sando",
    name: "Katsu Sando",
    japaneseName: "カツサンド",
    category: "lunch",
    price: 365,
    description: "Crisp breaded pork loin cutlet brushed with tangy spiced tonkatsu reduction, sandwiched in shokupan with finely shredded cabbage.",
    ingredients: ["Pork loin cutlet", "Panko breadcrumbs", "Shokupan milk bread", "House tonkatsu sauce", "Shredded green cabbage", "Karashi mustard", "Butter"],
    allergens: ["gluten", "egg", "dairy", "soy"],
    dietary: ["contains-pork"],
    image: { src: "/images/menu/katsu-sando.webp", alt: "Pork katsu sando sandwich cut in clean halves showing crispy cutlet" },
    imageLabel: "katsu-sando",
    available: { from: "11:00", to: "15:00" },
    reviews: [
      { id: "r-lu5-1", author: "Victor M.", rating: 5, date: "2026-08-18", comment: "Juicy pork loin cutlet with a satisfying crunch. The karashi mustard gives just the right spark." },
      { id: "r-lu5-2", author: "Hannah L.", rating: 4, date: "2026-09-05", comment: "Cleanly sliced and very aesthetic. The cabbage slaw stays delightfully crisp." },
      { id: "r-lu5-3", author: "Leo F.", rating: 4, date: "2026-09-25", comment: "A benchmark sando. Perfect lunch companion." }
    ]
  },
  {
    id: "lu-6",
    slug: "kimchi-fried-rice",
    name: "Kimchi Fried Rice",
    japaneseName: "キムチチャーハン",
    category: "lunch",
    price: 335,
    description: "Jasmine rice stir-fried with aged house kimchi and smoky bacon, finished with scallions, toasted sesame, and a runny sunny egg.",
    ingredients: ["Aged baechu kimchi", "Steamed rice", "Smoked bacon", "Gochugaru chili", "Scallions", "Farm egg", "Toasted sesame oil", "Nori flakes"],
    allergens: ["gluten", "egg", "soy", "sesame", "fish"],
    dietary: ["spicy", "contains-pork"],
    image: { src: "/images/menu/kimchi-fried-rice.webp", alt: "Kimchi fried rice with fried egg and roasted sesame" },
    imageLabel: "kimchi-fried-rice",
    available: { from: "11:00", to: "15:00" },
    reviews: [
      { id: "r-lu6-1", author: "Sam K.", rating: 5, date: "2026-08-12", comment: "Aged kimchi makes all the difference—deeply tangy, smoky, with pleasant wok hei." },
      { id: "r-lu6-2", author: "Rachel W.", rating: 4, date: "2026-08-31", comment: "The crispy edges of the rice at the bottom of the bowl are the best part." },
      { id: "r-lu6-3", author: "Taro E.", rating: 5, date: "2026-09-22", comment: "Rich and satisfying without feeling greasy." }
    ]
  },

  // ══════════════════════════════════════════
  // DINNER (17:00 – Close)
  // ══════════════════════════════════════════
  {
    id: "dn-1",
    slug: "beef-bulgogi-rice-set",
    name: "Beef Bulgogi Rice Set",
    japaneseName: "牛プルコギ定食",
    category: "dinner",
    price: 475,
    description: "Tender thinly sliced beef ribeye sautéed with sweet onions in an apple-soy marinade, served with rice, crisp lettuce wraps, daily banchan, and miso soup.",
    ingredients: ["Sliced beef ribeye", "Sweet yellow onions", "Asian pear-soy marinade", "Koshihikari rice", "Romaine lettuce wraps", "House kimchi", "Daikon banchan", "Miso soup"],
    allergens: ["gluten", "soy", "sesame"],
    dietary: ["dairy-free"],
    image: { src: "/images/menu/beef-bulgogi-rice-set.webp", alt: "Bulgogi beef dinner set with rice, lettuce wraps and banchan" },
    imageLabel: "beef-bulgogi-rice-set",
    available: { from: "17:00", to: "19:30" },
    reviews: [
      { id: "r-dn1-1", author: "Benjamin C.", rating: 5, date: "2026-08-17", comment: "The beef is caramelized to perfection and melts on the tongue. Wrapping it in lettuce is so interactive." },
      { id: "r-dn1-2", author: "Jessica M.", rating: 5, date: "2026-09-01", comment: "The pear marinade lends a natural sweetness that makes this set extraordinary." },
      { id: "r-dn1-3", author: "Kyle O.", rating: 4, date: "2026-09-23", comment: "Very generous portion for dinner. Banchan side dishes are top tier." }
    ]
  },
  {
    id: "dn-2",
    slug: "miso-glazed-cod",
    name: "Miso-Glazed Cod",
    japaneseName: "銀鱈の西京焼き",
    category: "dinner",
    price: 595,
    description: "Silky Alaskan black cod marinated 48 hours in sweet Saikyo white miso, pan-roasted until caramelized, served with steamed rice, sautéed greens, and pickles.",
    ingredients: ["Alaskan black cod", "Saikyo sweet white miso", "Mirin", "Sake", "Koshihikari rice", "Sautéed bok choy", "Hajikami pickled ginger"],
    allergens: ["fish", "soy"],
    dietary: ["contains-seafood", "dairy-free"],
    image: { src: "/images/menu/miso-glazed-cod.webp", alt: "Caramelized miso glazed black cod fillet on stoneware plate" },
    imageLabel: "miso-glazed-cod",
    available: { from: "17:00", to: "19:30" },
    isSignature: true,
    reviews: [
      { id: "r-dn2-1", author: "Marcus L.", rating: 5, date: "2026-08-13", comment: "Flakes into silky, buttery layers. The sweet miso caramelization has stunning depth." },
      { id: "r-dn2-2", author: "Helena V.", rating: 5, date: "2026-08-29", comment: "Hands down the centerpiece dish of Shizuka. Pure culinary tranquility." },
      { id: "r-dn2-3", author: "Nathan F.", rating: 5, date: "2026-09-15", comment: "Remarkable quality of fish. The pickled ginger stem is a delightful touch." },
      { id: "r-dn2-4", author: "Koji S.", rating: 5, date: "2026-09-28", comment: "Authentic Kyoto Saikyo-yaki. Exemplary." }
    ]
  },
  {
    id: "dn-3",
    slug: "chicken-karaage-teishoku",
    name: "Chicken Karaage Teishoku",
    japaneseName: "唐揚げ定食",
    category: "dinner",
    price: 425,
    description: "Double-fried ginger-garlic chicken thighs, crisp and juicy, served with steamed rice, shredded cabbage, citrus ponzu, miso soup, and lemon.",
    ingredients: ["Boneless chicken thighs", "Fresh ginger", "Garlic", "Soy sauce", "Potato starch", "Koshihikari rice", "Citrus ponzu", "Green cabbage", "Miso soup"],
    allergens: ["gluten", "soy"],
    dietary: ["dairy-free"],
    image: { src: "/images/menu/chicken-karaage-teishoku.webp", alt: "Crispy chicken karaage dinner set with rice and miso soup" },
    imageLabel: "chicken-karaage-teishoku",
    available: { from: "17:00", to: "19:30" },
    reviews: [
      { id: "r-dn3-1", author: "Alexander R.", rating: 5, date: "2026-08-20", comment: "Extraordinarily crisp on the exterior and burst-with-juice tender inside. Best karaage in town." },
      { id: "r-dn3-2", author: "Naomi T.", rating: 4, date: "2026-09-06", comment: "Light potato starch batter, not oily at all. The ponzu dip cuts through perfectly." },
      { id: "r-dn3-3", author: "Brian K.", rating: 5, date: "2026-09-26", comment: "A hearty, deeply satisfying dinner set." }
    ]
  },
  {
    id: "dn-4",
    slug: "shoyu-ramen",
    name: "Shoyu Ramen",
    japaneseName: "醤油ラーメン",
    category: "dinner",
    price: 395,
    description: "Clear, aromatic chicken-dashi broth seasoned with artisanal shoyu, springy wheat noodles, slow-braised chashu pork, seasoned ajitama egg, and bamboo shoots.",
    ingredients: ["Artisan wheat ramen noodles", "Chicken and dashi broth", "Aged shoyu tare", "Braised pork belly chashu", "Ajitama ramen egg", "Menma bamboo shoots", "Toasted nori", "Scallions"],
    allergens: ["gluten", "egg", "soy"],
    dietary: ["contains-pork"],
    image: { src: "/images/menu/shoyu-ramen.webp", alt: "Steaming bowl of shoyu ramen with chashu pork and ajitama egg" },
    imageLabel: "shoyu-ramen",
    available: { from: "17:00", to: "19:30" },
    isSignature: true,
    reviews: [
      { id: "r-dn4-1", author: "Tatsuya M.", rating: 5, date: "2026-08-08", comment: "Broth is crystal clear and layered with subtle aromatics. The chashu melts on the tongue." },
      { id: "r-dn4-2", author: "Isabella D.", rating: 5, date: "2026-08-24", comment: "The ajitama yolk has that perfect jammy consistency. Incredibly soul-warming." },
      { id: "r-dn4-3", author: "Aaron P.", rating: 4, date: "2026-09-10", comment: "Springy noodles with great chew. So glad dinner is now served here." },
      { id: "r-dn4-4", author: "Maya G.", rating: 5, date: "2026-09-27", comment: "A quiet masterpiece of noodle craft." }
    ]
  },
  {
    id: "dn-5",
    slug: "mushroom-udon",
    name: "Mushroom Udon",
    japaneseName: "きのこうどん",
    category: "dinner",
    price: 365,
    description: "Chewy Sanuki udon noodles bathed in a gentle kombu-shiitake broth, crowned with sautéed maitake, enoki, and shiitake mushrooms and fresh scallions.",
    ingredients: ["Sanuki udon noodles", "Kombu & dried shiitake dashi", "Fresh shiitake mushrooms", "Maitake mushrooms", "Enoki mushrooms", "Scallions", "Grated ginger", "Mirin"],
    allergens: ["gluten", "soy"],
    dietary: ["vegan", "dairy-free"],
    image: { src: "/images/menu/mushroom-udon.webp", alt: "Hot udon noodles in clear mushroom broth with maitake and scallions" },
    imageLabel: "mushroom-udon",
    available: { from: "17:00", to: "19:30" },
    reviews: [
      { id: "r-dn5-1", author: "Lucas E.", rating: 5, date: "2026-08-23", comment: "The kombu-mushroom broth has pure umami depth without needing any fish dashi. Outstanding vegan option." },
      { id: "r-dn5-2", author: "Zoe F.", rating: 4, date: "2026-09-09", comment: "Thick, bouncy Sanuki udon noodles. Generous wild mushrooms." },
      { id: "r-dn5-3", author: "Dominic H.", rating: 4, date: "2026-09-20", comment: "Light, clean, and grounding." }
    ]
  },
  {
    id: "dn-6",
    slug: "pork-shogayaki-set",
    name: "Pork Shogayaki Set",
    japaneseName: "豚の生姜焼き定食",
    category: "dinner",
    price: 415,
    description: "Tender pork slices quickly glazed in a fragrant ginger, garlic, and sweet soy reduction, served alongside steamed rice, crunchy cabbage, and miso soup.",
    ingredients: ["Tender pork shoulder slices", "Fresh ginger juice", "Garlic", "Soy sauce", "Mirin", "Koshihikari rice", "Finely shredded cabbage", "Miso soup"],
    allergens: ["gluten", "soy"],
    dietary: ["contains-pork", "dairy-free"],
    image: { src: "/images/menu/pork-shogayaki-set.webp", alt: "Ginger pork shogayaki set with shredded cabbage and steamed rice" },
    imageLabel: "pork-shogayaki-set",
    available: { from: "17:00", to: "19:30" },
    reviews: [
      { id: "r-dn6-1", author: "Kenzo W.", rating: 5, date: "2026-08-16", comment: "Fresh grated ginger gives this glaze an addictive bite. Classic Japanese home-style cooking." },
      { id: "r-dn6-2", author: "Fiona S.", rating: 4, date: "2026-09-03", comment: "Pork is so tender and flavorful. Great paired with steamed Koshihikari rice." },
      { id: "r-dn6-3", author: "Liam K.", rating: 4, date: "2026-09-24", comment: "Hearty and warming after a long workday." }
    ]
  },

  // ══════════════════════════════════════════
  // SNACKS (All Day)
  // ══════════════════════════════════════════
  {
    id: "sn-1",
    slug: "onigiri-trio",
    name: "Onigiri Trio",
    japaneseName: "おにぎり三種",
    category: "snacks",
    price: 180,
    description: "A selection of three warm hand-pressed rice triangles: grilled salted salmon, creamy tuna-mayo, and tart Kishu umeboshi, wrapped in crisp nori sheets.",
    ingredients: ["Koshihikari rice", "Salted salmon flakes", "Skipjack tuna", "Japanese mayonnaise", "Kishu umeboshi pickled plum", "Crisp Ariake nori", "Toasted sesame"],
    allergens: ["fish", "egg", "soy", "sesame"],
    dietary: ["contains-seafood", "dairy-free"],
    image: { src: "/images/menu/onigiri-trio.webp", alt: "Trio of triangle onigiri wrapped in crisp seaweed" },
    imageLabel: "onigiri-trio",
    available: "all-day",
    reviews: [
      { id: "r-sn1-1", author: "Yuri H.", rating: 5, date: "2026-08-04", comment: "The nori stays miraculously crisp until you take a bite. The umeboshi is wonderfully mouthwatering." },
      { id: "r-sn1-2", author: "Brandon M.", rating: 4, date: "2026-08-21", comment: "Perfect light afternoon snack while working or reading." },
      { id: "r-sn1-3", author: "Sophie T.", rating: 5, date: "2026-09-13", comment: "Great value and beautiful presentation on a cedar plank." }
    ]
  },
  {
    id: "sn-2",
    slug: "karaage-bites",
    name: "Karaage Bites",
    japaneseName: "ひとくち唐揚げ",
    category: "snacks",
    price: 220,
    description: "Bite-sized morsels of crunchy ginger-soy marinated chicken, served with a squeeze of fresh lemon and a dollop of whipped Kewpie mayonnaise.",
    ingredients: ["Chicken thigh bites", "Fresh ginger", "Garlic", "Soy sauce", "Sake", "Potato starch", "Fresh lemon", "Kewpie mayo", "Shichimi togarashi"],
    allergens: ["gluten", "egg", "soy"],
    dietary: ["dairy-free"],
    image: { src: "/images/menu/karaage-bites.webp", alt: "Crisp bite-sized chicken karaage with lemon wedge and mayo dip" },
    imageLabel: "karaage-bites",
    available: "all-day",
    reviews: [
      { id: "r-sn2-1", author: "Jake V.", rating: 5, date: "2026-08-14", comment: "Addictive crunch. The Kewpie mayo with a dash of togarashi is perfection." },
      { id: "r-sn2-2", author: "Amanda C.", rating: 4, date: "2026-09-01", comment: "Great portion to snack on alongside an iced matcha or yuzu soda." },
      { id: "r-sn2-3", author: "Ken M.", rating: 5, date: "2026-09-22", comment: "Never greasy, always hot and crunchy." }
    ]
  },
  {
    id: "sn-3",
    slug: "tteokbokki",
    name: "Tteokbokki",
    japaneseName: "トッポッキ",
    category: "snacks",
    price: 240,
    description: "Chewy Korean cylindrical rice cakes and sliced fish cakes simmered in a rich, sweet-spicy gochujang broth, garnished with scallions and sesame seeds.",
    ingredients: ["Korean cylinder rice cakes", "Busan fish cake slices", "House gochujang sauce", "Gochugaru chili", "Anchovy-kombu dashi", "Scallions", "Toasted sesame"],
    allergens: ["gluten", "fish", "soy", "sesame"],
    dietary: ["spicy", "contains-seafood"],
    image: { src: "/images/menu/tteokbokki.webp", alt: "Glossy red spicy tteokbokki rice cakes in stoneware bowl" },
    imageLabel: "tteokbokki",
    available: "all-day",
    reviews: [
      { id: "r-sn3-1", author: "Eunice K.", rating: 5, date: "2026-08-11", comment: "The rice cakes are delightfully chewy. The sauce has that authentic street food comfort." },
      { id: "r-sn3-2", author: "Marco R.", rating: 4, date: "2026-08-28", comment: "Pleasantly spicy! Clears the sinuses in the best way possible." },
      { id: "r-sn3-3", author: "Denise F.", rating: 4, date: "2026-09-17", comment: "Rich and sweet-savory. Fun dish to share." }
    ]
  },
  {
    id: "sn-4",
    slug: "taiyaki",
    name: "Taiyaki",
    japaneseName: "たい焼き",
    category: "snacks",
    price: 150,
    description: "Classic fish-shaped waffle cake baked crisp on the outside and soft inside, filled with your choice of warm Hokkaido red bean or vanilla custard.",
    ingredients: ["Wheat flour", "Organic eggs", "Whole milk", "Hokkaido azuki red bean paste", "Madagascar vanilla custard", "Cane sugar", "Baking powder"],
    allergens: ["gluten", "egg", "dairy"],
    dietary: ["vegetarian"],
    image: { src: "/images/menu/taiyaki.webp", alt: "Golden fish-shaped taiyaki pastry on wooden plate" },
    imageLabel: "taiyaki",
    available: "all-day",
    reviews: [
      { id: "r-sn4-1", author: "Hiroshi N.", rating: 5, date: "2026-08-07", comment: "Crispy waffle fins and filled generously all the way to the tail!" },
      { id: "r-sn4-2", author: "Maya B.", rating: 4, date: "2026-08-25", comment: "The red bean paste is smooth and not cloying. Wonderful with sencha." },
      { id: "r-sn4-3", author: "Cole S.", rating: 5, date: "2026-09-19", comment: "Baked fresh to order and served warm." }
    ]
  },
  {
    id: "sn-5",
    slug: "hojicha-pudding",
    name: "Hojicha Pudding",
    japaneseName: "ほうじ茶プリン",
    category: "snacks",
    price: 165,
    description: "Silky, delicate custard infused with roasted Kyoto hojicha tea, served over bittersweet caramel and crowned with light chantilly cream.",
    ingredients: ["Kyoto roasted hojicha tea", "Fresh dairy cream", "Whole milk", "Egg yolks", "Cane sugar", "Bittersweet caramel", "Sea salt"],
    allergens: ["dairy", "egg"],
    dietary: ["vegetarian"],
    image: { src: "/images/menu/hojicha-pudding.webp", alt: "Silky roasted green tea custard in glass cup with chantilly cream" },
    imageLabel: "hojicha-pudding",
    available: "all-day",
    isSignature: true,
    reviews: [
      { id: "r-sn5-1", author: "Ayumi S.", rating: 5, date: "2026-08-15", comment: "The smoky roast of the hojicha paired with bittersweet caramel is sublime. Melt-in-your-mouth texture." },
      { id: "r-sn5-2", author: "Julian E.", rating: 5, date: "2026-09-02", comment: "My favorite dessert at Shizuka. Subtle, calm, and exquisitely crafted." },
      { id: "r-sn5-3", author: "Rina W.", rating: 5, date: "2026-09-18", comment: "Silky smooth custard that is not too sweet. An absolute triumph." }
    ]
  },
  {
    id: "sn-6",
    slug: "mochi-donut",
    name: "Mochi Donut",
    japaneseName: "もちドーナツ",
    category: "snacks",
    price: 120,
    description: "Chewy, pull-apart pon-de-ring style donut crafted with mochiko sweet rice flour, finished with a delicate ceremonial matcha or brown sugar glaze.",
    ingredients: ["Mochiko sweet rice flour", "Tapioca starch", "Powdered sugar", "Ceremonial Uji matcha", "Okinawa kuromitsu brown sugar", "Whole milk"],
    allergens: ["gluten", "dairy", "egg"],
    dietary: ["vegetarian"],
    image: { src: "/images/menu/mochi-donut.webp", alt: "Glazed pull-apart mochi donut on parchment paper" },
    imageLabel: "mochi-donut",
    available: "all-day",
    reviews: [
      { id: "r-sn6-1", author: "Tina L.", rating: 5, date: "2026-08-06", comment: "Incredible pull-apart chewiness! The matcha glaze has genuine green tea fragrance." },
      { id: "r-sn6-2", author: "Leo G.", rating: 4, date: "2026-08-23", comment: "Lighter than traditional donuts. Perfect accompaniment to a flat white." },
      { id: "r-sn6-3", author: "Abby R.", rating: 4, date: "2026-09-14", comment: "Very cute ring shape and pleasant texture." }
    ]
  },
  {
    id: "sn-7",
    slug: "cheese-gimbap",
    name: "Cheese Gimbap",
    japaneseName: "チーズキンパ",
    category: "snacks",
    price: 200,
    description: "Korean rice roll wrapped in roasted seaweed, filled with melted cheddar, seasoned rolled omelette, sweet pickled radish, and tender braised carrots.",
    ingredients: ["Roasted gim (seaweed)", "Koshihikari rice", "Toasted sesame oil", "Mild cheddar cheese", "Rolled egg", "Danmuji (pickled yellow radish)", "Braised carrots", "Cucumber"],
    allergens: ["dairy", "egg", "sesame"],
    dietary: ["vegetarian"],
    image: { src: "/images/menu/cheese-gimbap.webp", alt: "Sliced Korean cheese gimbap roll showing colorful vegetable and egg center" },
    imageLabel: "cheese-gimbap",
    available: "all-day",
    reviews: [
      { id: "r-sn7-1", author: "Soo-jin P.", rating: 5, date: "2026-08-10", comment: "The sesame oil aroma hits you immediately. The mild cheese binds the crunchy veggies together so well." },
      { id: "r-sn7-2", author: "Kyle T.", rating: 4, date: "2026-08-27", comment: "Great light bite while sipping an iced tea. Slices are neat and easy to share." },
      { id: "r-sn7-3", author: "Mara N.", rating: 4, date: "2026-09-20", comment: "Classic comforting gimbap. Danmuji crunch is delightful." }
    ]
  },

  // ══════════════════════════════════════════
  // COFFEE (Existing items preserved & typed)
  // ══════════════════════════════════════════
  {
    id: "m1",
    slug: "pour-over",
    name: "Pour Over",
    japaneseName: "ハンドドリップ",
    jp: "ハンドドリップ",
    category: "coffee",
    price: 220,
    description: "Single-origin beans ground to order and hand-brewed on a Hario V60 dripper for clarity and floral sweetness.",
    ingredients: ["Single-origin roasted coffee beans", "Filtered hot water (92°C)"],
    allergens: [],
    dietary: ["vegan", "dairy-free"],
    image: { src: "/images/menu/pour-over.webp", alt: "Pour-over coffee in glass carafe" },
    imageLabel: "Pour-over in a glass carafe",
    available: "all-day",
    isSignature: true,
    reviews: [
      { id: "r-m1-1", author: "Felix M.", rating: 5, date: "2026-08-01", comment: "Unbelievable clarity. Notes of bergamot and jasmine shine brightly." },
      { id: "r-m1-2", author: "Naoko T.", rating: 5, date: "2026-08-20", comment: "The baristas treat each extraction like meditation." },
      { id: "r-m1-3", author: "Greg W.", rating: 4, date: "2026-09-12", comment: "Very clean cup, served in delicate warm ceramic." }
    ]
  },
  {
    id: "m2",
    slug: "espresso",
    name: "Espresso",
    japaneseName: "エスプレッソ",
    jp: "エスプレッソ",
    category: "coffee",
    price: 120,
    description: "A double ristretto shot of our Shizuka house blend with deep cocoa and roasted hazelnut notes.",
    ingredients: ["House blend roasted coffee beans", "Espresso extraction"],
    allergens: [],
    dietary: ["vegan", "dairy-free"],
    image: { src: "/images/menu/espresso.webp", alt: "Espresso in ceramic cup" },
    imageLabel: "Espresso in a ceramic cup",
    available: "all-day",
    reviews: [
      { id: "r-m2-1", author: "Matteo B.", rating: 5, date: "2026-08-11", comment: "Dense crema, syrupy body, zero harsh bitterness." },
      { id: "r-m2-2", author: "Liam S.", rating: 4, date: "2026-09-04", comment: "Quick and powerful morning shot." }
    ]
  },
  {
    id: "m3",
    slug: "cortado",
    name: "Cortado",
    japaneseName: "コルタード",
    jp: "コルタード",
    category: "coffee",
    price: 160,
    description: "Double espresso cut with equal parts velvety steamed milk, served in an amber glass.",
    ingredients: ["Espresso", "Steamed whole milk"],
    allergens: ["dairy"],
    dietary: ["vegetarian"],
    image: { src: "/images/menu/cortado.webp", alt: "Cortado in a glass" },
    imageLabel: "Cortado in a glass",
    available: "all-day",
    reviews: [
      { id: "r-m3-1", author: "Danielle P.", rating: 5, date: "2026-08-14", comment: "My everyday order. The proportion of coffee to milk is exact." },
      { id: "r-m3-2", author: "Tom C.", rating: 5, date: "2026-09-08", comment: "Silky microfoam with dark chocolate undertones." }
    ]
  },
  {
    id: "m4",
    slug: "flat-white",
    name: "Flat White",
    japaneseName: "フラットホワイト",
    jp: "フラットホワイト",
    category: "coffee",
    price: 180,
    description: "Silky microfoam poured delicately over a double ristretto in a ceramic stoneware cup.",
    ingredients: ["Double ristretto", "Steamed whole milk"],
    allergens: ["dairy"],
    dietary: ["vegetarian"],
    image: { src: "/images/menu/flat-white.webp", alt: "Flat white with latte art" },
    imageLabel: "Flat white with latte art",
    available: "all-day",
    reviews: [
      { id: "r-m4-1", author: "Oscar N.", rating: 5, date: "2026-08-19", comment: "Flawless latte art and silky texture that coats the palate." },
      { id: "r-m4-2", author: "Gemma K.", rating: 4, date: "2026-09-15", comment: "Warm, smooth, and restorative." }
    ]
  },
  {
    id: "m5",
    slug: "cold-brew",
    name: "Cold Brew",
    japaneseName: "コールドブリュー",
    jp: "コールドブリュー",
    category: "coffee",
    price: 210,
    description: "Steeped slowly for 18 hours in cold filtered water, served over a single clear ice block.",
    ingredients: ["Coarse ground coffee beans", "Filtered cold water", "Single block ice"],
    allergens: [],
    dietary: ["vegan", "dairy-free"],
    image: { src: "/images/menu/cold-brew.webp", alt: "Cold brew in a tall glass" },
    imageLabel: "Cold brew in a tall glass",
    available: "all-day",
    reviews: [
      { id: "r-m5-1", author: "Rei T.", rating: 5, date: "2026-08-13", comment: "Remarkably smooth without any harsh acidity. Notes of dried plum." },
      { id: "r-m5-2", author: "Luke H.", rating: 5, date: "2026-09-01", comment: "The clear ice block melts so slowly. Stays concentrated to the last sip." }
    ]
  },
  {
    id: "m6",
    slug: "cafe-au-lait",
    name: "Café au Lait",
    japaneseName: "カフェオレ",
    jp: "カフェオレ",
    category: "coffee",
    price: 190,
    description: "Equal parts slow-drip house coffee and warm steamed milk, served French-Japanese salon style.",
    ingredients: ["House drip coffee", "Steamed milk"],
    allergens: ["dairy"],
    dietary: ["vegetarian"],
    image: { src: "/images/menu/cafe-au-lait.webp", alt: "Café au lait in a bowl" },
    imageLabel: "Café au lait in a bowl",
    available: "all-day",
    reviews: [
      { id: "r-m6-1", author: "Isabelle V.", rating: 4, date: "2026-08-22", comment: "Comforting and nostalgic bowl of coffee and milk." }
    ]
  },

  // ══════════════════════════════════════════
  // TEA & MATCHA
  // ══════════════════════════════════════════
  {
    id: "m7",
    slug: "ceremonial-matcha",
    name: "Ceremonial Matcha",
    japaneseName: "抹茶",
    jp: "抹茶",
    category: "tea",
    price: 240,
    description: "Single-estate stone-milled Uji matcha, whisked to order with a bamboo chasen in a handcrafted chawan.",
    ingredients: ["Uji ceremonial green tea powder", "90°C filtered water"],
    allergens: [],
    dietary: ["vegan", "dairy-free"],
    image: { src: "/images/menu/ceremonial-matcha.webp", alt: "Matcha in a chawan" },
    imageLabel: "Matcha in a chawan",
    available: "all-day",
    isSignature: true,
    reviews: [
      { id: "r-m7-1", author: "Kenzo Y.", rating: 5, date: "2026-08-08", comment: "True ceremonial grade. Deep emerald foam, vibrant umami, zero astringency." },
      { id: "r-m7-2", author: "Sora K.", rating: 5, date: "2026-08-27", comment: "Holding the ceramic chawan in both hands brings an immediate calm." },
      { id: "r-m7-3", author: "Evelyn T.", rating: 5, date: "2026-09-17", comment: "The whisker froth is velvety and sweet." }
    ]
  },
  {
    id: "m8",
    slug: "hojicha-latte",
    name: "Hojicha Latte",
    japaneseName: "ほうじ茶ラテ",
    jp: "ほうじ茶ラテ",
    category: "tea",
    price: 200,
    description: "Charcoal-roasted green tea steamed with milk, offering a cozy aroma of toasted grains and cacao.",
    ingredients: ["Kyoto hojicha powder", "Steamed milk", "Touch of raw cane sugar"],
    allergens: ["dairy"],
    dietary: ["vegetarian"],
    image: { src: "/images/menu/hojicha-latte.webp", alt: "Hojicha latte in glass" },
    imageLabel: "Hojicha latte in glass",
    available: "all-day",
    reviews: [
      { id: "r-m8-1", author: "Aoi M.", rating: 5, date: "2026-08-16", comment: "Wonderfully nutty and comforting. Low caffeine, so perfect for afternoon tea." },
      { id: "r-m8-2", author: "Leo D.", rating: 4, date: "2026-09-07", comment: "The roasted note is so distinctive and pleasant." }
    ]
  },
  {
    id: "m9",
    slug: "sencha",
    name: "Sencha",
    japaneseName: "煎茶",
    jp: "煎茶",
    category: "tea",
    price: 160,
    description: "First-flush Kagoshima green tea brewed at 70°C for bright vegetal sweetness and golden liquor.",
    ingredients: ["Kagoshima first-flush sencha leaves", "70°C water"],
    allergens: [],
    dietary: ["vegan", "dairy-free"],
    image: { src: "/images/menu/sencha.webp", alt: "Sencha in a teapot" },
    imageLabel: "Sencha in a teapot",
    available: "all-day",
    reviews: [
      { id: "r-m9-1", author: "Shinji T.", rating: 5, date: "2026-08-11", comment: "Served in a traditional kyusu pot. Second steep is even sweeter." }
    ]
  },
  {
    id: "m10",
    slug: "genmaicha",
    name: "Genmaicha",
    japaneseName: "玄米茶",
    jp: "玄米茶",
    category: "tea",
    price: 170,
    description: "Japanese green tea blended with toasted brown rice for a nutty, soothing aroma.",
    ingredients: ["Green tea leaves", "Toasted brown rice", "Water"],
    allergens: [],
    dietary: ["vegan", "dairy-free"],
    image: { src: "/images/menu/genmaicha.webp", alt: "Genmaicha in a cup" },
    imageLabel: "Genmaicha in a cup",
    available: "all-day",
    reviews: [
      { id: "r-m10-1", author: "Maya O.", rating: 5, date: "2026-08-26", comment: "The toasted rice fragrance warms your soul instantly." }
    ]
  },

  // ══════════════════════════════════════════
  // NON-COFFEE
  // ══════════════════════════════════════════
  {
    id: "m11",
    slug: "honey-yuzu-tonic",
    name: "Honey Yuzu Tonic",
    japaneseName: "柚子トニック",
    jp: "柚子トニック",
    category: "seasonal",
    price: 200,
    description: "Kochi yuzu peel preserves, raw wildflower honey, and sparkling tonic water over hand-cut ice.",
    ingredients: ["Kochi yuzu puree", "Wildflower honey", "Artisanal tonic water", "Fresh mint", "Ice"],
    allergens: [],
    dietary: ["vegetarian", "dairy-free"],
    image: { src: "/images/menu/honey-yuzu-tonic.webp", alt: "Yuzu tonic in a glass" },
    imageLabel: "Yuzu tonic in a glass",
    available: "all-day",
    reviews: [
      { id: "r-m11-1", author: "Valerie P.", rating: 5, date: "2026-08-15", comment: "Bright, sparkling, and not overly sweet. Tangy citrus bursts with every sip." }
    ]
  },
  {
    id: "m12",
    slug: "hojicha-cocoa",
    name: "Hojicha Cocoa",
    japaneseName: "ほうじココア",
    jp: "ほうじココア",
    category: "seasonal",
    price: 210,
    description: "Roasted hojicha tea blended with Davao single-origin craft dark cocoa and warm steamed milk.",
    ingredients: ["Kyoto hojicha powder", "Davao dark cocoa", "Whole milk", "Panela cane sugar"],
    allergens: ["dairy"],
    dietary: ["vegetarian"],
    image: { src: "/images/menu/hojicha-cocoa.webp", alt: "Hojicha cocoa in a mug" },
    imageLabel: "Hojicha cocoa in a mug",
    available: "all-day",
    reviews: [
      { id: "r-m12-1", author: "Theo N.", rating: 5, date: "2026-08-30", comment: "Earthy roasted tea meets rich chocolate. A match made in heaven." }
    ]
  },
  {
    id: "m13",
    slug: "sudachi-soda",
    name: "Sudachi Soda",
    japaneseName: "すだちソーダ",
    jp: "すだちソーダ",
    category: "seasonal",
    price: 190,
    description: "Tart Japanese sudachi citrus juice, sparkling soda water, and a delicate sea salt rim.",
    ingredients: ["Tokushima sudachi juice", "Sparkling water", "Cane syrup", "Sea salt rim"],
    allergens: [],
    dietary: ["vegan", "dairy-free"],
    image: { src: "/images/menu/sudachi-soda.webp", alt: "Sudachi soda with ice" },
    imageLabel: "Sudachi soda with ice",
    available: "all-day",
    reviews: [
      { id: "r-m13-1", author: "Caleb J.", rating: 4, date: "2026-09-03", comment: "Zesty and sharp. The salt rim rounds out the citrus." }
    ]
  },

  // ══════════════════════════════════════════
  // PASTRIES & CAKES
  // ══════════════════════════════════════════
  {
    id: "m14",
    slug: "castella",
    name: "Castella",
    japaneseName: "カステラ",
    jp: "カステラ",
    category: "pastries",
    price: 140,
    description: "Traditional Nagasaki-style honey sponge cake, cut thick with a delicate crunchy sugar crystal bottom.",
    ingredients: ["Wheat flour", "Organic eggs", "Mizuame starch syrup", "Wild honey", "Cane sugar crystals"],
    allergens: ["gluten", "egg"],
    dietary: ["vegetarian", "dairy-free"],
    image: { src: "/images/menu/castella.webp", alt: "Castella slice on a plate" },
    imageLabel: "Castella slice on a plate",
    available: "all-day",
    reviews: [
      { id: "r-m14-1", author: "Michiko F.", rating: 5, date: "2026-08-03", comment: "The sugar crystals at the bottom (zarame) give it that authentic Nagasaki texture." },
      { id: "r-m14-2", author: "Andre L.", rating: 4, date: "2026-08-28", comment: "Dense yet cloud-soft sponge. Perfect with black pour-over." }
    ]
  },
  {
    id: "m15",
    slug: "mochi-muffin",
    name: "Mochi Muffin",
    japaneseName: "もちマフィン",
    jp: "もちマフィン",
    category: "pastries",
    price: 130,
    description: "Glutinous sweet rice flour muffin with a crisp caramelized edge and a chewy, bouncy heart.",
    ingredients: ["Mochiko sweet rice flour", "Coconut milk", "Brown butter", "Eggs", "Okinawa black sugar", "Vanilla"],
    allergens: ["egg", "dairy"],
    dietary: ["vegetarian"],
    image: { src: "/images/menu/mochi-muffin.webp", alt: "Mochi muffin on parchment" },
    imageLabel: "Mochi muffin on parchment",
    available: "all-day",
    reviews: [
      { id: "r-m15-1", author: "Camille D.", rating: 5, date: "2026-08-17", comment: "Crispy exterior and mochi-like chew inside. Addictive." }
    ]
  },
  {
    id: "m16",
    slug: "yuzu-cheesecake",
    name: "Yuzu Cheesecake",
    japaneseName: "柚子チーズケーキ",
    jp: "柚子チーズケーキ",
    category: "pastries",
    price: 220,
    description: "Slow-baked Japanese souffle cheesecake infused with tangy yuzu curd atop a spiced graham crust.",
    ingredients: ["Hokkaido cream cheese", "Fresh yuzu curd", "Eggs", "Graham cracker crust", "Heavy cream", "Cane sugar"],
    allergens: ["gluten", "dairy", "egg"],
    dietary: ["vegetarian"],
    image: { src: "/images/menu/yuzu-cheesecake.webp", alt: "Yuzu cheesecake slice" },
    imageLabel: "Yuzu cheesecake slice",
    available: "all-day",
    reviews: [
      { id: "r-m16-1", author: "Elise W.", rating: 5, date: "2026-08-09", comment: "Airy and tart. Not heavy like typical New York cheesecakes." }
    ]
  },
  {
    id: "m17",
    slug: "dorayaki",
    name: "Dorayaki",
    japaneseName: "どら焼き",
    jp: "どら焼き",
    category: "pastries",
    price: 150,
    description: "Two honey-infused mini castella pancakes sandwiching sweet simmered Hokkaido tsubuan azuki red bean paste.",
    ingredients: ["Wheat flour", "Honey", "Eggs", "Mirin", "Hokkaido azuki red beans", "Cane sugar"],
    allergens: ["gluten", "egg"],
    dietary: ["vegetarian", "dairy-free"],
    image: { src: "/images/menu/dorayaki.webp", alt: "Dorayaki on a wooden board" },
    imageLabel: "Dorayaki on a wooden board",
    available: "all-day",
    reviews: [
      { id: "r-m17-1", author: "Jun K.", rating: 5, date: "2026-08-25", comment: "Tender, honeyed pancakes with smooth bean paste. Reminds me of childhood." }
    ]
  },

  // ══════════════════════════════════════════
  // SEASONAL SPECIALS
  // ══════════════════════════════════════════
  {
    id: "m21",
    slug: "sakura-latte",
    name: "Sakura Latte",
    japaneseName: "桜ラテ",
    jp: "桜ラテ",
    category: "seasonal",
    price: 230,
    description: "Preserved salted cherry blossom blossoms, vanilla bean, steamed milk, and a sprinkle of dried petals.",
    ingredients: ["Pickled sakura blossoms", "Steamed milk", "Vanilla bean syrup", "Dried blossom powder"],
    allergens: ["dairy"],
    dietary: ["vegetarian"],
    image: { src: "/images/menu/sakura-latte.webp", alt: "Sakura latte in a glass" },
    imageLabel: "Sakura latte in a glass",
    available: "all-day",
    reviews: [
      { id: "r-m21-1", author: "Hana S.", rating: 5, date: "2026-08-12", comment: "Subtle floral aroma with a delicate touch of sea salt that balances the sweetness." }
    ]
  },
  {
    id: "m22",
    slug: "kuromitsu-hojicha-float",
    name: "Kuromitsu Hojicha Float",
    japaneseName: "黒蜜ほうじフロート",
    jp: "黒蜜ほうじフロート",
    category: "seasonal",
    price: 250,
    description: "Iced Kyoto hojicha tea drizzled with Okinawa black sugar syrup, crowned with creamy vanilla soft serve.",
    ingredients: ["Cold brewed hojicha tea", "Okinawa kuromitsu syrup", "Hokkaido dairy soft serve", "Ice"],
    allergens: ["dairy"],
    dietary: ["vegetarian"],
    image: { src: "/images/menu/kuromitsu-hojicha-float.webp", alt: "Kuromitsu hojicha float" },
    imageLabel: "Kuromitsu hojicha float",
    available: "all-day",
    reviews: [
      { id: "r-m22-1", author: "Gabe R.", rating: 5, date: "2026-08-30", comment: "The bitter roasted tea cuts right through the rich vanilla soft serve. Outstanding dessert beverage." }
    ]
  }
];

// Dynamically compute rating, reviewsCount, and resolve Unsplash image for every item
export const menuItems = rawMenuItems.map((item) => {
  const unsplashSrc =
    item.image?.src && item.image.src.startsWith("http")
      ? item.image.src
      : getUnsplashImageUrl(item.slug || item.imageLabel || item.name);

  return {
    ...item,
    image: {
      src: unsplashSrc,
      alt: item.image?.alt || item.name
    },
    jp: item.japaneseName || item.jp || "",
    japaneseName: item.japaneseName || item.jp || "",
    rating: calculateRating(item.reviews),
    reviewsCount: item.reviews ? item.reviews.length : 0
  };
});

/**
 * Helper to fetch a menu item by slug.
 * @param {string} slug
 * @returns {typeof menuItems[0] | undefined}
 */
export function getMenuItemBySlug(slug) {
  return menuItems.find((m) => m.slug === slug);
}