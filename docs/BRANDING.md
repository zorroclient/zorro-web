# Zorro Website — Branding

Keep the website visually identical to the program. Do not drift off-palette.

## Colors
Brand = **neon orange**. Defined as theme tokens in `src/app/globals.css`
(`@theme inline`) and wired into shadcn's `--primary` / `--ring`.

| Token | Hex | Use |
|-------|-----|-----|
| `brand` (`--primary`, `--ring`) | `#FF7A18` | Primary actions, focus rings, accents |
| `brand-hover` | `#FF9A3D` | Hover state |
| `brand-active` | `#D95600` | Active/pressed |
| `brand-info` | `#BE4800` | Info button base |
| `brand-info-hover` | `#FF7A18` | Info button hover |
| `brand-info-active` | `#913500` | Info button active |
| `brand-add` | `#FF7012` | Add button base |
| `brand-add-hover` | `#FF9C30` | Add button hover |
| `brand-add-active` | `#CD4B00` | Add button active |

- Text selection: `#FF7A18` @ 30% (`::selection` in globals).
- `primary-foreground` is white (`oklch(0.985 0 0)`) — orange buttons use white text.
- `accent` is intentionally a neutral gray (subtle hover bg) — orange is reserved
  for true primary actions, not every hover.
- Theme defaults to **dark** (`next-themes`, `defaultTheme="dark"`).

## Fonts
- **Headings:** Space Grotesk (`--font-heading`, applied to `h1–h4`).
- **Body:** Inter (`--font-sans`).
- **Mono:** Geist Mono (`--font-mono`).
- Wired in `src/app/layout.tsx` via `next/font/google`.

## Logo / assets
- Brand artwork: `public/brand/` (served at `/brand/...`).
- `public/brand/logo.png` — 1024×1024, masked Zorro + "ZORRO" wordmark, white on
  **solid black (no alpha)**. Used as a rounded badge in the header.
  TODO: get a **transparent** version (SVG ideal) + a mark-only variant for use
  over non-dark surfaces.
- Favicon/app icons: `src/app/` file conventions (favicon.ico in place).
