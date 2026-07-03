# CHANGELOG.md

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
- Ship f