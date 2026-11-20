# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

A **Next.js 16 (App Router) + TypeScript** app. Node ≥ 20.9 (`.nvmrc` pins 22).

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build (all routes are statically generated)
npm run start        # serve the production build
npm run check        # typecheck + lint + prettier check — run before committing
```

Deploys to Vercel as a standard Next.js project (`npx vercel --prod --yes`).
GitHub: `https://github.com/rohanpradyumna/ojas-mitra` · Live: `https://ojas-mitra.vercel.app`

Next 16 ships its docs in `node_modules/next/dist/docs/` — check them before using an API you are unsure of (e.g. `params` is a Promise; type pages with `PageProps<'/route'>`).

## Architecture

```
src/
  app/                      Routes (App Router)
    layout.tsx              Root: fonts, metadata, providers, SiteHeader
    page.tsx                /  — full-screen infinite bottle carousel
    (site)/                 Route group for reading pages: adds <main>, footer, WhatsApp button
      products/[slug]/      Product discovery page (SSG from data/products)
      shelf/  our-way/  journal/  journal/[slug]/
    sitemap.ts robots.ts not-found.tsx globals.css
  components/
    providers/              SmoothScroll (Lenis on GSAP's ticker), CursorProvider (cursor pill)
    layout/                 SiteHeader, MenuOverlay, SiteFooter, WhatsAppFloat
    home/                   Loader, BottleCarousel, useBottleLoop (engine), carouselGeometry (pure maths)
      wheel/                CartWheel (bullock-cart wheel behind the bottles), geometry, useWheelVariant, warli/ (frieze + figures)
    product/                ProductReveal, ProductNotes, DragGallery, OtherProducts, ProductTile
    fruit/                  Fruit (lemon/pineapple/apple SVGs), FruitBurst, scatter
    journal/  ui/           ReadingProgress; RichText, Reveal, PageIntro, BottleImage, Diamond
  data/                     Typed content — products, journal, gallery, site constants, types
  hooks/  lib/              useReducedMotion, useHideOnScroll; gsap (registered plugins), handoff, math, cx
public/                     images/bottles, images/gallery, logo, svg (Warli + illustrated bottles)
design/                     Reference material, not part of the app
uploads/                    Raw photos, not served
```

### Conventions

- **Content lives in `src/data/`, never in components.** Product and journal copy is typed (`data/types.ts`); `*text*` marks italics and is rendered by `<RichText>`. Adding a product = one entry in `PRODUCTS` (+ its images); routes, shelf, footer, sitemap and legacy redirects follow.
- **Server components by default.** Only files that animate or handle input are `'use client'`.
- **Styling:** design tokens and base type in `app/globals.css`; everything else in a co-located `*.module.css`. No inline style objects except CSS variables (e.g. `--tint`).
- **Animation:** always import from `@/lib/gsap` (registers ScrollTrigger + `useGSAP` once). Use `useGSAP` with a `scope` so tweens and ScrollTriggers are reverted on unmount; use `gsap.matchMedia()` for breakpoint and `prefers-reduced-motion` variants. Event-driven tweens are created inside the `useGSAP` callback with its `contextSafe`.
- **Imports:** `@/` maps to `src/`. Old `.html` URLs are permanently redirected in `next.config.ts`.

### Home → product hand-off

- **Home (`useBottleLoop`)**: an endless loop driven by wheel, drag/swipe, arrow keys and a slow drift. A bottle's pose is a pure function of its loop position (`carouselGeometry.ts`): +45° entering right, upright at centre, −30° leaving left. Clicking a bottle centres it, then parks it at the **hand-off pose** and navigates.
- **The hand-off pose** is defined once, as CSS variables `--handoff-top` / `--handoff-scale` (with `--bh`, the bottle height) in `globals.css`. The carousel reads them (`readHandoffPose`) and `ProductReveal` starts its bottle there, so the bottle doesn't move across the page change. `lib/handoff.ts` notes the chosen slug so the product page skips its own bottle entrance.
- **The cart wheel (`home/wheel/`)**: a bullock-cart wheel in `--seal` turns behind the bottles (`useBottleLoop` rotates it with the loop). It's modelled on a real cart wheel: iron tyre with bolts, broad wooden rim, 14 tapered spokes, ringed hub. Three rims, chosen by `HOME_WHEEL` in `data/site.ts` and previewable with `?wheel=text|warli|plain`:
  - `text` — the ring text on a broad painted band;
  - `warli` — a twelve-scene Warli frieze of how a bottle is made (picking fruit → peeling → the matka → ninety days under sun and moon → stirring → straining → bottling → the cart → a clean home), white on the wood like the paintings. Scenes run anticlockwise so each next one rises into view from the left as the wheel turns. Figures follow the Warli rules below and are placed on the circle one by one (`onRing`), so they stand on the curve;
  - `plain` — a narrower rim with its segment joints.
- **Product page (`ProductReveal`)**: pinned stage; on scroll the bottle rises through the giant title tilting to +28°, then leaves faster than the page. Three nested wrappers (rise / exit / entrance) keep each tween on its own element.
- **Other products (`ProductTile` + `FruitBurst`)**: hover or focus tints the tile and throws out a random handful of lemons, pineapples and apples (`scatter.ts` keeps them clear of the bottle) — the fruit the bio-enzymes are fermented from.

### Images

`public/images/bottles/*.webp` (301×1100) were generated from `uploads/bg_rem_laundry.jpeg`: background flood-filled out, "LAUNDRY LIQUID" and the first tagline line in-painted and re-set. Replace them with real photography of each bottle when available, keeping the ratio. Kumkumadhi uses its Warli-labelled SVG illustration. Gallery posters are in `public/images/gallery/`.

### Design tokens

Defined on `:root` in `globals.css`: palette (`--cream`, `--cream-warm`, `--cream-deep`, `--peach`, `--terracotta`, `--terracotta-soft`, `--terracotta-deep`, `--seal`, `--seal-text`, `--clay`, `--clay-warm`, `--clay-soft`, `--sage`, `--olive`), rules (`--rule`, `--rule-soft`, `--rule-faint`), type stacks (`--serif` EB Garamond, `--sans` Inter, `--deva` Tiro Devanagari Hindi, `--hand` Caveat — self-hosted via `@fontsource`), easing (`--ease-spring`, `--ease-out-expo`), layout (`--gutter`, `--header-h`, `--bh`, `--handoff-*`).

### Warli SVG system

All Warli illustrations use a single colour: `stroke="#a8472a"` (terracotta) with `fill="none"` for outlines and `fill="#a8472a"` for solid areas. No gradients or colours other than terracotta.

**Geometry rules — must be respected in every edit:**

- **Human figures**: two solid filled triangles tip-to-tip at the waist. Torso = upper triangle (apex DOWN). Pelvis = lower triangle (apex UP). Head = featureless filled circle above apex. **Women** only: small dot above head + connecting line = Ambada bun.
- **Trees**: two stacked conical triangles (NOT branching lines). Apex dot at crown tip. Bud dots at base corners of each triangle.
- **Animals**: horizontal oval/ellipse body (outline) + filled circle head + 4 stick legs.
- **Pots (matka)**: wide Q-bezier belly + rect neck + ellipse rim + belly stripe.
- **Crescent moon**: two offset filled circles — outer terracotta circle, inner cream circle (`fill="#f1e7d3"`) offset ~8px to create crescent silhouette against the cream background. Do NOT use SVG masks.
- **Fish border**: ellipse body (outline) + filled V-tail triangle (path) + eye dot.

**SVG files:**

| File                   | ViewBox  | Purpose                                                     |
| ---------------------- | -------- | ----------------------------------------------------------- |
| `warli-hero.svg`       | 1440×200 | Homepage hero — 8-chapter bio-enzyme narrative panorama     |
| `warli-divider.svg`    | 600×80   | Section divider (used in shelf.html)                        |
| `warli-procession.svg` | 800×120  | Procession strip (used in shelf.html)                       |
| `warli-circle.svg`     | 200×200  | Tarpa dance ring (not currently placed on any page)         |
| `warli-chauk.svg`      | 240×240  | Sacred square with Palaghata goddess (not currently placed) |
| `warli-tree.svg`       | 80×80    | Standalone tree mark                                        |
| `bottles/*.svg`        | 200×440  | Product bottle illustrations (7 files, one per product)     |

The hero panorama (`warli-hero.svg`) tells the full bio-enzyme making story left-to-right across x=0–1440:  
**Garden (x=0–280) → Preparation (280–430) → Kitchen / house (430–540) → Fermentation / 3 matkas + celestial time markers (540–740) → Straining (740–880) → Bottling & labelling (880–1060) → Delivery (1060–1200) → Clean home (1200–1440)**

### Bottle SVG anatomy

Each bottle in `public/svg/bottles/` follows the same structure:

1. `<defs>` — `linearGradient` (`fill<Name>`) for the liquid colour + optional `radialGradient` for glow
2. Cap element (varies by product type)
3. Bottle body path (same Q-bezier shape, reused across all 7)
4. Highlight `<line>` for glass shimmer
5. Label `<rect>` with: "Ojas Mithra" brand line, product name in EB Garamond, tagline in Inter small-caps
6. Warli ornament specific to the product (fish for dishwash, leaf for handwash, wave for laundry, tree for floor/veg, diya for kumkumadhi)

Each bottle has a **unique gradient colour** that signals its identity at a glance:

- Dishwash: citrus amber (`#f2d458` → `#a87c18`)
- Handwash: sage green (`#a4d8a8` → `#3c9050`)
- Toilet cleaner: ocean blue (`#72b8e0` → `#1a5488`)
- Floor cleaner: dark olive green (`#82c08a` → `#206030`)
- Vegetables & fruits: fresh mint (`#c0e8c8` → `#4a9878`)
- Laundry liquid: indigo blue (`#a0b8e8` → `#305898`)
- Kumkumadhi tailam: saffron vermillion (`#e8a870` → `#8a3810`)

## Design language

The site is styled as a **hand-typed letter from a kitchen** — editorial, slow, unhurried. Typography is primarily EB Garamond (serif). Inter is used only for small tracking-heavy labels. Caveat (handwriting) is used sparingly for signoffs. Script-level Devanagari (Hindi) and Telugu appear as cultural markers alongside English.

Tone markers: no bullet-point marketing language, no "premium" / "natural" / "eco" adjectives. Product descriptions are first-person observational prose. All kicker labels are `lowercase` with `letter-spacing: 0.28em+`.

## Adding a new product

1. Add its slug to `ProductSlug` in `src/data/types.ts` and an entry to `PRODUCTS` in `src/data/products.ts` (copy, ingredients, how-to, keeps, tint, accent).
2. Add `public/images/bottles/<slug>.webp` (transparent, 301×1100) — or an SVG in `public/svg/bottles/` following the bottle anatomy above, with `kind: 'illustration'`.
3. Add its poster to `public/images/gallery/<slug>.webp` and its size to `POSTER_SIZES` in `src/data/gallery.ts`.
4. That's all: the product page, shelf, footer, sitemap, carousel (if `family: 'bio-enzyme'`) and redirects pick it up.
