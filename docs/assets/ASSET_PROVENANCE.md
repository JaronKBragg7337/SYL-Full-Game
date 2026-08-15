# SYL Asset and Material Provenance

Every shipped external texture, model input, sound, image, or reference-derived
material must be legally traceable. Public availability is not a license.

## Allowed sources

- Jaron's original authored work
- repository-authored/generated work with its generator and source retained
- third-party inputs carrying a verified CC0 dedication

Do not ship “free,” attribution-only, editorial-use, unknown-license, scraped,
or AI-training-only material as if it were CC0. Record the exact asset-page URL,
not just a marketplace homepage.

## Required manifest fields

Each source record contains:

```text
assetId
displayName
kind
sourceType                 original | generated | cc0
sourceUrl
creator
license
licenseUrl
licenseEvidenceDate
sourceChecksumSha256
localFiles
modifications
realWorldDimensionsMetres
texturePhysicalSizeMetres
componentMaterialMapping
lodFiles
collisionSource
status                     legacy | draft | prototype | approved
notes
```

Every gameplay-ready asset separately declares stable component IDs, measured
bounds, collision, supports, sockets, apertures, navigation effects, material
IDs, animation joints, and damage/detachment behavior under the physical-world
contract.

## Material requirements

Distinct construction parts receive appropriate materials: foundation, frame,
wall/armor panel, roof, glass, gasket, fastener, door, utility equipment,
markings, grime, and repair. Record albedo, normal orientation, roughness, AO,
metalness, color space, mapping method, measured/estimated repeat scale, and
anti-tiling treatment. Missing maps are explicit `null`, not invented claims.

## Existing V1 assets

The files under `assets/desktop/` are legacy generated experiments produced by
`tools/generate_desktop_glbs.mjs` from primitive geometry. They are not approved
V2 production assets and must not be used as the quality reference.

No current runtime-painted texture or generated primitive is presumed to have
external CC0 provenance. It is repository-generated V1 presentation and is
classified separately from future sourced materials.
