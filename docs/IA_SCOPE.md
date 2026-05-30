# Zorro Website — Information Architecture & Scope (v1)

> Scope: subscription sales, **gated-download** model (account + active sub →
> download the EXE). No HWID/heartbeat/loader handshake in v1. See cross-repo
> `ghoster/docs/ROADMAP.md` (Phases) and `ghoster/docs/COMMERCIALIZATION_SPEC.md`
> (rationale).

## Design direction
- **Dark, sleek, techy.** Dark base, a single bright accent, modern gaming-tool feel.
- **shadcn/ui** on Tailwind v4 (CSS-variable theming). Init when UI work starts:
  `npx shadcn@latest init`. Default to a dark theme; expose theme tokens so the
  accent is easy to tune in-browser.
- Typography: clean sans (Geist is already wired by create-next-app). Tight,
  confident marketing copy; no fluff.
- Iterate visuals in the browser — no pixel-perfect mockups pre-code.

---

## Sitemap

### Public / marketing
| Route | Purpose | Key content |
|-------|---------|-------------|
| `/` (Landing) | Convert visitor → signup | Hero (what Zorro is + value), feature highlights, "how it works", FAQ, pricing teaser, CTA to signup. |
| `/pricing` | Plan selection | Plan cards (monthly / quarterly / lifetime — TBD §5), feature comparison, FAQ on billing/refunds, CTA → signup/checkout. |
| `/terms` | Legal | Terms of Service (needed for paid product). |
| `/privacy` | Legal | Privacy Policy (what data: email, HWID hash later, telemetry opt-in). |
| `/docs` | Documentation hub | How to install, configure, and use the program — ins & outs, features, troubleshooting, FAQ. |
| `/docs/[...slug]` | Doc pages | Individual guide pages (getting started, installation, features, troubleshooting, etc.). |

### Documentation section (`/docs`)
- **Public** (not gated): aids conversion + SEO. Account/license-specific steps
  stay in `/dashboard`, not public docs.
- **Content as MDX in-repo** under `content/docs/` (version-controlled, static,
  fast). A sidebar nav (sections → pages) + in-page table of contents.
- Initial structure (fill content over time):
  - Getting Started (what Zorro is, requirements)
  - Installation (download, run the EXE, first launch)
  - Usage / Features (the ins & outs, per-feature explanations)
  - Configuration / settings
  - Troubleshooting + FAQ
  - Changelog (later; can also feed the portal "what's new")
- Use shadcn typography + a code-block component for snippets/screenshots.

### Auth
| Route | Purpose |
|-------|---------|
| `/login` | Email+password login. Link to signup + reset. |
| `/signup` | Create account (email+password). |
| `/forgot-password` | Request reset email. |
| `/reset-password` | Set new password (from email link). |
| `/auth/confirm` (callback) | Email confirmation / token exchange route handler. |

### Authenticated (the product)
| Route | Purpose | Gating |
|-------|---------|--------|
| `/dashboard` | Home after login: subscription status + **download button**. | Must be logged in. Download enabled only if sub `active` AND `current_period_end` not passed. |
| `/account` | Billing & profile: current plan, renewal date, manage/cancel, change password. (HWID-reset slot reserved for Phase 5.) | Logged in. |

---

## Core user flows
1. **Acquire:** Landing → Pricing → Signup → (email confirm) → Checkout (Phase 3) → Dashboard.
2. **Return + download:** Login → Dashboard → (sub active) → click Download → signed URL → EXE.
3. **Expired sub:** Login → Dashboard → download disabled, prompt to renew → `/account` / billing.
4. **Account mgmt:** `/account` → cancel / change plan / reset password.

## Gating logic (single source of truth)
- "Entitled" = there exists a `subscriptions` row for the user with
  `status = 'active'` AND `current_period_end > now()` (small grace window TBD).
- Download is a **server route** that re-checks entitlement server-side, mints a
  short-lived Supabase Storage signed URL, and logs a `download_events` row.
  Never trust client state for the gate.

## Out of scope for v1 (deferred)
- HWID binding, heartbeat, per-session payload key, in-memory loader decrypt (Phase 5).
- `licenses` / `hwids` / `sessions` tables (named-for-later in schema).
- Crash telemetry UI (spec §7 step 2 — backend may land earlier).
- Changelog/"what's new" page, downloads history (nice-to-have).
- Admin panel (manual sub toggles done via SQL/Supabase dashboard pre-Phase-3).

## Open questions
- Plan tiers + prices (monthly/quarterly/lifetime?) — drives `/pricing` + checkout.
- Payment processor = Stripe for now (see memory; keep swappable). Checkout UX
  (hosted vs embedded) decided in Phase 3.
- Do we require email confirmation before download access? (Recommend yes.)
