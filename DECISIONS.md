# DECISIONS.md — Current Implementation Decisions

`CANON.md` and the locked canon sources outrank this file. Earlier decisions
that pointed toward Unreal/Unity, a separate desktop product, surface-only
terrain, or client-local world authority are superseded as of 2026-08-15. Their
history remains visible in git, `HANDOFF.md`, and `CHANGELOG.md`.

## Product and delivery

1. **Three.js is the permanent game runtime.** SYL is built and released as a
   browser game. Unreal Engine and Unity are not target runtimes.
2. **One responsive client.** `index.html` is the product entry for phone and
   desktop browsers. Phone/touch is primary and full fidelity. `desktop.html`
   is a preserved, on-hold legacy experiment.
3. **Canonical public route.** The game is hosted at
   `https://www.heartbeatobservatory.com/games/syl/`. The game repository owns
   source; the Heartbeat repository contains the deployed mirror.
4. **No assumed mobile downgrade.** Performance changes require measurements on
   the deployed game and Jaron's physical phone. Optimize the measured
   bottleneck without removing state-bearing physical detail.

## World and physics

5. **f64 hierarchical positions and local rendering remain.** Camera-relative
   Three.js rendering is retained. Gameplay/entity state never lives only in a
   mesh transform.
6. **Planet scale is reopened before permanent geology.** V1 uses deliberately
   compressed bodies. V2 must choose one coherent relationship among radius,
   gravity/mass, crust, atmosphere, terrain, and travel pacing before authoring
   persistent underground worlds.
7. **The V1 radial height shell is legacy.** Its visual/collision agreement is a
   valuable principle, but it cannot represent caves or material volume. V2
   uses versioned procedural geology plus sparse persistent edits.
8. **Matter is conserved.** Digging, dumping, cratering, construction, cargo,
   salvage, and manufacturing use measured material lots and custody. A planet
   is not empty below its outer mesh.
9. **Macro and local physics are separated.** Global planetary/ship motion uses
   explicit f64 integration. Measured rigid-body simulation may run inside
   rebased local islands for cargo, vehicles, articulated assemblies, and
   detached parts. A float32 solver never owns planetary coordinates.
10. **Physical damage uses component graphs.** Scalar HP may remain as migration
    data, but accepted V2 damage is location-, material-, energy-, and
    connection-aware. Significant detached parts persist as entities.

## Authority and persistence

11. **The server decides truth.** V1 localStorage and client simulation are not
    canonical persistence. V2 validates commands and owns economy, assets,
    custody, territory, governance, enforcement, damage, construction, and
    terrain.
12. **Audit is append-only.** Consequential corrections use compensating events,
    never hidden mutation or deleted history.
13. **AI Director is proposal-only.** It has no direct write authority. Custodian
    and YOM planners are deterministic and capability-bounded.
14. **Stable V1 IDs and saves are migrated explicitly.** Compatibility does not
    require preserving wrong semantics; it requires versioned migration and
    honest handling.

## World construction and assets

15. **V1 surface dressing is disposable.** Generated buildings, roads, nature,
    pickup cubes, and fake desktop GLBs are not approved V2 assets.
16. **The canonical nine factions replace invented placeholders.** V1 IDs remain
    only until a migration maps them to approved canon.
17. **Spatial function precedes final art.** Sites declare destinations,
    footprints, access, doors, docks, utilities, supports, and clearance; roads
    and buildings derive from that measured graph.
18. **Every reachable-looking building is physically coherent.** Interiors,
    exterior, apertures, collision, navigation, pressure zones, and support use
    one blueprint.
19. **Asset quality is mechanically assembled and provenance-recorded.** V2
    assets use real dimensions, component-specific PBR materials, readable
    silhouettes, secondary/tertiary detail, state-driven motion, and CC0 source
    records for external textures.

## Development process

20. **Historical docs are not current instructions.** Old handoffs/changelog
    entries remain unchanged and are explicitly subordinate to `CANON.md`.
21. **The current vendored Three.js/no-build setup is revisable.** It is useful
    while simple; workers, WASM, bundling, KTX2, and other web tooling may be
    introduced when they solve measured needs.
22. **V1 tests protect V1 behavior only.** V2 completion additionally requires
    authority, conservation, replay/reconnect, physical-observability, and
    public-device acceptance tests.
23. **No unsafe shared-origin staging.** `/games/syl-test/` is not an approved V2
    preview until its saves, backend state, and deployment are genuinely
    isolated from production.
