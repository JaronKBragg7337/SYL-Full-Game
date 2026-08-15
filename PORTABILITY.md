# PORTABILITY.md — Run, Deploy, and Recover SYL

## Repository ownership

- Canonical game source:
  `https://github.com/JaronKBragg7337/SYL-Full-Game`
- Website/deployment repository:
  `https://github.com/JaronKBragg7337/heartbeat-observatory`
- Canonical public game:
  `https://www.heartbeatobservatory.com/games/syl/`

The website repository's `games/syl/` directory is a deployed mirror. Never
develop a gameplay change only in that mirror and leave the source repository
behind.

## Run the current client locally

Requirements: Node 18 or newer and a browser.

```text
git clone https://github.com/JaronKBragg7337/SYL-Full-Game.git
cd SYL-Full-Game
node server.js
npm test
```

Open `http://localhost:8377/`. The current Three.js dependency is vendored. The
local Node server only serves the client; it is not the future authoritative
universe backend.

## Production delivery

A gameplay change is complete only when:

1. The intended source is committed and pushed to `SYL-Full-Game`.
2. Relevant tests and browser checks pass.
3. The canonical client files are deterministically synchronized into the
   Heartbeat repository's `games/syl/` mirror.
4. That website-repository change is committed and pushed.
5. The exact public URL returns successfully without authentication and the
   changed flow is exercised without console/network errors.
6. Phone-facing work is tested by Jaron on his physical phone.

Vercel currently deploys the website repository's `main` branch. Do not claim a
source-repository push changed production until the website mirror and public
URL have both been verified.

The current client mirror consists of `index.html`, `lib/`, `src/`, and the
approved contents of `assets/`. `desktop.html`, `src/desktop/`, and
`assets/desktop/` are legacy/on-hold experiment files, not a second product
that future sync automation should promote.

The repository still needs a checked deterministic sync tool. Until that tool
exists, compare source and destination manifests before copying, review the
website diff, and stage only the intended `games/syl/` files. Never run an
unverified recursive delete against a computed path.

## Preview safety

`/games/syl-test/` is not approved V2 staging. It shares the production origin,
and the legacy client defaults to the same `syl_save` key. A future preview must
have an isolated route or origin, save namespace, backend environment, audit
state, and deployment verification before it receives risky world changes.

## Authoritative services

The Three.js client may remain statically hosted while authenticated,
authoritative universe services run separately. Static hosting does not mean
the full game is client-authoritative or permanently “fully static.” Service
topology follows `docs/architecture/SERVER_AUTHORITY.md`.

## Disaster recovery

All source, canon, migrations, deployment tooling, and generated-asset recipes
belong in git. Canonical server state will require database backups, immutable
audit checkpoints, content-addressed terrain/entity snapshots, and tested
replay recovery in addition to source control.

The current V1 `node_modules/three` test shim is generated and ignored; `npm
test` recreates it.
