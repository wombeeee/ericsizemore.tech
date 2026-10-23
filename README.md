# ericsizemore.tech

Personal site for Eric Sizemore — K12 ed tech and AI. Writing, resources, and a
running archive of speaking work. Live at **[ericsizemore.tech](https://ericsizemore.tech)**
(the former ericsizemore.social, which now redirects here).

A hand-built, single-page site with **no build step** — just HTML, CSS, and a
little vanilla JS — served from a small Cloudflare Worker. The console-wordmark
identity (`❯ eric sizemore`) implements the **Alpine** design system (seven bands, slate to sand) in a
light theme (default) and a dark theme.

## Stack

- **Static front end** — `index.html` plus standalone resource pages under `resources/`, sharing one stylesheet (`css/site.css`). Progressive-enhancement JS in `js/main.js`. No framework, no bundler.
- **Cloudflare Workers** — `worker.js` serves the static assets and adds one tiny API route (below).
- **JetBrains Mono + Space Grotesk** — self-hosted variable fonts in `css/fonts/` (OFL). Mono carries the wordmark and labels; Space Grotesk carries headings and body.

## Project structure

```
index.html         The home page
css/alpine.css     Alpine tokens, type classes, @font-face (generated; do not hand-edit)
css/alpine-components.css  Alpine button, eyebrow, card, well, bands
css/site.css       Site layout on Alpine roles (no raw brand values)
js/alpine-bands.js Draws the ridgeline motif (footer only)
resources/         Standalone field-kit pages (e.g. the Gemini prompt library),
                   each with its own shareable URL
js/main.js         Theme toggle, mobile nav, scroll-to-top, the Writing feed
worker.js          Cloudflare Worker: serves assets + the /api/posts feed proxy
wrangler.jsonc     Worker / deploy config
data/events.csv    Source of truth for the Work archive (in-person events)
assets/            favicon.svg (anthracite badge) + social-card.png (og:image)
                   + portrait-dark/light.jpg (illustrated sketch portrait)
.assetsignore      Keeps worker.js, wrangler.jsonc, and data/ out of the public assets
```

## The Writing feed

The **Writing** section is pulled live from my Substack rather than hand-edited.
`worker.js` exposes `GET /api/posts`, which fetches the Substack RSS feed,
parses the latest few items, and returns trimmed JSON (title, link, date,
snippet). It's edge-cached (~15 min) and fails gracefully — if the feed is
unreachable, the section falls back to a link to the Substack archive. The
front end renders it client-side in `js/main.js`.

## Local development

Requires Node. From the repo root:

```sh
npx wrangler dev
```

This runs the Worker locally (default `http://localhost:8787`) so the
`/api/posts` feed works. A plain static server (e.g. `npx serve .`) will render
the page but won't serve the feed endpoint.

## Deployment

Pushing to `main` auto-deploys via **Cloudflare Workers Builds**. To deploy
manually:

```sh
npx wrangler deploy
```

## Design system

The site implements **Alpine**, the design system built from the seven bands of
the Dbrand Alpine skin. `css/alpine.css` is generated from Alpine's
`tokens.json` and is the only source of color, type, spacing, and radius;
`css/site.css` only arranges those roles.

- **Themes** — light is the default. `data-theme="dark"` forces dark; with no attribute the OS preference decides. The nav switch sets the attribute and persists it to `localStorage`.
- **One accent** — links, primary buttons, active states, and the wordmark chevron use `--accent`; hover uses `--accent-press`; text on an accent fill is `--on-accent`.
- **Bands, not gradients** — the seven `--alpine-*` colors are for the ridgeline motif only, never text, and nothing sits on them.
- **Flat and bordered** — surfaces separate with a 1px `--line`; only menus and overlays cast `--shadow-overlay`.
- **Wordmark** — lowercase `eric sizemore` in JetBrains Mono, chevron in accent.
- **Fixed marks** — the favicon and social card use the dark theme's wordmark colors and do not theme-swap.

---

Built with [Claude Code](https://claude.com/claude-code).
