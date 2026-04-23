# Loti & Matina — Digital Wedding Invitation

A single-page wedding invitation, mobile-first, with a cinematic envelope intro that fades away to reveal the invitation details.

**Live preview:** `python3 -m http.server 4173` at the repo root, then open `http://localhost:4173/`.

## Structure

```
/
├── index.html                 # entry
├── style.css                  # all styles (Heritage-inspired section rhythm)
├── script.js                  # envelope intro + countdown + RSVP + calendar
├── Final.mp4                  # envelope opening video (720×1280, ~1.5s, 450 KB)
├── Final-poster.png           # poster frame for the video
├── main.png                   # hero photo (static fallback / poster)
├── main-intro.mp4             # hero animation (plays once, holds on last frame)
├── frame_top.png              # decorative flower frame (top-left)
├── frame_bottom.png           # decorative flower frame (bottom-right)
├── image.jpeg                 # venue photo (Hills Restaurant)
├── scripts/                   # fal.ai video generation (dev-time only)
│   ├── generate-videos.mjs
│   ├── generate-portrait-envelope.mjs
│   └── package.json
├── react-invite/              # alternate React/Vite implementation (work-in-progress)
└── docs/                      # planning notes
```

## How it works

1. **Envelope scene** — on load, `Final-poster.png` shows. User taps → `Final.mp4` plays (1.5s opening) → on `ended`, the whole scene fades away and the invitation overlay fades in.
2. **Invitation overlay** — 5 sections following the Heritage theme rhythm (overline → heading → ornament → content):
   - **Hero** — couple names, monogram, family greeting, hero video (`main-intro.mp4`)
   - **Countdown** — days / hours / min / sec until 2026-07-04 19:00
   - **Details** — date, time, venue; RSVP via WhatsApp; add to calendar (.ics download)
   - **Venue** — Hills Restaurant photo + embedded Google Map
   - **Footer** — blessing + `#LotiMatina2026`
3. **Family personalization** — visit with a URL hash (`/#gashi`, `/#hoxha`, etc.) to personalize the greeting.

## Family ID mapping

Defined in `script.js`:

```js
const FAMILIES = {
  'gashi':    'Gashi',
  'hoxha':    'Hoxha',
  'krasniqi': 'Krasniqi',
  'berisha':  'Berisha',
  'shala':    'Shala',
  'ramadani': 'Ramadani',
  'mustafa':  'Mustafa',
  'ahmeti':   'Ahmeti',
};
```

Share `https://your-site/#gashi` → the greeting reads "Familja Gashi". Missing IDs fall back to generic "Ju".

## Regenerating the videos (dev)

The MP4s were generated with [fal.ai](https://fal.ai) image-to-video models. To regenerate:

```bash
cd scripts
npm install
FAL_KEY="your-fal-key" node generate-videos.mjs         # hero + (loop)
FAL_KEY="your-fal-key" node generate-portrait-envelope.mjs  # envelope intro
```

Outputs are written to the project root. Existing MP4s are skipped unless deleted first.

## Deploying

The site is pure static HTML/CSS/JS + MP4s + PNGs (~19 MB). It runs on any static host:

- **GitHub Pages** — enable in repo settings → Pages → source = `main` branch / root
- **Netlify / Vercel / Cloudflare Pages** — connect the repo, no build step, publish directory = `/`

No build step. No server. No database.
