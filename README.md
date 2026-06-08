You're a senior product designer + front-end engineer. Your job is to take the existing Zorro marketing site and elevate it from "competent but clearly
AI-generated" to something that looks like it was crafted by a top-tier studio — the kind of site that wins awards on Awwwards/Godly. Do not throw away the current
design language; amplify it. Keep the brand bones (near-black background, orange #ff7a18 accent, grain texture, the ghost-client identity) and make every detail
intentional.

The brand & vibe: Zorro is a Minecraft "ghost client" — a stealthy external program that gives players an edge and leaves no trace. The logo is a black-and-white
ink/brushstroke masked-vigilante figure. The feeling we want: sleek, sharp, a little dangerous, hand-drawn ink energy — strike from the shadows. Orange is the
"blade" — used sparingly as the weapon/accent, never decoration.

What's wrong today (fix these specifically):

1. The site feels generically AI-built: even spacing, predictable card grids, safe type scale, no real point of view.
2. The logo currently looks pasted on — a raster PNG floating in a box with mix-blend-screen. Solve the "hero mark" problem properly: integrate the figure into the composition so it feels native to the page (e.g. as a large bleeding background element, a textured ink wash, a masked/clipped treatment, an SVG line-art version that can stroke-draw, or a particle/displacement treatment) — not a centered logo dropped in a column.
3. Motion is minimal. We want real scroll-driven experience: smooth inertia scrolling, scroll-triggered reveals, parallax depth, pinned/sticky sections, text that masks or draws in, the ink slash that "cuts" between sections. Tasteful and fast — not a gimmick reel.

Deliverables:

- A redesigned homepage (hero → features → modules → pricing → FAQ → CTA) that keeps the existing information architecture but reimagines the execution.
- A clear motion system: define the scroll/reveal/transition vocabulary and apply it consistently.
- Strong typographic hierarchy with real contrast (display-size headlines, confident negative space, an editorial rhythm — not uniform card soup).
- Keep accessibility: honor prefers-reduced-motion, keep contrast/readability, keep it fast (no janky 60fps-killing effects).

Hard technical constraints (read before coding):

- This is a modified Next.js 16 (App Router) + React 19 + Tailwind v4 + TypeScript codebase. The APIs differ from your training data — read
  node*modules/next/dist/docs/ for the relevant guide before writing any Next.js code. In Tailwind v4, bg-gradient-to-* is bg-linear-to-\_.
- Brand tokens already exist in src/app/globals.css (--color-brand, the .bg-grain noise overlay, font-heading). Reuse them.
- You may add a motion library (Framer Motion, GSAP + ScrollTrigger, and/or Lenis for smooth scroll) — pick deliberately and justify it. Prefer GPU-friendly
  transforms.
- Work on the new-ui branch. Prototype on /lab first (don't touch the live homepage until a direction is approved). Build incrementally and show the hero before
  doing the whole page.
- Produce real, running, lint-clean code (npm run build must pass), not mockups.

Process: Before coding, briefly map the current components and state 2–3 distinct art directions for the hero (with how each solves the "pasted logo" problem).
Recommend one. Then build that hero on /lab, and only after sign-off extend the system to the full page.
