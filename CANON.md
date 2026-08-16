# Space You Land — Canon Index

Owner: Jaron K. Bragg

Canonical public game: https://www.heartbeatobservatory.com/games/syl/

Source repository: https://github.com/JaronKBragg7337/SYL-Full-Game

Deployment mirror: https://github.com/JaronKBragg7337/heartbeat-observatory/tree/main/games/syl

Space You Land is the full, permanent Three.js browser game. It is not a
prototype for Unreal Engine or Unity. Phone/touch is a first-class,
full-fidelity play path. Desktop browsers run the same responsive game.

## Effective canon

Read these sources in this order:

1. `docs/canon/SYL_CANON_AMENDMENTS.md`, newest accepted amendment first, only
   where it explicitly changes or extends an earlier rule.
2. `docs/canon/SYL_UNIVERSE_CODEX_v3.0.1.md`, the locked owner-supplied design
   Bible.
3. `DECISIONS.md`, for implementation decisions that do not conflict with
   canon.
4. `VISION.md` and `ARCHITECTURE.md`, which derive product and technical
   contracts from the sources above.
5. `ROADMAP.md`, implementation status, and current code.
6. `HANDOFF.md` and `CHANGELOG.md`, which are historical records only.

If code, tests, README text, or an old handoff contradicts canon, the code or
document is technical debt. It does not redefine SYL.

## Locked-document rule

`docs/canon/SYL_UNIVERSE_CODEX_v3.0.1.md` is immutable after its preservation
commit. Do not correct, reorganize, modernize, or silently merge later
decisions into it. Record later owner decisions as new append-only amendments.

A replacement Bible version may be created only when Jaron explicitly approves
a new version. The old version remains in the repository.

## Scope boundaries

- Fable Survival is a separate game. Never use its route, code, saves, or
  product identity as SYL canon.
- `desktop.html` and `src/desktop/` are preserved, on-hold experiments. They are
  not the official product, a separate PC edition, or a higher-fidelity
  authority.
- The current V1 code is migration evidence and a source of proven planetary
  traversal techniques. It is not the definition of the finished game.
- The source repository is authoritative for game source. The website
  repository contains the deployed mirror at `games/syl/`.
- `docs/canon/SYL_ORIGINAL_SPACE_GAME_CONCEPT.md` preserves the earlier design
  origin as historical context. It cannot override the Bible or amendments.

## Integrity

The SHA-256 of the locked v3.0.1 Bible is recorded here after its preservation
commit and must be checked before any future canon migration:

`SHA-256: 347b809e9205a574f94b4c624f92f8588fdb74dccafd596585068a54138d57ec`
