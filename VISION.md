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
screens** — chair → ship → dock → station 