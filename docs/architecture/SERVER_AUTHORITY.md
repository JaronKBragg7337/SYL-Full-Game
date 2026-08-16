# SYL Server Authority Contract

Status: Required V2 architecture

Derived from: Bible sections 2, 7–12, 15–17, and 21–24

## Governing rule

Clients submit intentions. Authoritative servers produce outcomes. Every
consequential durable change is validated, committed once, audited once, and
projected back into the physical universe.

## Ownership of truth

| State | Sole writer |
|---|---|
| Character, vehicle, combat, doors, local cargo | active authoritative zone |
| Ownership, credits, inventory custody, escrow | asset/economy module |
| Markets, fees, production, upkeep | economy module |
| Elections, seats, treaties, faction membership | governance module |
| Territory, stability, sovereignty stage | regional-system module |
| Evidence, Heat, warrants, detention | enforcement module |
| Custodian/YOM actions | bounded deterministic policy engines through ordinary commands |
| AI Director output | no direct writer; proposal only |
| Three.js client | no canonical write authority |

Spatial/entity leases carry monotonically increasing epochs so two zone workers
cannot write the same entity. Cross-module operations use reservations or
durable workflows. Selling a physical crate reserves that exact crate and the
buyer's funds before custody settles.

## Command envelope and validation

Every consequential command includes actor/session, sequence, idempotency key,
effective tick, target IDs, expected revisions, and ruleset version. Validation
occurs in this order:

1. Authentication, protocol, schema, rate, sequence, and idempotency.
2. Session, relevance, entity ownership, and lease epoch.
3. Role, governance seat, access policy, and capability.
4. Physical feasibility: range, collision, line of sight, mass, fuel, energy,
   tool/weapon state, and cooldown.
5. Conservation and financial checks.
6. Canon laws and hard caps, including neutral-hub guarantees.
7. Optimistic aggregate revision.
8. Atomic state, audit, and outbox commit.
9. Outcome acknowledgement containing tick, aggregate revision, and event ID.

Duplicate or reordered commands produce one result. Stale proposals fail
closed. Corrections are compensating events, never deleted history.

## Data and audit

- PostgreSQL/PostGIS: canonical relational/spatial state and aggregate heads.
- Double-entry ledgers: credits, fees, taxes, escrow, and conserved resources.
- Append-only audit journal: ownership, economy, governance, territory,
  enforcement, AI/system actions, terrain edits, and consequential damage.
- Transactional outbox: state, audit, and outbound event commit together.
- Object storage: immutable snapshots, replay bundles, chunk data, and signed
  audit checkpoints.
- Ephemeral cache/presence: never canonical.

Audit records include event/schema ID, aggregate revision, server time/tick,
actor, region/frame, command/idempotency/correlation/causation IDs, ruleset,
evidence/reason, and previous/payload/event hashes. High-frequency physics uses
bounded telemetry plus meaningful checkpoints; consequential transitions are
audited synchronously.

## Hot, warm, and cold continuity

Hot zones run full local simulation. Warm regions reduce tactical cadence. Cold
regions advance analytically or event-by-event. Fidelity may change; ownership,
custody, causality, route continuity, and history may not.

A cold convoy keeps its route, departure time, velocity profile, fuel, cargo,
damage, and deterministic hazard state. It materializes at the exact implied
position when observed.

## AI Director

The AI service receives immutable, redacted snapshots and returns strict-schema
proposals containing snapshot hash/cutoff, ruleset, one whitelisted command,
bounded arguments/targets, rationale, duration, and expiry. It has no SQL,
service credentials, raw code execution, or general action API.

Adoption order: offline replay → shadow proposals → visible comparison → narrow
canary → bounded automation with kill switch. Replays use the recorded accepted
command and never rerun a model.

Custodians and YOM are deterministic policy engines. Custodians obey staged
authority, systemic budgets, human-seat limits, decay/corruption rules, and
audit. YOM structurally lacks detention, seizure, governance, quarantine,
contraband, and espionage capabilities.

## Core invariants

- one current owner/custodian per asset
- balanced currency ledger
- cargo cannot exist in two locations
- no client-created movement, damage, terrain edit, or payment
- no YOM enforcement command
- no permanent Custodian human seat
- at least one neutral hub per system
- territory changes require recorded evidence
- restart/reconnect reconstructs the same accepted state
- every major local state has a tested physical witness

## First authority gate

One Fortis site, one walkable ship, one dock/pressure door, one physical cargo
lot, one terrain edit, and 2–8 players must survive modified-client attempts,
duplicate commands, reconnect, and zone restart before broader economy or
politics is built.
