# SYL Physical World Contract

Status: Required V2 architecture

Derived from: Bible section 1.1 and accepted canon amendments

## Physical-world law

Every consequential state has five linked records:

1. authoritative semantic state
2. stable entity IDs and spatial addresses
3. physical world projection
4. collision/navigation/support consequences
5. append-only event explaining the change

With the HUD closed, a player at an affected location must be able to see,
hear, traverse, or physically encounter the consequence of every major local
system. Secret state need not be publicly revealed, but it must leave
appropriate physical evidence somewhere.

## Identity and measurement

World units are metres. Server transforms use f64 hierarchical frames; client
geometry is float32 relative to a local origin. Runtime structural scale is
1.0. Every gameplay asset records:

- immutable entity, inspection, template, parent, and frame IDs
- transform, state revision, measured and grounded bounds
- mass, volume, pivot, allowed rotation/scale, and support contacts
- occupancy, clearance, collision hulls, connectors, apertures, and snap points
- rooms, pressure zones, navigation nodes, and material IDs
- LOD/animation IDs, owner/custody/access/security state, and provenance

Authored dimensions are expectations; measured post-build bounds are evidence.
Doors, controls, cargo, docking interfaces, and other precision interactions
must keep visible and physical state within 0.05 m unless a stricter connector
tolerance applies.

## Terrain and matter

The planet is a deterministic solid material field with sparse persistent
edits. It supports layered geology, caves, tunnels, underground rooms,
excavation, deposits, collapse, construction, and impact craters. A deep
immutable material boundary is allowed.

Excavation creates material lots with fixed-unit mass, loose volume,
composition, density, porosity/moisture where relevant, origin event, current
parent, ownership, and custody history. Dumping creates a physical pile or
accepted additive terrain edit. Compaction and construction consume that same
material. Matter never appears from a client inventory shortcut.

Terrain render mesh, authoritative collision, navigation, support data, and AI
connectivity share one accepted chunk revision.

## Roads and sites

Roads are infrastructure records, not textured boxes. One centerline/profile
dataset produces grading, surface, markings, shoulder/curb/drainage, collision,
vehicle lanes, pedestrian routes, signs, checkpoint sockets, condition, and
damage. AI vehicles use those same lanes.

Destinations and connection anchors are declared before final roads. Buildings
then occupy reserved parcels with measured setbacks, support, utilities,
entrances, loading interfaces, and reachability.

## Buildings, ships, stations, and docks

- Reachable buildings have real interiors in the same volume as the exterior.
- Every usable-looking door is a registered aperture leading to reachable space.
- Shell, rooms, slabs, doors, windows, pressure zones, collision, navigation,
  and support derive from one blueprint.
- Ships use one dimensional model for exterior and walkable interior. Characters
  and cargo occupy the moving ship frame while aboard.
- Docks declare approach/capture/keep-out/service volumes, connector frames,
  envelope/mass limits, clamps, umbilicals, pressure relationships, occupant,
  and access revision.
- Docking is physical: request → approach authorization → capture/landing →
  gear/clamps → services → pressure equalization → airlock → cargo route.
- Stations apply the same rules at compartment scale with portal streaming that
  never breaks physical continuity.

## Assemblies, animation, and damage

Every state-bearing moving or destructible part declares component ID, parent,
pivot/axis, transform limits, mass/material/collision, driver state, system
connections, and failure behavior. One state drives visual motion, physics,
collision, navigation, sound, light, and effects.

Damage resolves hit component, material layers, angle, energy, penetration,
impulse, heat, breaches, and connector failure. Detached significant components
become persistent entities with inherited momentum, ownership, contents,
history, and salvage value. Tiny fragments may be visual aggregates if their
material total remains accounted for.

## Asset and material quality

Assets require mechanically or architecturally assembled silhouettes,
secondary and tertiary construction detail, real proportions, seams, guards,
fasteners, utilities, state-driven motion, and component-specific PBR materials.

External textures require CC0 provenance, checksum, source size, real-world
repeat scale, mapping method, and recorded modifications. Materials identify
albedo, normal, roughness, AO, metalness, color space, and lifecycle. Moving
assets use object-stable mapping; static world geometry may use world projection.

LOD and streaming may simplify geometry, update rate, and unloaded detail.
They may not remove ownership, damage, access, quarantine, emergency, cargo, or
other state-bearing cues. Performance claims require measurement on the actual
deployed client and Jaron's physical phone.

## Required validation

- zero unexplained floating/buried assets or illegal intersections
- zero blocked usable apertures or connector gaps outside tolerance
- deterministic stable IDs and legal transforms
- spawn-to-required-room, ship-to-pad, pad-to-site, cargo-loader, convoy, and
  authorized/restricted path proofs
- conserved cargo/material through transfer, damage, excavation, and repair
- same state after reload, reconnect, second client, and deterministic replay
- no visual/physical transform lag for moving components
- 100% `observableStateContract` coverage for the current slice
- browser, network, console, scene-report, and real-phone verification at the
  canonical public URL
