# Loti & Matina — Digital Wedding Invitation

A single-page wedding invitation, mobile-first, with a cinematic envelope intro that fades away to reveal the invitation details.

**Live preview:** `php -S localhost:4173 -t public`, then open `http://localhost:4173/`. The site is PHP (entry point `public/index.php`), so a static server like `python3 -m http.server` won't render it.

## Structure

```
/
├── public/                     # web root (PHP-served; document root on Forge)
│   ├── index.php               # entry — renders the page; asset() cache-busts static URLs by mtime
│   ├── style.css               # all styles (Heritage-inspired section rhythm)
│   ├── script.js               # envelope intro + countdown + RSVP + calendar + personalization
│   ├── families.json.php       # read-only JSON endpoint for family data (live file → seed fallback)
│   ├── edit/                   # password-protected admin to manage family entries
│   │   ├── index.php           #   login + edit UI
│   │   ├── _bootstrap.php       #   resolves config + families.json path (survives atomic deploys)
│   │   ├── config.example.php   #   template; real config lives in storage/ on the server
│   │   └── families.seed.json   #   committed fallback list of families
│   ├── Final.mp4               # envelope opening video (720×1280, ~1.5s)
│   ├── Final-poster.webp       # poster frame for the envelope video
│   ├── main.webp               # hero photo (static fallback / poster)
│   ├── main-intro.mp4          # hero animation (plays once, holds on last frame)
│   ├── frame_top.webp          # decorative flower frame (top-left)
│   ├── frame_bottom.webp       # decorative flower frame (bottom-right)
│   └── image.jpeg              # venue photo (The Hills)
├── scripts/                    # fal.ai video generation (dev-time only)
│   ├── generate-videos.mjs
│   ├── generate-portrait-envelope.mjs
│   └── package.json
├── react-invite/               # alternate React/Vite implementation (prototype)
└── docs/                       # planning notes
```

## How it works

1. **Envelope scene** — on load, `Final-poster.webp` shows. User taps → `Final.mp4` plays (1.5s opening) → on `ended`, the whole scene fades away and the invitation overlay fades in.
2. **Invitation overlay** — 5 sections following the Heritage theme rhythm (overline → heading → ornament → content):
   - **Hero** — couple names, monogram, family greeting, hero video (`main-intro.mp4`)
   - **Countdown** — days / hours / min / sec until 2026-07-04 19:00
   - **Details** — date, time, venue; RSVP via WhatsApp; add to calendar (.ics download)
   - **Venue** — The Hills photo + embedded Google Map
   - **Footer** — blessing + `#LotiMatina2026`
3. **Family personalization** — visit with a URL hash (e.g. `/#dritan-berisha`) to greet that family by name. Unknown or missing hashes fall back to a generic greeting.

## Family personalization

The family list is **data-driven**, not hardcoded:

- `script.js` fetches it on load from `/families.json.php` (with a small inline fallback if the request fails).
- `families.json.php` serves the live list from `storage/families.json` on the server, falling back to the committed `public/edit/families.seed.json` so the page never blanks out.
- Manage the list through the password-protected admin at **`/edit/`**.

Each entry maps a hash slug → a display name and member list. Share `https://your-site/#<slug>` and the greeting personalizes for that family.

**Admin config.** On Forge, the password and storage location live in `storage/config.local.php` (outside the repo, so they survive atomic deploys). Locally, copy `public/edit/config.example.php` → `public/edit/config.local.php`. The default password is `change-me` — change it.

## Regenerating the videos (dev)

The MP4s were generated with [fal.ai](https://fal.ai) image-to-video models. To regenerate:

```bash
cd scripts
npm install
FAL_KEY="your-fal-key" node generate-videos.mjs         # hero + (loop)
FAL_KEY="your-fal-key" node generate-portrait-envelope.mjs  # envelope intro
```

Outputs are written to the repo root (e.g. `main-intro.mp4`, `envelope-intro.mp4`). The production-ready, re-encoded versions then live in `public/` (e.g. `Final.mp4`). Existing MP4s are skipped unless deleted first.

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
