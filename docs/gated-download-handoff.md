# Gated Download — WIP Handoff (scratch)

> Temp handoff doc. Where we left off on the Option 2 (private bucket + signed
> URL) gated download. Delete once the decision below is made and acted on.
> Last updated: 2026-06-02.

## Done (zorro-web — committed/working, breaks nothing)

- **`download_events`** table + RLS (owner-read via `auth.uid()=user_id`;
  client insert/update/delete denied; writes server-side via service role).
  Advisors clean.
- **`src/lib/download-actions.ts` → `startDownload()`**: verify session +
  active `subscriptions` → read latest active `app_releases` (service-role
  admin client) → `createSignedUrl` from `releases` bucket (60s TTL,
  `download:true`) → insert `download_events` (best-effort) → redirect to signed
  URL. Falls back to deriving the object path from `windows_url` if
  `windows_path` is null.
- **`src/app/account/download/page.tsx`**: shows version + size, real
  "Download for Windows" button posting to `startDownload`. Placeholder gone.
- **`src/lib/supabase/admin.ts`**: `Database` type extended with `app_releases`
  + `download_events`.
- DB: added `app_releases.windows_path` (object path) and **backfilled** from
  `windows_url`. Active release = `0.1.0-beta.25`,
  path `windows/0.1.0-beta.25/zorro-0.1.0-beta.25.exe` (verified to exist in
  `storage.objects`).
- **ghoster `.github/workflows/release.yml`**: now also emits `storage_path`
  and writes `windows_path` in the `app_releases` upsert (kept `windows_url`
  for back-compat).
- Build passes. Works against the still-public bucket (createSignedUrl works on
  public buckets too), so safe to ship/test now.

## Discovered (program side — already built)

- Program logs in via Supabase Auth (`/auth/v1/token` password+refresh → JWT),
  computes a device fingerprint hash.
- Update service already calls deployed Edge Functions `update_manifest` +
  `update_download_url` with the bearer token.
- Program treats the returned download URL as **opaque** (already handles
  temporary signed GitHub asset URLs) → returning a Supabase signed URL needs
  **no C++ change / no rebuild**.
- Edge Functions deployed + ACTIVE: `attest`, `redeem_key`, `reauth_device`,
  `update_manifest`, `update_download_url`. (Program's stale "update_manifest
  not deployed (404)" log predates deployment.)

## ⚠️ Remaining before bucket can go private (task 6)

1. **`update_download_url` doesn't sign Supabase URLs yet** — returns
   `windows_url` as-is for Storage-hosted releases (only signs GitHub-private
   assets). Needs a small edit to `createSignedUrl` from `windows_path` when the
   release lives in Storage. Editable via MCP `deploy_edge_function`. It's a
   **production change to the live beta backend** → needs explicit go-ahead.
   Caveat: any in-field tester on an OLD build that hits the public URL directly
   would break → hence "coordinated".

2. **Entitlement divergence (the real subscription-migration work):**
   `update_download_url` gates on `license_activations` + `license_keys` (BETA
   key model). zorro-web gates on `subscriptions`. Two entitlement systems.
   Pick one source of truth (the "no redeemable keys" decision) and repoint the
   Edge Functions at it before subscriptions fully replace keys.

## Decision pending (pick one, then resume)

- **(i)** Edit + deploy `update_download_url` to sign Supabase URLs now →
  private-bucket-ready on the download path.
- **(ii)** Tackle entitlement unification first (subscriptions vs license_keys
  as the program's source of truth) — affects what the Edge Function checks.
- **(iii)** Stop; web download loop is functional against the public bucket;
  do the private-bucket cutover later.

## Task list state

1. ✅ download_events table + RLS
2. ✅ getDownloadUrl/startDownload server action
3. ✅ wire /account/download
4. ✅ release.yml writes windows_path
5. ✅ investigate program/Edge Function side (findings above)
6. ⬜ flip releases bucket to private — BLOCKED on decision (i)/(ii) above

## Key facts

- Supabase project ref: `grgudmkolztqwvkwqivq`. Bucket `releases` (currently
  **public**). zorro-web branch: `stripe-billing` (web changes NOT yet committed).
- Cross-repo source of truth: `ghoster/docs/ROADMAP.md` (Decision log +
  "Gated download" section updated 2026-06-02).
- ghoster repo (other device, mounted here): `/mnt/c/Users/sande/CLionProjects/ghoster`.
