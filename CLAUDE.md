# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Deployment

This is a **zero-build static site** — no bundler, no Node, no `npm install`. Every file is served directly.

```bash
# Preview locally (any static file server works)
npx serve .
# or
python3 -m http.server 8000

# Deploy to production
npx vercel --prod --yes
```

GitHub repo: `https://github.com/rohanpradyumna/ojas-mitra`  
Live URL: `https://ojas-mitra.vercel.app`

## Architecture

### File organisation

```
/                        → HTML pages (flat, no routing layer)
assets/css/site.css      → Single stylesheet; all CSS lives here
assets/svg/              → Warli illustrations + product bottles
assets/svg/bottles/      → One SVG per product (7 bottles)
assets/logo/             → PNG logo lockups + mark
assets/img/              → Photography placeholders (kavita.png)
uploads/                 → Raw product photos (WhatsApp JPEGs, not yet wired up)
```

### Pages

| File | Purpose |
|---|---|
| `index.html` | Homepage — hero, maker story, 4-product preview, testimonials, invitation |
| `shelf.html` | Full product catalogue (3-column grid, all 7 products) |
| `product-*.html` | Individual product pages (7 files, identical layout) |
| `our-way.html` | Brand philosophy / longform |
| `journal.html` | Journal index |
| `journal-*.html` | Individual journal entries (3 files) |

### CSS architecture

All styling is in **`assets/css/site.css`** with a single `<style>` block in `index.html` for page-specific overrides (hero layout, shelf section, shelf product tints). No other page has inline styles of substance.

**Design tokens** (defined as CSS custom properties on `:root`):
- Palette: `--cream`, `--cream-warm`, `--cream-deep`, `--terracotta`, `--terracotta-soft`, `--terracotta-deep`, `--clay`, `--clay-warm`, `--clay-soft`, `--sage`, `--olive`, `--indigo`, `--marigold`
- Rules: `--rule` (42% opacity terracotta), `--rule-soft` (20%), `--rule-faint` (10%)
- Type stacks: `--serif` (EB Garamond), `--sans` (Inter), `--deva` (Tiro Devanagari Hindi), `--telugu` (Tiro Telugu), `--hand` (Caveat)

**Key layout classes** in site.css:
- `.container` — max 1280px, 48px horizontal padding
- `.section` / `.section-tight` — vertical padding blocks
- `.section-head` — 1fr 2fr grid (label left, heading+lead right)
- `.maker` — 0.7fr 1.3fr grid (portrait frame left, text right)
- `.shelf-preview` — 4-column grid (home page product strip)
- `.shelf-grid` — 3-column grid (shelf.html catalogue)
- `.product-detail` — 1fr 1fr grid (bottle image left, text right)
- `.testimonials` — 3-column grid with left-border blockquotes
- `.also-on-shelf` — 3-column row of mini product links (bottom of product pages)

The paper grain texture is an inline SVG data-URI on `body::before` (feTurbulence noise). All page content sits at `z-index: 2` to render above it.

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

| File | ViewBox | Purpose |
|---|---|---|
| `warli-hero.svg` | 1440×200 | Homepage hero — 8-chapter bio-enzyme narrative panorama |
| `warli-divider.svg` | 600×80 | Section divider (used in shelf.html) |
| `warli-procession.svg` | 800×120 | Procession strip (used in shelf.html) |
| `warli-circle.svg` | 200×200 | Tarpa dance ring (not currently placed on any page) |
| `warli-chauk.svg` | 240×240 | Sacred square with Palaghata goddess (not currently placed) |
| `warli-tree.svg` | 80×80 | Standalone tree mark |
| `bottles/*.svg` | 200×440 | Product bottle illustrations (7 files, one per product) |

The hero panorama (`warli-hero.svg`) tells the full bio-enzyme making story left-to-right across x=0–1440:  
**Garden (x=0–280) → Preparation (280–430) → Kitchen / house (430–540) → Fermentation / 3 matkas + celestial time markers (540–740) → Straining (740–880) → Bottling & labelling (880–1060) → Delivery (1060–1200) → Clean home (1200–1440)**

### Bottle SVG anatomy

Each bottle in `assets/svg/bottles/` follows the same structure:
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

1. Create `assets/svg/bottles/<slug>.svg` following the bottle anatomy above — choose a unique gradient colour.
2. Add `product-<slug>.html` modelled on any existing product page.
3. Add a card to `shelf.html` inside `.shelf-grid`.
4. Optionally add a preview card to the home page's `.shelf-preview` (currently shows 4 of 7).
5. Update the `.also-on-shelf` row on adjacent product pages to include the new entry.
