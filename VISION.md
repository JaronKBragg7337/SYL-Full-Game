# VISION.md — What Space You Land Is

This is Jaron's game. It has been in his head since he was 15. Do not shrink it.

## Reference games (Jaron, 2026-07-03) — the tone target

SYL is a SERIOUS game, not a toy. Aim at this blend:

- **EVE Online** — the open-world, planet-to-planet persistent universe:
  territory, factions, economy, consequence.
- **Kerbal Space Program** — the building aspect: ships assembled piece by
  piece, engineering that matters, flight that is earned.
- **DayZ / ARC Raiders / Battlefield** — the PVP layer: tense, survival-
  flavored, skill-based combat between real players.

Every feature decision should be checkable against those four: does it make
the universe more consequential (EVE), the building more real (KSP), or the
player-vs-player stakes higher (DayZ/ARC Raiders/Battlefield)?

## The official game (read this, future AIs)

**The end product is an official, high-fidelity game — that means Unreal
Engine (or Unity), not a browser.** Jaron has UE 5.8 installed and the
SpaceYouLand/Kurearthis repos are the Unreal lane with proven planetary-scale
physics groundwork.

This repo's role in that plan: it is the LIVING BLUEPRINT and PUBLIC PLAYTEST.
Systems are designed, balanced, and proven here first (cheap, fast, testable,
playable by anyone at heartbeatobservatory.com/games/syl — including on
phones); the Unreal build then ports proven architecture instead of guessing
(PORTABILITY.md maps every system 1:1). Work here is never wasted — it is the
specification the official game is built from. But do not confuse the
blueprint for the destination: when a choice arises between "nice for the web
demo" and "right for the official game," choose the official game.

**Hosting rule:** the game is LIVE-HOSTED, never local-only. Jaron wants
others to try it and to test on his phone. Every change ships to the live URL
(see PORTABILITY.md deploy section). localhost is a dev convenience only.

## The one paragraph (canon, from the SpaceYouLand repo)

Persistent, **first-person**, shared-galaxy space game. **Menus observe reality;
they don't replace it.** You are a body; ships and stations are walkable places;
cargo is physical; crew are positioned actors. **Seamless scale, no loading
screens** — chair → ship → dock → station → planet → atmosphere → space → orbit →
another real world. **The world is built, not spawned**: structures are made by
machines and labor, visibly, over time; Builder is a full role. Multiple playable
factions; **Fortis** (Militaristic Empire — armored, practical, serious, steel +
red) is the first slice. Everything authored from scratch; no premade asset packs.

## Design law (never violate)

1. **Relate to reality 100%.** No visual/menu/teleport fake where a physical
   system is intended. Taking longer is acceptable.
2. **SYL is a REAL SOLAR SYSTEM** — multiple real planets players physically fly
   between, eventually mapped to our actual solar system. Never build for "one
   planet." Every planet is data; the way one is built is the pattern for all.
3. **Planet first, then place things ON it** — structures sit on the sphere at
   correct spherical positions with radial "up". One visible-and-physical surface
   per location, never stacked shells.
4. **Ships are built piece by piece.** The ship is never a single disposable
   prefab. Modules, slots, repair, readiness — construction is gameplay.
5. **Factions and persistence are core systems.** New work must preserve faction
   state, discovery, inventory, ship state, and old save loading.
6. **Mobile is a real play path.** The public browser build must stay playable
   on Jaron's phone even while the official Unreal/Unity game is the destination.
7. **"Fixed" is measured, not screenshotted.** Acceptance = automated checks
   (this repo: `npm test`) plus Jaron's feel tests.

## Where this foundation fits

This browser build is the **live blueprint and public playtest** of SYL:
every hard problem that killed earlier attempts (planetary coordinates, seamless
traversal, radial gravity, modular ships, factions, persistence) is solved here
in its simplest honest form, with the same architecture the official Unreal/Unity
game should use (see PORTABILITY.md for the mapping). Content is placeholder;
**structure is canon**. The live URL is
https://heartbeatobservatory.com/games/syl/.

The long arc: this foundation → richer terrain/ship-builder/economy → persistent
multiplayer server → official high-fidelity Unreal/Unity game → the shared-galaxy
SYL. ROADMAP.md is the staircase.
