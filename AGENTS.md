# AGENTS.md — Instructions for Every AI Agent

This repository is AI-built and AI-maintained under the direction and ownership
of Jaron K. Bragg. Explain outcomes in plain language. Automate structural
verification and ask Jaron for real-device feel tests when human judgment is
actually required.

## Read before changing anything

1. `CANON.md` — precedence and scope boundaries.
2. `docs/canon/SYL_CANON_AMENDMENTS.md` — accepted decisions after v3.0.1.
3. `docs/canon/SYL_UNIVERSE_CODEX_v3.0.1.md` — locked universe Bible.
4. `CLAUDE.md` — operating rules; despite the filename, it applies to all agents.
5. The newest entry in `HANDOFF.md` — current repository state.
6. `VISION.md`, `ARCHITECTURE.md`, and `DECISIONS.md` — derived product and
   technical contracts.
7. `ROADMAP.md` — current implementation order.

Old code, tests, comments, handoffs, and changelog entries never override canon.

## Product truth

- Space You Land is permanently a Three.js browser game. It is not an Unreal
  Engine or Unity prototype and has no engine-port destination.
- The complete public game lives at
  `https://www.heartbeatobservatory.com/games/syl/`.
- There is one responsive game. Phone/touch is a primary full-fidelity play
  path; desktop browsers run the same client. The old `desktop.html` route is a
  preserved, on-hold experiment, not a product lane.
- Never reduce fidelity based on an assumed phone limitation. Measure the
  deployed game on Jaron's physical phone, identify the actual bottleneck, and
  optimize that bottleneck without removing state-bearing physical detail.
- Fable Survival is a separate game. Its route, product identity, saves, and
  architecture are not SYL canon.

## Non-negotiable system laws

- The server decides canonical economy, ownership, custody, territory,
  enforcement, damage, construction, and persistent world state. Clients submit
  intentions and render accepted outcomes.
- AI Director output is proposal-only. Custodian and YOM behavior is
  deterministic, capability-bounded server simulation, not LLM authority.
- If a system matters, its local consequence must be physically observable.
- Gameplay positions use f64 hierarchical frames. Three.js meshes are local
  projections of state, never the persistence layer.
- A planet is a materially conserved volume. Rendering, collision, navigation,
  support, excavation, caves, and deposits derive from one terrain revision.
- Gameplay-relevant assets are component assemblies with stable IDs and named
  structural/system connections. Damage is location/material/energy aware;
  failed connections may create persistent detached entities.
- Roads, building parcels, doors, docks, utilities, vehicle lanes, and AI
  routes derive from one measured spatial plan. AI never guesses geometry from
  pixels.
- Ships and stations are walkable physical places. Cargo and convoys are
  physical, conserved entities, not menu substitutions.
- External texture inputs must be CC0 with recorded source, license, and
  checksum. Runtime assets require real dimensions, component material zones,
  collision, connectors, and measured LODs.
- No fake travel teleport or loading screen may replace physical traversal.
- Stable V1 IDs and saves require an explicit migration when replaced. Legacy
  local saves are not server authority.

## Physics and performance

- Preserve the proven f64 floating-origin and camera-relative rendering pattern.
- Do not run a float32 physics world at planetary coordinates. Bounded
  rigid-body simulation is allowed inside rebased local frames when a measured
  feature such as detachment requires it.
- Do not allocate a dense voxel planet. Use deterministic procedural geology
  plus sparse persistent edits.
- Rendering, collision, and navigation must never consume different accepted
  revisions of a changed object or terrain chunk.
- Phone performance is established by measurements on the public build and
  Jaron's actual device, not a pre-selected fidelity ceiling.

## Session protocol

1. Run `git status -sb`. Preserve unrelated user changes.
2. Run `npm test` before editing and record the baseline.
3. Complete one coherent roadmap slice with tests.
4. Run `npm test` again and browser-verify the affected public flow.
5. Update the top of `HANDOFF.md`, add a forward entry to `CHANGELOG.md`, and
   correct any active document invalidated by the work.
6. Commit with a plain-language message and the required Codex attribution
   trailer when Codex participates.
7. Push the source-repository change. For gameplay changes, sync the verified
   client into `heartbeat-observatory/games/syl/`, push that repository, and
   verify the exact public URL without authentication.

Do not advertise `/games/syl-test/` as isolated staging. Its current legacy
client shares the production origin and default save key. Use a genuinely
isolated preview only after it is implemented and verified.
