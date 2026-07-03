# HANDOFF.md — Session Log

Newest entry goes at the TOP. Every agent session adds an entry before ending.
This is how sessions with no shared memory continue each other's work.

## Entry template (copy this)

```
## YYYY-MM-DD — <agent/session name> — <one-line summary>
**State:** working / broken / in-progress (details)
**Shipped:** what changed, files touched, deployed? (URL)
**Verified:** how you checked it (npm test, browser test, feel test)
**Next up:** the single most useful next step
**Gotchas:** anything surprising the next session must know
```

---

## 2026-07-03 — Claude (Fable 5, Cowork) — Foundation build: full playable spine of SYL

**State:** working. Game boots, full loop playable, `npm test` = 32/32 green.

**Shipped:** the entire repo (v0.1.0). Systems: floating-origin engine
(src/core/engine.js), analytic-terrain planets with 3 bodies
(src/world/bodies.js, planet.js), radial-gravity on-foot player
(src/player/player.js), modular 14-slot ship with damage/repair/readiness
(src/ship/*), seamless traversal state machine (src/world/traversal.js),
factions with Fortis canon + 6 placeholders (src/factions/factions.js),
items/inventory, versioned localStorage save (src/save/save.js), DOM HUD/panels
(src/ui/ui.js), zero-dep server (server.js), headless test suite
(test/run_tests.mjs), full doc set. Not deployed to a host yet (static-ready;
see PORTABILITY.md).

**Verified:**
- `npm test`: 32/32 — registries, terrain/collision agreement, inverse-square
  gravity, zone flatness, dominant-body switching, modular ship
  damaged→gathered→repaired→READY progression, wrong-slot rejection, and a
  FULL SIMULATED LOOP with the real integrator: Earth pad → continuous ascent
  → space → autopilot transit → soft Moon landing with fuel remaining (205 s
  game-time), plus save/load round-trips for every stated system.
- Syntax-checked every browser-only module with `node --check`.
- Manual browser pass (how to repeat): `node server.js` → localhost:8377 →
  gather crates (F) → builder (B): repair engine ×2 alloy, repair gear, install
  power cell + gear strut, load 4 hydrazine → READY → board (E) → W + Space to
  lift → climb until sky fades to stars → M for map → burn at Moon → X-brake
  under ~300 m → touch down < 8 m/s → zone-discovery toast + autosave → F9
  reload restores everything.

**Next up:** ROADMAP Milestone 1, top item — flight-feel tuning session with
Jaron (thrust/rotation/camera tunables live at the top of ship.js and in
readShipControls in main.js).

**Gotchas:**
- The three.js import works via import map in the browser and via a
  node_modules/three shim (auto-written by `npm test`) in Node. Don't npm-install
  three; the vendored lib/three.module.js is the single copy.
- F5/F9 are save/load and preventDefault'ed — don't rebind browser-critical keys
  without doing the same (engine.js Input).
- Boarding the ship at the home pad fires the home-zone discovery (harmless
  flavor + a checkpoint save). If a player has an old save and plays fresh
  without F9 first, that checkpoint overwrites it — acceptable now, fix with a
  save-slot UI later (ROADMAP M1/M6).
- Windows/Cowork file-sync note: one Write raced and truncated
  test/run_tests.mjs mid-session (fixed by appending). If a file looks cut off,
  check `wc -l` before assuming the last agent wrote broken code.
- Ship exit places you 5 m to the ship's +X side — if you ever add wide
  modules there, revisit exitShip in traversal.js.
- The starter ship deliberately CANNOT fly until repaired (engine at 20% is
  below the 40% degraded threshold). If "nothing happens on W," that's the
  design, not a bug — the HUD says NOT READY and the toast points to B.
