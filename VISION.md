# VISION.md — What Space You Land Is

This is Jaron's game. It has been in his head since he was 15. Do not shrink it.

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
5. **"Fixed" is measured, not screenshotted.** Acceptance = automated checks
   (this repo: `npm test`) plus Jaron's feel tests.

## Where this foundation fits

This browser build is the **architectural proof and playable spine** of SYL:
every hard problem that killed earlier attempts (planetary coordinates, seamless
traversal, radial gravity, modular ships) is solved here in its simplest honest
form, with the same architecture the Unreal build uses (see PORTABILITY.md for
the mapping). Content is placeholder; **structure is canon**.

The long arc: this foundation → richer terrain/ship-builder/economy → persistent
multiplayer server → the shared-galaxy SYL. ROADMAP.md is the staircase.
