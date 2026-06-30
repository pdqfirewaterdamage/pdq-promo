# PDQ Restoration CRM — Promo Site

A standalone, self-contained marketing site for the **PDQ Restoration CRM**, built to show
prospects and investors. It includes:

- A polished **single-page marketing site** — hero, stats, a features grid, and a dedicated
  **"AI built in"** section spotlighting the six AI features.
- A **clickable phone-mockup prototype** of the mobile dispatch app (pure front-end state, no
  backend) with five tappable screens: **My Day**, **Dispatch**, **Job detail**, **Alert Page**
  (AI Alert Qualifier), and **AI Billing QA**.
- An **embedded pitch deck** (~12 slides, keyboard-navigable) with **two export paths**:
  - **Download PDF** — uses a print stylesheet + `window.print()` scoped to the deck for a clean
    one-slide-per-page PDF via the browser's "Save as PDF".
  - **Download PPTX** — generates a real `.pptx` client-side with
    [`pptxgenjs`](https://github.com/gitbrent/PptxGenJS).

> **Sample data only.** Everything is invented demo data. There are **no** network calls, **no**
> secrets, and **no** real customer data. Nothing here touches the live CRM or Supabase.

## Tech

Vite + React 19 + TypeScript + Tailwind CSS v3. Kept intentionally light — this is a marketing
site, not the application.

## Develop

```bash
npm install
npm run dev
```

Vite serves the site at **http://localhost:5173**.

## Build

```bash
npm install
npm run build
```

This runs `tsc -b` then `vite build`, producing static assets in **`dist/`**.
Preview the production build locally with `npm run preview`.

## Deploy to Cloudflare Pages

This is a static SPA. A `wrangler.toml` and `public/_redirects` (`/* /index.html 200`) are
included.

**Option A — Git-connected (recommended)**

1. Push this repo to GitHub.
2. In the Cloudflare dashboard: **Workers & Pages → Create → Pages → Connect to Git**.
3. Configure the build:
   - **Framework preset:** None (or Vite)
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Save & Deploy. Every push to the production branch redeploys.

**Option B — Direct upload with Wrangler**

```bash
npm run build
npx wrangler pages deploy dist --project-name pdq-promo
```

## Project structure

```
pdq-promo/
├── index.html                 App entry HTML (fonts, meta)
├── package.json               Scripts + deps (react 19, tailwind, pptxgenjs)
├── vite.config.ts             Vite + React plugin (outDir: dist)
├── tailwind.config.ts         Brand tokens (navy + orange accent)
├── postcss.config.js
├── tsconfig*.json
├── wrangler.toml              Cloudflare Pages config (output: dist)
├── public/
│   ├── _redirects             SPA fallback for Pages
│   └── favicon.svg
└── src/
    ├── main.tsx               React entry
    ├── index.css              Tailwind + print stylesheet for the deck
    ├── App.tsx                Page sections (hero, features, AI, prototype, deck, CTA)
    ├── data.ts                All dummy data + marketing/deck copy
    ├── PhonePrototype.tsx     Clickable 5-screen mobile mockup
    ├── PitchDeck.tsx          Keyboard-nav slide deck + PDF/PPTX buttons
    └── pptx.ts                Client-side .pptx generation (pptxgenjs)
```
