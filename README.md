# DRIFT AUDIO — Premium Audio E-Commerce

A production-grade, fully interactive e-commerce experience for a fictional premium audio brand (**DRIFT AUDIO** — earbuds, headphones, premium ANC, speakers, smartwatches). Built as a portfolio flagship to demonstrate modern front-end and UX engineering.

> **Note:** DRIFT AUDIO is an original, fictional brand. All product names, copy and illustrations are original — this is a concept/portfolio project, not affiliated with any real company, and no real payments are processed.

---

## ✨ Highlights

- **Fully animated landing page** — parallax hero, scroll-reveal sections, infinite marquee, interactive colour configurator, testimonials.
- **Real shopping cart** — add / remove / change quantity, live subtotal & savings, slide-in drawer, **persists across page reloads** (localStorage).
- **Dual-currency** — toggle ₹ INR ↔ $ USD; every price updates instantly everywhere and the preference persists.
- **Live search** — as-you-type product filtering with a results dropdown from any page.
- **Product catalog** — category filters, price buckets, and 5 sort modes.
- **Dynamic product pages** — colour picker with live re-render, quantity, add-to-cart / buy-now, specs, verified reviews, related products (statically generated per product).
- **Checkout flow** — validated shipping + payment form with a live order summary and an order-confirmation state (demo only — no real payment).
- **Premium polish** — designed 404 & empty states, keyboard focus states, `prefers-reduced-motion` support, custom SVG product illustrations, glassmorphic UI, grain texture.
- **Responsive** — mobile → 4K, animated mobile menu, zero horizontal overflow.

---

## 🛠 Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | **Next.js 15** (App Router, React 19, SSG) |
| Language | **TypeScript** (strict) |
| Styling | **Tailwind CSS** with CSS-variable design tokens |
| Animation | **Framer Motion** |
| State | **Zustand** (+ persist middleware) |
| Icons | **lucide-react** |
| Fonts | Space Grotesk (display) + DM Sans (body) via `next/font` |

Design system generated with **UI-UX Pro Max**; component patterns informed by **21st.dev** and **shadcn/ui**.

---

## 🏗 Architecture (built to scale)

- **Single source of truth** — all products live in [`src/lib/products.ts`](src/lib/products.ts). Adding a product or category is a data-only edit; no component changes needed.
- **Token-driven theming** — colours, radii, shadows are CSS variables in [`globals.css`](src/app/globals.css) / [`tailwind.config.ts`](tailwind.config.ts). A full rebrand is a token change, not a rewrite.
- **Composable primitives** — small reusable `ui/` building blocks compose into feature components; nothing is copy-pasted.
- **Decoupled data layer** — components read from typed data + stores, never inline data, so swapping in a real backend/CMS later means replacing the source, not the UI.

```
src/
├─ app/                # routes: home, products, products/[slug], checkout, 404
├─ components/
│  ├─ layout/          # navbar, footer, cart drawer, mobile menu, search
│  ├─ home/            # hero, showcase, configurator, bestsellers, etc.
│  ├─ products/        # product card, catalog, product detail
│  ├─ checkout/        # checkout form + summary
│  └─ ui/              # button, badge, price tag, reveal, product SVGs…
└─ lib/                # products data, cart & currency stores, types, utils
```

---

## 🚀 Getting Started

```bash
npm install
npm run dev      # http://localhost:3000
```

Build for production:

```bash
npm run build
npm start
```

---

## 📦 Deploy

Zero-config deploy to **Vercel**: push to a Git repo and import, or run `npx vercel`. No environment variables required.
