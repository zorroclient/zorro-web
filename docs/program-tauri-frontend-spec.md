# Zorro Program — Tauri Frontend & Core API (Spec)

> Status: spec / not started. **Belongs in the `ghoster` monorepo** — drafted
> here only because the program repo isn't reachable from `zorro-web`; move it
> over. Author: 2026-06-02. Related: web memory `program-frontend-tauri`,
> `multi-os-builds-planned`.

## Goal

Replace the program's **ImGui** control panel with a **Tauri** shell (web UI +
Rust core), **cross-platform from day 1**, without a big-bang rewrite. The
in-game visuals (ESP/tracers/nametags) are **out of scope** — they stay as
low-level draw calls in the injected module.

## Locked decisions

- **Monorepo** — engine, protocol, and UI versioned together.
- **API-first** — define and build the core API _alongside the existing
  program_ before building the new UI.
- **Single distributable `.exe`** — Tauri embeds the web UI; the engine and the
  injectable module are embedded as resources.
- **Engine runs as a separate child process** (not linked in-process), for
  crash isolation. The protocol is **transport-agnostic** so FFI-in-process
  stays possible later.
- **Keep** the Supabase cloud API (auth/license/updates) and the existing
  auto-updater. Those are unrelated to this change.

## For whoever implements this (read first)

This is a **load-bearing refactor of an existing, non-trivial C++ program** —
not a greenfield app. Before writing code:

1. **Map the existing `ghoster` repo thoroughly.** Understand the build system,
   the mod/module registry (e.g. `src/dll/runtime/factories/mod_factory.cpp`),
   the injected-module runtime, how ImGui currently drives modules, any existing
   IPC, and the existing Supabase auth/license/update calls. Do not assume
   conventions — read them.
2. **Design the monorepo + protocol structure deliberately, and write it down,
   before building.** Decide and document where `engine/`, `protocol/`, and
   `app/` live; how the build wires them (single-`.exe` packaging, resource
   embedding, child-process spawn); and naming/ownership conventions. The
   structure is load-bearing — every later phase depends on it — so settle it
   and get sign-off **first**, don't grow it ad hoc.
3. **Keep the headless-core boundary clean.** Engine logic must not depend on
   the UI; the UI may only reach the engine through the protocol. No leakage
   either direction.
4. **Match the existing engine's code conventions**, and read the **Tauri v2**
    - `cxx`/sidecar docs before writing — this stack has its own idioms; don't
      guess.
5. **Treat the protocol as the contract first** (Phase 1), validated
   independently of the new UI.

### First deliverable: a project map
Before writing feature code, produce a durable **project map** committed to the
repo (e.g. `docs/PROJECT_MAP.md`) and keep it current:

- **File/directory tree** of the engine, one line of purpose per significant
  dir/file.
- **Architecture map** (mindmap or diagram): the subsystems and how they relate
  — injection path, hook layer, mod/module runtime + registry, config/state,
  the ImGui coupling points, and the Supabase auth/license/update calls.
- **Data/control flow:** launch → inject → enable/disable module → in-game
  render, and where state lives.
- **OS-portability annotation (the important part):** tag each piece as
  **Windows-only** (DLL injection, WinAPI/DX hooks, …) vs **portable** (mod
  logic, config, protocol). This map then doubles as the **blueprint for the
  macOS/Linux ports** — it makes the per-OS rewrite surface explicit up front
  instead of discovered mid-port.

Why first: it forces real understanding before code, grounds the structure
decisions in #2, and becomes the shared reference this refactor *and* the future
per-OS engines build against.

## Architecture

```
        ┌──────────────────────── single .exe ────────────────────────┐
        │  Tauri app                                                  │
        │   ├─ web UI (HTML/CSS/JS — reuse zorro-web's theme)         │
        │   └─ Rust core ──(local API: transport-agnostic)──┐         │
        │                                                   │         │
        │  embedded resources: [engine binary] [inject module]        │
        └───────────────────────────────────────────────────┼─────────┘
                                                            │ spawns
                                                  ┌─────────▼─────────┐
                                                  │ C++ engine (child │
                                                  │ process, per-OS)  │
                                                  └─────────┬─────────┘
                                                            │ injects
                                                  ┌─────────▼─────────┐
                                                  │ Minecraft process │
                                                  │ (injected module) │
                                                  └───────────────────┘
        Cloud (unchanged): engine/UI ⇄ Supabase (auth, license, updates)
```

## The core API (the heart of phase 1)

A small **command/event protocol** between the Rust core and the C++ engine.
Lives in the monorepo as a shared contract (one schema both sides build from).

- **Transport-agnostic envelope** (JSON to start): `{ protocol_version, id,
type, payload }`. Request/response for commands, fire-and-forget for events.
- **Transport now:** local IPC to the child process (stdio frames, named pipe,
  or loopback socket). Swappable for in-process FFI later without touching the
  message shapes.
- **Commands (UI → engine):** `get_state`, `list_modules`,
  `set_module_enabled {id, enabled}`, `set_setting {module, key, value}`,
  `attach`/`detach` (injection lifecycle), `status`.
- **Events (engine → UI):** `state_changed`, `module_status`,
  `connection_status`, `log`, `error`.
- **Versioned:** `protocol_version` gates compatibility; engine and UI ship
  together so skew is bounded, but the field future-proofs sidecar swaps.

This API is what lets ImGui-today and Tauri-tomorrow both be mere _clients_ of
the same headless core.

## Phased roadmap (API-first)

**Phase 1 — Headless core + API (no new UI).**

- Deliver the **project map** (see "read first") as the first artifact — the
  understanding it produces drives everything below.
- Extract a headless core from the current C++ (decouple engine logic from
  ImGui). Define the protocol above.
- Prove it without building the new UI: drive the core from a tiny CLI/test
  harness, _or_ re-point the existing ImGui panel at the new core so it becomes
  the first "client." Ship nothing user-facing yet.
- Exit criteria: every action ImGui can do today is expressible as an
  API command/event.

**Phase 2 — Tauri vertical slice.**

- Tauri app + Rust core that connects to the engine over the protocol.
- Minimal UI: read live state + toggle one module end-to-end. Engine bundled as
  an embedded resource, spawned as a child process.
- Exit criteria: one real module controlled from the Tauri UI on Windows.

**Phase 3 — Full UI + retire ImGui.**

- Build out the real UI (reuse zorro-web's Tailwind theme/components for a
  consistent look), reach feature parity, then remove ImGui from the control
  panel.

**Phase 4 — Cross-platform + packaging.**

- Per-OS engine builds behind the same API (injection differs per OS —
  Windows DLL vs macOS/Linux mechanisms; see `multi-os-builds-planned`). UI can
  show "engine not available on this OS yet" until each lands.
- Single-`.exe` packaging per platform; optional installer; wire the existing
  Supabase updater.

## Suggested repo layout

```
ghoster/
  engine/        # C++ — injection, hooks, mod runtime, injected module
  protocol/      # shared API contract (schema + generated bindings)
  app/
    src-tauri/   # Rust core
    ui/          # web frontend (reuses zorro-web design tokens)
```

## Out of scope / unchanged

In-game rendering (stays in the injected module); the Supabase cloud API and
auto-updater; the cheat internals themselves.

## Open decisions (not blockers)

- Protocol serialization: JSON to start; revisit if perf matters.
- Web stack for the UI (React to mirror zorro-web, or lighter — Svelte/Solid).
- Whether to ever collapse to in-process FFI (the transport-agnostic protocol
  keeps this open).
- AV/code-signing posture for the single `.exe` (dropping/injecting trips AV —
  same trade-off as today).

```

## Effort shape
Phase 1 is the real work (decoupling the core + protocol). Phases 2–3 are
standard app build. Phase 4 scales with how many OSes and is gated on per-OS
engine work, which is the heavy, separate lift.
```
