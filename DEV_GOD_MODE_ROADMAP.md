# SYL Dev/God Mode, Prefabs, Snap Builder, and Walk-In Vehicles

Status corrected 2026-08-15. `CANON.md` and the V2 physical-world contract
govern this tooling. V1 primitive placement remains historical capability, not
the production asset direction.

This file tracks the editor/building/vehicle wishlist so it is not trapped in
chat history. It should be updated whenever an agent ships part of this lane.

Legend:
- `[x]` done enough to use in the public build
- `[~]` partial foundation exists, but the requested feature is not complete
- `[ ]` not started

## 1. Dev/God Mode

Goal: admin/local-only tools that let Jaron test worlds, vehicles, placement,
repair, fuel, and construction without grinding every loop by hand.

Current implementation lives in `src/dev/devTools.js`.

- `[x]` Admin-only or local-only toggle.
  - Implemented as opt-in `?dev=1`, persisted per browser in localStorage.
  - Keyboard shortcuts: `F10` enables/toggles, backquote toggles once enabled.
  - This is not real account-based admin auth yet.
- `[x]` Fly as the player camera.
  - DEV panel has `Fly person`.
  - WASD moves, mouse/touch look aims, `Space` rises, `X`/Ctrl descends, Shift is fast.
- `[~]` Spawn supplies and ship parts.
  - DEV `Give supply kit` adds resources and one of each part to inventory.
  - It does not yet spawn visible crates into the world.
- `[~]` Spawn vehicles.
  - DEV `Ready ship here` moves the current ship near the player and installs/fuels a safe test build.
  - It does not yet create additional independent vehicles.
- `[ ]` Spawn crates, buildings, walls, props, or placed prefabs.
- `[~]` Teleport.
  - DEV can move player to ship and ship to player.
  - Body/zone teleport menu is not implemented.
  - Normal gameplay must remain no-fake-teleport; dev-only teleport is acceptable for testing.
- `[x]` Repair/refuel instantly.
  - `Ready current ship` installs/repairs/fuels the current ship.
  - `Fill fuel` fills fuel to capacity.
- `[~]` Save.
  - DEV `Save now` saves the normal game state.
  - There is no placed-object persistence yet.

Next useful slice:
1. Add inspection by stable entity ID and hierarchical spatial address.
2. Add scene reports, snapshots/diffs, collision/navigation/support overlays,
   and authoritative revision display.
3. Add dev-only body/site travel after the V2 coordinate/authority contract
   exists. Debug teleport remains diagnostic and never becomes gameplay travel.

## 2. Placeable Prefabs

Goal: ready-made things Jaron can drop into the world from a dev/editor panel,
then later promote into player construction.

- `[~]` Ready-made ships.
  - Current starter ship exists as a fixed-slot modular ship.
  - DEV can instantly create a safe test version of the current ship.
  - Code-built Fortis gunship visual exists in `src/ship/ship.js` as `Fortis_Gunship_CodeBuilt`.
  - Multiple ship prefab variants are not implemented.
- `[ ]` Ground vehicles.
- `[ ]` Buildings as placeable prefabs.
  - Fortis outpost/salvage-yard structures exist as authored world primitives in `src/world/planet.js`.
  - They are not player/dev placeable yet.
- `[ ]` Walls, doors, windows, floors, ramps, props as placeable prefabs.
- `[x]` Starter test ship so Jaron can fly immediately.
  - Use `?dev=1` then DEV -> `Ready ship here` or `Ready current ship`.

Next useful slice:
1. Define the V2 assembly/template schema before enabling placement.
2. Register measured components, bounds, supports, apertures, sockets,
   materials, collision, navigation, provenance, and stable IDs.
3. Add a diagnostic placement cursor that rejects invalid support, clearance,
   intersection, and authority conditions.
4. Save accepted server-side entities, not client-only decorative instances.

## 3. Snap Builder

Goal: build ships/rooms/buildings from compatible pieces rather than only using
fixed slots or free placement.

- `[~]` Compatible ship part foundation.
  - Current ship builder has fixed slots/hardpoints in `src/ship/shipParts.js`.
  - Expanded hardpoints exist in `src/ship/shipParts_expanded.js`.
  - This is not free-form snapping yet.
- `[ ]` Compatible parts snap together in the world.
- `[ ]` Doors/windows fit wall sockets.
- `[ ]` Walls/floors/ramps snap together.
- `[~]` Ship rooms/cockpits/engines/seats snap to hardpoints.
  - Fixed ship slots are the early data model.
  - No room-scale interior snapping yet.
- `[ ]` Save a built ship as a reusable blueprint.

Next useful slice:
1. Define snap sockets on prefabs: `socketId`, `kind`, `position`, `normal`, `compatibleKinds`.
2. Add ghost preview that snaps when sockets are compatible.
3. Save a placed build as JSON.
4. Promote saved JSON into reusable prefab/blueprint definitions.

## 4. Walk-In Vehicles

Goal: replace the current abstract ship object with real vehicles that can be
approached, opened, entered, seated in, and operated from physical stations.

- `[~]` Approach ship.
  - Player can approach the current ship and press `E` to board.
  - The interaction is abstract; it does not yet open a hatch or walk the player inside.
- `[~]` Press button / board.
  - `E` enters ship mode today.
  - There is no physical hatch button yet.
- `[ ]` Hatch opens.
  - Fortis visual includes a rear ramp and pressure door mesh pieces.
  - They are not animated/interactable yet.
- `[ ]` Walk inside.
  - Fortis visual includes primitive interior cues, pilot seat, and console.
  - There is no local ship interior collision/walkable frame yet.
- `[ ]` Sit in pilot/crew seats.
  - Current `E` board puts the player into pilot mode abstractly.
  - No separate pilot/crew seat interactions yet.
- `[ ]` Different seats do different things.
- `[ ]` Long-term replacement for one abstract ship object.

Next useful slice:
1. Add explicit interaction anchors to the ship: hatch/ramp, pilot seat, crew seat.
2. Animate ramp/door open state.
3. Add a local ship interior frame so player position can ride with the moving ship.
4. Change boarding from abstract mode switch to: approach -> open -> walk in -> sit -> pilot.

## 5. Three.js Production Asset Pipeline

Goal: ship mechanically and architecturally assembled production assets whose
geometry, materials, movement, collision, navigation, damage, and provenance
describe the same object.

- `[x]` V1 primitives and generated GLBs are identified as legacy placeholders.
  - Current world structures, pickup cubes, ship pieces, and the three desktop
    GLBs are not approved V2 production assets.
- `[ ]` Authoritative asset manifest and inspection schema.
  - Stable template/component/material IDs; measured bounds and mass; supports;
    apertures; sockets; collision; navigation; pressure zones; damage proxies;
    LODs; animation drivers; provenance.
- `[ ]` Detailed Three.js asset authoring/import path.
  - Blender and other tools may produce GLB, but Three.js is the product engine.
  - Assets require silhouette readability, secondary/tertiary construction
    detail, real proportions, seams, guards, fasteners, motors, wiring, and
    component-specific PBR material zones.
- `[ ]` CC0 material intake and proof.
  - Record exact source URL, license evidence, checksum, modifications,
    real-world repeat scale, map set, color space, and anti-tiling treatment.
- `[ ]` State-driven articulated motion.
  - Pivots, constraints, collision, navigation, sound, light, and visuals use
    the same accepted component state.
- `[ ]` Measured cross-device delivery.
  - Build full intended fidelity, test the deployed page on Jaron's physical
    phone, and optimize only demonstrated bottlenecks. Phone is not a reduced
    asset tier.

Next useful slice:
1. Implement the manifest/inspection contract from `docs/assets/` and
   `docs/architecture/PHYSICAL_WORLD_CONTRACT.md`.
2. Produce one approved multi-component asset with real material provenance,
   reachable function, damage state, and LODs.
3. Validate exact dimensions, connectors, collision, navigation, animation,
   public loading, and real-phone performance before growing the catalog.

## Summary: What Is Done vs Not Done

Done enough to use:
- Opt-in DEV panel.
- Fly-person mode.
- Ready/refuel current ship instantly.
- Supply kit to inventory.
- Move ship to player / player to ship.
- Save now for normal game state.
- Code-built Fortis gunship visual.
- Starter test ship through DEV tools.

Partial foundations:
- Current fixed-slot modular ship builder.
- Current abstract `E` board/exit flow.
- Fortis ramp/door/seat visual pieces.
- Legacy world structures as code-built primitives.
- Normal save system, but not placed-object persistence.

Not done yet:
- Placeable prefab catalog.
- World placement cursor.
- Saved placed buildings/props/vehicles.
- Multiple ready-made vehicle prefabs.
- Ground vehicles.
- Snap sockets and snap preview.
- Saved ship/building blueprints.
- Physical hatch/ramp interaction.
- Walkable ship interiors.
- Pilot/crew seat stations with different roles.
- Three.js production asset pipeline with provenance and measured LODs.
