# Shizuka Café (静か 珈琲)

> **Café & Zakka & Coffee Roastery** — A quiet specialty coffee experience and culinary sanctuary inspired by Japanese minimalism and Korean café culture.

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS%20v4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer%20Motion-11.18-0055FF?style=flat-square&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Google Maps](https://img.shields.io/badge/Google%20Maps-Zero%20API%20Key-4285F4?style=flat-square&logo=googlemaps&logoColor=white)](https://maps.google.com/)
[![TypeScript Ready](https://img.shields.io/badge/TypeScript-Strict%20Types-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

---

## ☕ Overview & Design Philosophy

**Shizuka Café** (静か) is an online storefront and interactive digital experience for an artisanal coffee roastery, zakka lifestyle goods boutique, and serene dining space tucked along Lantern Lane in Poblacion, Makati.

The digital experience is crafted around the Japanese aesthetic concept of **Ma** (間) — the deliberate celebration of space, pause, and quiet contemplation:
- **Palette**: Rice-paper creams (`zen-paper` `#F5F1EA`), warm tatami surfaces (`zen-surface` `#EBE6DD`), deep roasted espresso tones (`zen-espresso` `#1A1613`), soft charcoal typography (`zen-charcoal` `#2B211B`), and muted earthen accents (`zen-clay`, `zen-sage`).
- **Typography**: Editorial titles set in *Cormorant Garamond*, geometric clarity in *Jost*, and authentic Japanese typography in *Noto Sans JP* and *Shippori Mincho*.
- **Motion**: Deliberate, smooth easing `[0.4, 0, 0.2, 1]`, gentle page crossfades, ambient image hover-zooming, and full consideration for accessibility via `prefers-reduced-motion`.

---

## ✨ Key Features

### 1. Artisanal Micro-Roastery & Zakka Store (`/shop`)
- **Single-Origin Lots**: Transparent origin details, bean elevation, processing methods (washed, natural, honey), and distinct cupping notes (cacao nib, bergamot, candied citrus, jasmine).
- **Curated Homewares**: Handcrafted Mino-ware ceramic cups, brass drippers, linen aprons, and curated Japanese zakka homewares.
- **Multi-Currency System**: Real-time currency selector supporting Philippine Peso (₱), US Dollar ($), Japanese Yen (¥), and Euro (€).
- **Interactive Cart & Drawer**: Persistent side cart drawer with instant quantity controls, free shipping thresholds, and order notes.

### 2. Expanded Japanese & Korean Dining Menu (`/menu`)
- **Serving Hour Intelligence**: Dynamic indicators that calculate availability in real time:
  - **Breakfast** (`07:30 – 11:00`): Tamago Sando, Shokupan French Toast, Matcha Pancakes, Asa Teishoku, Yuzu Avocado Toast.
  - **Lunch** (`11:00 – 15:00`): Chicken Katsu Curry, Beef Bibimbap, Salmon Ikura Don, Cold Sesame Soba, Katsu Sando, Kimchi Fried Rice.
  - **Dinner** (`17:00 – Close`): Miso-Glazed Black Cod, Beef Bulgogi Set, Shoyu Ramen, Mushroom Udon, Pork Shogayaki.
  - **Snacks & Tea** (`All Day`): Onigiri Trio, Karaage Bites, Tteokbokki, Taiyaki, Hojicha Pudding, Mochi Donuts, Cheese Gimbap.
- **Filter & Search Engine**: 250ms debounced search, category tabs with Japanese subtitles, dietary tags (Vegetarian, Vegan, Dairy-Free, Spicy), price range slider, and multi-option sort dropdown.
- **Accessible Dish Dialog**: Responsive modal (slide-up bottom sheet on mobile, centered dialog on desktop) featuring detailed ingredient breakdowns, allergen advisories, 5-to-1 star rating distribution bars, customer reviews, and table reservation CTAs.
- **High-Resolution Photography**: Integrated high-res Unsplash food photography without people, paired with an elegant Japanese craft fallback card if offline.

### 3. Zen AI Chat Assistant
- **Floating Launcher & Responsive Sheet**: Minimalist steam-cup trigger that expands into a 380×560px desktop card or full-height mobile bottom sheet.
- **Deterministic Scripted Engine (`DemoProvider`)**: Operates 100% client-side with zero external API dependencies or fees. Handles hours, location, bean recommendations, brew tips, dietary advice, and dish lookups.
- **Natural Token Streaming**: Simulates realistic token-by-token reveals (25–35ms per token) accompanied by an organic typing indicator.
- **In-Chat Reservation Flow**: State machine guiding guests through party size, date, time slot, and contact details, outputting downloadable `.ics` calendar invitation files upon confirmation.
- **Pluggable Architecture**: Easily swaps to a live LLM backend (OpenAI, Gemini, Anthropic) via `VITE_CHAT_MODE=live`.

### 4. Interactive Location & Delivery Mapping (`/visit`)
- **Interactive Google Maps (Zero API Key)**: Official responsive Google Maps embed showing the roastery sanctuary in Poblacion, Makati with Roadmap/Satellite toggles, directions routing, and Metro Manila delivery hub selectors.
- **Delivery Coverage Visualizer**: Interactive delivery hubs calculating distance and courier dispatch duration across Metro Manila.

### 5. Editorial Journal & Brewing Guides (`/journal`)
- **Rich Articles**: Deep dives into green coffee sourcing, single-origin processing, water chemistry, and tea rituals.
- **Interactive Guides**: Step-by-step pour-over recipes for Hario V60, French Press, and Kyoto Cold Drip with ratios, grind sizes, and water temperatures.
- **Reading Comfort**: Clean serif headings, pull quotes with border accents, estimated read times, and author profiles.

### 6. Checkout & Brand Trust
- **Automated Review Carousel ("Kind Words")**: Timed 5-second fade carousel featuring authentic guest reviews with touch-swipe gesture support and high-contrast night aesthetics.
- **Authentic Payment Gateway Badges**: Custom vector badges for Visa, Mastercard, American Express, Apple Pay, Google Pay, JCB, PayPal, and Shop Pay.

---

## 🛠️ Technology Stack

| Category | Technologies |
| :--- | :--- |
| **Frontend Framework** | [React 18.3](https://react.dev/) (Functional Components, Hooks, Context API) |
| **Build & Tooling** | [Vite 8.2](https://vitejs.dev/) with Fast Refresh & Lightning-fast Rollup builds |
| **Language & Typing** | JavaScript (ESNext) + Strict [TypeScript](https://www.typescriptlang.org/) models (`menuTypes.ts`, `types.ts`, `calendar.ts`) |
| **Styling & Design System** | [Tailwind CSS v4](https://tailwindcss.com/) with custom Japanese aesthetic tokens & typography |
| **Motion & Gestures** | [Framer Motion 11](https://www.framer.com/motion/) (orchestrated layout animations, presence, gesture drag) |
| **Routing** | [React Router DOM v6](https://reactrouter.com/) (declarative routing, scroll restoration, route guards) |
| **Mapping & Geospatial** | [Google Maps](https://maps.google.com/) (Zero API Key Embed) with Satellite toggles & courier routing |
| **Icons & Art** | [Lucide React](https://lucide.dev/), handcrafted SVGs, and Unsplash Culinary Photography API |
| **Data & State Management** | React Context (`CartContext`, `CurrencyContext`, `AuthContext`) + TanStack Query |
| **Utilities** | `date-fns` (localized date formatting), `canvas-confetti`, `clsx`, `tailwind-merge` |

---

## 📂 Project Directory Structure

```text
shizuka-cafe/
├── public/                     # Static assets, favicon, menu photography
├── src/
│   ├── components/             # Reusable UI & design system components
│   │   ├── chat/               # AI Assistant (Launcher, Panel, MessageRow, Cards)
│   │   ├── ui/                 # Accessible atomic UI components
│   │   ├── Header.jsx          # Desktop navigation & mobile drawer
│   │   ├── Footer.jsx          # Footer links, newsletter, payment badges
│   │   ├── MenuImage.jsx       # Dish photo component with zen craft fallback
│   │   ├── MenuItemDialog.jsx  # Accessible dish modal / bottom sheet
│   │   ├── PaymentIcons.jsx    # Vector payment provider badges
│   │   ├── ShizukaMap.jsx      # Google Maps interactive component (zero API key)
│   │   ├── ZenImage.jsx        # Ambient image frame with subtle grain
│   │   └── ZoomImage.jsx       # Smooth hover-zoom container
│   ├── context/                # Global React contexts (Cart, Currency)
│   ├── data/                   # Single sources of truth (menu, products, journal, site)
│   │   ├── menu.js             # 44 dishes & drinks with reviews, ingredients, allergens
│   │   ├── menuTypes.ts        # Strict TypeScript interfaces for menu items & reviews
│   │   ├── products.js         # Single-origin coffee beans & zakka merchandise
│   │   ├── journal.js          # Journal posts, brewing guides & categories
│   │   └── site.js             # Operating hours, coordinates, address, social links
│   ├── lib/                    # Core application libraries
│   │   ├── auth.js             # Client-side session and auth storage
│   │   ├── unsplash.js         # Unsplash image integration & photo map
│   │   └── chat/               # AI Chat engine
│   │       ├── intentMatcher.ts    # Fuzzy intent and keyword scoring engine
│   │       ├── knowledge.ts        # Menu, hours, policies, & recommendation queries
│   │       ├── reservationMachine.ts # Multi-step booking state machine
│   │       ├── calendar.ts         # Client-side .ics file generator
│   │       └── providers/          # Pluggable Chat Providers (DemoProvider, LiveProvider)
│   ├── pages/                  # Top-level page routes
│   │   ├── Home.jsx            # Hero, counter picks, room, kind words, values
│   │   ├── Menu.jsx            # Redesigned menu with tabs, filters, and modal
│   │   ├── Shop.jsx            # Roastery and zakka product catalogue
│   │   ├── ProductDetail.jsx   # Bean tasting notes, roast meter, photo swiper
│   │   ├── Journal.jsx         # Editorial articles & brewing guides
│   │   ├── JournalArticle.jsx  # Rich article reader with pull quotes
│   │   ├── Visit.jsx           # Location, transit hints, interactive Google Maps
│   │   ├── Reservations.jsx    # Table booking experience
│   │   ├── Cart.jsx            # Detailed shopping cart review
│   │   ├── Checkout.jsx        # Step-by-step guest checkout flow
│   │   ├── Account.jsx         # Customer profile, past orders, saved items
│   │   └── Admin.jsx           # Order metrics, inventory, table seating manager
│   ├── App.jsx                 # Application routes & layout wrapper
│   └── index.css               # Design tokens, typography variables, paper grain
├── tailwind.config.js          # Tailwind theme configuration
├── vite.config.js              # Vite bundler configuration & path aliases (@/ -> ./src)
└── package.json                # Project dependencies & scripts
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18.0 or higher recommended)
- [npm](https://www.npmjs.com/) (version 9.0 or higher)

### Installation

```bash
# Clone the repository
git clone https://github.com/jrbgalan/shizuka-cafe.git

# Navigate into the project directory
cd shizuka-cafe

# Install dependencies
npm install
```

### Local Development

```bash
# Start the local development server with HMR
npm run dev
```

Open your browser and navigate to `http://localhost:5173`.

### Code Quality & Build

```bash
# Typecheck TypeScript definitions
npm run typecheck

# Run ESLint validation
npm run lint

# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 🍵 AI Assistant Architecture & Switching to a Live LLM

The chat assistant is designed around a decoupled **Provider Pattern** (`ChatProvider` interface), keeping UI components completely agnostic to whether responses are generated locally or by an external AI API.

### Current Mode: Demo Mode (Default)
In default operation (`VITE_CHAT_MODE=demo`):
- All queries are scored by a deterministic keyword & phrase matching engine (`src/lib/chat/intentMatcher.ts`).
- Answers are sourced directly from the single source of truth data files (`menu.js`, `products.js`, `site.js`).
- Supports complex contextual questions:
  - *"What's for breakfast?"* &rarr; Returns morning offerings (7:30–11:00 AM) and Tamago Sando card.
  - *"Something vegetarian"* &rarr; Identifies vegetarian options and returns Mushroom Udon card.
  - *"Anything spicy"* &rarr; Highlights dishes with gentle heat like Bibimbap and Tteokbokki.
  - *"How much is the ramen?"* &rarr; Returns price (₱395), ingredient list, and Shoyu Ramen card.
  - *"Is dinner being served?"* &rarr; Time-aware calculation based on current hour and day closing schedule.
- Zero API keys, zero network lag, zero privacy concerns.

### Switching to a Live LLM (OpenAI / Gemini / Anthropic)

Because this application runs client-side, **never store LLM API keys in frontend code or client environment variables**.

To connect a live model:
1. **Set up a server proxy**: Create a backend endpoint (e.g. Next.js route handler, Express server, or Cloudflare Worker) at `POST /api/chat`.
2. **Store secrets server-side**: Keep `GEMINI_API_KEY` or `OPENAI_API_KEY` strictly in your server's environment.
3. **Stream chunks**: Configure your endpoint to accept `messages: ChatMessage[]` and stream text chunks using Server-Sent Events (SSE).
4. **Activate Live Mode**: Add `VITE_CHAT_MODE=live` to your local `.env.local` file:
   ```env
   VITE_CHAT_MODE=live
   ```
5. The bundled `LiveProvider` (`src/lib/chat/providers/liveProvider.ts`) will automatically connect to `/api/chat` and stream tokens directly into the existing UI.

---

## 🎨 Design System Tokens

| Token | Hex Value | Usage |
| :--- | :--- | :--- |
| `zen-paper` | `#F5F1EA` | Primary background, rice-paper light containers |
| `zen-surface` | `#EBE6DD` | Secondary card background, tatami contrast |
| `zen-espresso` | `#1A1613` | Dark sections, footer, high-contrast night blocks |
| `zen-charcoal` | `#2B211B` | Primary reading typography, borders, logos |
| `zen-clay` | `#B8A995` | Muted labels, craft borders, eyebrow accents |
| `zen-sage` | `#8A9A82` | Botanical highlights, vegetarian dietary badges |
| `zen-hairline` | `#D1C7B7` | Delicate divider hairlines and border outlines |
| `zen-muted` | `#8C8378` | Secondary body text, timestamps, subtitles |

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more details.
All brand designs, craft assets, and Japanese café concept created for the Shizuka Café portfolio experience.
