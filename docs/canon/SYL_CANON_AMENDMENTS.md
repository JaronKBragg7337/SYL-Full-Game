# Space You Land — Canon Amendments

This file supplements the locked v3.0.1 Bible. Never edit, reorder, or remove
an accepted amendment. A correction is a new amendment that identifies what it
supersedes. Add each newest accepted amendment at the top of the amendment list.

## SYL-CA-2026-08-15-04 — Spatial and asset truth

Accepted by Jaron K. Bragg on 2026-08-15.

- Nothing is placed without an exact coordinate frame, dimensions, footprint,
  supports, clearances, attachments, material assignments, collision,
  navigation effect, and stable identity.
- Settlement destinations and building connection points are declared before
  final roads.
- Terrain grading, roads, utilities, doors, docks, loading sockets, vehicle
  lanes, and AI navigation derive from one authoritative spatial graph.
- AI does not infer roads or structures from pixels.
- Assets require readable silhouettes, secondary and tertiary construction
  detail, realistic proportions, component-specific PBR materials, roughness
  variation, seams, fasteners, wear, decals, and anti-tiling.
- External textures must be CC0 with recorded source, license, and checksum.
  Original authored materials are allowed.
- Moving parts animate from their actual physical joints and state.

## SYL-CA-2026-08-15-03 — Physical assemblies and damage

Accepted by Jaron K. Bragg on 2026-08-15.

- Gameplay-relevant assets are assemblies of persistent components connected
  by explicit joints, fasteners, welds, sockets, pipes, cables, seals, or other
  appropriate connections.
- Damage depends on impact location, energy, angle, material, component, and
  connection state.
- Failed connections can detach components. Detached parts retain identity,
  mass, momentum, ownership, contents, damage history, and salvage or repair
  value.
- Impacts can deform or excavate terrain, create persistent craters, alter
  collision/navigation/support, and displace material.
- Damage scale must match the event: small hits chip or scar; sufficiently
  energetic impacts breach, detach, or crater.
- Decorative micro-detail need not become an independent simulation entity
  unless it can move, fail, block, carry something, or affect another system.

## SYL-CA-2026-08-15-02 — Planets are material volumes

Accepted by Jaron K. Bragg on 2026-08-15.

- A planet is not empty beneath a rendered surface.
- Planets contain queryable, persistent material volume: soil, rock, strata,
  ore, natural voids, caves, tunnels, and constructed underground spaces.
- Players can excavate with appropriate tools, create tunnels and underground
  bases, transport removed material, dump it elsewhere, and use it as fill.
- Excavated matter retains measured volume, mass, composition, location, and
  custody.
- A deep unmineable mantle/core boundary is allowed, but it must exist as a
  material rule rather than empty space or an unexplained invisible wall.
- Terrain rendering, collision, navigation, structural support, and server
  state must describe the same accepted terrain revision.

## SYL-CA-2026-08-15-01 — Permanent runtime and delivery

Accepted by Jaron K. Bragg on 2026-08-15.

- The released and continuing SYL product is the Three.js browser game.
- Unreal Engine and Unity are not target runtimes.
- In Bible section 12, “Unity snapshot” now means “Three.js client snapshot”;
  every server-validation and AI-authority restriction remains unchanged.
- The canonical public entrypoint is exactly
  `https://www.heartbeatobservatory.com/games/syl/`.
- `SYL-Full-Game` is the source repository;
  `heartbeat-observatory/games/syl/` is its deployed website mirror.
- There is one responsive game with mobile controls, not separate phone and PC
  products.
- Phone is a complete, full-fidelity target. Do not remove fidelity based on
  assumed mobile limits. Measure the deployed game on Jaron's physical phone,
  identify the actual bottleneck, and optimize that bottleneck without
  removing state-bearing physical detail.
- The separate desktop experiment is on hold and preserved.
