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

## 2026-07-04 — Codex — Assisted ship flight now uses nose-first thrust

**State:** Jaron clarified the remaining issue: the ship felt like it had no
front. Left/right changed the direction of travel but did not feel like the
glass/front of the hull was turning.

**Shipped:** changed assisted ship flight in `src/ship/ship.js` from direct
target-velocity steering to vehicle-style control: yaw rotates the ship body,
then throttle/reverse/lift applies acceleration through the ship's actual
front/up axes. Added a regression test proving yaw-only input turns the nose
without creating sideways travel.

**Verified:** `npm test` 72/72.

**Next up:** Jaron retests on desktop and phone. Expected feel: A/D or analog
left/right rotates the hull/front; W/stick up pushes through that front; no
throttle means turn-in-place rather than sliding in a new direction.

**Gotchas:** this keeps the arcade hover/damping for phone friendliness. It is
not yet full Newtonian 6DOF inertia.

---

## 2026-07-04 — Codex — Ship steering no longer drags chase camera

**State:** Jaron confirmed the joystick/button bubbling fix was not enough:
desktop WASD and mobile analog still visibly moved the camera while piloting.

**Shipped:** changed the chase camera anchor in `src/main.js`. While ship
steering/throttle/lift/brake input is active, the chase camera holds its current
base orientation instead of using every live ship yaw as camera orbit. Explicit
mouse/touch look still orbits the camera, and when steering/look stops the
camera recenters behind the ship.

**Verified:** run tests/smoke before public sync.

**Next up:** Jaron should retest: A/D and analog left/right should rotate the
ship under the view, not swing the camera around unless he drags outside the
analog or moves the mouse.

**Gotchas:** the camera still follows the ship position; moving/flying the ship
will move the camera through the world because it is a chase camera, but steering
should not independently orbit it anymore.

---

## 2026-07-04 — Codex — Touch joystick/camera event split hardened

**State:** after the Fortis visual port, Jaron's remaining feel issue is that
the analog stick can still seem to orbit the camera instead of only steering
the ship.

**Shipped:** added `input.touchJoystickActive` and stopped joystick/button touch
events from bubbling into the global touch-look listener. This follows the
Unreal pilot rule: vehicle-control input belongs to the ship, and look input
only comes from touches outside the control surfaces.

**Verified:** run tests/smoke before public sync.

**Next up:** if Jaron still feels camera drift on phone, add an on-screen
camera-lock indicator and log active touch ids in dev mode to catch a browser-
specific multitouch edge case.

**Gotchas:** this is event routing, not a physics rewrite. It keeps the
dev-fly-style assisted ship movement from `0.2.14`.

---

## 2026-07-04 — Codex — Code-built Fortis gunship visual

**State:** working on `main`. This is the first browser/mobile-safe port of
the Unreal Fortis walkable gunship source into SYL web.

**Shipped:** `src/ship/ship.js` now renders a code-built
`Fortis_Gunship_CodeBuilt` silhouette based on
`SpaceYouLand/_authoring/make_walkable_gunship.py`: physics deck, side shells,
roof, cockpit glass, rear ramp/pressure door, wings, engines, tanks, gear,
pilot seat, console, trim, and optional module markers. No FBX/GLB/Blender
payload was added, so the mobile page stays light. Module state remains
authoritative and damaged pieces darken.

**Verified:** run tests/smoke before public sync.

**Next up:** add actual boarding/interior interaction points: exterior hatch,
ramp open/close, pilot seat, and camera seat anchors.

**Gotchas:** visual only, not a full walkable interior collision mesh yet. The
ship collision remains analytic hull/structure footprint for mobile safety.

---

## 2026-07-04 — Codex — Assisted ship piloting default

**State:** working on `main` after Jaron reported both mobile and desktop ship
controls still felt wrong: A/D moved the camera/slide, S did little, while dev
fly mode felt correct.

**Shipped:** normal ship piloting now uses the dev-fly-style assisted movement
spine, not the old throttle/inertial steering by default. W/S or mobile stick
up/down drive forward/reverse, A/D or stick left/right turn ship heading,
Space/LIFT climbs, and Brake/Control slows. Mouse/touch look is camera orbit
only; it does not steer the ship. Camera recenters when look input stops.

**Verified:** run test/smoke before public sync.

**Next up:** Jaron retests both phone and desktop. Desktop: W forward, S reverse,
A/D turn ship, mouse only changes camera angle.

**Gotchas:** advanced 6DOF is now effectively parked behind the code path, not
the default player feel. Keep basic movement pleasant first.

---

## 2026-07-04 — Codex — Dev-fly feel for mobile ship

**State:** working on `main` after Jaron clarified dev fly mode feels correct:
the ship should use that direct free-roam feel, with the analog stick controlling
only the ship and camera look only from touches outside the stick circle.

**Shipped:** touch joystick ids are now excluded from the look map, even if the
finger drifts outside the circle. Mobile ship steering no longer consumes
touch-look `mouseDX/mouseDY`; outside-drag controls only a chase-camera orbit.
When no outside look touch is active, the chase camera recenters behind the
ship. Mobile ship assist is now dev-fly-like direct hover movement: stick
forward/reverse drives real ship velocity, LIFT climbs, BRAKE slows, and
release steadies instead of falling immediately. Desktop 6DOF remains unchanged.

**Verified:** run tests/smoke before public sync.

**Next up:** Jaron phone retest: use only the FLY circle and confirm the camera
stays locked behind; then drag outside the circle and confirm only camera angle
free-looks.

**Gotchas:** this deliberately prioritizes mobile feel over realism. Keep
advanced flight for a later explicit toggle.

---

## 2026-07-04 — Codex — Mobile ship heading assist

**State:** working on `main` after Jaron reported the calmer controls still
felt like the ship was moving on a fixed vertical line: left/right changed the
view but not the actual travel direction enough.

**Shipped:** added `controls.mobileAssist` and a touch-only flight path in
`src/ship/ship.js`. Mobile piloting now yaws the actual travel heading directly,
levels the hull to the current body's up vector, and applies main thrust along
that flat heading. LIFT remains vertical/radial. Desktop keeps the existing 6DOF
inertial controls.

**Verified:** run `npm test`, syntax checks, and public touch smoke before push.

**Next up:** Jaron should retest phone flight specifically: hold stick up to
build throttle, then move stick left/right and confirm the ship's path curves
instead of only the camera view changing.

**Gotchas:** this is intentionally "assisted mobile flight," not full 6DOF. The
goal is phone free-roam first; advanced aircraft/space controls can come later
behind a mode toggle.

---

## 2026-07-04 — Codex — Calmer mobile ship piloting

**State:** working on `main` after Jaron's real-phone screenshots showed the
first analog steering pass was still too aircraft-like and easy to crash.

**Shipped:** mobile piloting now treats the left stick as throttle + yaw
instead of pitch + yaw. The large bottom button relabels to LIFT, right-side
ship buttons are reduced to BRAKE + GEAR, touch-look sensitivity is lower while
piloting, and touch throttle-up applies vertical lift during takeoff so the ship
doesn't scrape into hard-impact damage loops. Docs/changelog updated.

**Verified:** run `npm test` and browser/touch smoke before public sync.

**Next up:** Jaron should retest on phone: board, hold stick upward, tap/hold
LIFT if needed, use left/right stick to turn. After feel is acceptable, bring a
lightweight code-built Fortis walkable gunship visual into the web game.

**Gotchas:** `SpaceYouLand/_authoring/make_walkable_gunship.py` is the richer
Unreal Fortis gunship. For the web route, port it as simplified Three.js
geometry first; avoid shipping raw FBX/Blender payload until mobile perf is
measured.

---

## 2026-07-04 — Codex — Touch analog ship steering

**State:** working on `main`. This is the direct follow-up to Jaron's report
that the mobile stick only felt like camera/look and the ship mostly flew
straight.

**Shipped:** checked the reference repos. `SpaceYouLand` had the useful lesson:
when seated, the body/camera and ship steering must be decoupled. Ported that
web-safe: `src/ui/touch.js` now maps the left stick to analog ship pitch/yaw in
`PILOTING` mode, `src/main.js` feeds those axes into the ship controls, and
`src/core/engine.js` tracks touch virtual-key sources so the stick cannot cancel
THR+/THR- or TURN buttons. Updated README/help/changelog.

**Verified:** `node --check` on edited JS and `npm test` 65/65.

**Next up:** Jaron should feel-test on an actual phone/tablet: board the ship,
press THR+, then steer with the left stick. After that, continue prefab
placement/blueprint persistence for buildings and future modular ship rooms.

**Gotchas:** Browser desktop mobile viewport still does not reliably expose real
touch APIs here, so the automated check is unit/headless plus code inspection.
Real touch feel still needs Jaron's device pass.

---

## 2026-07-04 — Codex — SYL dev editor first slice

**State:** working on `main`. Public SYL already carries Kimi expansion,
Realtime visibility, and the yaw/touch-turn fix.

**Shipped:** added `src/dev/devTools.js`, an opt-in `?dev=1` editor/god panel.
It exposes ready test ship, supply kit, fill fuel, move ship to player, player
to ship, save now, and fly-person mode. The first slice is phone-safe:
code-built state changes + DOM UI only, no heavy external 3D assets.

**Verified:** `npm test` 62/62 and `node --check` on `src/**/*.js` plus tests
before syncing to Heartbeat.

**Next up:** build prefab placement and blueprint persistence: code-built
building pieces, snap-compatible wall/window/door sockets, then ship room and
seat modules.

**Gotchas:** `?dev=1` persists the DEV button in localStorage for that browser.
This is a playtest convenience, not a security boundary. Future public/admin
tools should use Heartbeat auth/admin checks.

---

## 2026-07-04 — Codex — Promote SYL test branch to main

**State:** `main` now contains the tested Kimi expansion, Heartbeat Realtime
visibility MVP, and Claude's ship yaw/touch-turn fix. `test/kimi-expansion-pack`
remains as history but is no longer the only lane with those features.

**Shipped:** fast-forwarded `main` from `test/kimi-expansion-pack`; updated
README/CHANGELOG so promoted features are documented as public-main work instead
of test-only work.

**Verified:** run `npm test` before pushing/deploying this session.

**Next up:** sync the same promoted source into Heartbeat
`/games/syl/`, keep the stable save key, then push both repos.

**Gotchas:** `/games/syl-test/` should keep its path-scoped save key for future
preview work; `/games/syl/` should keep `syl_save` so public saves stay public.

---

## 2026-07-04 (later) — Claude (Opus, Cowork) — Ship turning fix on test lane

**State:** working on `test/kimi-expansion-pack`. `npm test` 57/57. Turning fix
is test-lane only; stable `/games/syl/` untouched; save format unchanged.

**Shipped:** flight-turn feel fix. Yaw was the weak axis (mouse-X only, low
authority, heavy damping) and on phone a look-drag could not HOLD a turn.
- ship.js: rotation now uses tunable PITCH_RATE/YAW_RATE/ROLL_RATE/ROT_DAMP
  consts (yaw 1.8->2.7, damping 3.0->2.2) — feel-tuning is now a one-line edit.
- main.js readShipControls: yaw = mouse-X + A/D keys; roll moved Q/A -> Q/E.
- touch.js: added on-screen "TURN left / TURN right" hold-buttons to the
  piloting cluster so phones can hold a sustained turn.
- README + in-game help updated to the new control scheme.
- test/run_tests.mjs: +2 tests (sustained yaw turns the ship; yaw settles on
  release). 55 -> 57.

**Verified:** `npm test` 57/57; `node --check` on all changed files; live
test-lane browser check after the Heartbeat sync deploy. Jaron phone feel-test
pending.

**Next up:** Jaron feel-tests turning on /games/syl-test/. If good: (a) mirror
this fix to `main` + promote the Kimi expansion, and (b) apply the same A/D-yaw
+ touch-turn pattern to Fable vehicle steering (cross-game parity).

**Gotchas:** A/D now YAW in the cockpit (they still strafe on foot — mode-scoped,
same as W/S). Roll is Q/E. The live test lane is a COPY inside the
heartbeat-observatory repo (games/syl-test/), so this fix only reaches phones
after that repo is synced and Vercel redeploys — pushing the game repo alone is
not enough.

## 2026-07-04 — Codex — Heartbeat realtime multiplayer MVP on SYL test lane

**State:** working on `test/kimi-expansion-pack`. Multiplayer source is local
to the test branch and copied into Heartbeat's unlisted `/games/syl-test/`
lane. Public stable `/games/syl/` is intentionally untouched.

**Shipped:** added `src/multiplayer/multiplayer.js`, a Heartbeat Supabase
Realtime adapter that follows the existing Observatory multiplayer law:
presence for identity only, movement as broadcast state at <=10Hz, idle
suppression, 250ms remote interpolation, and solo fallback if realtime fails.
Remote players render as suit avatars on foot and simple ship markers while
piloting. Added the compact realtime chip to the page CSS.

**Verified:** `npm test` = 55/55 after wiring. Browser/live verification is
handled from the Heartbeat repo after copying this test source into
`games/syl-test/`.

**Next up:** two-browser or two-phone playtest at
`https://www.heartbeatobservatory.com/games/syl-test/`: both players should see
the realtime chip, see each other at the Fortis spawn, and see the remote marker
switch to a ship once one boards/takes off.

**Gotchas:** this is peer-visible/client-broadcast multiplayer, not an
authoritative PVP server. It deliberately does not change save format,
floating-origin math, traversal, or ship physics. Keep full combat/persistence
authority for a later Milestone 5/official-engine pass.

---

## 2026-07-04 — Codex — Kimi expansion local playtest branch

**State:** working locally on `test/kimi-expansion-pack`. Not pushed to main,
not deployed, and heartbeat-observatory was not modified.

**Shipped:** added Kimi's expanded items, bodies, ship parts/slots, and recipes
as additive registries. Added deterministic test crates at the new landing
zones. Added `Inventory.has()` and a small crafting UI inside the existing
Inventory panel (`I`). README/CHANGELOG now identify this as a local test branch
and document the expanded files/test count.

**Verified:** baseline before changes was clean on `main` and `npm test` was
41/41. Stage 1 items+bodies passed 47/47 after fixing one supplied string
literal in `bodies_expanded.js`. Stage 2 pickups passed 47/47. Stage 3 expanded
ship parts/slots passed 51/51. Stage 4 crafting and inventory UI passed 55/55.

**Next up:** Jaron should play the local branch URL and test the body map,
Fortis repair/fuel loop, new ship-builder slots, inventory crafting, and
save/load before approving any merge or deployment.

**Gotchas:** non-Fortis factions in the added bodies are still the repo's
existing placeholder factions, not claimed canon. The Kimi branch is for local
testing only until Jaron approves it.

---

## 2026-07-03 — Codex — Mobile panel close button + README drift guard

**State:** working. Gameplay repo and live site are both updated.

**Shipped:** added a visible `Close` button to all panels so phone users can
close inventory/ship-builder/map without Esc or refresh. README now explains
that 8377 is the default local URL and alternate PORT values are only temporary
test ports when 8377 is busy. AGENTS.md now explicitly requires checking
README.md before ending and updating it when controls, run URLs, gameplay loop,
test counts, or file locations change.

**Verified:** `npm test` = 41/41 passed. `node --check` passed for every
`src/**/*.js` module. Phone-width Browser smoke at 390x844 opened the map,
confirmed the visible Close button, clicked it, and verified the panel display
returned to `none` while canvas/HUD stayed loaded. Confirmed inventory closes
the same way and all three panels (inventory, ship builder, map) have a Close
button. No localhost:8380 warnings/errors were logged. Static copy deployed via
heartbeat-observatory commit c735af3; live phone-width Browser smoke at
https://heartbeatobservatory.com/games/syl/ confirmed canvas render, three panel
Close buttons, map Close click hiding the panel, and no heartbeatobservatory.com
warnings/errors.

**Next up:** Jaron should retest phone panels: open M/B/I and close with the
new Close button without refreshing or losing unsaved inventory/ship-builder
work.

**Gotchas:** close buttons call the same `closePanels()` path as Esc/same-key;
keep future panel close behavior centralized there.

---

## 2026-07-03 — Codex — Mobile layout cleanup + analog horizontal fix

**State:** working. Gameplay repo and live site are both updated.

**Shipped:** fixed the remaining horizontal control reversal by restoring
player right-vector math to match the actual camera right vector. Mobile CSS now
keeps HUD/toasts/help/panels from overlapping: help hidden on small screens,
toasts below HUD, map wraps to phone width, ship builder scrolls inside its
panel, and touch controls hide while panels are open. Ship throttle buttons only
appear while piloting.

**Verified:** `npm test` = 41/41 passed. `node --check` passed for every
`src/**/*.js` module. Phone-width Browser smoke at 390x844 verified compact HUD,
toast below HUD, help hidden, map panel inside viewport, and no localhost
warnings/errors. Static copy deployed via heartbeat-observatory commit d9d7b6f;
live phone-width Browser smoke at https://heartbeatobservatory.com/games/syl/
confirmed canvas + HUD render, Fortis Salvage Yard appears in the map, panel
fits within 390px width, help is hidden, and no heartbeatobservatory.com
warnings/errors were logged.

**Next up:** Jaron should retest on phone: analog right/left, B ship builder,
M map, and normal walking/looting near the base.

**Gotchas:** Browser viewport does not emulate touch APIs here, so touch-root
visibility was validated by source/CSS plus phone-width layout screenshots; real
phone remains the final feel check.

---

## 2026-07-03 — Codex — Fix controls, structure collision, and nearby salvage

**State:** working. Gameplay repo and live site are both updated.

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
No new localhost:8378 warnings/errors were logged. Static copy deployed via
heartbeat-observatory commit 52f4273; live Browser smoke at
https://heartbeatobservatory.com/games/syl/ rendered canvas + HUD, showed
Fortis Salvage Yard on the map, and logged no heartbeatobservatory.com warnings
or errors.

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
