// Editorial content: experiences, testimonials, gallery, journal, events, FAQ, values, timeline.

export const experiences = [
  {
    id: "exp1",
    title: "Coffee & Community",
    jp: "珈琲と人",
    description: "A long table, slow conversation, and the quiet ritual of the brew. Our space is built for lingering.",
    imageLabel: "Communal cafe table in warm light",
    href: "/visit"
  },
  {
    id: "exp2",
    title: "The Coffee",
    jp: "珈琲",
    description: "Single-origin beans, roasted in small batches behind the counter. Traceable, seasonal, honestly priced.",
    imageLabel: "Close-up of beans on a stone surface",
    href: "/shop"
  },
  {
    id: "exp3",
    title: "Omakase Tasting",
    jp: "お任せ",
    description: "Sit at the bar. Trust the barista. A guided flight of three coffees, brewed and explained, course by course.",
    imageLabel: "An elegant coffee tasting flight",
    href: "/omakase"
  }
];

export const testimonials = [
  { id: "t1", quote: "The quietest cup in the city. I came for the coffee and stayed for the stillness.", name: "Aiko T.", role: "Regular since 2020" },
  { id: "t2", quote: "Their Yirgacheffe pour over changed how I think about coffee. Floral, bright, unforgettable.", name: "Marco D.", role: "Home brewer" },
  { id: "t3", quote: "The omakase tasting felt like a tea ceremony. Every cup had a story.", name: "Soo-min K.", role: "Visited from Seoul" },
  { id: "t4", quote: "I work from here most mornings. The light, the wood, the pace — it lets me think.", name: "Lena F.", role: "Writer" }
];

export const gallery = [
  { id: "g1", label: "Morning light on the counter", caption: "Counter" },
  { id: "g2", label: "Pour-over dripper on carafe", caption: "The pour" },
  { id: "g3", label: "Ceramic cups on a wooden shelf", caption: "Vessels" },
  { id: "g4", label: "Steam rising from a cup", caption: "Steam" },
  { id: "g5", label: "A quiet corner with a plant", caption: "Stillness" },
  { id: "g6", label: "Beans spilling onto a stone", caption: "Origin" },
  { id: "g7", label: "Window light through linen", caption: "Light" },
  { id: "g8", label: "A single pastry on a plate", caption: "Sweet" }
];

export const journal = [
  { id: "j1", slug: "the-quiet-brew", title: "The Quiet Brew", excerpt: "Why we brew one cup at a time, and what slowness gives back.", category: "Philosophy", date: "2026-09-12", imageLabel: "A single pour-over in soft light" },
  { id: "j2", slug: "origin-ethiopia", title: "Notes from Yirgacheffe", excerpt: "A week at the Konga washing station, among the cherry sorters.", category: "Origin", date: "2026-08-30", imageLabel: "Coffee cherries on a drying bed" },
  { id: "j3", slug: "on-ma", title: "On Ma — the space between", excerpt: "The Japanese idea of negative space, and how it shapes our cafe.", category: "Culture", date: "2026-08-10", imageLabel: "An empty calm cafe interior" },
  { id: "j4", slug: "home-pour-over", title: "A Home Pour-Over Guide", excerpt: "Six small decisions that make a better cup at your own counter.", category: "Brewing", date: "2026-07-22", imageLabel: "A home pour-over setup" }
];

export const events = [
  { id: "e1", slug: "saturday-cupping", title: "Saturday Cupping", date: "2026-10-18", time: "10:00 – 11:30", price: 350, spots: 8, description: "Taste four origins side by side. We brew, you slurp, we talk through what you're tasting.", imageLabel: "A cupping table with spoons" },
  { id: "e2", slug: "latte-art-class", title: "Latte Art Class", date: "2026-10-25", time: "14:00 – 16:00", price: 850, spots: 6, description: "Milk science, pour mechanics, and a lot of practice. Leave with a tulip you poured yourself.", imageLabel: "Flat white with latte art" },
  { id: "e3", slug: "tea-ceremony", title: "Tea Ceremony — Chanoyu", date: "2026-11-02", time: "15:00 – 16:30", price: 600, spots: 5, description: "A guided matcha ceremony in our quiet room. Sit, breathe, and taste.", imageLabel: "A matcha tea ceremony setting" }
];

export const values = [
  { id: "v1", title: "Slow", jp: "ゆっくり", text: "We brew one cup at a time. The wait is the point." },
  { id: "v2", title: "Traceable", jp: "原産地", text: "Every bag names the farm, the process, and the people." },
  { id: "v3", title: "Quiet", jp: "静か", text: "A space for thought. No music to compete with your cup." },
  { id: "v4", title: "Honest", jp: "正直", text: "Fair prices, fair pay, no theatre." }
];

export const timeline = [
  { year: "2019", title: "A door in Poblacion", text: "We opened with one espresso machine and a borrowed grinder." },
  { year: "2021", title: "The roastery", text: "We began roasting in small batches, behind the counter." },
  { year: "2023", title: "Omakase", text: "We introduced the guided tasting — our most-loved ritual." },
  { year: "2026", title: "Still here", text: "Same door, slower hands, a little more light." }
];

export const faqs = [
  { id: "f1", q: "Do you take reservations?", a: "Yes — walk-ins are welcome, but the omakase bar and weekend brunch fill up. Reserve through the Reservations page." },
  { id: "f2", q: "Can I buy beans to brew at home?", a: "Always. Our full range is on the Roastery page, whole bean or ground to your brewer." },
  { id: "f3", q: "Do you ship internationally?", a: "We ship across the Philippines. International shipping is available for subscriptions — see Subscriptions." },
  { id: "f4", q: "Is the space vegan-friendly?", a: "Most of our menu is or can be made vegan. Dietary icons are marked on every item." },
  { id: "f5", q: "Can I work from the cafe?", a: "Mornings are quiet and laptop-friendly. We ask that afternoons stay screen-light to keep the calm." },
  { id: "f6", q: "Do you offer wholesale?", a: "Yes — for cafes and offices. Reach out through the Wholesale page." }
];