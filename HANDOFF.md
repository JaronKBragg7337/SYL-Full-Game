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

## 2026-07-08 — Claude (Fable 5, Cowork) — Visual overhaul: the end of the box era + F8 Tuner

**State:** working. `npm test` 139/139 (124 + 15 new render-layer tests). Every
system that made SYL "look like Roblox" was rebuilt; gameplay math untouched.

**Shipped:**
- **`src/render/` (new layer, 3 files):** `textures.js` (runtime-painted canvas
  textures: ground mottle, building walls w/ lit windows, hazard-ring landing
  pads, roads, metal plates, fabric, solar — the World of ClaudeCraft
  technique, zero image files); `props.js` (procedural builders: displaced-rock
  boulders, leafy + pine trees, ice spires, crystals, vents, quonset huts,
  gabled buildings, block towers, storage tanks, lattice masts, comms dishes,
  banners, canopies, containers, solar arrays — plus `sampleFootprint()`
  grounding + `surfaceMat()` material dedupe); `lighting.js` (warm sun + hemi
  sky bounce + PCFSoft shadows following the camera + altitude-reactive FogExp2
  and sky color per body; ACES/sRGB now ON for the mobile lane — it never was).
- **planet.js:** terrain vertex colors now slope-aware (exposed rock on steep
  faces), beach bands above sea level, per-vertex jitter, ground detail texture
  multiplied over the colors; water is Phong w/ specular; all landing-zone
  structures rebuilt from props (footprints still match their colliders — the
  comment block in buildZoneStructures says so loudly).
- **worldDetails.js (rewritten):** settlements/nature now come from pure
  deterministic layout functions shared by BOTH visuals and NEW collider specs
  (`zone._extraColliders`, merged in planet.js `allCollidersForZone`) — you can
  no longer walk through settlement buildings or big trees. GROUNDING: every
  object samples terrain under its whole footprint, bases on the lowest corner,
  buildings fill slope gaps with foundation plinths, rocks/trees sink + tilt to
  the terrain normal. Nothing floats.
- **ship.js:** visible additive engine flames scaling with burn; ship casts
  shadows. **spaceProps.js:** asteroids are displaced icosahedra (flat-shaded),
  debris are shards, no more floating cubes. **player/transports** cast shadows.
- **`src/dev/tuner.js` (new) — Jaron's no-AI-usage editor (F8):** live sliders
  for exposure / sun / sky fill / haze / ship thrust / turn, persisted in
  localStorage, applied through the shared `TUNE` object consumed by
  lighting.js + ship.js. "Copy JSON" exports the tuned values so ONE cheap
  agent message ("make these canon") replaces twenty feel-tuning round-trips.

**Verified:** `npm test` 139/139 on a fresh clone; `node --check` on every
touched file; deployed to the `games/syl-test` staging route and live-verified
before promoting to `games/syl` (see heartbeat-observatory HANDOFF).

**Next up:** Jaron feel-test on phone + desktop: shadows perf on his phone
(Settings O → graphics low turns them off), the new outpost look, F8 tuner.
Then ROADMAP: ship interior walk-around or better terrain LOD.

**Gotchas:**
- Structure visuals and colliders are matched BY HAND in two places
  (buildZoneStructures ↔ structureCollidersForZone; settlement layout ↔
  detailCollidersForLayout). Move a building → move its collider.
- render/textures.js returns null without a DOM; never call .repeat on a
  texture you didn't null-check (see planet.js terrainMap pattern).
- Graphics 'low' disables shadows at BOOT (lighting.js reads settings once).
- The desktop lane (src/desktop/*) was NOT touched this session.

---

## 2026-07-05 — Kimi (Moonshot AI) — Settings, space props, transport fleet, ship interiors, back buttons

**State:** working in `SYL-Full-Game` and synced to Heartbeat `games/syl/`. Live
and verified. Back buttons also added to Fable Survival and President-Sim.

**Shipped:**
- **Settings screen** (`src/ui/settings.js`): localStorage-persisted settings
  with mouse sensitivity, touch sensitivity, graphics toggle, and sound toggle.
  Bound to `O` key. Settings panel rendered in `src/ui/ui.js`. Sensitivity values
  clamped [0.1, 3.0] with `toFixed(2)` storage. Wired into `player.js` mouse look
  and `main.js` touch attitude controls.
- **Space props** (`src/world/spaceProps.js`): 40-60 decorative objects
  (asteroids, clusters, debris, satellites) in a 500k–2M unit radius field around
  the sun. `tick(dt)` rotates objects slowly. Visual-only by design (no
  collision) — documented in code comments.
- **Transport fleet** (`src/world/civilTransport.js`): 3 staggered transports
  on the same 7-stop route (starts at stops 0, 2, 4 with 0s/10s/20s phase offsets).
  Added `collide()` with oriented-box hull pushback. `nudgeIfOverlappingPlayer()`
  prevents spawn-ins. Added `toggleDoor()` with ramp animation and
  `interiorCameraPose()` for interior view.
- **Ship interiors** (`src/ship/ship.js`): interior bounds, `doorOpen` state,
  `toggleDoor()`, window meshes. `src/world/traversal.js` adds `MODE.INSIDE_SHIP`
  and `PHASE.INSIDE`. MVP interior view toggle (`V` key while piloting or
  passenger) — not full ship-local physics but gives "look around inside, look out
  windows" feel. `src/main.js` wires interior view keys.
- **Multiplayer transport sync** (`src/multiplayer/multiplayer.js`): broadcasts
  transport fleet state (`worldPos`, `quaternion`, `routeIndex`, `state`,
  `passenger`, `doorOpen`) so remote players see all transports.
- **No invisible walls**: verified `planet.js` has no hardcoded boundaries; only
  terrain and visible structure footprints provide collision.
- **Back buttons**: `← Games` link to `/games/` added to SYL `index.html` and
  `desktop.html`, Fable Survival `index.html`, and President-Sim `index.html`.

**Files touched:** `src/ui/settings.js` (new), `src/world/spaceProps.js` (new),
`src/world/civilTransport.js`, `src/ship/ship.js`, `src/main.js`,
`src/multiplayer/multiplayer.js`, `src/player/player.js`, `src/ui/ui.js`,
`src/world/traversal.js`, `index.html`, `desktop.html`, `test/run_tests.mjs`.

**Verified:** `npm test` 124/124 (105 original + 19 new). All new files passed
`node --check`. Live URLs verified: `settings.js`, `spaceProps.js`,
`civilTransport.js` all return 200 with correct content at
`https://www.heartbeatobservatory.com/games/syl/`.

**Next up:** Jaron phone-tests: settings panel (`O`), interior view (`V`), door
toggle (`T`), transport boarding, and space prop visibility. If feel is good,
next useful chunk is ship interior walk-around with full WASD movement inside
(traversal.js has `MODE.INSIDE_SHIP` architecture ready).

**Gotchas:**
- Interior view is a camera toggle (MVP), not full ship-local physics. The
  architecture exists in `traversal.js` for future full walk-around.
- Space props are visual-only; do not add collision to them without also adding
  spatial indexing (40-60 objects at 500k+ units is fine for visuals, not for
  collision queries).
- Transport fleet uses the same route for all 3 ships; staggered starts prevent
  clumping. If adding more, keep `phaseOffset` distinct.
- Sensitivity settings affect mouse look and touch attitude but not desktop Q/R
  roll or arrow-key pitch — those keep existing responsiveness by design.

---

## 2026-07-05 — Codex — Planet settlement and biome detail layer

**State:** working in `SYL-Full-Game`; sync to Heartbeat `games/syl/` is the
next step after the canonical game commit.

**Shipped:** added `src/world/worldDetails.js` and wired it into
`src/world/planet.js` plus `src/desktop/desktopPlanet.js`. The public/mobile
build now adds deterministic visual-only towns, small city clusters, roads,
terminal canopies, trees/forests, rocks, ice spires, volcanic vents, desert
windbreaks, and harbor pylons around landing zones on landable bodies. The
desktop route gets a lighter accent version because desktop already carries
PBR terrain, GLBs, shadows, and bloom. `src/ui/ui.js` now reports surface detail
counts in the body map for known worlds.

**Verified:** `node --check` passed for edited runtime modules. `npm test`
passes 105/105, including new checks that every landable world builds a detail
layer with settlement buildings, roads, and exploration dressing. Local static
server on `http://127.0.0.1:8377/` returned 200 for `/`, `/desktop.html`, and
`/src/world/worldDetails.js`. Chrome visual QA on the public route rendered the
canvas, opened `M`, showed `surface: 36 buildings, 104 wild details`, preserved
the CIVIL TRANSPORT LINE, and logged zero warnings/errors. Screenshots confirmed
trees/settlement dressing near the Earth base. Desktop browser automation
timed out while probing `/desktop.html`; static HTTP returned 200, but a normal
desktop visual pass remains needed before claiming the desktop route fully
verified for this slice.

**Next up:** commit/push SYL, sync the new files into Heartbeat
`games/syl/`, verify live public route, then inspect Heartbeat engine realtime
patterns for shared build/vehicle persistence in SYL and Fable.

**Gotchas:** `worldDetails.js` is visual-only by design. Do not put loot,
collision, save payload, or authoritative multiplayer state in it. New solid
objects still need analytic colliders in `planet.js`; new persistent/player-
owned objects belong in a realtime/persistence system, not this detail layer.

---

## 2026-07-05 — Codex — Civil transport line and transit bases

**State:** working locally; ready for commit and live-site sync after final diff
review. Public/mobile `index.html` and desktop `desktop.html` both wire the
same civil transport system.

**Shipped:** added `src/world/civilTransport.js`, a seven-stop public passenger
line, and a visible Fortis-style civil carrier. Players can board at a transit
terminal, ride the carrier as it moves continuously between real planetary
landing zones, and disembark after docking. Added transit-base landing zones on
Earth, Moon, Aethelgard, Pyrrhus, Veldora, Dunewind, and Rustholm, plus
`structures: 'transit'` visuals/colliders in `src/world/planet.js`. The map
panel now lists the civil route and current/next stop. Save/autosave is guarded
while riding so a player does not reload stranded in space as an on-foot body.

**Verified:** baseline before changes was `npm test` 95/95. After changes,
`npm test` passes 102/102, including new civil transport stop/ride/disembark
tests. Syntax checks passed for edited runtime/test modules. Local browser
smoke on `http://127.0.0.1:8377/` and `/desktop.html`: `window.game` boots,
`civilTransport` exists, route count is 7, first stop is Earth, next stop is
Moon, forced boarding sets passenger mode, prompt shows the Moon destination,
passenger stays attached to the carrier, and the carrier moves away from the
terminal. Real `M` key map panel shows the CIVIL TRANSPORT LINE with Earth
active and Moon next. Screenshots reviewed for public and desktop lanes.

**Next up:** commit/push SYL, sync `index.html`, `desktop.html`, `lib/`, `src/`,
and `assets/` into Heartbeat `games/syl/`, then verify live public and desktop
routes. After that, the next useful SYL chunk is landing aids or route UX polish
(timetable countdown, terminal signage, fare/standing hooks).

**Gotchas:** The civil carrier is not a teleport, but it is still a scripted
client-local service. It does not yet charge fares, obey a server timetable, or
carry multiple networked players authoritatively. See DECISIONS.md #19.

---

## 2026-07-05 — Codex — Desktop fidelity route added beside mobile build

**State:** working. The phone-safe `index.html` route still boots
`src/main.js`; the new desktop route is `desktop.html` and boots
`src/desktopMain.js`.

**Shipped:** added a separate desktop browser build that reuses floating
origin, traversal, custom integrators, registries, UI, inventory, ship builder,
factions, and pickups. Desktop-only additions: cloned/scaled body registry with
12 bodies, richer terrain profiles, `syl_desktop_save`, PBR procedural terrain
textures, high-detail mesh-true planet grids, atmosphere shader shells, ring
visuals, HDR-style lighting, shadows, bloom post-processing, GLB-imported
Fortis gunship/building/prop assets, `.glb` static serving, and deployment docs
that include `desktop.html` + `assets/`.

**Verified:** baseline before changes was `npm test` 91/91. After changes,
`npm test` passes 95/95. Syntax checks pass for edited runtime modules. Static
server smoke on port 8381 returned 200 for `desktop.html`, `src/desktopMain.js`,
GLB assets, and vendored loader modules. Headless Chrome/CDP booted
`/desktop.html`: `window.game === true`, boot message removed, 12 desktop
bodies loaded, surface star opacity 0.06; only `favicon.ico` 404 was logged.

**Next up:** feel/visual pass on a real GPU in a normal desktop browser,
especially terrain/pad scale, atmosphere readability, and GLB art direction.
This pass deliberately did not tune gameplay handling.

**Gotchas:** The desktop route uses cloned body data; do not mutate base
`BODIES` for desktop presentation. Desktop saves are intentionally separate
from public/mobile saves. Post-processing depends on vendored Three example
modules under `lib/examples/jsm/`; if adding another pass, vendor its full
dependency chain.

---

## 2026-07-05 — Codex — True-space ship attitude no longer snaps to planets

**State:** working in tests. Jaron reached space/Aethelgard and found the ship
would flip back toward Earth or get blocked when pitching around in space.

**Shipped:** `src/ship/ship.js` now splits assisted ship flight into two modes.
Low altitude still uses planet-upright assisted landing with
`ASSIST_MAX_PITCH`/`ASSIST_MAX_ROLL`. True space keeps the current ship
quaternion and applies pitch/yaw/roll around ship-local axes, so changing the
dominant gravity body can no longer re-level or snap the craft toward that
planet. Space attitude rates are separate from low-altitude bank rates.

**Verified:** `npm test` passes with 91/91 checks, including regressions for
no dominant-body snap, pitching past the old nose wall, and true-space thrust
following the pitched nose.

**Next up:** phone-test the feel near Earth-to-Aethelgard transitions. If true
space still feels too fast, tune `ASSIST_SPACE_ATTITUDE_RATE` and
`ASSIST_SPACE_ROLL_RATE`; do not bring back dominant-body up-vector rebuilds
in true space.

**Gotchas:** The root bug was not the camera. Assisted flight rebuilt the ship
orientation from `dominantBody(...).up` every tick. Near another planet/moon,
that made the ship snap to the new body's up vector and hit the old pitch clamp.
Future agents must keep true-space attitude independent from dominant body
leveling; only landing/low-alt flight should be planet-upright.

---

## 2026-07-05 — Codex — Mobile right-stick bank/pitch tuned down

**State:** working in tests. Jaron confirmed the dual-stick layout, then said
right-stick bank left/right was too fast and diagonal thumb drift could trigger
bank plus nose pitch together.

**Shipped:** tuned `joystickShipAttitude()` in `src/ui/touch.js`: bank is capped
with `ATT_BANK_SCALE`, pitch with `ATT_PITCH_SCALE`, small movement is curved by
`ATT_CURVE`, dominant horizontal/vertical intent locks out the weaker axis, and
intentional diagonals are softened by `ATT_DIAGONAL_SOFTEN`. Added explicit
`touchShipBank` reset state in `Input`.

**Verified:** `npm test` passes with 89/89 checks, including capped attitude
speed and softened diagonal thumb drift.

**Next up:** phone-test the exact feel. If bank is still too fast, lower
`ATT_BANK_SCALE`; if pitch is too fast, lower `ATT_PITCH_SCALE`; if diagonal
drift still feels finicky, raise `ATT_AXIS_LOCK` or lower
`ATT_DIAGONAL_SOFTEN`.

**Gotchas:** These constants deliberately live in mobile touch mapping so PC
Q/R and arrow-key controls keep their existing responsiveness.

---

## 2026-07-04 — Codex — Mobile ship controls use dual sticks

**State:** working in tests. Jaron said the flight controls felt right, but
mobile became thumb-heavy because the right thumb had to manage BANK and NOSE
buttons.

**Shipped:** replaced mobile BANK/NOSE buttons with a right-side ATTITUDE
joystick. Left stick remains fly/throttle/strafe/lift. Right stick X feeds
`touchShipBank`; right stick Y feeds `touchShipPitch`. PC key mapping is
unchanged.

**Verified:** `npm test` passes with 88/88 checks, including a right attitude
stick mapping regression.

**Next up:** phone-test ergonomics. If the right stick feels too close to the
browser safe area, tune `#att-base` in `src/ui/touch.js`; do not put BANK/NOSE
back as four separate flight buttons unless Jaron asks.

**Gotchas:** Right attitude stick must be excluded from touch-look handling.
It is a ship-control surface, not a camera-look surface.

---

## 2026-07-04 — Codex — High-flight nose pitch and module stat accounting

**State:** working in tests. Jaron confirmed the bank/locked-chase behavior
felt perfect, then identified the next missing flight axis: in space/high
flight the ship could not pitch nose-up/nose-down to aim at the ground or flip.

**Shipped:** added keyboard ↑/↓ and mobile NOSE UP / NOSE DOWN controls. Assisted
flight now stores `assistPitch` once safely airborne, applies maneuvering
thruster `torqueBoost`, and uses the ship's real 3D nose for high-flight thrust.
The chase camera follows the real 3D nose while keeping a stable up vector.
Expanded modules now contribute live stats: torque, shields, scanner range,
heat dissipation, weapons, cargo, armor, power, thrust, and fuel.

**Verified:** `npm test` passes with 87/87 checks, including new regressions for
expanded module stats, visible NOSE pitch, and thrust following a pitched nose.

**Next up:** phone-test high-flight pitch. If the buttons feel backwards, flip
the `keyPitch` subtraction in `src/main.js`; if the pitch engages too early/late,
tune the `alt > 60` free-attitude threshold in `src/ship/ship.js`.

**Gotchas:** Weapons/scanner/shields are accounted as stats but do not yet have
live action buttons such as FIRE, SCAN, or SHIELD. Add those as real gameplay
systems later, not dummy buttons.

---

## 2026-07-04 — Codex — Ship visual rotation fixed and chase camera locked

**State:** working. Jaron confirmed the real breakthrough: the ship now visibly
rotates like a craft instead of acting fixed. Follow-up issue is camera
readability while banking, so chase view is now locked behind/above the ship
nose.

**Shipped:** fixed the renderer/visual mismatch by letting
`trackWorldObject()` entries carry an optional authoritative quaternion and by
registering `ship.group` with `quaternion: ship.quaternion`. Removed BANK/Q/R
camera-follow behavior and changed chase camera to a locked forward rig using
ship nose + planet up; it does not inherit ship roll. Updated README/help text,
CHANGELOG, AGENTS, and this handoff.

**Verified:** run `npm test` and browser-visible checks before ending. The key
check must inspect `game.ship.group.quaternion`, not only `game.ship.quaternion`.

**Next up:** Jaron should phone-test the locked chase view. If it is too close
or too high/low, tune only the chase offset constants in `updateCamera()`.

**Gotchas:** The bug that wasted time was visual sync, not flight math:
physics quaternion changed but the local ship group did not. Future agents must
verify rendered group rotation for vehicle work. BANK/buttons should not move
camera directly; chase follows ship nose as a rig.

---

## 2026-07-04 — Codex — Controls/camera/vehicles wiring guide added

**State:** Jaron wants to personally inspect and wire the control/camera/vehicle
behavior because several agent attempts still felt wrong.

**Shipped:** added `CONTROLS_CAMERA_VEHICLES_GUIDE.md`, linked from `README.md`
and `ROADMAP.md`. It maps the important files (`engine.js`, `touch.js`,
`main.js`, `ship.js`), explains the current control pipeline, and gives code
shapes for Jaron's target mapping: W/S thrust, A/D ship yaw, Space lift, Q/R
roll, arrows/mouse camera-only.

**Verified:** docs-only change; rebased on top of Claude/Fable root-cause
physics/camera/collision commit.

**Next up:** if Jaron wants the repo changed to that exact map, implement from
the guide in this order: `readShipControls()`, `updateCamera()`, then assisted
roll handling in `ship.tick()`.

**Gotchas:** Claude's root-cause fixes are now on `origin/main` and this guide
was rebased on top of them. Do not restore the old chase-camera steering hold
or early-return assisted flight path.

---

## 2026-07-04 — Claude (Fable 5, Cowork) — ROOT-CAUSE FIXES: ship physics, chase camera, mesh-true terrain collision, solid ship hull

**State:** working — `npm test` 79/79. Jaron does the live feel test (his request).

**What was actually wrong (why control patches kept failing):**
1. `ship.js` assisted flight **`return`ed before gravity and ground collision ever
   ran**. That single early-return caused: fly-through-terrain, "gravity feels
   off", ship never falling, and no landing during assisted flight. Every
   control patch on top of it was fighting this.
2. `main.js` chase camera **held its orientation while steering** (the July 4
   "steering lock"). Standard flying games do the OPPOSITE: the camera follows
   the ship, so steering visibly turns the world. With the lock, A/D turned the
   hull under a frozen camera — "the ship acts like it doesn't have a front."
3. **Collision and the rendered mesh were two different surfaces.** Collision
   sampled the exact fbm function; the mesh is a linear interpolation of it
   across ~150 m triangles. On rugged terrain they disagreed by many meters:
   players stood on air, sank under the grass, saw through the planet from
   inside ("the ball" = the water/atmo shells seen from under the terrain mesh),
   and crates floated. NOT a rendering bug — a two-surfaces bug.
4. The ship was a ghost to the on-foot player (no hull collision at all).

**Shipped:**
- `src/ship/ship.js` — assisted mode now only sets orientation + thrust accel;
  gravity, integration, structure collision, and ground collision run for EVERY
  mode, always. Idle damping split: tangential eases (~1.5 s), vertical falls
  under real gravity to a ~8 m/s terminal = safe hands-off auto-landing. Added
  ASSIST_GRIP: velocity swings to follow the nose, so turning turns your path.
  Yaw sign fixed so D / stick-right turns RIGHT under the fixed camera.
- `src/main.js` — chase camera follows ship orientation (slerp 10/s), look-drag
  is a temporary orbit offset that eases back. Steering hold REMOVED — never
  re-add it (comment in code). Player gets `shipRef` for hull collision.
- `src/world/planet.js` — MESH-TRUE COLLISION: `buildBodyVisual` stores each
  body's exact vertex-radius grid (`body._terrainGrid`); `terrainRadiusAt` now
  ray-intersects the SAME triangle the GPU draws (three.js SphereGeometry
  param + b–d diagonal split). Collision == picture to float precision. Raw
  analytic function still exported as `analyticTerrainRadiusAt` (build-time).
  Mesh detail bumped (96/64/48) — better looks AND smaller triangles.
- `src/player/player.js` — `_collideWithShip`: oriented-box hull blocker;
  player can't walk through the ship and CAN stand/walk on the roof.
- `test/run_tests.mjs` — 7 new regression tests (8b section): assisted gravity,
  assisted terrain clamp, collision==mesh at 500 vertices, continuity, player
  high-speed fall-through, ship-hull solidity. Two old tests updated — they
  asserted the no-gravity bug as correct behavior.

**Verified:** `npm test` 79/79; node --check all edited files; live md5 sync to
heartbeat-observatory /games/syl (see that repo's commit).

**Next up:** Jaron's phone/desktop feel test. Then: "cine"-style multiplayer is
NOT in this lane; next code steps per DEV_GOD_MODE_ROADMAP.md (walk-in ship
interior benefits from the new hull collider — the roof/deck standing logic is
the seed for interior floors).

**Gotchas:**
- CLAUDE.md law updated in spirit: `terrainRadiusAt()` is still the single
  ground truth, but it is now MESH-TRUE (grid interpolation). If you add
  terrain LOD, collision must sample whatever the player currently sees.
- Do NOT re-add a chase-camera steering hold, and do NOT put an early `return`
  in `Ship.tick` before the shared physics block.
- The two updated tests were not weakened — they encoded the bug.

---

## 2026-07-04 — Codex — Dev/God Mode roadmap captured

**State:** Jaron asked for the dev/god mode, prefabs, snap builder, walk-in
vehicles, and asset pipeline list to live in the repo with a clear done/not-done
breakdown.

**Shipped:** added `DEV_GOD_MODE_ROADMAP.md` with statuses for every item in
the list: done, partial, or not started. Linked it from `README.md` and
`ROADMAP.md`, and added this changelog/handoff note.

**Verified:** docs-only change; no runtime tests required.

**Next up:** start the first implementation slice from that file: DEV body/zone
teleport, code-built prefab catalog, placement cursor, and `placedObjects` save
payload.

**Gotchas:** current DEV tools are useful but not a placement system yet. The
new doc is the source of truth for this lane.

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
