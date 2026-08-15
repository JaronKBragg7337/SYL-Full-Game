# CLAUDE.md — Repository Operating Manual

This file is auto-loaded by Claude Code but applies to every model working in
the repository.

Project: **SYL — Space You Land**, the permanent Three.js browser game

Owner: Jaron K. Bragg
Public game: https://www.heartbeatobservatory.com/games/syl/

Read `CANON.md`, the canon sources it lists, and `AGENTS.md` before acting.

## Run and verify

- Start the current client: `node server.js` → `http://localhost:8377/`
- Test: `npm test`
- Three.js is currently vendored through the import map.
- Localhost is development-only. Public gameplay handoff uses the canonical URL.

## Product and client rules

- Three.js/web is the finished-product runtime, not a temporary porting lane.
- One responsive client serves phone and desktop browsers. Phone with touch
  controls is the primary reference experience.
- Never cut fidelity merely because a feature runs on a phone. Measure the
  deployed game on Jaron's physical device before making a performance claim.
- `desktop.html` is a legacy/on-hold experiment and receives no new product work
  unless Jaron explicitly revives it.

## State and physical-world rules

- The current V1 client is not server-authoritative. Its localStorage saves,
  local movement, transport, and Realtime broadcasts are legacy implementation.
- V2 clients submit intentions; authoritative services validate and commit
  consequential state; Three.js renders accepted outcomes.
- Gameplay positions use f64 world/body/local frames. Mesh transforms are
  render projections only.
- The V1 `terrainRadiusAt()` shell is not the V2 terrain contract. V2 planets
  are procedural solid geology plus sparse persistent edits, supporting caves,
  tunnels, underground construction, craters, and conserved material.
- Assets are measured component assemblies with stable identities, connectors,
  material zones, collision, navigation effects, and state-driven animation.
- Global planetary motion keeps the custom f64 integration pattern. Local,
  rebased rigid-body islands may be introduced after measurement for detached
  parts, cargo, vehicles, and other bounded physical interactions.
- Old saves and stable IDs require explicit migration; do not silently reinterpret
  them.

## Repository structure

- One owned system per module; keep `src/main.js` focused on bootstrap and loop
  ordering.
- Registries remain data-driven, but V1 placeholder data does not become canon
  through reuse.
- New assets follow `docs/assets/ASSET_PROVENANCE.md`.
- New server/world work follows `docs/architecture/SERVER_AUTHORITY.md` and
  `docs/architecture/PHYSICAL_WORLD_CONTRACT.md`.

## Done means

1. Relevant automated checks pass.
2. The affected path is browser-verified without console/network errors.
3. Phone-facing work is tested on the deployed URL and handed to Jaron for the
   physical-device feel check.
4. `HANDOFF.md`, `CHANGELOG.md`, and any invalidated active docs are updated.
5. Source is committed and pushed. Gameplay changes are synced to the website
   repository and the canonical public URL is verified.
