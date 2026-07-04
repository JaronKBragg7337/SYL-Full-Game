# SYL — Space You Land (Foundation Build)

The hard playable foundation for **Space You Land**: a world-scale space game with
multiple planets, real surface→space→surface traversal (no loading screens, no
teleports), a modular piece-by-piece ship, factions, and persistence.

Built by Claude (Fable 5) for Jaron, 2026-07-03, as the bridge foundation other
agents (Claude, Codex, Opus) continue. **Read AGENTS.md before touching anything.**

## Play it

**Live (anyone, any device incl. phones):** https://heartbeatobservatory.com/games/syl/

Local dev (Windows, zero installs beyond Node): double-click **`START_GAME.cmd`**,
or `node server.js` → http://localhost:8377. That is the default local URL; if
8377 is already busy, agents may test with `PORT=8378 node server.js`, but the
normal documented path stays 8377. Click the game for mouse control; on touch
devices the joystick/buttons appear automatically.

**The bigger picture:** this repo is the living blueprint and public playtest
for the official SYL game (Unreal/Unity — see VISION.md "The official game"
and ROADMAP Milestone 7). Target: EVE-style planet-to-planet open world,
KSP-style ship building, DayZ/ARC Raiders/Battlefield-style PVP.

**Promoted July 4, 2026:** the Kimi expansion content, Heartbeat Realtime
visibility MVP, and ship turning fix are now part of `main` and the public
`/games/syl/` route. The old `/games/syl-test/` lane can stay available as an
unlisted preview lane for future risky changes.

## The loop that exists right now

You spawn on **Earth** at the **Fortis Outpost**. Your gunship on the pad is damaged:
dead engine, missing power cell, missing landing gear, empty tanks.

1. **Gather** salvage crates around the outpost and nearby **Fortis Salvage Yard**
   (walk up, press **F**). Crates are persistent one-shot pickups today; resource
   node respawn is a future system.
2. **Repair & build** at the ship (press **B**): repair the engine with alloy, install
   the power cell and gear strut, load hydrazine fuel. The builder shows honest
   readiness: mass, thrust, TWR, power budget.
3. **Board** (**E**) and take off — **W** throttles up, **Space** gives vertical thrust.
4. Climb through the atmosphere — sky thins into starfield, continuously.
5. Open the body map (**M**), burn toward the **Moon** (or **Rustholm**), brake with
   **X** on approach, descend, and land gently (under ~16 m/s or you damage modules).
6. Landing at a marked zone **discovers** it — faction contact, salvage reward, autosave.
7. Additional bodies/zones carry test crates with
   expanded resources and ship parts.
8. Open **I** for inventory and crafting. Crafting is intentionally simple:
   buttons are enabled only when the carried inputs are present.
9. **F5** saves, **F9** loads, autosave every 60 s.

## Controls

On foot: **WASD** move · **Shift** run · **Space** jump · **E** board · **F** gather
Ship: **W/S** forward/reverse · **A/D** strafe · **Q/R** turn-bank · **↑/↓** nose pitch in high flight · **Z** descend ·
locked forward chase camera · **Space** climb · **X/Ctrl** brake · **G** gear ·
**C** cockpit/chase camera · **E** exit (landed)
Touch ship: hold the left stick to lift while driving/strafe; **BANK L/R** turns
the ship and rolls it; **NOSE UP/DOWN** pitches the ship once safely airborne;
**DESCEND** overrides lift so you can guide the ship down. Ship chase camera is
locked behind/above the nose so turns stay readable.
Panels: **B** ship builder · **I** inventory · **M** bodies · **H** help ·
**Close** button / **Esc** / same key closes panels · **F5/F9** save/load

Builder/dev tools: add `?dev=1` to the URL to reveal the **DEV** button. It can
ready a mobile-safe test ship, give a supply kit, move the ship to you, save, and
toggle fly-person mode for testing. Fly-person uses WASD, mouse/touch look,
Space up, X/Ctrl down, Shift fast. The tools are code-built and phone-safe; no
heavy external assets are required.

## Verify it works

```
npm test        # 65 headless checks incl. controls, touch ship steering, collision, Earth→Moon sim, registries, crafting, dev tools
```
Manual pass: see HANDOFF.md → "How to verify".

## Where everything lives

| System | File |
|---|---|
| Game loop / bootstrap only | `src/main.js` |
| Renderer + **floating origin** | `src/core/engine.js` |
| Noise/terrain math (single source of truth) | `src/core/math3d.js` |
| Planet/body **data registry** | `src/world/bodies.js` |
| Kimi expanded body registry | `src/world/bodies_expanded.js` |
| Terrain, gravity, atmosphere, analytic collision | `src/world/planet.js` |
| World progress state | `src/world/worldState.js` |
| Pickup placement | `src/world/pickups.js` |
| Surface⇄space **state machine** | `src/world/traversal.js` |
| On-foot radial-gravity player | `src/player/player.js` |
| Ship entity + 6DOF flight | `src/ship/ship.js` |
| **Modular ship parts/slots** | `src/ship/shipParts.js` |
| Kimi expanded ship parts/slots | `src/ship/shipParts_expanded.js` |
| Install/remove/repair/refuel | `src/ship/shipBuilder.js` |
| Faction registry + standings | `src/factions/factions.js` |
| Items / inventory | `src/items/items.js`, `src/inventory/inventory.js` |
| Kimi expanded items / crafting | `src/items/items_expanded.js`, `src/crafting/recipes.js` |
| Save/load (localStorage, backend-ready) | `src/save/save.js` |
| HUD/panels | `src/ui/ui.js` |
| Touch controls | `src/ui/touch.js` |
| Dev/editor tools | `src/dev/devTools.js` |
| Headless tests | `test/run_tests.mjs` |

## Docs

`VISION.md` (what SYL is) · `ARCHITECTURE.md` (why it's built this way) ·
`AGENTS.md` + `CLAUDE.md` (how agents work here) · `HANDOFF.md` (session log) ·
`ROADMAP.md` (what's next) · `CONTROLS_CAMERA_VEHICLES_GUIDE.md` (where to wire
ship controls/camera/vehicle behavior) · `DEV_GOD_MODE_ROADMAP.md` (dev tools,
prefabs, snap builder, walk-in vehicles) · `DECISIONS.md` (real vs approximated
— read this) · `PORTABILITY.md` (moving/deploying/live-site sync) ·
`CHANGELOG.md`.
