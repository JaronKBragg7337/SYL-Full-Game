# SYL — Space You Land (Foundation Build)

The hard playable foundation for **Space You Land**: a world-scale space game with
multiple planets, real surface→space→surface traversal (no loading screens, no
teleports), a modular piece-by-piece ship, factions, and persistence.

Built by Claude (Fable 5) for Jaron, 2026-07-03, as the bridge foundation other
agents (Claude, Codex, Opus) continue. **Read AGENTS.md before touching anything.**

## Play it

**Live (anyone, any device incl. phones):** https://heartbeatobservatory.com/games/syl/

Local dev (Windows, zero installs beyond Node): double-click **`START_GAME.cmd`**,
or `node server.js` → http://localhost:8377. Click the game for mouse control;
on touch devices the joystick/buttons appear automatically.

**The bigger picture:** this repo is the living blueprint and public playtest
for the official SYL game (Unreal/Unity — see VISION.md "The official game"
and ROADMAP Milestone 7). Target: EVE-style planet-to-planet open world,
KSP-style ship building, DayZ/ARC Raiders/Battlefield-style PVP.

## The loop that exists right now

You spawn on **Earth** at the **Fortis Outpost**. Your gunship on the pad is damaged:
dead engine, missing power cell, missing landing gear, empty tanks.

1. **Gather** the salvage crates around the outpost (walk up, press **F**).
2. **Repair & build** at the ship (press **B**): repair the engine with alloy, install
   the power cell and gear strut, load hydrazine fuel. The builder shows honest
   readiness: mass, thrust, TWR, power budget.
3. **Board** (**E**) and take off — **W** throttles up, **Space** gives vertical thrust.
4. Climb through the atmosphere — sky thins into starfield, continuously.
5. Open the body map (**M**), burn toward the **Moon** (or **Rustholm**), brake with
   **X** on approach, descend, and land gently (under ~16 m/s or you damage modules).
6. Landing at a marked zone **discovers** it — faction contact, salvage reward, autosave.
7. **F5** saves, **F9** loads, autosave every 60 s.

## Controls

On foot: **WASD** move · **Shift** run · **Space** jump · **E** board · **F** gather
Ship: **W/S** throttle · **mouse** pitch/yaw · **Q/A** roll · **Space** vertical thrust ·
**X** brake · **G** gear · **C** camera · **E** exit (landed)
Panels: **B** ship builder · **I** inventory · **M** bodies · **H** help · **F5/F9** save/load

## Verify it works

```
npm test        # 32 headless checks incl. a full Earth→space→Moon-landing sim
```
Manual pass: see HANDOFF.md → "How to verify".

## Where everything lives

| System | File |
|---|---|
| Game loop / bootstrap only | `src/main.js` |
| Renderer + **floating origin** | `src/core/engine.js` |
| Noise/terrain math (single source of truth) | `src/core/math3d.js` |
| Planet/body **data registry** | `src/world/bodies.js` |
| Terrain, gravity, atmosphere, analytic collision | `src/world/planet.js` |
| World progress state | `src/world/worldState.js` |
| Surface⇄space **state machine** | `src/world/traversal.js` |
| On-foot radial-gravity player | `src/player/player.js` |
| Ship entity + 6DOF flight | `src/ship/ship.js` |
| **Modular ship parts/slots** | `src/ship/shipParts.js` |
| Install/remove/repair/refuel | `src/ship/shipBuilder.js` |
| Faction registry + standings | `src/factions/factions.js` |
| Items / inventory | `src/items/items.js`, `src/inventory/inventory.js` |
| Save/load (localStorage, backend-ready) | `src/save/save.js` |
| HUD/panels | `src/ui/ui.js` |
| Touch controls | `src/ui/touch.js` |
| Headless tests | `test/run_tests.mjs` |

## Docs

`VISION.md` (what SYL is) · `ARCHITECTURE.md` (why it's built this way) ·
`AGENTS.md` + `CLAUDE.md` (how agents work here) · `HANDOFF.md` (session log) ·
`ROADMAP.md` (what's next) · `DECISIONS.md` (real vs approximated — read this) ·
`PORTABILITY.md` (moving/deploying/live-site sync) · `CHANGELOG.md`.
