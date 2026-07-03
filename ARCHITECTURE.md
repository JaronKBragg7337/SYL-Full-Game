# ARCHITECTURE.md — Why It's Built This Way

Decisions here are deliberate and mostly EVIDENCE-BACKED by the Kurearthis
Unreal proofs. Don't "improve" them away without a documented reason and a
HANDOFF.md entry. Read DECISIONS.md for the real-vs-approximated ledger.

## The three load-bearing ideas

### 1. Floating origin (camera-relative rendering) — `src/core/engine.js`
GPU vertex math is float32; physics engines are float32 internally. Kurearthis
proved (proofs 2b/2c, measured, logged) that at planetary coordinates
(~6,371 km from origin) stock physics is unusable: forces integrate 10–100×
wrong, bodies get ejected by imprecise contacts. The proven fix is keeping the
ACTIVE REGION numerically small. Here: all authoritative positions are float64
(plain JS numbers), the render camera is pinned at (0,0,0), and every mesh is
placed at `worldPos - cameraWorldPos` each frame. The player can fly millions
of meters with zero jitter. NEVER store gameplay state in mesh positions.

### 2. Analytic terrain = collision AND visuals — `src/world/planet.js` + `src/core/math3d.js`
Kurearthis proved a planet must never be one giant collision mesh (proof 2c/2d:
glitchy contacts, false blocking 1 km above the surface). Instead of streaming
local collision patches (the Unreal answer), the browser build does something
stronger: the ground is a pure function `terrainRadiusAt(body, direction)` —
deterministic noise, float64, valid everywhere at any distance. The rendered
mesh is a picture of that function; collision queries ARE that function.
Visuals and physics cannot disagree. Landing-zone flattening happens INSIDE the
function, so pads are flat in both. If you add terrain detail, you must go
through this one function (LOD meshes sample it; never a second height source).

### 3. Custom double-precision integrators — `src/player/player.js`, `src/ship/ship.js`
Kurearthis proof 2e/2f: motion must be integrated directly (set velocity, swept
move, ground clamp), not driven through a physics engine's force solver. There
is deliberately NO physics library in this project. The player is the ported
RadialGravityPawn: local up = radial, tangential input, gravity integration,
analytic ground clamp, capsule re-orientation tracking the sphere's curvature.
The ship is a 6-DOF integrator: thrust → N-body gravity (every body pulls,
always — "second-body coexistence") → integrate → analytic ground contact with
soft-landing vs crash-damage outcomes.

## Layer separation (one system per file — fable-survival law)

```
DATA:      bodies.js, shipParts.js, factions.js, items.js     (registries — pure data)
STATE:     worldState.js, inventory.js, FactionState, Ship modules   (serializable)
EMBODIMENT:planet.js meshes, ship visual, player body          (pictures of state)
RULES:     shipBuilder.js, traversal.js                        (state transitions)
IO:        engine.js (render+input), ui.js (DOM), save.js (persistence)
WIRING:    main.js (bootstrap + loop order ONLY — never logic)
```
Every module's header comment states what it owns, what it does not own, and
how to extend it. Keep it that way; it's what makes agent sessions cheap.

## The traversal state machine — `src/world/traversal.js`
Modes: ON_FOOT ⇄ PILOTING. Flight phases (LANDED, TAKEOFF, ATMOSPHERE, SPACE,
APPROACH, DESCENT) are **derived from real physical quantities** every frame —
altitude, vertical velocity, dominant body. The machine never sets positions;
it only names what is happening and gates interactions. This is what makes the
no-loading-screens chain real: there is no code path that could teleport you.

## Why browser/Three.js for the foundation?
Runs instantly on any machine (including Jaron's MSI) with zero installs,
which makes every architectural idea testable in minutes, headlessly (`npm test`
simulates the full Earth→Moon trip in Node). The architecture maps 1:1 onto the
Unreal build (PORTABILITY.md has the table). fable-survival proved the repo
pattern; SpaceYouLand carries the canon; Kurearthis supplied the physics truth.

## Why no bundler/framework?
ES modules + an import map + vendored `lib/three.module.js`. Zero build step,
zero npm install, works offline. A bundler earns its place only when the module
count actually hurts (see fable-survival's Vite setup for the pattern then).

## Save format — `src/save/save.js`
Composed from each system's own serialize()/deserialize(). Versioned (v1).
localStorage today; a cloud backend is a transport swap, not a redesign
(fable-survival's Supabase lane is the reference implementation).
