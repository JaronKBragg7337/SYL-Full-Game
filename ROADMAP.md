# ROADMAP.md — Continuation Plan for Codex / Claude / Opus

Work top-down within the current milestone. One item = one session chunk:
implement → `npm test` green (add tests) → browser-verify → HANDOFF + CHANGELOG
→ commit. Do not start several items at once.

## Milestone 0 — Foundation (THIS BUILD — done 2026-07-03)
- [x] Floating-origin engine, f64 world coordinates
- [x] Data-driven body registry (3 bodies), analytic terrain = collision
- [x] Radial-gravity on-foot player (Kurearthis pawn logic)
- [x] Modular ship (14 slots, 8 part types, damage/repair/readiness)
- [x] Seamless surface→space→surface traversal state machine
- [x] Factions (Fortis canon + 6 placeholders), items, inventory
- [x] Save/load (localStorage, versioned) + autosave
- [x] Full gameplay loop + 32 headless tests incl. Earth→Moon sim
- [x] Handoff doc set

## Milestone 1 — Feel & robustness (make what exists feel good)
- [ ] Flight-feel tuning pass with Jaron (thrust curves, rotation rates, camera
      distances; expose tunables as a constants block in ship.js)
- [ ] Landing aids: velocity vector indicator, ground-radar altitude, target-zone
      marker while approaching (HUD additions in ui.js)
- [ ] On-foot collision with structures (capsule vs placed-structure primitives —
      keep analytic-first: structures register simple colliders)
- [ ] Crash/repair loop polish: gear-only soft landings, per-module damage
      readout toast, stranded-recovery mechanic (emergency beacon → Fortis tow
      at standing cost — first faction-relationship USE)
- [ ] Browser perf pass: body mesh LOD by distance, HUD refresh throttling
- [ ] Mobile/gamepad input layer (fable-survival showed mobile is a reach lever)

## Milestone 2 — World depth
- [ ] Terrain LOD: quadtree patches near the camera sampling `terrainRadiusAt()`
      (NEVER a second height source) with crater/ridged noise variants per body
- [ ] Free-form ship builder: attachment-node graph replacing fixed slots
      (reuse shipBuilder actions; keep slotIds stable for save migration)
- [ ] Resource nodes + mining tool on-foot loop (extends items/inventory)
- [ ] More bodies: gas-giant no-landing body, ice moon (data + one new terrain
      noise variant each — prove the registry scales to 6+)
- [ ] Ship cargo transfer UI (inventory ⇄ cargo pods; cargoCap already computed)

## Milestone 3 — Real space
- [ ] Orbital mechanics: give bodies orbital elements, move `_centerV` per frame
      (all systems already read it live); add ORBIT phase to traversal.js
- [ ] Scale-up experiment: 10× radii/distances behind a WORLD_SCALE data flag;
      measure, document, decide the shipping scale (DECISIONS #9)
- [ ] Atmospheric flight model: lift/drag/heating on descent (DECISIONS #14)
- [ ] Unified N-body on-foot gravity (DECISIONS #13)
- [ ] Autopilot/nav computer: the test-suite autopilot (test/run_tests.mjs
      phase B) promoted into a player-facing nav-assist system

## Milestone 4 — SYL identity
- [ ] Walkable ship interior (local frame riding the ship — DECISIONS #18)
- [ ] Construction system: structures built over time from resources by
      machines ("the world is built, not spawned") — Builder role v1
- [ ] Faction expansion: canon names/colors from Jaron's Drive docs replace
      placeholders; territory claims; standing-gated services (fuel, repairs,
      trade prices)
- [ ] Settlements & traders: NPC vendors at zones (fable-survival trader.js is
      the pattern), simple economy driven by factions' economyHooks
- [ ] AI Director v1: paced events (supply drops, pirate contact, faction
      pressure) reading world/faction state, writing missions
- [ ] Visual identity pass: procedural textures, better lighting, per-faction
      architecture kits (still no premade asset packs)

## Milestone 5 — Persistence & multiplayer research
- [ ] Cloud saves: transport beside localStorage PUTting the same payload
      (fable-survival api/save.js + Supabase is the working reference)
- [ ] Account linking (player-code pattern from fable-survival)
- [ ] Multiplayer research spike: authoritative server for f64 world state,
      client prediction for integrators — WRITE FINDINGS BEFORE CODE
- [ ] Server-authoritative world sim prototype (the persistent-galaxy seed)

## Milestone 6 — Hardening
- [ ] Deploy to Vercel/Pages (static; PORTABILITY.md) + playtest link for Jaron
- [ ] Expand test suite: traversal phase transitions, crash damage, zone
      discovery, save migration fixtures
- [ ] Performance budget + CI check (fable-survival's bundle-size discipline)
- [ ] Codex/Claude handoff protocol drill: one full session by another model
      following AGENTS.md, then fix whatever confused it

## Standing rules for every item
No flat-world hacks. No loading screens. No second height source. No physics
library without a measured case. Ship stays modular. Old saves keep loading.
Update HANDOFF.md + CHANGELOG.md before stopping.
