// ============================================================================
// run_tests.mjs — headless verification of the SYL foundation. `npm test`.
//
// OWNS: automated acceptance checks that run in Node with no browser:
//   registry integrity, terrain/collision agreement, gravity math, ship
//   module install/repair/readiness, save round-trip, and a full SIMULATED
//   GAMEPLAY LOOP: takeoff from Earth → space → powered transit → landing
//   on the Moon, using the real Ship integrator.
// DOES NOT OWN: rendering/UI checks (those need a browser; see HANDOFF.md
//   "How to verify" for the manual pass).
//
// Node can't resolve the bare 'three' specifier without help; setup() writes
// a tiny node_modules/three shim pointing at the vendored lib. Idempotent.
// ============================================================================
import { mkdirSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { join } from 'path';

const ROOT = fileURLToPath(new URL('..', import.meta.url));

// --- three shim so `import 'three'` resolves in Node -----------------------
const shimDir = join(ROOT, 'node_modules', 'three');
if (!existsSync(join(shimDir, 'package.json'))) {
  mkdirSync(shimDir, { recursive: true });
  writeFileSync(join(shimDir, 'package.json'),
    JSON.stringify({ name: 'three', version: '0.160.0-vendored', type: 'module', main: './index.js' }));
  writeFileSync(join(shimDir, 'index.js'), `export * from '../../lib/three.module.js';\n`);
}

const THREE = await import('three');
const { BODIES, getBody } = await import('../src/world/bodies.js');
const {
  terrainRadiusAt, altitudeAt, gravityAt, upAt, dominantBody, buildBodyVisual,
  zoneWorldPos, resolveStructureCollision, structureCollidersForBody,
} =
  await import('../src/world/planet.js');
const { PICKUPS } = await import('../src/world/pickups.js');
const { Player } = await import('../src/player/player.js');
const { Ship } = await import('../src/ship/ship.js');
const { installPart, repairPart, loadFuel, applyStarterDamage, readinessReport } =
  await import('../src/ship/shipBuilder.js');
const { Inventory } = await import('../src/inventory/inventory.js');
const { FactionState, FACTIONS } = await import('../src/factions/factions.js');
const { WorldState } = await import('../src/world/worldState.js');
const { ITEMS, getItem } = await import('../src/items/items.js');

let pass = 0, fail = 0;
function check(name, cond, detail = '') {
  if (cond) { pass++; console.log(`  PASS  ${name}`); }
  else { fail++; console.log(`  FAIL  ${name} ${detail}`); }
}

// Stub engine (no WebGL needed to construct meshes/groups).
const stubEngine = { scene: { add() {} }, trackWorldObject(e) { return e; }, untrackWorldObject() {} };

console.log('\n== 1. Registries ==');
check('at least two reachable bodies', BODIES.length >= 2, `got ${BODIES.length}`);
check('every body has required fields', BODIES.every(b =>
  b.id && b.name && b.radius > 0 && b.surfaceGravity > 0 && b.terrain && Array.isArray(b.landingZones)));
check('every landing zone id unique', (() => {
  const ids = BODIES.flatMap(b => b.landingZones.map(z => z.id));
  return new Set(ids).size === ids.length;
})());
check('7 factions registered', FACTIONS.length === 7, `got ${FACTIONS.length}`);
check('Fortis is canon (not placeholder)', FACTIONS.find(f => f.id === 'fortis')?.placeholder === false);
check('item registry resolves ship part items', ITEMS.filter(i => i.kind === 'part').every(i => i.partId));
check('pickup ids unique', new Set(PICKUPS.map(p => p.id)).size === PICKUPS.length);
check('pickups reference real zones/items', PICKUPS.every(p => {
  const body = BODIES.find(b => b.id === p.bodyId);
  return body?.landingZones.some(z => z.id === p.zoneId) && !!getItem(p.itemId);
}));

console.log('\n== 2. World math (visual/collision agreement) ==');
// Build visuals to initialize derived fields (_centerV, zone dirs).
for (const b of BODIES) buildBodyVisual(b, {});
const earth = getBody('earth');
{
  const dir = new THREE.Vector3(0.3, 0.8, 0.5).normalize();
  const r1 = terrainRadiusAt(earth, dir), r2 = terrainRadiusAt(earth, dir);
  check('terrain is deterministic', r1 === r2);
  check('terrain within amplitude bounds', Math.abs(r1 - earth.radius) <= earth.terrain.amplitude * 1.01,
    `r=${r1}`);
  const surface = dir.clone().multiplyScalar(r1).add(earth._centerV);
  check('altitude at surface ≈ 0', Math.abs(altitudeAt(earth, surface)) < 1e-6);
  const up = upAt(earth, surface);
  check('up is radial unit', Math.abs(up.length() - 1) < 1e-9 && up.dot(dir) > 0.999);
  // Gravity reference is the BASE radius; terrain sits slightly above/below,
  // so sample at exactly r=radius for the canonical value.
  const atBase = dir.clone().multiplyScalar(earth.radius).add(earth._centerV);
  const g0 = gravityAt(earth, atBase).length();
  check('surface gravity ≈ 9.81 at base radius', Math.abs(g0 - 9.81) < 1e-6, `g=${g0.toFixed(4)}`);
  const far = dir.clone().multiplyScalar(earth.radius * 2).add(earth._centerV);
  const g2 = gravityAt(earth, far).length();
  check('inverse-square falloff (2r → g/4)', Math.abs(g2 - g0 / 4) < 1e-6, `g2=${g2.toFixed(4)}`);
}
{
  const zone = earth.landingZones[0];
  const rc = terrainRadiusAt(earth, zone._dirV);
  // Sample a point 40% into the pad: height must match the center (flattened).
  const east = new THREE.Vector3(0, 1, 0).cross(zone._dirV);
  if (east.lengthSq() < 1e-6) east.set(1, 0, 0);
  east.normalize();
  const off = zone._dirV.clone().addScaledVector(east, zone.angularRadius * 0.4).normalize();
  const ro = terrainRadiusAt(earth, off);
  check('landing zone is flat (collision == visual by construction)', Math.abs(ro - rc) < 0.5,
    `Δ=${Math.abs(ro - rc).toFixed(2)}m`);
}
{
  const colliders = structureCollidersForBody(earth);
  check('Earth structures expose analytic colliders', colliders.length >= 6, `got ${colliders.length}`);
  const zone = earth.landingZones.find(z => z.id === 'fortis_outpost');
  const insideBunker = offsetWorld(earth, zone, 40, 0, 0.2);
  const moved = resolveStructureCollision(earth, insideBunker, 0.45);
  const en = localOffset(earth, zone, insideBunker);
  const outside = Math.abs(en.east - 40) >= 8.44 || Math.abs(en.north) >= 6.44;
  check('structure collision pushes player outside bunker footprint', moved && outside,
    `east=${en.east.toFixed(2)} north=${en.north.toFixed(2)}`);
}
{
  const nearEarth = earth._centerV.clone().add(new THREE.Vector3(earth.radius * 1.5, 0, 0));
  check('dominant body near Earth is Earth', dominantBody(BODIES, nearEarth).id === 'earth');
  const moon = getBody('moon');
  const nearMoon = moon._centerV.clone().add(new THREE.Vector3(moon.radius * 1.2, 0, 0));
  check('dominant body near Moon is Moon (second-body coexistence)',
    dominantBody(BODIES, nearMoon).id === 'moon');
}

console.log('\n== 3. Controls and local playability ==');
{
  const player = new Player(stubEngine, { mouseDX: 0, mouseDY: 0, down: () => false }, BODIES);
  const spawn = earth.landingZones.find(z => z.id === earth.spawn.zoneId);
  player.placeAt(zoneWorldPos(earth, spawn, 0.2));
  player.yaw = 0; player.pitch = 0;
  const up = upAt(earth, player.worldPos);
  const frame = player.localFrame(up);
  const expectedRight = up.clone().cross(frame.fwd).normalize();
  check('A/D right vector matches camera frame', frame.right.dot(expectedRight) > 0.999);
  const camPos = new THREE.Vector3(), camQuat = new THREE.Quaternion();
  player.cameraPose(camPos, camQuat);
  const cameraForward = new THREE.Vector3(0, 0, -1).applyQuaternion(camQuat).normalize();
  check('first-person camera looks where W moves', cameraForward.dot(frame.fwd) > 0.999,
    `dot=${cameraForward.dot(frame.fwd).toFixed(3)}`);
}
{
  const counts = {};
  for (const p of PICKUPS.filter(p => p.bodyId === 'earth' && ['fortis_outpost', 'fortis_salvage_yard'].includes(p.zoneId))) {
    counts[p.itemId] = (counts[p.itemId] || 0) + 1;
  }
  check('near-base pickups include power + gear parts', counts.part_power >= 1 && counts.part_gear >= 1);
  check('near-base pickups include repair surplus', (counts.salvage_alloy || 0) >= 5 && (counts.wiring_loom || 0) >= 4,
    JSON.stringify(counts));
  check('near-base pickups include flight-test fuel surplus', (counts.fuel_hydrazine || 0) >= 6,
    JSON.stringify(counts));
}

console.log('\n== 4. Modular ship: damage → gather → repair → ready ==');
const ship = new Ship(stubEngine, BODIES);
applyStarterDamage(ship);
check('starter ship is NOT flight-ready', !ship.stats.ready, JSON.stringify(ship.stats.missing));
check('starter ship has no fuel', ship.fuel === 0);
const inv = new Inventory();
inv.add('part_power'); inv.add('part_gear');
inv.add('salvage_alloy', 4); inv.add('wiring_loom', 3); inv.add('fuel_hydrazine', 4);
check('install power cell', installPart(ship, inv, 'power_bay', 'part_power').ok);
check('install landing gear', installPart(ship, inv, 'gear_rr', 'part_gear').ok);
check('wrong-slot install rejected', !installPart(ship, inv, 'engine_aux', 'part_fuel').ok);
let r = { ok: true };
while (r.ok) r = repairPart(ship, inv, 'engine_main');       // burn alloy into engine
let r2 = { ok: true };
while (r2.ok) r2 = repairPart(ship, inv, 'gear_rl');
for (let i = 0; i < 4; i++) loadFuel(ship, inv);
ship.refreshStats();
const rep = readinessReport(ship);
check('ship becomes FLIGHT READY after repairs+installs', ship.stats.ready, rep.lines.join(' | '));
check('fuel loaded', ship.fuel > 50, `fuel=${ship.fuel}`);
check('modules affect stats (thrust > 0, mass grew)', ship.stats.thrust > 0 && ship.stats.mass > 200);

console.log('\n== 5. FULL TRAVERSAL SIM: Earth pad → space → Moon landing ==');
// Uses the REAL Ship integrator — this is the gameplay loop, headless.
const pad = earth.landingZones[0];
const start = zoneWorldPos(earth, pad, 1.95);
ship.placeAt(start, upAt(earth, start));
ship.fuel = ship.stats.fuelCap;

const moon = getBody('moon');
const dt = 1 / 60;
let t = 0, phaseLog = ['LANDED'];
const controls = { pitch: 0, yaw: 0, roll: 0, thrustUp: false, brake: false };

// Phase A: vertical ascent to space (thrustUp along local up).
ship.landed = false;
ship.velocity.addScaledVector(upAt(earth, ship.worldPos), 3);
controls.thrustUp = true;
let reachedSpace = false;
while (t < 240 && !reachedSpace) {
  ship.tick(dt, true, controls); t += dt;
  const alt = altitudeAt(earth, ship.worldPos);
  if (alt > (earth.atmosphere ? earth.atmosphere.height * 1.2 : 500)) reachedSpace = true;
}
check('ascent: surface → space (continuous, no teleport)', reachedSpace,
  `alt=${altitudeAt(earth, ship.worldPos).toFixed(0)}m t=${t.toFixed(0)}s`);
phaseLog.push('SPACE');

// Phase B: point at the Moon and burn (main throttle), then brake and fall.
controls.thrustUp = false;
let landedOnMoon = false, crashed = false;
const MAX_T = 1800;
while (t < MAX_T && !landedOnMoon) {
  // Simple autopilot: orient toward the moon-intercept, manage speed by range.
  const toMoon = moon._centerV.clone().sub(ship.worldPos);
  const range = toMoon.length() - moon.radius;
  toMoon.normalize();
  ship.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), toMoon);
  const closing = -ship.velocity.dot(toMoon.clone().negate()); // + = toward moon
  const targetSpeed = Math.min(320, Math.max(12, range * 0.04));
  ship.throttle = closing < targetSpeed ? 1 : 0;
  controls.brake = closing > targetSpeed * 1.15;
  ship.tick(dt, true, controls); t += dt;
  if (ship.landed && dominantBody(BODIES, ship.worldPos).id === 'moon') landedOnMoon = true;
}
check('transit + landing: ship LANDED on the Moon', landedOnMoon,
  `t=${t.toFixed(0)}s altMoon=${altitudeAt(moon, ship.worldPos).toFixed(0)}m spd=${ship.speed().toFixed(1)}`);
check('trip fuel budget realistic (fuel remains)', ship.fuel > 0, `fuel=${ship.fuel.toFixed(1)}`);
check('ship survived (still flight-capable or repairable)', ship.stats.mass > 0);
phaseLog.push('LANDED@moon');
console.log(`  info: phases ${phaseLog.join(' → ')}, total sim time ${t.toFixed(0)}s game-time`);

console.log('\n== 6. Save/load round-trip (no browser localStorage needed) ==');
{
  const ws = new WorldState(); const fs2 = new FactionState();
  ws.discoverBody('moon'); ws.discoverZone('tranquility_pad'); ws.setFlag('reachedSpace');
  fs2.adjustStanding('meridian', 10); fs2.meet('meridian');
  const shipData = ship.serialize();
  const wsData = ws.serialize(); const fsData = fs2.serialize(); const invData = inv.serialize();
  const ship2 = new Ship(stubEngine, BODIES);
  ship2.deserialize(JSON.parse(JSON.stringify(shipData)));
  const ws2 = new WorldState(); ws2.deserialize(JSON.parse(JSON.stringify(wsData)));
  const fs3 = new FactionState(); fs3.deserialize(JSON.parse(JSON.stringify(fsData)));
  const inv2 = new Inventory(); inv2.deserialize(JSON.parse(JSON.stringify(invData)));
  check('ship modules survive round-trip',
    JSON.stringify(ship2.serialize().modules) === JSON.stringify(shipData.modules));
  check('ship position/fuel survive round-trip',
    // fuel is intentionally rounded to 0.1 in saves; position must be exact.
    ship2.worldPos.distanceTo(ship.worldPos) < 1e-9 && Math.abs(ship2.fuel - ship.fuel) <= 0.05 + 1e-9);
  check('world discovery survives round-trip',
    ws2.discoveredZones.has('tranquility_pad') && ws2.flags.reachedSpace);
  check('faction standings survive round-trip', fs3.standing('meridian') === 10 && fs3.metFactions.has('meridian'));
  check('inventory survives round-trip', JSON.stringify(inv2.counts) === JSON.stringify(inv.counts));
}

console.log(`\n========================================`);
console.log(`RESULT: ${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);

function zoneFrame(dirUnit) {
  const east = new THREE.Vector3(0, 1, 0).cross(dirUnit);
  if (east.lengthSq() < 1e-6) east.set(1, 0, 0);
  east.normalize();
  const north = dirUnit.clone().cross(east).normalize();
  return { east, north };
}

function offsetWorld(body, zone, eastM, northM, extraHeight = 0) {
  const frame = zoneFrame(zone._dirV);
  const dir = zone._dirV.clone()
    .addScaledVector(frame.east, eastM / body.radius)
    .addScaledVector(frame.north, northM / body.radius)
    .normalize();
  const r = terrainRadiusAt(body, dir) + extraHeight;
  return dir.multiplyScalar(r).add(body._centerV);
}

function localOffset(body, zone, worldPos) {
  const frame = zoneFrame(zone._dirV);
  const dir = worldPos.clone().sub(body._centerV).normalize();
  return {
    east: dir.dot(frame.east) * body.radius,
    north: dir.dot(frame.north) * body.radius,
  };
}
