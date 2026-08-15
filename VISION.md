# VISION.md — What Space You Land Is

This is Jaron K. Bragg's game. It has been in development as an idea since he
was fifteen. Do not shrink it into a decorative space demo.

This file is derived from `CANON.md`, the locked v3.0.1 Universe Codex, and its
accepted amendments. Those sources win if this summary ever drifts.

## The product

Space You Land is the permanent, full Three.js browser game hosted at:

https://www.heartbeatobservatory.com/games/syl/

It is a first-person, persistent 3D galaxy where leadership is temporary,
stability is earned, and anyone can matter. Players physically inhabit ships,
stations, planets, settlements, cargo routes, conflicts, governments, and
reconstruction—not menu substitutes for them.

There is one responsive web client. Phone/touch is a primary full-fidelity
experience and the user's physical phone is the acceptance device. Desktop
browsers run the same game. Unreal Engine and Unity are not future destinations.

## The governing experience

If a system matters, a player should be able to witness its effects physically
somewhere in the universe.

That means:

- ownership changes doors, signs, uniforms, patrols, docks, and access
- shortages change physical stock, cargo traffic, queues, and prices
- war damages real components and infrastructure
- Custodian escalation arrives as patrols, checkpoints, restrictions, and
  quarantine equipment
- YOM recovery arrives as relief ships, clinics, supplies, workers, and visible
  construction stages
- cargo and convoys occupy space and retain custody
- ships and stations contain reachable interiors
- rebuilding consumes actual material and changes geometry, collision,
  navigation, services, and governance state

Menus report this reality. They never replace it.

## The universe

The server owns economy, assets, custody, territory, enforcement, damage,
construction, governance, and persistent history. Clients submit intentions and
render accepted results. Enforcement is proof-based and append-only. AI Director
output is proposal-only. Custodians and YOM are bounded server-run NPC systems,
not LLM authorities.

Seven playable factions and two persistent AI robot factions inhabit a living
galaxy. Players trade, build, mine, manufacture, govern, rebel, spy, fight,
reconstruct, own stations, create factions, command fleets, and alter regional
stability. Sovereignty Law, YOM recovery, solar storms, Rebuild Credit, Heat,
Ethos Drift, and Cognitive Frameworks prevent permanent power calcification
without hidden administrator intervention.

No paid feature grants combat power, expansion share, immunity, privileged
intel, or a systemic advantage.

## Physical-world laws

1. **A planet is a solid material volume.** Soil, rock, strata, ore, caves,
   tunnels, underground bases, deposits, and immutable deep material all exist
   in one authoritative terrain model.
2. **Matter is conserved.** Excavated material has volume, mass, composition,
   location, ownership, and custody. It can be carried, loaded, transported,
   dumped, compacted, manufactured, or lost through recorded physical causes.
3. **Geometry is assembled.** Gameplay-relevant assets consist of identified
   components connected by real joints, welds, fasteners, sockets, pipes,
   cables, seals, and supports.
4. **Damage has a location and cause.** Impact energy, angle, material,
   thickness, components, and connections determine penetration, breach,
   detachment, fire, pressure loss, system failure, debris, craters, and salvage.
5. **One spatial truth drives everything.** Terrain, foundations, parcels,
   roads, doors, docks, utilities, vehicle lanes, collision, navigation, and AI
   queries use the same measured coordinates and revisions.
6. **Movement is mechanically honest.** Doors move around real hardware, wheels
   match travel, landing gear contacts terrain, thrusters reflect force, and
   animation never claims work the server says is not occurring.
7. **Materials are specific.** Assets use component-appropriate PBR materials,
   real-world scale, calibrated roughness, construction detail, wear, decals,
   and anti-tiling. External texture inputs are CC0 and provenance-recorded.

## Reference qualities

- **EVE Online:** persistent territory, economy, politics, fleets, and
  consequence.
- **Kerbal Space Program:** ships assembled piece by piece and engineering that
  materially affects flight.
- **DayZ / ARC Raiders / Battlefield:** tense physical combat and meaningful
  loss.
- **Ashgrove:** buildings with spatially truthful, reachable interiors.
- **Rustfall:** recognizable material identity, grounded environments, and
  convincing surface texture.

These references describe qualities, not licenses to copy their content.

## Current implementation

V1 proves f64 camera-relative rendering, radial traversal, continuous planetary
flight, mobile controls, and modular ship data. It does not yet implement most
of this vision. Its shell terrain, generated dressing, fake road layout,
primitive sealed buildings, placeholder factions, local saves, and
client-broadcast presence are explicitly noncanonical migration debt.

V2 is built in this repository and remains Three.js throughout. The first honest
slice is a Fortis Recovery Corridor connected to a volumetric quarry and a
component-damage laboratory. It must prove that authoritative economic,
political, territorial, geological, and reconstruction state becomes physical,
walkable, persistent reality.
