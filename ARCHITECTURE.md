# ARCHITECTURE.md — Space You Land V2

This architecture derives from `CANON.md`. It separates proven V1 techniques
from mandatory V2 replacements so historical code cannot masquerade as the
finished system.

## Governing data flow

```text
player intention
  → authoritative validation
  → atomic state + audit event
  → physical-world materialization
  → interest-managed client state
  → Three.js rendering, sound, controls, and prediction
```

Clients never create canonical position, damage, cargo, credits, ownership,
terrain edits, construction, enforcement, or political outcomes. They predict
for responsiveness and reconcile to accepted server state.

## Load-bearing rules

### 1. Permanent Three.js client

Three.js is the production renderer and interaction client. The same responsive
client supports touch and keyboard/mouse. A separate PC edition or future engine
port is outside the product direction.

The current import-map/vendored-module setup is an implementation choice, not a
canon law. Bundling, workers, WASM, compressed textures, and other web tooling
may be adopted when measured needs justify them.

### 2. Hierarchical f64 frames

Canonical positions use double-precision hierarchical frames:

- system/inertial frame
- celestial-body frame
- surface-local east/north/up frame
- station or structure frame
- moving ship-local frame

Three.js receives float32-friendly coordinates relative to the active camera or
chunk origin. Mesh transforms are projections, never durable world state.

V1's camera-relative rendering in `src/core/engine.js` is useful evidence and
should be preserved. V1 client positions remain local simulation state until
the authoritative server exists.

### 3. Authoritative universe services

The initial backend should be modular rather than prematurely split into many
services:

- session/API gateway
- universe and spatial-lease coordinator
- authoritative hot-zone simulation
- identity, faction, ownership, inventory, economy, station, governance,
  territory, stability, enforcement, mission, storm, expansion, and Cognitive
  Framework modules
- warm/cold simulation workers
- append-only audit journal and transactional outbox
- physical-state materializer
- isolated AI proposal service

PostgreSQL/PostGIS is the intended canonical store. Redis or Realtime presence
may cache ephemeral state but never becomes truth. Consequential transactions
commit domain state, audit records, and outbound events atomically.

`server.js` currently serves static client files only. `src/multiplayer/` is a
legacy visibility layer where clients broadcast their own state. Neither is the
V2 authority.

### 4. One material planet truth

V1 `terrainRadiusAt(body, direction)` is a radial height shell with only one
surface per direction. It cannot express caves, overhangs, tunnels, underground
rooms, or conserved excavation. Its current visual/collision agreement is worth
preserving as a principle, not as the final representation.

V2 terrain is:

```text
versioned procedural solid geology + sparse accepted edits
  = authoritative material field
```

A body-local query returns solid/void state, signed distance, material,
composition, density, strength, mineability, and revision. The generator
provides strata, faults, resource bodies, natural caves, and immutable deep
material without storing a planet-wide voxel array. Sparse chunks exist around
exposure, excavation, construction, and damage.

Rendering, collision, navigation, structural support, mining yield, deposits,
and AI spatial queries use the same accepted chunk revision. Edited volumetric
chunks replace—not overlay—the corresponding legacy surface tile.

### 5. Conserved matter and physical custody

Digging, loading, transfer, dumping, manufacturing, damage, and repair conserve
material. Excavation removes a measured volume and creates material lots with
mass, composition, origin, ownership, custody, and location. Loose piles are
aggregate physical entities; phones do not network one rigid body per grain.

A transfer completes only after physical placement, server custody change,
audit commit, and source/destination reconciliation agree.

### 6. Component-and-connector assemblies

Ships, buildings, stations, vehicles, machines, cargo, and infrastructure are
graphs of persistent components. Nodes own mass, materials, bounds, collision,
state, and render variants. Edges represent structural and system connections:
welds, bolts, hinges, foundations, sockets, power, fuel, coolant, data, and
atmosphere.

Damage resolves against exact components and material layers. It can perforate,
deform, jam, sever system paths, breach compartments, break support, and detach
connected subassemblies. A significant detached part becomes a persistent
entity with identity, mass, momentum, ownership, contents, provenance, and
salvage value.

Global flight retains explicit f64 integration. Bounded rigid-body solvers may
run in rebased local physics islands for cargo, vehicles, debris, and detached
parts after real-device measurement. No float32 physics world runs at planetary
coordinates.

### 7. Physical-state materialization

Semantic server state must become observable physical state. The materializer
projects accepted state into doors, checkpoints, patrols, signs, cargo,
construction stages, damage, workers, traffic, stock, services, and routes. It
does not decide gameplay.

Every slice maintains an `observableStateContract` mapping consequential state
keys to physical projectors and acceptance tests. With the HUD closed, a player
at the affected location must be able to see, hear, traverse, or physically
encounter the local consequence.

### 8. Exact spatial graph

Sites begin with measured functions and connection anchors, not scattered
meshes. Landing pads, buildings, doors, docks, loading bays, utilities, and
restricted volumes reserve exact parcels. Roads and utilities connect those
anchors. Surface mesh, grading, drainage, collision, vehicle lanes, pedestrian
routes, signs, checkpoint sockets, and AI navigation derive from the same graph.

Buildings derive exterior shell, reachable rooms, doors, pressure zones,
collision, navigation, and support contacts from one blueprint. Every
usable-looking door leads somewhere; explicitly sealed doors look sealed.

## Simulation fidelity

Canonical continuity does not disappear when no player is watching:

- **Hot:** full local interaction, movement, combat, doors, cargo, and terrain.
- **Warm:** reduced-cadence nearby routes, stations, production, and conflicts.
- **Cold:** deterministic analytic progression with retained identity, route,
  cargo, fuel, damage, and schedule.

Approaching a cold convoy materializes it at the position and state implied by
its history. It never teleports to an arbitrary spawn portal.

## AI boundary

The AI Director receives a redacted immutable snapshot and returns one bounded,
schema-valid proposal. It has no database credentials, raw execution surface,
or direct write authority. Accepted proposals pass the same validator and audit
path as other commands. Custodian and YOM planning is deterministic and
capability-bounded.

## V1 migration inventory

Preserve after validation:

- f64 camera-relative rendering
- body IDs and useful registry structure
- radial orientation and traversal concepts
- continuous surface/space movement
- modular ship-state migration data
- responsive touch controls

Replace deliberately:

- radial shell terrain and outer-surface clamps
- random generated settlement placement and roads
- hand-maintained visual/collider duplication
- primitive sealed buildings
- invented faction data
- localStorage as canonical persistence
- client-authored multiplayer movement and transport
- random scalar damage
- separate desktop world scale/product route

Detailed contracts live in `docs/architecture/`.
