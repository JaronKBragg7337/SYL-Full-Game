# CHANGELOG.md

## 0.3.0 — 2026-07-08 — Visual overhaul: end of the box era (Builder: Claude, Fable 5)
- New src/render/ layer: runtime-painted canvas textures, procedural prop
  library (rocks/trees/spires/crystals/huts/towers/tanks/masts/dishes),
  lighting system (warm sun, hemisphere sky bounce, PCFSoft shadows,
  altitude-reactive fog + sky color, ACES/sRGB on the mobile lane).
- Terrain: slope-aware rock coloring, beach bands, per-vertex jitter, ground
  detail texture; Phong water with specular glints.
- Grounding system: footprint sampling + foundation plinths + terrain-normal
  alignment — nothing floats on slopes anymore.
- Settlement buildings and large nature props now have REAL collision derived
  from the same deterministic layout as their visuals.
- Zone structures rebuilt: textured hazard-ring landing pads with edge lights,
  quonset huts, gabled sheds, domed tanks, lattice masts, comms dishes,
  faction banners, containers.
- Ship: visible engine flames; ship/player/transports cast shadows.
- Space props: displaced-icosahedron asteroids + shard debris (were cubes).
- NEW F8 Tuner panel (src/dev/tuner.js): live sliders (exposure/sun/sky/haze/
  thrust/turn), localStorage persistence, Copy-JSON export → tune without AI.
- Tests: 139/139 (15 new: textures Node-safety, prop builders, displacement
  determinism, grounding, layout determinism, detail collision, lighting).

## 2026-07-05 — Settings screen, space props, transport fleet, ship interiors, back buttons (Builder: Kimi)
- Added `src/ui/settings.js` with localStorage-persisted settings: mouse
  sensitivity, touch sensitivity, graphics toggle, sound toggle. Bound to `O` key.
  Sensitivity clamped [0.1, 3.0] and wired into `player.js` mouse look and
  `main.js` touch attitude controls.
- Added `src/world/spaceProps.js` with 40-60 decorative space objects
  (asteroids, clusters, debris, satellites) in a 500k–2M unit radius field.
  Rotates slowly. Visual-only by design (no collision).
- Extended `src/world/civilTransport.js` to support a 3-transport fleet with
  staggered starts (stops 0, 2, 4; 0s/10s/20s phase offsets). Added `collide()`
  with oriented-box hull pushback, `nudgeIfOverlappingPlayer()` to prevent
  spawn-ins, `toggleDoor()` with ramp animation, and `interiorCameraPose()` for
  interior view.
- Added ship interior features to `src/ship/ship.js`: interior bounds,
  `doorOpen` state, `toggleDoor()`, and window meshes. Added `MODE.INSIDE_SHIP`
  and `PHASE.INSIDE` to `src/world/traversal.js`. Interior view toggle (`V` key)
  while piloting or passenger — MVP camera toggle, not full ship-local physics.
- Extended `src/multiplayer/multiplayer.js` to broadcast transport fleet state
  (`worldPos`, `quaternion`, `routeIndex`, `state`, `passenger`, `doorOpen`) so
  remote players see all transports.
- Verified no invisible walls in `planet.js` — only terrain and visible
  structure footprints provide collision.
- Added back buttons (`← Games` → `/games/`) to SYL `index.html` and
  `desktop.html`, Fable Survival `index.html`, and President-Sim `index.html`.
- Added regression tests: settings persistence, space prop creation, transport
  fleet collision, interior mode toggle, door state, back button presence. `npm
  test` is now 124/124.

## 2026-07-05 — Planet settlement and biome detail layer (Builder: Codex)
- Added `src/world/worldDetails.js`, a deterministic visual-only dressing layer
  that builds towns, city blocks, roads, terminal canopies, trees/forests,
  rocks, ice spires, volcanic vents, desert windbreaks, and harbor pylons around
  landing zones across the SYL bodies.
- Wired the detail layer into both the public/mobile planet builder and the
  desktop fidelity builder without changing terrain collision, saves, loot, or
  traversal. The body map now reports visible surface-detail counts for known
  worlds.
- Added regression coverage that every landable world receives settlement,
  road, and exploration dressing. `npm test` is now 105/105.

## 2026-07-05 — Civil transport line + transit bases (Builder: Codex)
- Added a rideable automated civil transport ship (`src/world/civilTransport.js`)
  that moves continuously between planetary bases. Players can board at a
  terminal, ride as passengers, and disembark after docking instead of piloting
  their own damaged ship.
- Added seven transit stops with visible/collidable transit-base structures:
  Earth, Moon, Aethelgard, Pyrrhus, Veldora, Dunewind, and Rustholm.
- The body map now lists the civil transport line and marks the current/next
  stop. Public and desktop routes both wire the system in.
- Added headless civil-transport route/passenger tests. `npm test` is now
  102/102.

## 2026-07-05 — Separate desktop fidelity build (Builder: Codex)
- Added `desktop.html` and `src/desktopMain.js` as a separate desktop browser
  route. The existing `index.html` / `src/main.js` mobile-safe build is left in
  place and now has tests proving the two entries coexist.
- Added cloned/scaled desktop body data with 12 total bodies, richer terrain
  profiles, desktop-only worlds, and a separate `syl_desktop_save` localStorage
  slot so phone/public saves are not mixed with the scaled desktop world.
- Added desktop PBR terrain textures, higher-detail mesh-true planet grids,
  atmosphere shader shells, rings, HDR-style lighting, shadows, bloom
  post-processing, and GLB-imported ship/building/prop assets.
- Added static `.glb` serving, vendored Three example loader/post-processing
  modules, and desktop deployment docs. `npm test` is now 95/95.

## 2026-07-05 — True-space ship attitude no longer snaps to planets (Builder: Codex)
- Fixed the space-flight snap/flip bug reported near Aethelgard: assisted
  true-space flight now rotates around the ship's own local axes instead of
  rebuilding the ship quaternion from whichever planet/moon currently has
  dominant gravity.
- Removed the old high-flight nose wall in true space. Pitch can now continue
  past the previous clamp so the ship can aim back toward a planet or flip
  through a full attitude change, while low-altitude landing flight still keeps
  its planet-upright safety clamps.
- Added regression checks for no dominant-body snap, passing the old pitch
  wall, and thrust following the pitched ship nose in true space.

## 2026-07-05 — Mobile attitude stick speed tuning (Builder: Codex)
- Reduced right ATTITUDE stick bank/pitch output so mobile bank left/right no
  longer spins the ship too quickly, especially with maneuvering-thruster torque
  installed.
- Added curved response and axis intent filtering: mostly-horizontal movement
  banks only, mostly-vertical movement pitches only, and diagonals are softened
  so thumb drift does not accidentally command both axes at full strength.
- Added regression checks for capped attitude speed and diagonal filtering.

## 2026-07-04 — Mobile dual-stick ship attitude (Builder: Codex)
- Replaced separate mobile BANK and NOSE buttons with a right-side ATTITUDE
  joystick. Horizontal stick motion bank-turns the ship; vertical motion pitches
  the nose in high flight.
- Kept desktop controls unchanged: Q/R bank-turn, ↑/↓ pitch.
- Added a regression check for the right attitude stick mapping.

## 2026-07-04 — High-flight nose pitch + module stat accounting (Builder: Codex)
- Added NOSE UP / NOSE DOWN mobile buttons and ↑/↓ keyboard pitch so the ship
  can aim up/down once safely airborne instead of staying planet-upright forever.
- Chase camera now follows the ship's real 3D nose while preserving a stable
  up vector, so pitch/flip attempts remain readable.
- Maneuvering thrusters now contribute torque boost; shield, scanner, weapon,
  radiator, and expanded module stats are computed and shown in the ship
  builder. Weapons/scanner/shields still need future gameplay verbs.
- Added regression tests for expanded module stats, assisted pitch, and thrust
  following a pitched nose.

## 2026-07-04 — Ship visual rotation + locked chase camera (Builder: Codex)
- Fixed the actual visible-ship rotation bug: the ship physics quaternion was
  changing, but the floating-origin renderer only copied position. The ship
  visual now registers its authoritative quaternion and the renderer copies it
  each frame.
- Removed BANK/Q/R camera-follow behavior. BANK now rotates the visible ship
  while the chase camera stays locked behind/above the ship nose.
- Added a regression check so future agents verify the ship visual is wired to
  authoritative rotation instead of trusting physics-only state.

## 0.2.20 — 2026-07-04 — Controls/camera/vehicles wiring guide (Builder: Codex)
- Added `CONTROLS_CAMERA_VEHICLES_GUIDE.md` so Jaron can see exactly where
  keyboard, touch analog, camera orbit, and ship physics are wired.
- The guide documents the requested control map: W/S thrust, A/D ship yaw,
  Space lift, Q/R roll, arrows/mouse camera-only, and touch analog steering.
- Linked the guide from `README.md` and `ROADMAP.md`.

## 2026-07-04 — Root-cause physics/camera/collision repair (Claude Fable 5)
- Assisted ship flight now obeys gravity and terrain collision (early-return bug removed) — no more flying through planets; idle ships sink to a safe auto-landing.
- Chase camera follows the ship (steering hold removed) — the ship has a front again; D/stick-right turns right; velocity "grip" makes turns change your path.
- MESH-TRUE terrain collision: the collision surface IS the rendered mesh (vertex-radius grid + exact ray-triangle). Fixes fall-through ground, floating/buried crates, seeing through the planet. Mesh detail bumped.
- Ship hull is solid to the player (walk on the roof, not through the walls).
- 7 new regression tests; 79/79 green.

## 0.2.19 — 2026-07-04 — Dev/God Mode roadmap captured in repo (Builder: Codex)
- Added `DEV_GOD_MODE_ROADMAP.md` to track the requested dev/god mode,
  placeable prefabs, snap builder, walk-in vehicles, and asset pipeline lane.
- The doc marks what is done, partial, and not started so future agents can
  continue from repo state instead of chat memory.
- Linked the new tracker from `README.md` and `ROADMAP.md`.

## 0.2.18 — 2026-07-04 — Assisted ship flight now has a real nose/front (Builder: Codex)
- Reworked assisted ship piloting from direct travel-vector steering to a
  vehicle-style model: yaw rotates the hull/front, and throttle accelerates
  through that front.
- This follows the common flight-game split of torque/steering vs force/thrust:
  left/right no longer invents sideways travel by itself.
- Added a regression test proving yaw-only input turns the ship nose without
  creating sideways velocity.

## 0.2.17 — 2026-07-04 — Ship steering no longer drags chase camera orbit (Builder: Codex)
- Changed chase camera anchoring while piloting: WASD/mobile ship steering now
  holds the current camera anchor instead of applying every ship yaw directly to
  the chase camera orbit.
- Camera orbit still works from explicit look input, and the chase camera
  recenters behind the ship once steering/look input is released.
- This targets Jaron's report that both desktop WASD and mobile analog still
  felt like they were moving the camera while in the ship.

## 0.2.16 — 2026-07-04 — Mobile joystick no longer leaks into ship camera look (Builder: Codex)
- Added explicit touch joystick active state and stopped joystick/button touch
  events from bubbling into the global touch-look handler.
- This mirrors the Unreal pilot-input rule: vehicle-control touches steer the
  ship, while camera look only comes from touches outside the analog/buttons.
- This should reduce the "analog stick is still orbiting the ship camera" feel
  on mobile browsers.

## 0.2.15 — 2026-07-04 — Code-built Fortis walkable gunship visual (Builder: Codex)
- Ported the `SpaceYouLand/_authoring/make_walkable_gunship.py` layout into a
  mobile-safe Three.js primitive silhouette instead of shipping raw FBX/Blender:
  physics deck, side shells, roof, cockpit glass, rear ramp/pressure door,
  wings, engines, tanks, landing gear, pilot seat, console, trim, and module
  markers.
- The module system remains authoritative: missing/damaged installed modules
  still affect readiness and darken/omit matching visual pieces.
- Added a headless visual hierarchy check for the code-built Fortis gunship.

## 0.2.14 — 2026-07-04 — Assisted ship piloting becomes the default (Builder: Codex)
- Changed normal ship piloting to the dev-fly-style direct control spine:
  `W/S` or mobile stick up/down now means forward/reverse, `A/D` or mobile
  stick left/right turns the ship, `Space`/LIFT climbs, and Brake/Control slows.
- Mouse/touch look is now camera orbit only. Ship steering no longer consumes
  mouse/touch look deltas, so the stick/keyboard turns the ship while separate
  look input changes only the chase camera.
- Camera recenters behind the ship when no separate look input is active.
- Ship movement now uses the existing analytic structure collision with a larger
  hull radius so outpost buildings no longer act pass-through for the ship.

## 0.2.13 — 2026-07-04 — Dev-fly feel for mobile ship controls (Builder: Codex)
- Split mobile ship stick input from mobile camera look: the joystick touch id
  can no longer feed touch-look, and ship steering no longer reads touch
  `mouseDX/mouseDY`.
- Added a touch chase-camera orbit: camera stays locked behind the ship during
  stick-only flight, while a separate touch outside the joystick temporarily
  free-looks the camera.
- Changed touch mobile ship assist to dev-fly-like direct hover movement:
  stick forward/reverse drives the actual ship, LIFT climbs, BRAKE slows, and
  releasing controls steadies the ship instead of falling immediately.

## 0.2.12 — 2026-07-04 — Mobile flight changes actual travel direction (Builder: Codex)
- Added a mobile flight-assist path in `ship.js`: touch piloting now steers the
  ship's real travel heading directly, keeps the hull upright relative to the
  current body, and applies main thrust along that heading instead of letting
  camera pitch/inertia make the ship feel like it is on a vertical rail.
- Desktop flight remains the more aircraft-like 6DOF path.

## 0.2.11 — 2026-07-04 — Calmer mobile ship piloting (Builder: Codex)
- Reworked mobile piloting after Jaron's phone screenshots: left stick is now
  throttle + yaw, not pitch/yaw, so takeoff no longer asks the thumbstick to
  tip the ship while trying to fly.
- Reduced touch-look sensitivity while piloting and added mobile takeoff assist:
  throttling up on touch also applies vertical lift until the ship leaves the
  ground, preventing hard-impact loops from tiny mobile input mistakes.
- Simplified the piloting buttons: right-side ship buttons are now BRAKE + GEAR,
  and the bottom Space button relabels to LIFT while piloting.

## 0.2.10 — 2026-07-04 — Touch analog ship steering (Builder: Codex)
- Checked `SpaceYouLand` and carried over the key pilot-control lesson: ship
  steering must be separate from camera look while seated.
- Touch joystick now becomes a real ship steering stick in piloting mode:
  left/right yaw, up/down pitch. The THR buttons remain the throttle controls.
- Split touch virtual-key sources so the steering stick cannot cancel THR+/THR-
  or TURN buttons when both thumbs are used together.
- Added headless tests for normalized touch axes and ship-stick mapping.
  `npm test` 62 -> 65.

## 0.2.9 — 2026-07-04 — Mobile-safe SYL dev editor first slice (Builder: Codex)
- Added opt-in `?dev=1` DEV editor tools: ready a mobile-safe test ship, give a
  supply kit, fill fuel, move the ship to the player, jump the player to the
  ship, save, and toggle fly-person mode.
- Kept the first editor slice code-built and DOM-based so it stays phone-safe;
  no Blender/GLB assets added yet.
- Added headless tests for the dev actions. `npm test` 57 -> 62.

## 0.2.8 — 2026-07-04 — Promote Kimi expansion + multiplayer to main (Builder: Codex)
- Promoted the tested `test/kimi-expansion-pack` work onto `main`: expanded
  items/bodies/ship parts/crafting, Heartbeat Realtime visibility, and the
  A/D yaw + touch-turn flight fix are now the public SYL foundation.
- Updated README language so the promoted features no longer read as test-only.
- Public hosted copy should be synced into Heartbeat `/games/syl/` while keeping
  stable saves on the `syl_save` key and future risky work on `/games/syl-test/`.

## 0.2.7-test — 2026-07-04 — Ship turning/flight-feel fix (Builder: Claude/Opus)
- Yaw is now a first-class, holdable control: `A`/`D` turn the ship (in addition
  to mouse-X), roll moved to `Q`/`E`, and the phone piloting cluster gains
  "TURN left / TURN right" hold-buttons so touch players can hold a turn.
- ship.js rotation exposed as tunable consts (PITCH_RATE/YAW_RATE/ROLL_RATE/
  ROT_DAMP); yaw authority 1.8->2.7 and damping 3.0->2.2 for crisper, sustained
  turns. No change to floating origin, traversal, collision, or save format.
- README + in-game help updated. +2 turning tests. `npm test` 55 -> 57.

## 0.2.6-test — 2026-07-04 — Heartbeat realtime multiplayer MVP (Builder: Codex)
- Added optional Supabase Realtime multiplayer in `src/multiplayer/` using the
  existing Heartbeat Observatory realtime pattern: presence for join/leave
  identity, broadcast state at <=10Hz, idle suppression, 250ms interpolation,
  and graceful solo fallback when realtime is unavailable.
- Remote players now render as suit avatars on foot and ship markers while
  piloting; state includes body/world position, orientation, mode, throttle,
  and landed status without changing traversal, floating origin, physics, or
  save format.
- Added a compact realtime HUD chip and copied the test-branch source into the
  Heartbeat `/games/syl-test/` hosted lane. Stable `/games/syl/` is unchanged.
- Verified `npm test` remains 55/55.

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
