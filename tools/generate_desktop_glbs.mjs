import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const OUT = 'assets/desktop';
mkdirSync(OUT, { recursive: true });

const PALETTE = {
  fortisSteel: [0.25, 0.32, 0.32, 1],
  fortisDark: [0.06, 0.08, 0.08, 1],
  fortisRed: [0.62, 0.05, 0.04, 1],
  cockpitGlass: [0.28, 0.78, 1.0, 0.42],
  warmLight: [1.0, 0.38, 0.12, 1],
  padSteel: [0.18, 0.22, 0.24, 1],
  habitatWall: [0.35, 0.40, 0.38, 1],
  crateBlue: [0.20, 0.50, 0.85, 1],
  crateOrange: [0.95, 0.42, 0.10, 1],
};

function box(name, center, size, mat, rot = [0, 0, 0]) {
  return { name, kind: 'box', center, size, mat, rot };
}

function cyl(name, center, radius, depth, mat, axis = 'Y', segments = 24) {
  return { name, kind: 'cylinder', center, radius, depth, mat, axis, segments };
}

const ASSETS = {
  'fortis-gunship.glb': {
    materials: {
      steel: { color: PALETTE.fortisSteel, metallic: 0.35, roughness: 0.48 },
      dark: { color: PALETTE.fortisDark, metallic: 0.45, roughness: 0.55 },
      red: { color: PALETTE.fortisRed, metallic: 0.25, roughness: 0.38 },
      glass: { color: PALETTE.cockpitGlass, metallic: 0.0, roughness: 0.08, alpha: 'BLEND' },
      glow: { color: PALETTE.warmLight, metallic: 0.0, roughness: 0.2, emissive: [1.0, 0.22, 0.04] },
    },
    parts: [
      box('armored_deck', [0, -0.28, -0.25], [3.9, 0.32, 11.6], 'dark'),
      box('keel_spine', [0, -0.74, -0.75], [0.7, 0.36, 9.6], 'dark'),
      box('port_hull_curve', [-2.08, 0.76, -0.45], [0.36, 2.65, 10.9], 'steel', [0, 0, 0.06]),
      box('starboard_hull_curve', [2.08, 0.76, -0.45], [0.36, 2.65, 10.9], 'steel', [0, 0, -0.06]),
      box('roof_armor', [0, 2.1, -0.7], [3.9, 0.32, 8.8], 'steel'),
      box('faceted_nose', [0, 0.32, 5.75], [3.05, 0.8, 0.55], 'steel', [-0.16, 0, 0]),
      box('left_cockpit_glass', [-0.62, 1.35, 4.86], [1.2, 0.09, 1.95], 'glass', [-0.34, 0, 0]),
      box('right_cockpit_glass', [0.62, 1.35, 4.86], [1.2, 0.09, 1.95], 'glass', [-0.34, 0, 0]),
      box('rear_pressure_bulkhead', [0, 1.25, -5.7], [3.65, 2.15, 0.24], 'dark'),
      box('rear_ramp_panel', [0, -0.42, -6.25], [3.35, 0.2, 2.85], 'steel', [-0.26, 0, 0]),
      box('port_wing_root', [-3.45, 0.45, -1.05], [3.2, 0.28, 3.7], 'steel', [0, 0, -0.06]),
      box('starboard_wing_root', [3.45, 0.45, -1.05], [3.2, 0.28, 3.7], 'steel', [0, 0, 0.06]),
      box('red_port_trim', [-2.28, 0.24, -0.45], [0.08, 0.16, 10.4], 'red'),
      box('red_starboard_trim', [2.28, 0.24, -0.45], [0.08, 0.16, 10.4], 'red'),
      cyl('port_engine_can', [-3.75, 0.86, -2.85], 0.72, 3.0, 'dark', 'Z', 32),
      cyl('starboard_engine_can', [3.75, 0.86, -2.85], 0.72, 3.0, 'dark', 'Z', 32),
      cyl('main_nozzle', [0, 0.34, -5.2], 0.58, 0.64, 'glow', 'Z', 32),
      cyl('port_tank', [-1.55, 0.07, -1.1], 0.44, 2.45, 'steel', 'Z', 28),
      cyl('starboard_tank', [1.55, 0.07, -1.1], 0.44, 2.45, 'steel', 'Z', 28),
      box('pilot_seat', [0, 0.34, 3.22], [0.72, 0.36, 0.78], 'dark'),
      box('console_glow', [0, 0.66, 4.17], [1.55, 0.34, 0.78], 'glow'),
      ...[-1, 1].flatMap((sx) => [1.8, -2.2].map((z, i) => [
        cyl(`${sx < 0 ? 'port' : 'starboard'}_gear_${i}_strut`, [sx * 1.16, -1.08, z], 0.12, 0.96, 'dark', 'Y', 16),
        box(`${sx < 0 ? 'port' : 'starboard'}_gear_${i}_foot`, [sx * 1.16, -1.58, z], [1.1, 0.18, 0.42], 'dark'),
      ])).flat(),
    ],
  },
  'fortis-habitat.glb': {
    materials: {
      wall: { color: PALETTE.habitatWall, metallic: 0.18, roughness: 0.74 },
      dark: { color: PALETTE.fortisDark, metallic: 0.25, roughness: 0.62 },
      red: { color: PALETTE.fortisRed, metallic: 0.2, roughness: 0.42 },
      glass: { color: PALETTE.cockpitGlass, metallic: 0.0, roughness: 0.12, alpha: 'BLEND' },
    },
    parts: [
      box('hab_main_bay', [0, 3.0, 0], [20, 6, 12], 'wall'),
      box('hab_left_buttress', [-11, 2.2, -2], [2.5, 4.4, 9], 'dark'),
      box('hab_right_buttress', [11, 2.2, -2], [2.5, 4.4, 9], 'dark'),
      box('hab_roof_armor', [0, 6.45, 0], [22, 0.8, 12.8], 'dark'),
      box('hab_red_spine', [0, 6.95, 0], [16, 0.22, 0.36], 'red'),
      box('hab_door_frame', [0, 2.3, 6.15], [5.2, 4.6, 0.45], 'dark'),
      box('hab_door_red', [0, 2.0, 6.45], [3.0, 3.3, 0.3], 'red'),
      box('hab_window_strip_l', [-5.6, 4.2, 6.35], [3.6, 1.2, 0.18], 'glass'),
      box('hab_window_strip_r', [5.6, 4.2, 6.35], [3.6, 1.2, 0.18], 'glass'),
      cyl('hab_comms_mast', [8.4, 10.8, -3.2], 0.42, 8.8, 'dark', 'Y', 16),
      cyl('hab_roof_tank_a', [-5.8, 7.35, -3.0], 1.0, 5.2, 'wall', 'X', 24),
      cyl('hab_roof_tank_b', [-5.8, 7.35, 3.0], 1.0, 5.2, 'wall', 'X', 24),
    ],
  },
  'industrial-prop.glb': {
    materials: {
      blue: { color: PALETTE.crateBlue, metallic: 0.1, roughness: 0.65 },
      orange: { color: PALETTE.crateOrange, metallic: 0.1, roughness: 0.55 },
      dark: { color: PALETTE.fortisDark, metallic: 0.25, roughness: 0.6 },
    },
    parts: [
      box('reinforced_crate_body', [0, 0.65, 0], [1.8, 1.3, 1.8], 'blue'),
      box('crate_top_strap', [0, 1.35, 0], [2.0, 0.16, 0.32], 'dark'),
      box('crate_front_strap', [0, 0.65, 0.96], [2.0, 0.2, 0.16], 'dark'),
      box('crate_side_marker_l', [-1.02, 0.68, 0], [0.16, 0.78, 1.1], 'orange'),
      box('crate_side_marker_r', [1.02, 0.68, 0], [0.16, 0.78, 1.1], 'orange'),
      cyl('fuel_canister_a', [-1.55, 0.74, 0], 0.32, 1.45, 'orange', 'Y', 20),
      cyl('fuel_canister_b', [1.55, 0.74, 0], 0.32, 1.45, 'orange', 'Y', 20),
    ],
  },
};

for (const [file, asset] of Object.entries(ASSETS)) {
  writeFileSync(join(OUT, file), buildGlb(asset));
  console.log(`wrote ${join(OUT, file)}`);
}

function buildGlb(asset) {
  const buffers = [];
  const bufferViews = [];
  const accessors = [];
  const meshes = [];
  const nodes = [];
  const materials = Object.entries(asset.materials).map(([name, m]) => ({
    name,
    pbrMetallicRoughness: {
      baseColorFactor: m.color,
      metallicFactor: m.metallic,
      roughnessFactor: m.roughness,
    },
    emissiveFactor: m.emissive || [0, 0, 0],
    alphaMode: m.alpha || 'OPAQUE',
  }));
  const materialIndex = Object.fromEntries(Object.keys(asset.materials).map((k, i) => [k, i]));

  for (const part of asset.parts) {
    const geom = part.kind === 'box' ? makeBox(part) : makeCylinder(part);
    applyEuler(geom.positions, part.rot || [0, 0, 0]);
    translate(geom.positions, part.center);
    applyEuler(geom.normals, part.rot || [0, 0, 0], true);
    const pAcc = addAccessor(buffers, bufferViews, accessors, floatBuffer(geom.positions), 'VEC3', 5126, bounds(geom.positions));
    const nAcc = addAccessor(buffers, bufferViews, accessors, floatBuffer(geom.normals), 'VEC3', 5126, bounds(geom.normals));
    const uAcc = addAccessor(buffers, bufferViews, accessors, floatBuffer(geom.uvs), 'VEC2', 5126, null);
    const iAcc = addAccessor(buffers, bufferViews, accessors, indexBuffer(geom.indices), 'SCALAR', 5123, null);
    meshes.push({
      name: part.name,
      primitives: [{
        attributes: { POSITION: pAcc, NORMAL: nAcc, TEXCOORD_0: uAcc },
        indices: iAcc,
        material: materialIndex[part.mat],
      }],
    });
    nodes.push({ name: part.name, mesh: meshes.length - 1 });
  }

  const bin = concatAligned(buffers);
  let byteOffset = 0;
  for (const view of bufferViews) {
    view.byteOffset = byteOffset;
    byteOffset += align4(view.byteLength);
  }

  const gltf = {
    asset: { version: '2.0', generator: 'SYL desktop GLB generator' },
    scene: 0,
    scenes: [{ nodes: nodes.map((_, i) => i) }],
    nodes,
    meshes,
    materials,
    buffers: [{ byteLength: bin.length }],
    bufferViews,
    accessors,
  };
  const json = Buffer.from(JSON.stringify(gltf), 'utf8');
  const jsonPad = Buffer.concat([json, Buffer.alloc(align4(json.length) - json.length, 0x20)]);
  const binPad = Buffer.concat([bin, Buffer.alloc(align4(bin.length) - bin.length)]);
  const total = 12 + 8 + jsonPad.length + 8 + binPad.length;
  const out = Buffer.alloc(total);
  let o = 0;
  out.writeUInt32LE(0x46546c67, o); o += 4;
  out.writeUInt32LE(2, o); o += 4;
  out.writeUInt32LE(total, o); o += 4;
  out.writeUInt32LE(jsonPad.length, o); o += 4;
  out.writeUInt32LE(0x4e4f534a, o); o += 4;
  jsonPad.copy(out, o); o += jsonPad.length;
  out.writeUInt32LE(binPad.length, o); o += 4;
  out.writeUInt32LE(0x004e4942, o); o += 4;
  binPad.copy(out, o);
  return out;
}

function addAccessor(buffers, views, accessors, buf, type, componentType, extents) {
  views.push({ buffer: 0, byteLength: buf.length });
  buffers.push(buf);
  const count = type === 'SCALAR' ? buf.length / 2 : buf.length / (type === 'VEC3' ? 12 : 8);
  accessors.push({ bufferView: views.length - 1, componentType, count, type, ...(extents || {}) });
  return accessors.length - 1;
}

function makeBox(part) {
  const [sx, sy, sz] = part.size.map((v) => v / 2);
  const faces = [
    [[-sx, -sy, sz], [sx, -sy, sz], [sx, sy, sz], [-sx, sy, sz], [0, 0, 1]],
    [[sx, -sy, -sz], [-sx, -sy, -sz], [-sx, sy, -sz], [sx, sy, -sz], [0, 0, -1]],
    [[sx, -sy, sz], [sx, -sy, -sz], [sx, sy, -sz], [sx, sy, sz], [1, 0, 0]],
    [[-sx, -sy, -sz], [-sx, -sy, sz], [-sx, sy, sz], [-sx, sy, -sz], [-1, 0, 0]],
    [[-sx, sy, sz], [sx, sy, sz], [sx, sy, -sz], [-sx, sy, -sz], [0, 1, 0]],
    [[-sx, -sy, -sz], [sx, -sy, -sz], [sx, -sy, sz], [-sx, -sy, sz], [0, -1, 0]],
  ];
  const positions = [], normals = [], uvs = [], indices = [];
  for (const f of faces) {
    const base = positions.length / 3;
    for (let i = 0; i < 4; i++) {
      positions.push(...f[i]);
      normals.push(...f[4]);
      uvs.push(i === 1 || i === 2 ? 1 : 0, i >= 2 ? 1 : 0);
    }
    indices.push(base, base + 1, base + 2, base, base + 2, base + 3);
  }
  return { positions, normals, uvs, indices };
}

function makeCylinder(part) {
  const seg = part.segments || 24;
  const h = part.depth / 2;
  const r = part.radius;
  const positions = [], normals = [], uvs = [], indices = [];
  const axis = part.axis || 'Y';
  for (let i = 0; i <= seg; i++) {
    const a = i / seg * Math.PI * 2;
    const x = Math.cos(a) * r;
    const z = Math.sin(a) * r;
    pushAxis(positions, x, -h, z, axis);
    pushAxis(positions, x, h, z, axis);
    pushAxis(normals, Math.cos(a), 0, Math.sin(a), axis);
    pushAxis(normals, Math.cos(a), 0, Math.sin(a), axis);
    uvs.push(i / seg, 0, i / seg, 1);
  }
  for (let i = 0; i < seg; i++) {
    const b = i * 2;
    indices.push(b, b + 1, b + 3, b, b + 3, b + 2);
  }
  const topCenter = positions.length / 3;
  pushAxis(positions, 0, h, 0, axis); pushAxis(normals, 0, 1, 0, axis); uvs.push(0.5, 0.5);
  const bottomCenter = positions.length / 3;
  pushAxis(positions, 0, -h, 0, axis); pushAxis(normals, 0, -1, 0, axis); uvs.push(0.5, 0.5);
  for (let i = 0; i < seg; i++) {
    const a = i / seg * Math.PI * 2, b = (i + 1) / seg * Math.PI * 2;
    const t0 = positions.length / 3;
    pushAxis(positions, Math.cos(a) * r, h, Math.sin(a) * r, axis);
    pushAxis(positions, Math.cos(b) * r, h, Math.sin(b) * r, axis);
    pushAxis(normals, 0, 1, 0, axis); pushAxis(normals, 0, 1, 0, axis);
    uvs.push(0.5 + Math.cos(a) * 0.5, 0.5 + Math.sin(a) * 0.5, 0.5 + Math.cos(b) * 0.5, 0.5 + Math.sin(b) * 0.5);
    indices.push(topCenter, t0, t0 + 1);
    const b0 = positions.length / 3;
    pushAxis(positions, Math.cos(b) * r, -h, Math.sin(b) * r, axis);
    pushAxis(positions, Math.cos(a) * r, -h, Math.sin(a) * r, axis);
    pushAxis(normals, 0, -1, 0, axis); pushAxis(normals, 0, -1, 0, axis);
    uvs.push(0.5 + Math.cos(b) * 0.5, 0.5 + Math.sin(b) * 0.5, 0.5 + Math.cos(a) * 0.5, 0.5 + Math.sin(a) * 0.5);
    indices.push(bottomCenter, b0, b0 + 1);
  }
  return { positions, normals, uvs, indices };
}

function pushAxis(out, x, y, z, axis) {
  if (axis === 'X') out.push(y, x, z);
  else if (axis === 'Z') out.push(x, z, y);
  else out.push(x, y, z);
}

function floatBuffer(values) {
  const arr = new Float32Array(values);
  return Buffer.from(arr.buffer);
}

function indexBuffer(values) {
  const arr = new Uint16Array(values);
  return Buffer.from(arr.buffer);
}

function bounds(values) {
  const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < values.length; i += 3) {
    for (let k = 0; k < 3; k++) {
      min[k] = Math.min(min[k], values[i + k]);
      max[k] = Math.max(max[k], values[i + k]);
    }
  }
  return { min, max };
}

function translate(values, c) {
  for (let i = 0; i < values.length; i += 3) {
    values[i] += c[0]; values[i + 1] += c[1]; values[i + 2] += c[2];
  }
}

function applyEuler(values, rot, normalOnly = false) {
  if (!rot || (!rot[0] && !rot[1] && !rot[2])) return;
  const [rx, ry, rz] = rot;
  const sx = Math.sin(rx), cx = Math.cos(rx);
  const sy = Math.sin(ry), cy = Math.cos(ry);
  const sz = Math.sin(rz), cz = Math.cos(rz);
  for (let i = 0; i < values.length; i += 3) {
    let x = values[i], y = values[i + 1], z = values[i + 2];
    let ny = y * cx - z * sx, nz = y * sx + z * cx; y = ny; z = nz;
    let nx = x * cy + z * sy; nz = -x * sy + z * cy; x = nx; z = nz;
    nx = x * cz - y * sz; ny = x * sz + y * cz; x = nx; y = ny;
    if (normalOnly) {
      const l = Math.hypot(x, y, z) || 1;
      x /= l; y /= l; z /= l;
    }
    values[i] = x; values[i + 1] = y; values[i + 2] = z;
  }
}

function concatAligned(buffers) {
  const out = [];
  for (const b of buffers) out.push(b, Buffer.alloc(align4(b.length) - b.length));
  return Buffer.concat(out);
}

function align4(n) {
  return (n + 3) & ~3;
}
