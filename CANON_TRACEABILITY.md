# SYL Canon Traceability

This matrix prevents implemented V1 behavior from being mistaken for completed
canon. Status values are `implemented`, `partial`, `legacy-conflict`, or
`absent`. Update a row only with evidence and tests.

| Canon area | Current status | Current evidence or conflict | Required physical/server proof |
|---|---|---|---|
| 1 Universe / physical experience | partial | First-person traversal and physical pickup meshes exist; ships/buildings/stations are not truly walkable | Recovery Corridor can be witnessed with HUD closed |
| 2.1 Server authority | legacy-conflict | Static file server, local simulation, localStorage, client broadcasts | Modified client cannot create movement, damage, cargo, credits, terrain, or ownership |
| 2.2 AI proposal boundary | absent | No Director validator/proposal pipeline | Strict proposal schema, deterministic validator, audit, replay, shadow mode |
| 2.3 No pay-to-win | absent | No monetization system | Entitlement tests prove paid state cannot alter power |
| 2.4 Anyone can matter | absent | No systemic underdog/rebellion loop | Region-scoped opportunity and legitimacy tests |
| 2.5 Neutral enforcement | absent | No evidence/audit/Heat system | Replayable proof bundle and append-only enforcement event |
| 2.6 Continuity | absent | No authoritative persistent universe | Crash/restart/reconnect preserve state and recovery paths |
| 3 Nine factions | legacy-conflict | Seven V1 entries include six invented placeholders; no Custodians/YOM | Canon registry, policy limits, physical faction witnesses |
| 4 Gameplay loops | partial | V1 gather/repair/fly/discover loop only | Personal, faction, asset, shadow, and sanctuary loops use one world state |
| 5 Ships | partial | Modular scalar slots and flight exist | Walkable assembly, ownership, custody, crew, upkeep, capture, physical cargo |
| 6 Stations | absent | Surface structures are not station systems | Traversable station, docks, access, fees, security, market, production |
| 7 Economy | partial | Inventory/crafting resources only | Conserved cargo, ledgers, prices, markets, fees, sinks, physical trade |
| 8 Governance | absent | No seats/elections/coups/approval | Audited governance transitions that alter physical access and services |
| 9 Faction relations | absent | Standing scalar only | Alliances/rivalries/treaties drive validated behavior |
| 10 Momentum | absent | No hourly normalized metric | Reproducible rollup and anti-snowball effects |
| 11 Expansion | absent | Static body ownership | Seeded epoch allocation, costs, territory, and systemic spawn budgets |
| 12 AI Director | absent | Future comment only | Whitelist, clamp, cooldown, neutral hub, audit, fail-closed behavior |
| 13 Ethos Drift | absent | No axes or behavior-derived drift | Region/faction vector changes bounded missions/posture/visuals |
| 14 Solo Crew | absent | No crew actors | Mode-dependent NPC crew, delay/efficiency, Ghost Signature |
| 15 Solo Integrity | absent | No evidence-based collusion system | Replayable detection and logout-persistent escalating penalty |
| 16 Rebellion/enforcement | absent | No rebellion, arbitration, detention, deportation | Logged process with measurable consequences |
| 17 Shadow economy/intel | absent | No black market or intel custody | Freshness, proof, custody, resale penalty, obligations |
| 18 Companion | absent | No companion system | Guidance/narration with mechanically enforced zero authority |
| 19 ISA/BYOK | absent | No entitlement/BYOK system | Client-only key, redacted context, no power benefits |
| 20 PSI | absent | No sanctuary instance | No-production instance and constrained exit inventory |
| 21 Sovereignty Law | absent | No Stability, stages, Heat, Rebuild Credit | Physical Custodian takeover and YOM-aided human reclamation |
| 22 COMMS FALL | absent | No SUN_HEAT/storm system | Thresholds, safe corridor, market/comms localization, persistence |
| 23 Cognitive Frameworks | absent | No regional vector or measurement | Behavior-derived regional vector changes order/scaffolding, never physics |
| 24 Canonical values | absent | Most values not represented | Versioned ruleset tests every locked cap/window/share |
| 25 Philosophy | absent | Current V1 does not measure social stability | Systemic outcomes uphold temporary leadership and recoverability |
| 26 Marketing promise | legacy-conflict | Public build is not yet server-authoritative/persistent | Public description stays honest until gates pass |
| Permanent Three.js client | partial | `index.html` boots Three.js and active direction is corrected; deployed mirror still needs this revision | One responsive client on public phone and desktop browsers |
| Material-volume planets | legacy-conflict | Radial one-surface height shell | Quarry proves strata, cave, tunnel, edit persistence, mass conservation |
| Assembly damage | legacy-conflict | Random module HP and monolithic presentation | Location/material hit, connector failure, persistent detachment |
| Spatial/asset truth | absent | Random scatter, independent roads, and primitive generated assets were removed with their colliders (0.5.0); nothing spatial has replaced them yet | Measured site graph, interiors, shared nav/collision, provenance manifest |

## Completion rule

A row becomes `implemented` only when all of the following exist:

1. authoritative state/schema
2. stable identity and spatial address
3. physical projection
4. collision/navigation/system consequence
5. automated authority and observability tests
6. restart/reconnect parity where persistent
7. verification on the deployed Three.js client
