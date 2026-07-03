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

## 2026-07-03 — Codex — Fix controls, structure collision, and nearby salvage

**State:** working locally. Gameplay changed; sync to live site before handing
off as shipped.

**Shipped:** fixed reversed-feeling on-foot and ship mouse controls
(player.js/main.js); added analytic structure footprint collision in planet.js
and wired it into player movement; added Fortis Salvage Yard as a nearby Earth
zone with depot structures; moved pickup placement into src/world/pickups.js and
added outpost/salvage-yard surplus crates for easier ship testing. Loot crates
are still persistent one-shot pickups; timed respawn/resource nodes are a future
ROADMAP M2 item.

**Verified:** `npm test` = 41/41 passed. `node --check` passed for every
`src/**/*.js` module. Port 8377 was occupied by an older local server, so this
checkout was served on http://localhost:8378/; Browser smoke rendered canvas +
HUD, opened the map, and confirmed Fortis Salvage Yard appears under Earth.
Mobile-size Browser smoke (390x844) rendered canvas + HUD + touch surfaces.
No new localhost:8378 warnings/errors were logged.

**Next up:** Jaron should feel-test desktop mouse/WASD and phone touch controls,
then do the ROADMAP M1 flight-feel tuning pass.

**Gotchas:** structure collision is intentionally analytic footprint collision,
not Three.js mesh collision. Keep new blockers registered in planet.js beside
the authored visual layout so browser and Unreal/Unity ports stay aligned.

---

## 2026-07-03 — Codex — Repair sync-truncated documentation tails

**State:** working. Documentation set is complete again; no gameplay changes.

**Shipped:** restored cut-off endings in README.md, AGENTS.md, HANDOFF.md,
CHANGELOG.md, ROADMAP.md, PORTABILITY.md, and VISION.md after the v0.2.0
sync/write race. Confirmed CLAUDE.md, ARCHITECTURE.md, and DECISIONS.md were
already complete. Preserved the canon that the browser build is the live
blueprint/public playtest at heartbeatobservatory.com/games/syl, the official
serious game path is Unreal/Unity, mobile must remain playable, and planetary
traversal/modular ships/factions/persistence/no fake teleport traversal are
non-negotiable.

**Verified:** `npm test` = 32/32 passed. Documentation metadata check confirmed
all ten inspected docs end with newlines and have headings. Local server at
http://localhost:8377 returned HTTP 200; Browser smoke rendered canvas + HUD and
`H` help toggle worked. Mobile-size Browser smoke (390×844) rendered canvas +
HUD + touch control surfaces. Live URL
https://heartbeatobservatory.com/games/syl/ returned HTTP 200 and Browser smoke
rendered canvas + HUD with no live-site app warnings/errors. One localhost
pointer-lock click produced Chromium's own `UnknownError` message; boot logs were
clean before interaction and no heartbeatobservatory.com logs were present.

**Next up:** Jaron's desktop flight + phone touch feel tests, then ROADMAP M1
flight-feel tuning. Do not start new gameplay until this docs repair commit is
pushed.

**Gotchas:** prior sync race truncated markdown mid-line while leaving the repo
otherwise runnable. When a doc ends mid-word or lacks its expected final
sections, compare against earlier commits before treating it as intentional.

---

## 2026-07-03 (later) — Claude (Fable 5, Cowork) — Live at heartbeatobservatory.com/games/syl + mobile + official-game vision

**State:** working. Live URL serving the game; `npm test` 32/32; touch controls in.

**Shipped:** v0.2.0 — see CHANGELOG. Key files: src/ui/touch.js (new), engine.js
Input (virtual keys), main.js (touch wiring), VISION/ROADMAP/AGENTS/PORTABILITY
(official-game north star: EVE openworld + KSP building + DayZ/ARC Raiders/
Battlefield PVP; hosted-not-local rule; deploy procedure). Deployed: copied
index.html+lib+src into heartbeat-observatory repo at games/syl/ + games-hub
card; Vercel auto-deployed.

**Verified:** `npm test` green; live URL fetched and browser-tested (boot, no
console errors); mobile viewport smoke via device emulation. Jaron's real-phone
feel test still pending — ask him.

**Next up:** Jaron's feel tests (desktop flight + phone touch), then ROADMAP M1
top item (flight-feel tuning). When touching input/UI, re-check touch controls.

**Gotchas:** deploys are a COPY into the website repo — shipping a change means
pushing BOTH repos (procedure in PORTABILITY.md; automation is a ROADMAP M6
item). localStorage saves are per-origin (site vs localhost = different saves).

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
  check line count and recent history before assuming the last agent wrote
  broken content.
- Ship exit places you 5 m to the ship's +X side — if you ever add wide
  modules there, revisit exitShip in traversal.js.
- Background browser tabs throttle requestAnimationFrame: if you inspect the
  game via remote tools while the tab is unfocused, the camera lerp/physics
  may look frozen or lagged. It is not a bug; focus the tab.
- The starter ship deliberately CANNOT fly until repaired (engine at 20% is
  below the 40% degraded threshold). If "nothing happens on W," that's the
  design, not a bug — the HUD says NOT READY and the toast points to B.
