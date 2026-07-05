# ROADMAP.md — Continuation Plan for Codex / Claude / Opus

Work top-down within the current milestone. One item = one session chunk:
implement → `npm test` green (add tests) → browser-verify → HANDOFF + CHANGELOG
→ commit → **deploy to the live site** (PORTABILITY.md). Do not start several
items at once.

## ⭐ NORTH STAR (Jaron, 2026-07-03)
The destination is an **official Unreal/Unity game**: EVE's planet-to-planet
persistent open world + KSP's piece-by-piece building + DayZ/ARC Raiders/
Battlefield PVP (VISION.md). This repo is the live blueprint + public playtest
at **heartbeatobservatory.com/games/syl** — every merged change must reach that
URL. No local-only work. Mobile must keep working (Jaron tests on his phone).
When sessions have spare capacity, prefer items tagged [UNREAL-PREP]: they
de-risk the official build.

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
      distances; expose tunables as a constants block in ship.js). Control and
      camera wiring notes live in `CONTROLS_CAMERA_VEHICLES_GUIDE.md`.
- [ ] Landing aids: velocity vector indicator, ground-radar altitude, target-zone
      marker while approaching (HUD additions in ui.js)
- [x] On-foot collision with structures (capsule vs placed-structure primitives —
      analytic footprint colliders, 2026-07-03)
- [ ] Crash/repair loop polish: gear-only soft landings, per-module damage
      readout toast, stranded-recovery mechanic (emergency beacon → Fortis tow
      at standing cost — first faction-relationship USE)
- [ ] Browser perf pass: body mesh LOD by distance, HUD refresh throttling —
      MOBILE FRAME RATE IS THE BUDGET (Jaron tests on phone)
- [x] Mobile touch input layer (joystick + look + buttons, 2026-07-03) —
      follow-up: tune sizes/sensitivity from Jaron's phone feel test; gamepad
- [ ] Mobile polish: HUD scaling on small screens, orientation hint,
      fullscreen button, iOS Safari audit

## Milestone 2 — World depth
- [ ] Terrain LOD: quadtree patches near the camera sampling `terrainRadiusAt()`
      (NEVER a second height source) with crater/ridged noise variants per body
- [ ] Free-form ship builder: attachment-node graph replacing fixed slots
      (reuse shipBuilder actions; keep slotIds stable for save migration)
- [x] Civil transport line: automated passenger ship, visible/collidable
      transit bases, and a seven-stop route so non-pilots can visit other
      planets (2026-07-05).
- [ ] Dev/God Mode + placeable prefab lane: tracked in
      `DEV_GOD_MODE_ROADMAP.md` so admin tools, prefab placement, snap sockets,
      walk-in vehicles, and the asset pipeline have one owned checklist.
- [ ] Resource nodes + mining tool on-foot loop (extends items/inventory);
      this is where timed respawn belongs, not one-shot salvage crates
- [x] Settlement/biome dressing pass: landing zones now get deterministic
      visual towns, roads, terminal canopies, forests/trees, rocks, ice spires,
      volcanic vents, desert windbreaks, and harbor pylons without changing
      collision or saves (2026-07-05).
- [x] More bodies: gas-giant no-landing body, ice moon (data + one new terrain
      noise variant each — desktop lane proves the registry scales beyond 6)
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

## Milestone 5 — Persistence, multiplayer & PVP foundation
- [ ] Cloud saves: transport beside localStorage PUTting the same payload
      (fable-survival api/save.js + Supabase is the working reference; the
      heartbeat-observatory site already runs Supabase — consider sharing it)
- [ ] Account linking (player-code pattern from fable-survival)
- [x] Multiplayer visibility MVP on the Heartbeat test lane: remote players and
      ship markers over Heartbeat Supabase Realtime, with no save/physics
      changes (2026-07-04). This is playtest presence, not authoritative PVP.
- [ ] Multiplayer persistence parity: make player-owned ships/vehicles,
      build/place actions, and persistent world objects visible to other players
      in SYL and Fable using the Heartbeat 3D engine realtime pattern.
- [ ] Multiplayer research spike: authoritative server for f64 world state,
      client prediction for integrators — WRITE FINDINGS BEFORE CODE
- [ ] Server-authoritative world sim prototype (the persistent-galaxy seed)
- [ ] PVP foundation: damage ownership, player identity, friendly/hostile
      faction rules, death/respawn cost, and persistence-safe combat logs
- [ ] Survival pressure: inventory loss rules, stranded recovery, extraction/
      recovery loops that match the DayZ/ARC Raiders/Battlefield tone target

## Milestone 6 — Hardening & deployment
- [ ] Automate live-site sync to heartbeatobservatory.com/games/syl (copy
      index.html/lib/src only, preserve site saves; see PORTABILITY.md)
- [ ] Expand test suite: traversal phase transitions, crash damage, zone
      discovery, save migration fixtures, mobile input smoke
- [ ] Performance budget + CI check (fable-survival's bundle-size discipline);
      mobile frame rate is the budget
- [ ] Codex/Claude handoff protocol drill: one full session by another model
      following AGENTS.md, then fix whatever confused it

## Milestone 7 — Official Unreal/Unity lane [UNREAL-PREP]
- [ ] Produce a port packet: system-by-system acceptance tests, data schemas,
      and save payload examples for Unreal/Unity agents
- [ ] Unreal prototype: import bodies registry + analytic terrain sampling into
      the Kurearthis/SpaceYouLand lane; verify floating-origin behavior at scale
- [ ] Ship builder prototype in engine: modular slots/attachment nodes, damage,
      repair, fuel/power budgets, and persistence matching this repo's payload
- [ ] Planet-to-space traversal prototype in engine with no loading screen or
      fake teleport; phase labels remain derived from physical state
- [ ] Visual identity target pass: serious Fortis materials, lighting, grounded
      weapon/gear texture direction, and faction architecture kit

## Standing rules for every item
No flat-world hacks. No loading screens. No teleport pretending to be travel.
No second height source. No physics library without a measured case. Ship stays
modular. Planetary traversal, factions, persistence, and mobile playability stay
intact. Old saves keep loading. Update HANDOFF.md + CHANGELOG.md before stopping.
