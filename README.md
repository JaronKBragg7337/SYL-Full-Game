# SYL — Space You Land

Space You Land is a permanent Three.js browser game: a server-authoritative,
persistent 3D galaxy where players physically fly, walk, trade, fight, build,
govern, excavate, transport material, damage infrastructure, and rebuild the
world they change.

**Play the public game:** https://www.heartbeatobservatory.com/games/syl/

**Source repository:** https://github.com/JaronKBragg7337/SYL-Full-Game

The browser game is the full product. It is not an Unreal Engine or Unity
prototype. There is one responsive Three.js client with mobile controls. Phone
is a primary, full-fidelity target; desktop browsers run the same game.

Read [`CANON.md`](CANON.md) before interpreting the code or changing the game.
The locked universe Bible and accepted amendments outrank old handoffs, tests,
comments, and current implementation details.

## Current state

The live V1 build is a useful planetary-traversal prototype now being rebuilt
in this repository as SYL V2. V1 proves several reusable techniques:

- f64 world positions with camera-relative Three.js rendering
- radial walking and planetary gravity
- continuous surface-to-space-to-surface travel
- data-driven celestial bodies
- modular ship state
- touch and keyboard/mouse controls

V1 is not the finished design. Its scattered surface dressing, fake roads,
sealed primitive buildings, placeholder factions, localStorage authority,
client-broadcast multiplayer, radial shell terrain, and randomized scalar ship
damage are migration debt. Do not treat them as canon or extend them as the V2
world model.

The separate `desktop.html` route is a preserved, on-hold experiment. It is not
a PC edition, not a higher-fidelity destination, and not a second product lane.
Future work targets the one responsive game launched by `index.html`.

## Run locally

Requirements: Node 18 or newer and a browser. Three.js is vendored, so no
package installation is required.

```text
node server.js
```

Open `http://localhost:8377/`. On Windows, `START_GAME.cmd` does the same thing.
Localhost is for development; the public URL is the handoff target.

## Current live V1 loop

The public build currently spawns the player near a damaged ship on Earth. The
player can gather salvage, repair and fuel the modular ship, launch without a
loading screen, fly between bodies, land, discover zones, craft items, ride a
client-simulated transport, and save locally.

This loop remains available while V2 replaces its presentation and authority
in deliberate slices. Current map dressing is disposable. Planet identities,
useful traversal math, and stable migration data are preserved where they pass
the new contracts.

## Controls in the current build

**On foot:** WASD move · Shift run · Space jump · E interact/board · F gather

**Ship:** W/S forward/reverse · A/D strafe · Q/R turn-bank · arrows pitch ·
Space climb · Z descend · X/Ctrl brake · G gear · C camera · V interior view ·
T door/ramp · E exit when landed

**Panels:** B ship builder · I inventory · M bodies · O settings · H help ·
F5 save · F9 load

Touch controls appear automatically. Phone behavior is verified on the actual
deployed page and Jaron's physical phone, not inferred from desktop emulation.
No feature or fidelity is removed merely because the client is on a phone.

## Verify the repository

```text
npm test
```

The headless suite checks the current V1 implementation. Passing it prevents
regressions, but it does not prove the locked Bible is implemented. Every V2
slice must add acceptance tests for server authority and for the physical world
consequence a player can witness.

## V2 foundation order

1. Canon, repository truth, and deterministic source-to-site delivery.
2. Coherent world scale, stable IDs, spatial addressing, and authoritative
   server command/audit contracts.
3. Solid volumetric planets with strata, caves, persistent edits, and conserved
   excavated material.
4. Component-and-connector asset assemblies with location-aware damage,
   detachment, pressure, power, and salvage consequences.
5. One Fortis Recovery Corridor proving a walkable ship, physical cargo, a
   graded road, real interiors, Custodian containment, YOM reconstruction, and
   persistent visible change.
6. Broader economy, governance, territory, factions, stations, fleets, storms,
   Cognitive Frameworks, and expansion after the foundational laws hold.

See [`ROADMAP.md`](ROADMAP.md) for acceptance gates and sequencing.

## Repository map

| Area | Location | Truth today |
|---|---|---|
| Canon index | `CANON.md` | Governing precedence |
| Locked Bible and amendments | `docs/canon/` | Product canon |
| V2 architecture contracts | `docs/architecture/` | Required target behavior |
| Browser entry | `index.html`, `src/main.js` | Canonical Three.js client |
| Floating-origin rendering | `src/core/engine.js` | Useful V1 foundation |
| Body registry | `src/world/bodies*.js` | IDs/data to migrate and rescale |
| Current shell terrain | `src/world/planet.js` | Legacy V1; not volumetric |
| Current map dressing | `src/world/worldDetails.js` | Disposable V1 presentation |
| Current player/ship traversal | `src/player/`, `src/ship/`, `src/world/traversal.js` | Reuse after V2 validation |
| Current saves | `src/save/save.js` | Legacy local cache, not universe truth |
| Current multiplayer | `src/multiplayer/multiplayer.js` | Visibility only, not authority |
| Legacy desktop experiment | `desktop.html`, `src/desktop/`, `assets/desktop/` | On hold |
| Tests | `test/run_tests.mjs` | V1 regression suite |

## Public delivery

`SYL-Full-Game` is the canonical source repository. The website repository
`heartbeat-observatory` hosts a deployed mirror at `games/syl/`. A finished
gameplay change is not done until both repositories contain the intended source
and the exact public URL has been verified without login.

Do not use `/games/syl-test/` as V2 staging. The current route shares the same
origin and legacy save key as production. V2 needs an explicitly isolated
preview before risky gameplay promotion.

Deployment details live in [`PORTABILITY.md`](PORTABILITY.md).
