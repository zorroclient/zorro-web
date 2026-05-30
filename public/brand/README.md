# Brand assets — drop files here

Anything in `/public` is served at the site root. A file at
`public/brand/logo.svg` is reachable at `/brand/logo.svg` and usable as
`<Image src="/brand/logo.svg" .../>` or `<img src="/brand/logo.svg" />`.

## Where to put what

### General artwork / logos → `public/brand/`
Drop logos, marketing art, screenshots here, e.g.:
- `logo.svg` / `logo-mark.svg` (icon-only) / `logo-wordmark.svg`
- `hero.png`, `screenshot-*.png`, etc.

Prefer **SVG** for logos (crisp at any size) and **PNG/WebP** for raster art.
Tell me the filenames after you drop them and I'll wire them into the header,
landing hero, etc. (currently the header uses a placeholder orange square).

### Favicon & app icons → `src/app/` (Next.js file conventions)
Next.js auto-generates the right `<link>` tags from specially named files in
`src/app/`. Just drop the file with the exact name:

| File in `src/app/` | Purpose |
|--------------------|---------|
| `favicon.ico`      | Classic browser tab icon (already present — replace it). |
| `icon.png` (or `.svg`) | Modern favicon; 512×512 recommended. |
| `apple-icon.png`   | iOS home-screen icon, 180×180. |
| `opengraph-image.png` | Social share preview, 1200×630. |
| `twitter-image.png`   | Twitter/X share preview, 1200×630. |

No code needed for those — Next picks them up automatically by filename.
