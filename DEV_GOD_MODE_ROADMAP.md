# SYL Dev/God Mode, Prefabs, Snap Builder, and Walk-In Vehicles

Status as of 2026-07-04.

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
  - Desktop shortcuts: `F10` enables/toggles, backquote toggles once enabled.
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
1. Add a DEV zone/body teleport list.
2. Add spawnable code-built crates/props with IDs.
3. Extend save format with a `placedObjects` array.

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
1. Create `src/editor/prefabs.js` with code-built prefab definitions.
2. Start with mobile-safe primitives: crate, wall, floor, ramp, door frame, small building, landing pad.
3. Add DEV placement cursor and rotate/place/delete controls.
4. Save placed prefab instances.

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

## 5. Asset Pipeline

Goal: stay mobile-safe while leaving a path to richer authored assets.

- `[x]` Code-built placeholder prefabs first.
  - Current world structures, pickups, ship parts, and Fortis visual are code-built Three.js primitives.
  - This keeps the live mobile page light.
- `[~]` Blender-generated GLB assets.
  - The Unreal/Blender source exists in the sibling `SpaceYouLand` lane, especially
    `_authoring/make_walkable_gunship.py`.
  - The web build intentionally has not shipped heavy GLB/FBX assets yet.
- `[ ]` Unreal/Unity-style assets later if useful.
  - Official-engine work is tracked in `ROADMAP.md` Milestone 7.
  - Any imported asset must pass mobile performance checks before public sync.

Next useful slice:
1. Keep editor prefabs code-built until placement/saving/snapping works.
2. Only then replace selected prefabs with optimized GLB.
3. Add asset budget rules: triangle count, texture size, draw calls, and phone smoke test.

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
- Authored world structures as code-built primitives.
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
- Blender GLB shipping pipeline for mobile.
