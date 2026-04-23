# Digital Wedding Invitation — Loti Gashi

## Concept
Single-page, client-side-only digital wedding invitation with an envelope opening animation. Modern & minimal aesthetic.

## Flow
1. **Landing** — Sealed envelope centered on screen, "Tap to open" prompt
2. **Animation** — Envelope flap lifts, card slides up and expands to fill viewport
3. **Invitation card** — Family name greeting, wedding details, Google Maps embed

## Details
- **Couple**: Loti Gashi
- **Date**: July 4, 2026 — 7:00 PM
- **Venue**: Hills Restaurant, Ferizaj, Kosovo
- **Google Maps**: Embedded map of venue

## Tech
- Pure HTML + CSS + vanilla JS — no frameworks
- CSS animations for envelope
- Hash-based family IDs: `#abc123` → `{ abc123: "Gashi" }` in JS map
- Fallback: "You are invited" if no hash match

## Style
- **Palette**: Off-white (#FAFAF8), charcoal (#2C2C2C), muted gold (#C9A96E)
- **Typography**: Playfair Display (headings) + Inter (body)
- **Envelope**: CSS-only with paper texture via gradients

## Files
```
wedding-invite-digital/
├── index.html
├── style.css
└── script.js
```
