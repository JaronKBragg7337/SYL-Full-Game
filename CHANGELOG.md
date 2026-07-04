# CHANGELOG.md

## 0.2.5-test — 2026-07-04 — Kimi expansion local playtest branch (Builder: Codex)
- Created local branch `test/kimi-expansion-pack` for Jaron playtesting only;
  main/live heartbeat deployment were not touched.
- Added Kimi expansion registries for items, bodies, ship parts/slots, and
  crafting recipes, wired additively so existing IDs stay stable.
- Added deterministic test crates at new expansion landing zones without
  removing existing Fortis, Moon, or Rustholm pickups.
- Added inventory crafting UI under the existing `I` panel plus
  `Inventory.has()` compatibility for recipe checks.
- Expanded `npm test` from 41 to 55 checks covering expanded registry integrity,
  body discovery resource references, faction references, ship slot/part
  references, expanded install/remove/repair flow, and crafting.

## 0.2.4 — 2026-07-03 — Mobile panel close button + README discipline (Builder: Codex)
- Added a visible `Close` button to inventory, ship builder, and body-map panels
  so phone players are no longer trapped in a panel without an Esc key.
- Updated README controls/run notes: default local URL remains
  http://localhost:8377; alternate PORT values are only for local testing when
  8377 is already occupied.
- Updated AGENTS.md session protocol to require a README.md re-check before
  ending whenever controls, run URLs, gameplay loop, verification count, or
  system/file locations change.

## 0.2.3 — 2026-07-03 — Mobile layout and analog-stick fix (Builder: Codex)
- Fixed the remaining reversed horizontal movement by aligning A/D movement
  with the actual first-person camera right vector; the test now checks camera
  right directly.
- Improved mobile layout: HUD is smaller, help is hidden by default on narrow
  screens/touch, toasts sit below the HUD, map tables wrap to phone width, and
  dense ship-builder tables scroll within the panel.
- Touch controls now hide while panels are open and ship throttle/brake/gear
  buttons only appear while piloting, preventing the overlays shown in Jaron's
  phone screenshots.

## 0.2.2 — 2026-07-03 — Controls, collision, and testable salvage (Builder: Codex)
- Fixed backwards-feeling controls: first-person camera now looks along the
  same vector W moves, A/D use the correct right vector, mouse-up looks up, and
  ship mouse pitch/yaw use the same non-inverted convention.
- Added analytic structure collision footprints for zone structures so the
  player can no longer walk through bunkers, relay masts, depot sheds, or
  beacons; still no mesh physics or flat-world collision.
- Added a nearby Fortis Salvage Yard on Earth with depot structures and extra
  supplies, plus surplus outpost crates so Jaron can repair/fuel the starter
  ship even if he misses a few pickups.
- Moved pickup placement into `src/world/pickups.js`; crates remain persistent
  one-shot pickups for now, with respawning/resource nodes tracked in ROADMAP.
- Expanded `npm test` from 32 to 41 checks covering controls alignment,
  structure collision, pickup manifest validity, and near-base supply margin.

## 0.2.1 — 2026-07-03 — Documentation truncation repair (Builder: Codex)
- Repaired sync-truncated tails in README.md, AGENTS.md, HANDOFF.md,
  CHANGELOG.md, ROADMAP.md, PORTABILITY.md, and VISION.md.
- Preserved the v0.2.0 canon: browser build is the live blueprint/public
  playtest at heartbeatobservatory.com/games/syl; official serious game path
  is Unreal/Unity; mobile remains required; planetary traversal, modular
  ships, factions, persistence, and no fake teleport/loading-screen traversal
  remain non-negotiable.
- Inspected CLAUDE.md, ARCHITECTURE.md, and DECISIONS.md; their tails were
  already complete.

## 0.2.0 — 2026-07-03 — Live hosting + mobile + official-game vision (Builder: Claude, Fable 5)
- Deployed the game to heartbeatobservatory.com/games/syl (copy in the
  heartbeat-observatory repo, Vercel auto-deploy) with a card on the games hub.
- Mobile touch controls: virtual joystick (WASD + run), drag-to-look, action
  buttons (E/F/B/M, jump/thrust, throttle, brake, gear) routed through the
  shared Input as virtual keys — zero gameplay-system changes (src/ui/touch.js).
- Input: virtualKeys/setVirtual/lookActive added to engine.js Input.
- VISION.md: reference games declared (EVE planet-to-planet openworld, KSP
  building, DayZ/ARC Raiders/Battlefield PVP); official-game direction
  (Unreal/Unity) and hosted-not-local rule made canon.
- ROADMAP.md: north star added; PVP foundation items (M5), deploy automation
  (M6), and Milestone 7 (official Unreal lane) added; mobile input marked done.
- AGENTS.md non-negotiables: keep the live URL live, keep mobile playable,
  build toward the official game. PORTABILITY.md: deploy procedure.

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
