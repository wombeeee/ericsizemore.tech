# ericsizemore.tech

Personal site for Eric Sizemore — K12 ed tech and AI. Writing, resources, and a
running archive of speaking work. Live at **[ericsizemore.tech](https://ericsizemore.tech)**
(the former ericsizemore.social, which now redirects here).

A hand-built, single-page site with **no build step** — just HTML, CSS, and a
little vanilla JS — served from a small Cloudflare Worker. The console-wordmark
identity (`❯ eric sizemore`) implements the **ES Design System** ("Sooners alt":
crimson / anthracite / cream) in both a dark and a light theme.

## Stack

- **Static front end** — `index.html` plus standalone resource pages under `resources/`, sharing one stylesheet (`css/site.css`). Progressive-enhancement JS in `js/main.js`. No framework, no bundler.
- **Cloudflare Workers** — `worker.js` serves the static assets and adds one tiny API route (below).
- **JetBrains Mono + Space Grotesk** — loaded from Google Fonts. Mono carries the wordmark, labels, and console idiom; Space Grotesk carries headings and body.

## Project structure

```
index.html         The home page
css/site.css       Shared stylesheet — design tokens + all site styles
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

The site implements the **ES Design System** (palette "Sooners alt"). The
identity is a **console wordmark** — the name typed as a terminal command with
a blinking caret in the hero. No separate icon glyph: the chevron `❯` *is* the
icon, and unicode glyphs (`❯ ❮ ✕ ✓ ● ◐`) stand in for an icon set. No emoji,
no gradients, no shadows on flat surfaces, no entrance animations.

- **Three constants** — crimson `#A3151C`, anthracite `#1C1E21`, cream `#F3ECD6`. The accent is crimson in both themes.
- **Dual theme** — dark (anthracite, default) and light (cream). Defaults to the visitor's OS preference; the nav switch overrides it and persists to `localStorage`. Theme is set pre-paint to avoid a flash.
- **Contrast rule** — `--logo-mark` (chevron, `//`, console glyphs) is crimson on dark and drops to deep crimson `#841617` on cream. Text on a crimson fill is always cream (`--on-accent`).
- **Type** — JetBrains Mono (wordmark, labels, console idiom) + Space Grotesk (headings, body). Surfaces are flat: `--surface-2` fill, 1px hairline border, 14px radius.
- **Imagery** — the illustrated sketch portrait is the only image treatment; never a photograph.
- **Icon marks are fixed** — the favicon and social card are always the anthracite badge with the crimson chevron; they do **not** theme-swap.

The social card (`assets/social-card.png`, 1200×630) is rendered from a small
standalone HTML file in the fixed anthracite palette — regenerate it if the
wordmark or tagline changes. The full system (tokens, components, guidelines,
UI kits) lives in the ES Design System handoff outside this repo.

---

Built with [Claude Code](https://claude.com/claude-code).
