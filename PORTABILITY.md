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

## Deploy — LIVE at heartbeatobservatory.com/games/syl (required step)

The public build lives inside Jaron's website repo
**github.com/JaronKBragg7337/heartbeat-observatory** (Vercel auto-deploys its
`main` branch to heartbeatobservatory.com). The game is a static copy at
`games/syl/` there, plus a card on `games/index.html`.

To ship a new build (after `npm test` is green and you've committed here):
```
git clone https://github.com/JaronKBragg7337/heartbeat-observatory /tmp/hb
rm -rf /tmp/hb/games/syl && mkdir -p /tmp/hb/games/syl
cp -r index.html lib src /tmp/hb/games/syl/
cd /tmp/hb && git add -A && git commit -m "SYL: sync build <version/commit>" && git push
```
Vercel deploys automatically (~1 min). Verify at
https://heartbeatobservatory.com/games/syl/ — boot + one interaction + no
console errors. Only `index.html`, `lib/`, `src/` ship; docs/tests/server stay
in this repo. Note: localStorage saves are per-origin — players on the site
keep separate progress from localhost. ROADMAP M6 has the automation task.

Other static hosts (GitHub Pages, itch.io) also work if ever needed.

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
| planet.js analytic terrain | `SurfaceTileManager`/`ProcTerrainTile` sampling ONE height fn; giant mesh = visual only, NoCollision (proven, 2d/2