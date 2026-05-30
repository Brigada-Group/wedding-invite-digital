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

The live site is PHP-served (the entry point is `public/index.php`, which renders with an `asset()` helper and reads family data from `public/families.json.php`), so it needs a PHP runtime — it is **not** a pure-static deploy.

**Host:** [Laravel Forge](https://forge.laravel.com) → server `Brigada` (`204.168.225.141`), PHP **8.3**, web root `public/`.
**URL:** `https://wedding-invite-digital-kxdp0kig.on-forge.com/` (behind Cloudflare).

### Deploy flow

Pushing to `main` triggers a Forge **atomic (zero-downtime) deployment** — each deploy builds a fresh release directory and flips the `current` symlink. The deploy script is:

```bash
$CREATE_RELEASE()

cd $FORGE_RELEASE_DIRECTORY

$ACTIVATE_RELEASE()

( flock -w 10 9 || exit 1
    echo 'Restarting FPM...'; sudo -S service $FORGE_PHP_FPM reload ) 9>/tmp/fpmlock
```

> [!IMPORTANT]
> The final **FPM reload line is required** and must not be removed. This server runs PHP with `opcache.validate_timestamps=0`, and atomic releases keep the `current` symlink path constant — so OPcache serves the *old* compiled `index.php` until PHP-FPM is reloaded. Without that line, a deploy updates static assets (`script.js`, `style.css`) but leaves `index.php` stale. Reloading FPM clears the cache so the new release is served.

### Local preview

Because the site is PHP, serve the `public/` directory with PHP (not `http.server`):

```bash
php -S localhost:4173 -t public
```

Then open `http://localhost:4173/`.
