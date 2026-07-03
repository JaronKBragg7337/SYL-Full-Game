# AGENTS.md — For Any AI Agent (Claude, Codex, Opus, Gemini, future models)

This repository is AI-built and AI-maintained, owned by Jaron (does not code —
describe results to him in plain language, ask him for feel tests only).

Read in this order before doing anything:

1. **CLAUDE.md** — operating rules and session protocol (generic agent manual;
   named for Claude Code auto-load, applies to every model)
2. **HANDOFF.md** — session log; the TOP entry is the current state
3. **VISION.md** — what SYL is; the design laws you may not break
4. **ARCHITECTURE.md** — why things are built this way (evidence-backed;
   don't "improve" these away)
5. **DECISIONS.md** — what is real vs approximated, and what each approximation's
   replacement path is
6. **ROADMAP.md** — the backlog; take the top unchecked item of the current milestone

## Non-negotiables, whoever you are

- The game must run at all times. `node server.js` + browser, and `npm test`
  green, before AND after your session.
- **The game is live at heartbeatobservatory.com/games/syl — keep it live.**
  Every finished chunk deploys there (PORTABILITY.md § Deploy). Jaron does not
  want local-only builds: other people play this, and he tests on his phone.
- **Mobile stays playable.** Touch controls (src/ui/touch.js) must keep
  working; check them when you change input or UI.
- **The destination is the official Unreal/Unity game** (VISION.md § The
  official game). This repo is the blueprint/playtest, not the endgame —
  prefer choices that transfer to Unreal.
- **Never** introduce a flat-world assumption, a loading screen, a teleport
  masquerading as travel, or a second terrain-height source.
- **Never** store gameplay positions in mesh positions (floating-origin rule).
- **Never** add a physics engine without reading DECISIONS.md #3 first.
- The ship stays modular. New ship features extend shipParts/shipBuilder;
  they do not bypass them.
- Registries stay data-driven: new planet = bodies.js entry; new faction =
  factions.js entry; new part = shipParts.js + items.js entries.
- Old saves must keep loading. Bump SAVE_VERSION and migrate in save.js.
- Finish ONE roadmap item fully (implement → `npm test` green → browser-verify →
  document) rather than starting several.
- Before ending: update HANDOFF.md (top entry, use its template) + CHANGELOG.md,
  then commit. Push if credentials exist.

## Session protocol

1. `git status` — if dirty, read HANDOFF top entry; a crashed session may have
   left unlogged work (treat as contamination: verify before trusting).
2. `npm test` — must be green before you change anything.
3. Do your one chunk. Add/adjust tests in `test/run_tests.mjs` for what you build.
4. Verify: `npm test` + run the game and play the affected path.
5. Document: HANDOFF entry + CHANGELOG line + any doc your change invalidates.
6. Commit with a clear message; attribute yourself (`Builder: Claude|Codex|...`).
7. Push if credentials exist. If gameplay changed, deploy the static copy to
   heartbeatobservatory.com/games/syl using PORTABILITY.md.

## Model routing note (from Jaron)

Heavy coding tasks may fall to Opus, Codex, Claude, or future models.
This repo is deliberately structured so that works: the physics that is hard to
re-derive (floating origin, analytic collision, radial-gravity movement,
traversal derivation) is ALREADY BUILT and explained in ARCHITECTURE.md +
header comments. When extending those systems, copy their patterns; do not
re-derive from scratch.
