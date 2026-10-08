# Shizuka Café (静か 珈琲)

> Café & Zakka & Coffee Roastery — A quiet specialty coffee experience built with React, Vite, Tailwind CSS, and Framer Motion.

[![Sole Contributor](https://img.shields.io/badge/Sole%20Contributor-John%20Romeo%20Galan-2B211B?style=flat-square)](mailto:jrbgalan@gmail.com)
[![React](https://img.shields.io/badge/React-18-blue?style=flat-square)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-Bundler-646CFF?style=flat-square)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square)](https://tailwindcss.com/)

---

## ☕ About the Project

**Shizuka Café** is an online home for a Japanese/Korean-inspired specialty coffee house, zakka lifestyle store, and micro-roastery. The interface embodies the Japanese concept of *Ma* (間, the space between)—featuring a rice-paper palette, refined typography (Cormorant Garamond, Jost, and Noto Sans JP), delicate motion transitions, and generous whitespace.

### ✨ Key Features

- **Atmospheric Visuals**: Ensō ring loader, subtle paper grain, custom hover-zoom frames, and calm scroll reveals.
- **Roastery Store**: Single-origin specialty coffee beans with origin details, roast levels, tasting notes, multi-currency support, and persistent bag drawer.
- **Journal & Coffee Notes (`/journal`)**: Editorial articles, brewing guides, origin stories, debounced search, category filter chips, skeleton loading, and readable typography.
- **Curated Menu**: Hand-drip pour-overs, espresso beverages, tea ceremony matcha, and artisanal pastries.
- **Seat Reservations & Visit Guide**: Interactive visit planning and booking.
- **Account & Admin Suite**: Order history, wishlist management, reservation tracking, and revenue overview.
- **Accessibility & Performance**: Full responsive support down to 360px viewports, 44px minimum touch targets, image aspect ratio containers, and full `prefers-reduced-motion` compliance.

---

## 👤 Author & Sole Contributor

- **John Romeo Galan**
- Email: [jrbgalan@gmail.com](mailto:jrbgalan@gmail.com)
- Role: Sole Creator, Designer & Developer

---

## 🛠️ Technology Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Routing**: React Router DOM v6
- **State & Utilities**: TanStack Query, date-fns, Lodash

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/shizuka-cafe.git

# Navigate to the project directory
cd shizuka-cafe

# Install dependencies
npm install
```

### Development

```bash
# Start the local development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Production Build

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

---

## 🍵 AI Chat Assistant & Switching to a Live LLM

The application includes an in-chat AI assistant designed with a tranquil Japanese/Korean aesthetic and a pluggable architecture.

### Demo Mode (Default)
By default, the assistant runs in **Demo Mode** (`VITE_CHAT_MODE=demo`):
- Powered by a local deterministic intent engine (`src/lib/chat/intentMatcher.ts`) and knowledge base (`src/lib/chat/knowledge.ts`).
- Simulates natural token streaming (25–35ms per token) with an initial typing pause.
- Features a guided multi-step in-chat table reservation state machine with client-side `.ics` calendar generation.
- Zero external API keys, zero network latency, zero costs.

### Switching to a Live LLM

Because Shizuka Café is a client-side Single-Page Application (Vite), **never place LLM API keys (OpenAI, Gemini, Anthropic) into client-side environment variables or frontend code**.

To connect a live model:
1. **Deploy a small backend proxy** (e.g. Next.js API route, Express, Cloudflare Worker, or Nitro serverless function) listening at `POST /api/chat`.
2. **Store your API key strictly server-side** (e.g., `GEMINI_API_KEY` or `OPENAI_API_KEY` in your server environment).
3. **Stream responses**: Configure `/api/chat` to accept `{ messages }` and return a streamed response (Server-Sent Events or readable chunk stream).
4. **Enable Live Mode**: Set `VITE_CHAT_MODE=live` in your `.env.local` file:
   ```env
   VITE_CHAT_MODE=live
   ```
5. **Provider Implementation**: The frontend `LiveProvider` (`src/lib/chat/providers/liveProvider.ts`) will automatically activate and stream chunks directly from `/api/chat` without modifying any UI components.

---

## 📄 License

© 2026 **John Romeo Galan**. All rights reserved. Portfolio Project.
