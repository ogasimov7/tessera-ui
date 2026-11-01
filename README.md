# Tessera UI

Sells the Tessera design system in two editions:

- **Tessera ($49):** the base system this site is built with (`BASE_SYSTEM` in `lib/tokens.ts`, mirrored in `app/globals.css`).
- **Adapted ($79):** the visitor uploads a reference (plus a brief), Claude adapts Tessera to it, the site renders it on real
  components with a contrast report, and after a Stripe payment the visitor downloads it.

Both editions download the same kit: Figma importer plus code.

**Stack:** Next.js 15 (App Router) · React 19 · Tailwind CSS v4 · Radix primitives · Claude API · Stripe Checkout · Postgres

## Run it

```bash
cp .env.example .env.local     # fill in the keys
npm install
npm run db:migrate             # applies db/schema.sql to DATABASE_URL
npm run dev
```

Stripe webhooks locally:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe   # copy the whsec_ into STRIPE_WEBHOOK_SECRET
```

Pay with the test card `4242 4242 4242 4242`, any future date, any CVC.

## Pages

| Route | What it is |
| --- | --- |
| `/` | Landing page with a live preset showcase |
| `/docs`, `/docs/[id]` | Guides and component docs (preview / code tabs, install command) |
| `/themes` | Presets × radius × mode, with copyable `globals.css` |
| `/generate` | Shows the base system with a $49 checkout; reference image + brief → adapted preview, tokens, contrast, refine, $79 checkout |
| `/generate/success` | Post-payment page that verifies the Stripe session and offers the download |

## API

| Route | |
| --- | --- |
| `POST /api/generate` | `{ brief, styles, corners, image? }` or `{ current, change }` → `{ id, system }`. Calls Claude, validates and repairs the JSON (`lib/tokens.ts#normalizeSystem`), stores it. |
| `POST /api/checkout` | `{ systemId }` → Stripe Checkout URL. `tessera` is the base plan, any generated id the custom plan. Uses `STRIPE_PRICE_BASE` / `STRIPE_PRICE_CUSTOM` if set, else inline prices from `lib/plans.ts`. |
| `POST /api/webhooks/stripe` | Marks the purchase paid on `checkout.session.completed`. |
| `GET /api/download/[id]?session_id=` | Streams the zip if that session paid for that system. |
| `GET /api/system?id=` | Reloads a saved system (used after a cancelled checkout). |
| `POST /api/figma` | `{ code }` → system data for the Figma plugin, if that code's purchase is paid. CORS-open (plugins have a `null` origin). |

## What a buyer gets

Both editions download the same kit:

- `app/globals.css` (Tailwind v4 + shadcn variables, light and dark) and `tokens.json` (W3C DTCG).
- `components/ui/*`: 23 React components (accordion, alert, avatar, badge, button, card, checkbox, dialog, dropdown menu,
  input, label, popover, progress, radio group, select, separator, skeleton, slider, switch, table, tabs, textarea, tooltip)
  plus `lib/utils.ts`. These are read from this repo's `components/ui` at download time, so the site and the kit never drift;
  the README's `npm i` line is derived from their imports (`kitDependencies` in `lib/exporters.ts`).
- `figma/README.md` with the buyer's **Figma plugin code** (also shown on the success page), plus
  `figma/offline-plugin/`, the same importer with the system embedded for use without a connection.
- `style-guide.html` (`lib/style-guide.ts`): a self-contained page with colors, contrast checks, typography, radius,
  component samples and usage rules, with a light/dark toggle.
- `README.md` and `LICENSE.md` (commercial license plus the shadcn/ui MIT notice; set `LICENSOR` in `lib/exporters.ts`).

## Figma plugin

One Community plugin, **Tessera Import**, serves every buyer. Each purchase gets a code (`TSR-XXXX-XXXX-XXXX`, stored in
`purchases.figma_code`). The plugin asks for it, calls `POST /api/figma` (accepted only once the purchase is paid) and
builds a variable collection with Light/Dark modes, radius variables, text styles, a swatch board, 21 components bound
to the variables and Light/Dark preview boards.

Sources live in `lib/figma-plugin/`: `builder.js` (shared), `community.js` + `ui.html` (code entry) and `offline.js`
(embedded data, shipped in the zip). Why a plugin rather than a `.fig` file: Figma's REST API can't create files, and
`.fig` is a private format.

To publish it:

1. In `.env.local`, set `NEXT_PUBLIC_SITE_URL` to the production URL.
2. In the Figma desktop app: Plugins → Development → New plugin… → "Figma design", with UI. Copy the plugin id it
   assigns into `FIGMA_PLUGIN_ID`.
3. `npm run figma:build` writes `figma-plugin/` (manifest, code, UI). In Figma: Plugins → Development → Import plugin
   from manifest… → `figma-plugin/manifest.json`, and try it with a test purchase's code.
4. Publish from Plugins → Development → Manage plugins → Publish. After Figma's review, put the Community URL in
   `NEXT_PUBLIC_FIGMA_PLUGIN_URL` so the success page and `figma/README.md` link to it.

## Where to change things

- Base system: `BASE_SYSTEM` in `lib/tokens.ts` (keep `app/globals.css` in sync).
- Status colors (`STATUS`) and the chart palette (`CHART_PALETTE`) in `lib/tokens.ts` are fixed standards: every preset and generated system gets them unchanged. A preset whose primary sits near the error red moves its primary, never the status; a buyer's brand is kept and the generator warns instead (`primaryNearDestructive`).
- Prompt and model: `lib/generate.ts` (`ANTHROPIC_MODEL`, default `claude-sonnet-5-5`).
- Allowed fonts, presets, palette derivation, contrast checks: `lib/tokens.ts`.
- Prices and plan contents: `lib/plans.ts`.
- Exported files: `lib/exporters.ts`.
- Site theme: `app/globals.css` (the site uses the same tokens it sells).

## Before launch

- Rate-limit `/api/generate` (each call costs Claude usage), e.g. per IP with Upstash or Vercel KV, and consider requiring sign-in after a few free generations.
- Publish the components as a shadcn registry (`npx shadcn build`) so `npx shadcn@latest add https://your-domain.com/r/button.json` works as shown in the docs.
- Send a receipt email with the success-page link (Stripe can do this; the link is the re-download key).
- Terms of sale and refund policy for Stripe.
