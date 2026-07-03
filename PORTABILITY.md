# PORTABILITY.md — Moving, Deploying, and the Unreal Mapping

## Run on any machine
Requirements: Node ≥18 (only for the static server + tests) and a browser.
```
git clone <repo> && cd <repo>
node server.js          # → http://localhost:8377
npm test                # headless verification, no browser needed
```
No npm install. Three.js is vendored at `lib/three.module.js` (r160).
Any static file server works (`python -m http.server`, VS Code Live Server…);
ES modules just need http://, not file://.

## Deploy (static host — the fable-survival pattern)
The game is 100% static files. Vercel: import repo, no build command, output
dir = root. GitHub Pages / itch.io (zip upload) also work as-is. localStorage
saves are per-origin: players keep progress per deployment URL.

## Disaster recovery
Everything lives in git. Rebuilding a machine = clone + Node. The only
generated artifact is `node_modules/three` (a 2-file shim auto-written by
`npm test`) — gitignored, recreated on demand.

## The Unreal mapping (for the SpaceYouLand/Kurearthis lane)

This foundation's architecture is deliberately 1:1 with the proven Unreal
pieces, so an Unreal agent can port system by system:

| This repo | Unreal equivalent (exists in Kurearthis/SpaceYouLand) |
|---|---|
| engine.js floating origin | `AFloatingOriginManager` (proven, 2c) |
| f64 world positions | UE Large World Coordinates (64-bit, confirmed to 88M km) |
| planet.js analytic terrain | `SurfaceTileManager`/`ProcTerrainTile` sampling ONE height fn; giant mesh = visual only, NoCollision (proven, 2d/2e) |
| player.js radial movement | `ARadialGravityPawn` custom movement (proven, 2f) |
| ship.js swept integrator | `ASweptGravityBody` pattern: integrate + swept move, no Chaos forces (proven, 2e) |
| bodies.js registry | `BP_SYL_CelestialBody` data-driven fields (exists) |
| traversal.js derived phases | same derivation from altitude/velocity/dominant body |
| shipParts/shipBuilder | modular gunship + per-module components (gunship exists; slots to build) |
| save.js payload | SaveGame object with identical shape |

Kurearthis's hard-won gotchas that MUST carry over: never let a true-scale mesh
provide physics contacts (even query-only blocks sweeps kilometers early);
Chaos `AddForce` integrates 10–100× wrong — drive motion kinematically;
walkable-ship collision law: only hull + landing pads join the rigid body.
