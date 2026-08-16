# ROADMAP.md — Space You Land V2

Work in order. One slice is implemented, tested, browser-verified, documented,
committed, pushed, deployed, and public-URL verified before the next begins.
`CANON.md` governs scope.

## North star

Space You Land is the permanent Three.js game at
https://www.heartbeatobservatory.com/games/syl/. It is a server-authoritative,
persistent physical universe—not an engine prototype or decorative map.

Every phase has two gates:

1. **Authority:** accepted state is conserved, auditable, recoverable, and
   cannot be fabricated by a client.
2. **Physical witness:** a player can physically encounter the local
   consequence with the HUD closed.

Phone/touch is a primary full-fidelity path. Performance decisions follow
measurements on Jaron's physical phone and the deployed page.

## Phase 0 — Canon and repository truth

- [x] Preserve the locked v3.0.1 Universe Codex in the source repository.
- [x] Add append-only amendments for permanent Three.js delivery, volumetric
      planets, physical damage, and exact spatial/asset truth.
- [x] Replace active Unreal/Unity, blueprint, separate-PC, and assumed-mobile-
      downgrade instructions.
- [x] Mark V1 shell terrain, map dressing, invented factions, local saves,
      client presence, random damage, and desktop experiment honestly.
- [x] Establish server, physical-world, canon-traceability, and asset-provenance
      contracts.
- [ ] Add deterministic checked source-repo → website-repo sync and isolated
      V2 preview deployment.
- [x] Remove obsolete one-time self-mutating automation.
- [x] Establish read-only CI for regression, canon-integrity, and provenance
      checks.
- [ ] Add automated active-document contradiction scanning.

## Phase 1 — Clean V2 substrate

- [ ] Create an isolated V2 client entry using the same Three.js product stack.
      (Deferred by owner instruction 2026-08-15: the substrate was applied to
      the one responsive client and published to the canonical URL instead.)
- [x] Remove/disable disposable surface structures, fake roads, nature scatter,
      pickup cubes, space dressing, and their colliders together.
- [x] Preserve body identities, f64 frames, radial orientation, traversal
      evidence, touch controls, and migration IDs.
- [ ] Lock coherent body scale, mass/gravity, atmosphere, crust, terrain relief,
      travel pacing, and coordinate conventions before geology.
- [ ] Define stable entity/template/material IDs and hierarchical addresses.
- [ ] Build scene inspection, snapshot/diff, address lookup, and whole-scene
      validation before production assets.
- [ ] Decide and document V1 save/faction/body migration; do not silently map
      placeholder semantics into canon.

Exit: a noise-free planet/celestial preview runs at an isolated public URL and
all preserved mechanics have explicit V2 ownership.

## Phase 2 — Authority foundation

- [ ] Define versioned command/event envelopes, idempotency, revisions, and
      ruleset versions.
- [ ] Establish PostgreSQL/PostGIS state, double-entry ledgers, append-only
      audit, transactional outbox, snapshots, and replay harness.
- [ ] Implement session/API gateway, universe coordinator, and exclusive
      spatial/entity leases.
- [ ] Move one character/vehicle interaction to authoritative zone state with
      client prediction and reconciliation.
- [ ] Prove duplicate, reordered, stale, or malicious commands cannot create
      movement, damage, cargo, credits, or ownership.
- [ ] Establish hot/warm/cold continuity and crash/reconnect recovery.

Exit: one authoritative place survives modified clients and server restart.

## Phase 3 — Volumetric planet and material loop

- [ ] Replace the radial universal ground query with versioned procedural solid
      geology plus sparse accepted chunks.
- [ ] Add strata, material properties, faults/veins, natural cave, and immutable
      deep material.
- [ ] Replace outer-surface player/ship clamps with volumetric contact queries.
- [ ] Generate render, collision, navigation, and support products from one
      terrain revision.
- [ ] Add shovel/cutter/excavator sweeps, fixed-unit material conservation,
      loose piles, vehicle loading, dumping, and compaction.
- [ ] Add supported tunnel, underground room, collapse rules, and structure
      foundation contacts.
- [ ] Add server-owned impact craters, ejecta accounting, road/nav changes, and
      repair fill.

Exit: a Fortis quarry proves dig → load → drive → dump → compact, a persistent
tunnel, a crater, two-client parity, restart parity, and real-phone performance.

## Phase 4 — Assembly and damage laboratory

- [ ] Define component, connector, material-layer, compartment, damage-proxy,
      salvage, and repair schemas.
- [ ] Build one 12–20-component ship with exterior and coherent walkable
      interior.
- [ ] Add one server-owned projectile and layered armor/penetration tests.
- [ ] Recompute structural, power, fuel, atmosphere, data, and cargo-restraint
      graphs after hits.
- [ ] Detach a panel/engine/gear assembly as a persistent entity with mass,
      momentum, ownership, history, and salvage value.
- [ ] Add breach, pressure loss, fire/leak isolation, jammed door, and repair.

Exit: the same input/revision yields the same semantic damage result; a stopped
round cannot damage hidden components; detached parts survive restart.

## Phase 5 — Fortis Recovery Corridor

- [ ] Survey one 512 × 512 m site and declare pad, checkpoint, depot, habitat,
      relay, YOM worksite, parcels, doors, docks, utilities, and clearances.
- [ ] Build one graded 300–400 m road whose mesh, collision, vehicle lanes,
      pedestrian crossings, drainage, signs, checkpoint sockets, and condition
      derive from one graph.
- [ ] Build reachable depot, habitat/admin building, damaged relay, and a
      walkable relief/merchant ship from measured assembly blueprints.
- [ ] Add physical repair cargo, loading equipment, two convoy vehicles, and a
      patrol/escort.
- [ ] Begin under Custodian Containment with shortage, closed service, damaged
      relay, physical barriers, and YOM relief staged outside.
- [ ] Complete fly → dock → walk ship → unload → checkpoint → escort/fight →
      rebuild → de-escalate, including visible failure/stall paths.
- [ ] Reconcile stock, price displays, custody, damage, construction stages,
      Rebuild Credit, services, patrols, and access after reload/second client.

Exit: SYL's core identity is playable and physically observable in one honest
place.

## Phase 6 — One contested regional economy

- [ ] Replace V1 placeholders with approved canonical faction data and migration.
- [ ] Add two playable factions plus Custodians and YOM.
- [ ] Add physical station market, escrow, fees/taxes, repair/refuel, production,
      stock, and convoy route.
- [ ] Add elections, seats, access policy, Heat/evidence, territory, Stability,
      Sovereignty stages, and Rebuild Credit.
- [ ] Run AI Director in shadow/proposal-only mode.
- [ ] Prove YOM cannot enforce and Custodians cannot retain human seats.

## Phase 7 — Multi-region universe

- [ ] Spatial sharding and seamless handoff.
- [ ] Walkable ship interiors, fleets, stations, and persistent routes in the
      one responsive client.
- [ ] Seven playable factions, player-created factions, diplomacy, black market,
      intelligence custody, governance, crew/morale, and PSI.
- [ ] Momentum, expansion epochs, COMMS FALL, Ethos Drift, Cognitive Frameworks,
      solo crew/integrity, and Galactic Council.
- [ ] Canary selected AI Director commands only after validator/replay evidence.
- [ ] Load, soak, crash, duplicate-event, economy reconciliation, adversarial,
      and long-session phone tests.

## Standing rules

No current code path becomes canon because it already exists. No fake travel,
empty planet interior, decorative cargo, unrelated AI authority, client-created
state, hidden material duplication, unreachable usable-looking door, road that
AI cannot use, or unexplained visual/physical disagreement is accepted.
