// Central site configuration — edit business details, navigation, currencies and languages here.

export const site = {
  name: "Shizuka Café",
  nameJP: "静か 珈琲",
  tagline: "Café & Zakka & Coffee Roastery",
  taglineJP: "カフェ ＆ ザッカ ＆ コーヒーロースター",
  established: "2019",
  email: "hello@shizukacafe.com",
  phone: "+63 2 8555 0123",
  phoneDisplay: "+63 2 8555 0123",
  address: {
    line1: "12 Lantern Lane, Poblacion",
    city: "Makati City",
    region: "Metro Manila",
    country: "Philippines",
    postcode: "1210"
  },
  hours: [
    { day: "Monday – Friday", time: "7:30 – 19:00" },
    { day: "Saturday", time: "8:00 – 20:00" },
    { day: "Sunday", time: "8:00 – 18:00" },
    { day: "Public Holidays", time: "Closed" }
  ],
  socials: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "Facebook", href: "https://facebook.com" },
    { label: "LINE", href: "https://line.me" }
  ]
};

// Primary navigation (footer + header share this).
export const navLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Menu", to: "/menu" },
  { label: "Roastery", to: "/shop" },
  { label: "Visit", to: "/visit" },
  { label: "Reservations", to: "/reservations" },
  { label: "Journal", to: "/journal" },
  { label: "Contact", to: "/contact" }
];

// Currencies — base currency is PHP. rate = 1 PHP -> target currency.
export const currencies = [
  { code: "PHP", symbol: "₱", label: "Philippines", rate: 1, locale: "en-PH" },
  { code: "USD", symbol: "$", label: "United States", rate: 0.0179, locale: "en-US" },
  { code: "JPY", symbol: "¥", label: "Japan", rate: 2.68, locale: "ja-JP" },
  { code: "KRW", symbol: "₩", label: "Korea", rate: 23.9, locale: "ko-KR" },
  { code: "EUR", symbol: "€", label: "Europe", rate: 0.0164, locale: "en-IE" },
  { code: "AUD", symbol: "A$", label: "Australia", rate: 0.0268, locale: "en-AU" }
];

export const languages = [
  { code: "en", label: "English" },
  { code: "ja", label: "日本語" },
  { code: "ko", label: "한국어" }
];

// Promo codes (mock). discount is a fraction off the subtotal.
export const promoCodes = {
  WELCOME10: { discount: 0.1, label: "10% off your first order" },
  MA15: { discount: 0.15, label: "15% off — quiet appreciation" },
  ZEN5: { discount: 0.05, label: "5% off" }
};