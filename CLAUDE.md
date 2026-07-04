# CLAUDE.md — Operating Manual (all agents; auto-loaded by Claude Code)

Project: **SYL — Space You Land, Foundation Build** (browser/Three.js).
Owner: Jaron. You are his building partner. He tests feel; you build, verify, log.

## How to run
- Play: `node server.js` → http://localhost:8377 (or START_GAME.cmd on Windows).
- Test: `npm test` (headless; includes a full Earth→space→Moon-landing sim).
- No install step. No bundler. `lib/three.module.js` is vendored — import it
  via the import map ('three'); tests use the node_modules shim auto-written
  by test/run_tests.mjs.

## Rules of the codebase
- One system per file, header comment states ownership. main.js is bootstrap +
  loop order ONLY.
- All gameplay positions are f64 world-space; meshes get positions from the
  floating-origin sync in engine.js. Never bypass it.
- Ground truth for terrain is `terrainRadiusAt()` in planet.js. All collision
  and all visuals derive from it. Never add a second height source.
  (Since 2026-07-04 it is MESH-TRUE: it interpolates the rendered mesh's own
  vertex grid, so collision equals the picture exactly. Terrain LOD must keep
  collision sampling whatever the player currently sees.)
- No physics library. Player and ship integrate their own motion (see
  ARCHITECTURE.md for the measured evidence behind this).
- Data-driven registries (bodies, factions, parts, items). Content changes are
  data edits; system changes are rare and documented.
- Saves: bump SAVE_VERSION + migrate; old saves keep working.

## Verification bar for "done"
1. `npm test` green (add tests for new systems).
2. Game boots clean (no console errors) and the affected path plays.
3. HANDOFF.md top entry updated (template inside), CHANGELOG.md line added.
4. Committed. Pushed if credentials exist.

## Talking to Jaron
- Plain language, concrete and visual: what exists, what you verified, what's next.
- Ask him for hands-on feel tests (flight feel, camera, landing difficulty);
  automate everything structural yourself.
- He explicitly welcomes "made by Claude/Codex" signatures and easter eggs.

## Known environment
- Jaron's machine: Windows (MSI), Node 22 available. Unreal Engine 5.8 also
  installed (the separate SpaceYouLand/Kurearthis Unreal lane — see
  PORTABILITY.md for how this foundation maps there).
- GitHub: github.com/JaronKBragg7337 (SpaceYouLand, Kurearthis, fable-survival
  are the sibling repos this foundation was distilled from).
