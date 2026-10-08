# AGENTS.md

## Project Context

This is the **Shizuka Café** application repository. Sole contributor and author: **John Romeo Galan** (`jrbgalan@gmail.com`).

Treat it as user-owned application code, keep changes focused on the user's request, and preserve existing project conventions.

Start with `README.md` for local setup and project overview.

## Key Files & Directories

- `src/`: frontend application source.
- `src/components/`: reusable UI and design-system components (`Header.jsx`, `Footer.jsx`, `ZoomImage.jsx`, `ZenImage.jsx`, `ScrollReveal.jsx`).
- `src/pages/`: top-level page routes (`Home.jsx`, `Journal.jsx`, `JournalArticle.jsx`, `Shop.jsx`, `Menu.jsx`, `Visit.jsx`, `About.jsx`, `Contact.jsx`, `Account.jsx`, `Admin.jsx`, `PageNotFound.jsx`).
- `src/data/`: content and data configurations (`site.js`, `journal.js`, `products.js`, `menu.js`, `content.js`).
- `src/lib/auth.js`: client-side authentication and session management.
- `vite.config.js`: Vite configuration and path aliases (`@` -> `./src`).

## Working Notes

- Use `npm run dev` as the default local development command.
- Run `npm run build` to verify production builds.
- Run `npm run lint` and `npm run typecheck` before finishing code changes.
- Maintain the calm, zen Japanese/Korean aesthetic (rice-paper backgrounds, Cormorant Garamond serif headings, generous whitespace, smooth motion).
