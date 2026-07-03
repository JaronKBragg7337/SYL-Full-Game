# DECISIONS.md — What Is REAL vs APPROXIMATED (the honesty ledger)

Every approximation below was chosen deliberately, does NOT block the real
version, and has a written replacement path. If you replace one, update this
file and HANDOFF.md. Numbered for reference from other docs.

## REAL (foundation-grade; build on these)

1. **Floating origin / f64 world coordinates.** Fully real. The camera-relative
   pattern is the same one Kurearthis proved in Unreal (SetNewWorldOrigin).
2. **Radial gravity with inverse-square falloff, N-body sum on the ship.**
   Real physics at game scale. Every body pulls at all times; the dominant
   body is derived, never scripted.
3. **No physics engine — custom double-precision integrators.** This is the
   EVIDENCE-BACKED architecture (Kurearthis proofs 2b–2f: stock solvers are
   10–100× wrong at planetary coordinates). Do not add a physics library to
   "clean this up"; if a feature needs rigid-body dynamics, build it on the
   integrator pattern or document a measured case for an engine near-origin.
4. **Analytic terrain as single ground-truth (visuals == collision).** Real and
   stronger than mesh collision. Landing-zone flattening lives inside it.
5. **Seamless surface→space→surface traversal.** Real. Phases are derived from
   physical state; there is no teleport/cut code path in the repo.
6. **Modular ship (parts → stats → readiness → repair).** Real system boundary:
   stats are computed from installed modules only; damage/degradation change
   flight capability; the visual is rebuilt from modules.
7. **Data-driven registries** (bodies/factions/items/parts/zones). Real.
8. **Save/load of every stated system** (player, ship+modules, inventory,
   world discovery, faction standings, mode). Real, versioned, round-trip tested.

## APPROXIMATED (honest, replace via ROADMAP)

9. **Scale.** Bodies are hundreds–thousands of meters, not thousands of km;
   inter-body distances are tens of km. Fields `realRadiusKm`/`realGravity` in
   bodies.js record design intent. WHY: playable session times in a browser.
   REPLACEMENT: raise radii/distances (data change) + terrain LOD (ROADMAP M2)
   + time-warp or higher speeds. The architecture is scale-independent — this
   is proven by the f64/floating-origin design, not asserted.
10. **Terrain fidelity.** One displaced sphere mesh per body (~detail 64),
    visual match to collision is within mesh resolution (~exact on pads, small
    interpolation error on slopes). REPLACEMENT: quadtree/chunked LOD patches
    that sample `terrainRadiusAt()` (M2). NEVER a second height source.
11. **Bodies are static (no orbital motion).** Positions fixed in bodies.js.
    REPLACEMENT: orbital elements per body + moving `_centerV` (M3); systems
    already read `body._centerV` dynamically each frame, so motion is safe.
12. **Ship slot layout is fixed** (Fortis gunship pattern, 14 slots). Piece-by-
    piece building/repair is real; free-form placement is not yet. REPLACEMENT:
    attachment-node graph (M2) reusing shipBuilder actions unchanged.
13. **On-foot gravity uses dominant body only** (ship uses full N-body). Fine at
    current scales; unify when walking near L1-style boundaries matters (M3).
14. **Atmosphere is a tinted shell + altitude fade + drag term**, not scattering
    or aerodynamics. REPLACEMENT: shader scattering (M4 visual lane) + lift/drag
    model (M3 flight lane).
15. **Structures are simple authored primitives** placed on the sphere (SYL
    "authored from scratch" law honored in spirit; no premade assets used).
    REPLACEMENT: modular building kit + construction-over-time (M4).
16. **Factions beyond Fortis are placeholder archetypes** (marked in data).
    Canon names live in Jaron's Drive design docs — swap the data, ids stay.
17. **Persistence is localStorage.** Payload is backend-ready; fable-survival's
    Supabase lane is the reference for the cloud swap (M5).
18. **The pilot is not physically walking inside a walkable ship interior.**
    Enter/exit is positional + camera change. The SYL endgame (walkable ships)
    needs interior volumes riding the ship's frame — architecture note: model
    interiors as a local frame parented to the ship entity, players integrate
    within it (M4).

## Process decisions

19. **Clean repo, not a fork.** fable-survival stays the deployment/docs model;
    SpaceYouLand stays the Unreal canon lane; Kurearthis stays the physics-proof
    lane. This repo distills all three into one runnable foundation.
20. **Vendored three.js r160, no bundler.** Zero-install, offline-capable,
    instant boot. Revisit only when module count hurts (fable-survival's Vite
    config is the pattern).
21. **MIT license, public-repo hygiene**: no secrets, no personal data, tokens
    never committed.
