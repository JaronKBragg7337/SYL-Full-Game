# CHANGELOG.md

## 0.1.0 — 2026-07-03 — Foundation build (Builder: Claude, Fable 5)
- Floating-origin engine (f64 world coords, camera-relative rendering),
  vendored Three.js r160, zero-install static serving (server.js, START_GAME.cmd).
- Data-driven body registry: Earth (Fortis home, atmosphere, sea), Moon,
  Rustholm asteroid; per-body seeded terrain, colors, gravity, landing zones,
  faction ownership hooks, real-value design-intent fields.
- Analytic terrain (`terrainRadiusAt`) as single ground-truth for visuals AND
  collision; landing-zone flattening inside the function; zone structures
  (Fortis outpost, relay, beacons) authored from primitives on the sphere.
- On-foot radial-gravity player (tangent movement, jump, curvature-tracking
  orientation, first-person camera) — Kurearthis RadialGravityPawn logic.
- Modular ship: 14 slots / 8 part types with mass/thrust/fuel/power/cargo/armor
  stats, per-module HP with degradation, readiness rules, piece-by-piece visual
  rebuild; builder actions install/remove/repair/refuel; starter ship spawns
  damaged (engine dead, power cell + gear missing, tanks empty).
- Ship flight: 6-DOF custom integrator, N-body inverse-square gravity, throttle
  + vertical thrust + brake + roll, atmospheric drag, soft-landing vs
  crash-damage ground contact, landing-gear state.
- Traversal state machine: ON_FOOT ⇄ PILOTING; LANDED/TAKEOFF/ATMOSPHERE/
  SPACE/APPROACH/DESCENT derived from physical state; continuous atmosphere→
  starfield fade; enter/exit ship rules.
- Factions: Fortis (canon) + 6 marked placeholders; standings, meet events,
  economy/governance hook fields. Items/inventory; pickup crates around zones.
- Save/load v1 (localStorage): player, ship+modules, inventory, world
  discovery/flags, faction standings, mode; F5/F9 + autosave + discovery
  checkpoint saves.
- UI: HUD, prompts, toasts, center messages, inventory/ship-builder/body-map
  panels, help overlay.
- Tests: `npm test` — 32 headless checks including a full simulated
  Earth-pad → space → Moon-landing run using the real integrator.
- Docs: README, VISION, ARCHITECTURE, AGENTS, CLAUDE, HANDOFF, ROADMAP,
  PORTABILITY, DECISIONS, CHANGELOG.
