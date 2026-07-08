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
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'fs';
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

// Mock localStorage for headless Node testing (Settings module uses it).
const _lsStore = new Map();
globalThis.localStorage = {
  getItem: (k) => _lsStore.get(k) ?? null,
  setItem: (k, v) => _lsStore.set(k, v),
  removeItem: (k) => _lsStore.delete(k),
};

const { BODIES, getBody } = await import('../src/world/bodies.js');
const { DESKTOP_BODIES, DESKTOP_WORLD_SCALE } = await import('../src/desktop/desktopBodies.js');
const {
  terrainRadiusAt, altitudeAt, gravityAt, upAt, dominantBody, buildBodyVisual,
  zoneWorldPos, resolveStructureCollision, structureCollidersForBody,
} =
  await import('../src/world/planet.js');
const { PICKUPS } = await import('../src/world/pickups.js');
const { Player } = await import('../src/player/player.js');
const { Ship } = await import('../src/ship/ship.js');
const { PART_TYPES, SLOTS, getPartType } = await import('../src/ship/shipParts.js');
const { installPart, repairPart, removePart, loadFuel, applyStarterDamage, readinessReport } =
  await import('../src/ship/shipBuilder.js');
const { Inventory } = await import('../src/inventory/inventory.js');
const { FactionState, FACTIONS } = await import('../src/factions/factions.js');
const { WorldState } = await import('../src/world/worldState.js');
const { CivilTransport, CIVIL_TRANSPORT_STOPS } = await import('../src/world/civilTransport.js');
const { ITEMS, getItem } = await import('../src/items/items.js');
const { RECIPES, craft, availableRecipes } = await import('../src/crafting/recipes.js');
const { readyShip, giveInventoryKit } = await import('../src/dev/devTools.js');
const { joystickAxes, joystickMoveKeys, joystickShipControls, joystickShipAttitude } = await import('../src/ui/touch.js');
const { Settings } = await import('../src/ui/settings.js');
const { SpaceProps } = await import('../src/world/spaceProps.js');
const RenderTextures = await import('../src/render/textures.js');
const RenderProps = await import('../src/render/props.js');
const WorldDetails = await import('../src/world/worldDetails.js');
const { allCollidersForZone } = await import('../src/world/planet.js');

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
check('body ids unique', new Set(BODIES.map(b => b.id)).size === BODIES.length);
check('item ids unique', new Set(ITEMS.map(i => i.id)).size === ITEMS.length);
check('every landing zone id unique', (() => {
  const ids = BODIES.flatMap(b => b.landingZones.map(z => z.id));
  return new Set(ids).size === ids.length;
})());
check('7 factions registered', FACTIONS.length === 7, `got ${FACTIONS.length}`);
check('Fortis is canon (not placeholder)', FACTIONS.find(f => f.id === 'fortis')?.placeholder === false);
check('item registry resolves ship part items', ITEMS.filter(i => i.kind === 'part').every(i =>
  i.partId && !!PART_TYPES[i.partId]));
check('ship slot ids unique', new Set(SLOTS.map(s => s.slotId)).size === SLOTS.length);
check('ship slots accept real part types', SLOTS.every(s => !!PART_TYPES[s.accepts]));
check('recipes reference real input/output items', RECIPES.every(r =>
  Object.keys(r.inputs).every(resolvesItem) && resolvesItem(r.output.itemId)));
check('every discovery.resourceItemId resolves through getItem', BODIES.every(b =>
  b.landingZones.every(z => !z.discovery?.resourceItemId || resolvesItem(z.discovery.resourceItemId))));
check('every body ownerFactionId exists when set', BODIES.every(b =>
  !b.ownerFactionId || FACTIONS.some(f => f.id === b.ownerFactionId)));
check('every landing zone factionId exists when set', BODIES.every(b =>
  b.landingZones.every(z => !z.factionId || FACTIONS.some(f => f.id === z.factionId))));
check('every body matches the current schema', BODIES.every(bodyMatchesSchema));
check('pickup ids unique', new Set(PICKUPS.map(p => p.id)).size === PICKUPS.length);
check('pickups reference real zones/items', PICKUPS.every(p => {
  const body = BODIES.find(b => b.id === p.bodyId);
  return body?.landingZones.some(z => z.id === p.zoneId) && !!getItem(p.itemId);
}));
check('civil transport stops reference real transit bases', CIVIL_TRANSPORT_STOPS.length >= 5 &&
  CIVIL_TRANSPORT_STOPS.every((stop) => {
    const body = BODIES.find(b => b.id === stop.bodyId);
    const zone = body?.landingZones.find(z => z.id === stop.zoneId);
    return body && zone && zone.structures === 'transit';
  }));
{
  const indexHtml = readFileSync(join(ROOT, 'index.html'), 'utf8');
  const desktopHtml = readFileSync(join(ROOT, 'desktop.html'), 'utf8');
  check('mobile-safe index still boots src/main.js',
    indexHtml.includes('src="./src/main.js"') && !indexHtml.includes('desktopMain.js'));
  check('desktop entry boots src/desktopMain.js',
    desktopHtml.includes('src="./src/desktopMain.js"'));
  check('desktop GLB assets are present',
    ['fortis-gunship.glb', 'fortis-habitat.glb', 'industrial-prop.glb']
      .every((file) => existsSync(join(ROOT, 'assets', 'desktop', file))));
  check('desktop body registry is cloned, scaled, and additive',
    DESKTOP_BODIES.length > BODIES.length &&
    DESKTOP_BODIES.find(b => b.id === 'earth') !== BODIES.find(b => b.id === 'earth') &&
    DESKTOP_BODIES.find(b => b.id === 'earth').radius === Math.round(BODIES.find(b => b.id === 'earth').radius * DESKTOP_WORLD_SCALE.radius));
}

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
  const landable = BODIES.filter(b => b.landingZones.length > 0);
  check('landable worlds build surface detail layers',
    landable.every(b => b._detailStats?.zonesDetailed === b.landingZones.length),
    landable.map(b => `${b.id}:${b._detailStats?.zonesDetailed || 0}/${b.landingZones.length}`).join(' '));
  check('landing zones have settlement buildings and roads',
    landable.every(b => b._detailStats?.settlementBuildings >= b.landingZones.length * 3 &&
      b._detailStats?.roadSegments >= b.landingZones.length * 2),
    landable.map(b => `${b.id}:${b._detailStats?.settlementBuildings || 0}b/${b._detailStats?.roadSegments || 0}r`).join(' '));
  check('exploration dressing exists beyond pads',
    landable.every(b => b._detailStats?.naturalProps >= b.landingZones.length * 10),
    landable.map(b => `${b.id}:${b._detailStats?.naturalProps || 0}`).join(' '));
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
  const radius = 64;
  const right = joystickAxes(radius, 0, radius);
  const up = joystickAxes(0, -radius, radius);
  const move = joystickMoveKeys(0, -radius, radius);
  const shipStick = joystickShipControls(radius, -radius, radius);
  const attitudeRight = joystickShipAttitude(radius, 0, radius);
  const attitudeUp = joystickShipAttitude(0, -radius, radius);
  const attitudeDiag = joystickShipAttitude(radius, -radius, radius);
  const attitudeNearHorizontal = joystickShipAttitude(radius, -radius * 0.35, radius);
  check('touch joystick exposes normalized axes', right.x > 0.99 && up.y < -0.99);
  check('touch joystick still maps to WASD on foot', move.forward && !move.back);
  check('touch joystick produces ship side-axis + throttle while piloting',
    shipStick.yaw > 0.45 && shipStick.throttle > 0.65 && shipStick.pitch === 0,
    `side=${shipStick.yaw.toFixed(2)} throttle=${shipStick.throttle.toFixed(2)} pitch=${shipStick.pitch.toFixed(2)}`);
  check('right attitude stick uses gentle capped bank/pitch speeds',
    attitudeRight.bank > 0.30 && attitudeRight.bank < 0.34 && attitudeRight.pitch === 0 &&
    attitudeUp.pitch < -0.40 && attitudeUp.pitch > -0.44 && attitudeUp.bank === 0,
    `right=${attitudeRight.bank.toFixed(2)}/${attitudeRight.pitch.toFixed(2)} up=${attitudeUp.bank.toFixed(2)}/${attitudeUp.pitch.toFixed(2)}`);
  check('right attitude stick softens diagonal thumb drift',
    Math.abs(attitudeDiag.bank) < 0.13 && Math.abs(attitudeDiag.pitch) < 0.16 &&
    attitudeNearHorizontal.pitch === 0,
    `diag=${attitudeDiag.bank.toFixed(2)}/${attitudeDiag.pitch.toFixed(2)} near=${attitudeNearHorizontal.bank.toFixed(2)}/${attitudeNearHorizontal.pitch.toFixed(2)}`);
}
{
  const player = new Player(stubEngine, { mouseDX: 0, mouseDY: 0, down: () => false }, BODIES);
  const spawn = earth.landingZones.find(z => z.id === earth.spawn.zoneId);
  player.placeAt(zoneWorldPos(earth, spawn, 0.2));
  player.yaw = 0; player.pitch = 0;
  const up = upAt(earth, player.worldPos);
  const frame = player.localFrame(up);
  const camPos = new THREE.Vector3(), camQuat = new THREE.Quaternion();
  player.cameraPose(camPos, camQuat);
  const cameraForward = new THREE.Vector3(0, 0, -1).applyQuaternion(camQuat).normalize();
  const cameraRight = new THREE.Vector3(1, 0, 0).applyQuaternion(camQuat).normalize();
  check('A/D right vector matches camera right', frame.right.dot(cameraRight) > 0.999,
    `dot=${frame.right.dot(cameraRight).toFixed(3)}`);
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

console.log('\n== 3b. Civil transport line ==');
{
  const transport = new CivilTransport(stubEngine, BODIES, { legSeconds: 2.5, dwellSeconds: 0.1 });
  const rider = new Player(stubEngine, { mouseDX: 0, mouseDY: 0, down: () => false }, BODIES);
  rider.placeAt(transport.worldPos.clone().add(new THREE.Vector3(2, 0, 0)));
  const startStop = transport.currentStop();
  const startPos = transport.worldPos.clone();
  check('civil transport starts docked at Earth terminal',
    transport.isDocked() && startStop.bodyId === 'earth' && startStop.zone.structures === 'transit');
  check('player can board docked civil transport', transport.canBoard(rider) && transport.board(rider) && transport.passenger);
  transport.tick(0.2, rider); // leave dwell and begin moving
  let maxStep = 0;
  let last = transport.worldPos.clone();
  for (let i = 0; i < 155; i++) {
    transport.tick(1 / 60, rider);
    maxStep = Math.max(maxStep, transport.worldPos.distanceTo(last));
    last.copy(transport.worldPos);
  }
  check('civil transport moves continuously from stop to stop',
    transport.worldPos.distanceTo(startPos) > 100 && maxStep < 900,
    `moved=${transport.worldPos.distanceTo(startPos).toFixed(1)} maxStep=${maxStep.toFixed(1)}`);
  check('passenger rides with civil transport',
    rider.worldPos.distanceTo(transport.worldPos) < 10,
    `dist=${rider.worldPos.distanceTo(transport.worldPos).toFixed(1)}`);
  check('civil transport reaches next planetary base',
    transport.isDocked() && transport.currentStop().bodyId === 'moon',
    `stop=${transport.currentStop().label}`);
  check('passenger can disembark at destination base',
    transport.disembark(rider) && !transport.passenger &&
    rider.worldPos.distanceTo(zoneWorldPos(transport.currentStop().body, transport.currentStop().zone, 0.4)) < 25);
}

console.log('\n== 3c. Transport fleet, collision, door ==');
{
  // Multiple transports with staggered stops.
  const fleet = [
    new CivilTransport(stubEngine, BODIES, { startStopIndex: 0, phaseOffset: 0 }),
    new CivilTransport(stubEngine, BODIES, { startStopIndex: 2, phaseOffset: 10 }),
    new CivilTransport(stubEngine, BODIES, { startStopIndex: 4, phaseOffset: 20 }),
  ];
  check('multiple transports exist and are on different stops',
    fleet[0].routeIndex === 0 && fleet[1].routeIndex === 2 && fleet[2].routeIndex === 4);

  // Transport collision pushes player away.
  const transport = new CivilTransport(stubEngine, BODIES);
  const collider = new Player(stubEngine, { down: () => false, mouseDX: 0, mouseDY: 0 }, BODIES);
  collider.placeAt(transport.worldPos.clone());
  const before = collider.worldPos.clone();
  const push = transport.collide(collider.worldPos, 0.45);
  check('transport collision returns a push vector when overlapping', push && push.length() > 0.1);
  collider.worldPos.add(push);
  check('transport collision pushes player away', collider.worldPos.distanceTo(before) > 0.1);

  // Door toggle changes state.
  check('transport door starts closed', !transport.doorOpen);
  transport.toggleDoor();
  check('transport door toggle changes state', transport.doorOpen);
  transport.toggleDoor();
  check('transport door toggle reverts state', !transport.doorOpen);
}

console.log('\n== 4. Modular ship: damage → gather → repair → ready ==');
const ship = new Ship(stubEngine, BODIES);
applyStarterDamage(ship);
check('Ship constructor initializes modules for every slot',
  SLOTS.every(s => Object.prototype.hasOwnProperty.call(ship.modules, s.slotId)) &&
  Object.keys(ship.modules).length === SLOTS.length);
check('starter ship is NOT flight-ready', !ship.stats.ready, JSON.stringify(ship.stats.missing));
check('starter ship has no fuel', ship.fuel === 0);
check('ship visual uses code-built Fortis gunship silhouette',
  !!ship.group.getObjectByName('Fortis_Gunship_CodeBuilt') &&
  !!ship.group.getObjectByName('gunship:cockpit_glass_left') &&
  !!ship.group.getObjectByName('gunship:rear_ramp') &&
  !!ship.group.getObjectByName('gunship:port_engine'));
check('ship door starts closed', !ship.doorOpen);
ship.toggleDoor();
check('ship door toggle changes state', ship.doorOpen);
ship.toggleDoor();
check('ship door toggle reverts state', !ship.doorOpen);
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
{
  const testShip = new Ship(stubEngine, BODIES);
  const testInv = new Inventory();
  testInv.add('part_scanner');
  testInv.add('wiring_loom');
  testInv.add('salvage_alloy');
  const installed = installPart(testShip, testInv, 'scanner_top', 'part_scanner');
  if (installed.ok) testShip.modules.scanner_top.hp = getPartType('scanner').maxHp * 0.25;
  const repaired = repairPart(testShip, testInv, 'scanner_top');
  const removed = removePart(testShip, testInv, 'scanner_top');
  check('expanded ship part install/remove/repair flow works',
    installed.ok && repaired.ok && removed.ok && testInv.count('part_scanner') === 1,
    `${installed.msg} | ${repaired.msg} | ${removed.msg}`);
}
{
  const statShip = new Ship(stubEngine, BODIES);
  statShip.modules.maneuver_fl = { typeId: 'maneuver', hp: getPartType('maneuver').maxHp };
  statShip.modules.maneuver_fr = { typeId: 'maneuver', hp: getPartType('maneuver').maxHp };
  statShip.modules.shield_nose = { typeId: 'shield', hp: getPartType('shield').maxHp };
  statShip.modules.scanner_top = { typeId: 'scanner', hp: getPartType('scanner').maxHp };
  statShip.modules.weapon_wing_l = { typeId: 'weapon', hp: getPartType('weapon').maxHp };
  statShip.refreshStats();
  check('expanded modules contribute live stats',
    statShip.stats.torqueBoost > 0.6 && statShip.stats.shieldCap === 150 &&
    statShip.stats.scanRange === 5000 && statShip.stats.weaponCount === 1,
    `turn=${statShip.stats.torqueBoost} shield=${statShip.stats.shieldCap} scan=${statShip.stats.scanRange} weapons=${statShip.stats.weaponCount}`);
}

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

console.log('\n== 7. Crafting ==');
{
  const craftInv = new Inventory();
  craftInv.add('water_ice', 2);
  check('Inventory.has compatibility method works', craftInv.has('water_ice', 2) && !craftInv.has('water_ice', 3));
  check('availableRecipes finds craftable recipes', availableRecipes(craftInv).some(r => r.id === 'crack_ice'));
  const madeFuel = craft(craftInv, 'crack_ice');
  check('craft consumes inputs and creates output',
    madeFuel.ok && craftInv.count('water_ice') === 0 && craftInv.count('hydrogen_cracked') === 1,
    madeFuel.msg);
}

console.log('\n== 8. Turning (yaw authority) ==');
{
  const t = new Ship(stubEngine, BODIES);
  // Deep space so it won't clamp to ground or auto-settle upright.
  t.worldPos.set(200000, 0, 0);
  t.velocity.set(0, 0, 0);
  t.quaternion.identity();
  t.angVel.set(0, 0, 0);
  t.landed = false;
  t.throttle = 0;
  const fwd0 = new THREE.Vector3(0, 0, 1).applyQuaternion(t.quaternion);
  const ctl = { pitch: 0, yaw: 1, roll: 0, thrustUp: false, brake: false };
  const dt = 1 / 60;
  for (let i = 0; i < 60; i++) t.tick(dt, true, ctl); // 1 s of full yaw
  const fwd1 = new THREE.Vector3(0, 0, 1).applyQuaternion(t.quaternion);
  const turned = Math.acos(Math.max(-1, Math.min(1, fwd0.dot(fwd1))));
  check('sustained yaw input turns the ship a usable amount', turned > 0.5,
    `heading changed ${(turned * 180 / Math.PI).toFixed(0)} deg in 1s`);
  ctl.yaw = 0;
  for (let i = 0; i < 120; i++) t.tick(dt, true, ctl); // release
  check('yaw settles when input released (damping works)', t.angVel.length() < 0.05,
    `angVel=${t.angVel.length().toFixed(3)}`);
}
{
  const t = new Ship(stubEngine, BODIES);
  t.worldPos.set(0, earth.radius + 200, 0);
  t.velocity.set(0, 0, 0);
  t.quaternion.identity();
  t.landed = false;
  t.throttle = 1;
  t.fuel = 100;
  t.stats.ready = true;
  t.stats.thrust = Math.max(t.stats.mass * 25, t.stats.thrust);
  const ctl = { pitch: 0, yaw: 1, roll: 0, thrustUp: false, brake: false, mobileAssist: true };
  const dt = 1 / 60;
  const startFwd = new THREE.Vector3(0, 0, 1).applyQuaternion(t.quaternion);
  for (let i = 0; i < 90; i++) t.tick(dt, true, ctl);
  const endFwd = new THREE.Vector3(0, 0, 1).applyQuaternion(t.quaternion);
  check('mobile assist yaw changes real ship heading', startFwd.dot(endFwd) < 0.2,
    `dot=${startFwd.dot(endFwd).toFixed(2)}`);
  check('mobile assist main thrust creates horizontal travel', Math.abs(t.velocity.z) + Math.abs(t.velocity.x) > 5,
    `velocity=${t.velocity.toArray().map(v => v.toFixed(1)).join(',')}`);
  ctl.yaw = 0; ctl.thrustUp = false; t.throttle = 0; ctl.mobileAssist = true;
  const altBefore = altitudeAt(earth, t.worldPos);
  for (let i = 0; i < 120; i++) t.tick(dt, true, ctl);
  const upDir = upAt(earth, t.worldPos, new THREE.Vector3());
  const vTan = t.velocity.clone().addScaledVector(upDir, -t.velocity.dot(upDir));
  const altAfter = altitudeAt(earth, t.worldPos);
  check('mobile assist steadies tangential motion when released', vTan.length() < 1.5,
    `tanSpeed=${vTan.length().toFixed(2)}`);
  check('assisted flight is subject to REAL gravity (idle ship sinks)', altAfter < altBefore - 0.5,
    `alt ${altBefore.toFixed(1)} -> ${altAfter.toFixed(1)}`);
}
{
  const t = new Ship(stubEngine, BODIES);
  t.worldPos.set(0, earth.radius + 200, 0);
  t.velocity.set(0, 0, 0);
  t.quaternion.identity();
  t.landed = false;
  t.throttle = 0;
  t.fuel = 100;
  t.stats.ready = true;
  const ctl = { pitch: 0, yaw: 1, roll: 0, thrustUp: false, brake: false, assist: true, assistForward: 0 };
  const dt = 1 / 60;
  const startFwd = new THREE.Vector3(0, 0, 1).applyQuaternion(t.quaternion);
  for (let i = 0; i < 60; i++) t.tick(dt, true, ctl);
  const endFwd = new THREE.Vector3(0, 0, 1).applyQuaternion(t.quaternion);
  const upD = upAt(earth, t.worldPos, new THREE.Vector3());
  const tanV = t.velocity.clone().addScaledVector(upD, -t.velocity.dot(upD));
  check('assisted yaw turns ship nose without inventing sideways travel',
    startFwd.dot(endFwd) < 0.2 && tanV.length() < 0.5,
    `dot=${startFwd.dot(endFwd).toFixed(2)} tanSpeed=${tanV.length().toFixed(2)}`);
}
{
  const t = new Ship(stubEngine, BODIES);
  t.worldPos.set(0, earth.radius + 200, 0);
  t.velocity.set(0, 0, 0);
  t.quaternion.identity();
  t.landed = false;
  t.throttle = 0;
  t.fuel = 100;
  t.stats.ready = true;
  const ctl = { pitch: 0, yaw: 0, roll: 0, thrustUp: false, brake: false, assist: true, assistForward: -1 };
  const dt = 1 / 60;
  for (let i = 0; i < 60; i++) t.tick(dt, true, ctl);
  check('assisted S/reverse creates backward travel', t.velocity.z < -20,
    `vz=${t.velocity.z.toFixed(1)}`);
}
{
  const upShip = new Ship(stubEngine, BODIES);
  upShip.worldPos.set(0, earth.radius + 200, 0);
  upShip.velocity.set(0, 0, 0);
  upShip.quaternion.identity();
  upShip.landed = false;
  upShip.fuel = 100;
  upShip.stats.ready = true;
  const dt = 1 / 60;
  const liftCtl = { pitch: 0, yaw: 0, roll: 0, thrustUp: true, descend: false, brake: false, assist: true, assistForward: 0 };
  for (let i = 0; i < 60; i++) upShip.tick(dt, true, liftCtl);
  const upDir = upAt(earth, upShip.worldPos, new THREE.Vector3());
  const liftV = upShip.velocity.dot(upDir);

  const downShip = new Ship(stubEngine, BODIES);
  downShip.worldPos.set(0, earth.radius + 200, 0);
  downShip.velocity.set(0, 0, 0);
  downShip.quaternion.identity();
  downShip.landed = false;
  downShip.fuel = 100;
  downShip.stats.ready = true;
  const descendCtl = { pitch: 0, yaw: 0, roll: 0, thrustUp: true, descend: true, brake: false, assist: true, assistForward: 0 };
  for (let i = 0; i < 60; i++) downShip.tick(dt, true, descendCtl);
  const downDir = upAt(earth, downShip.worldPos, new THREE.Vector3());
  const descendV = downShip.velocity.dot(downDir);
  check('assisted descend overrides mobile lift', liftV > 5 && descendV < -5,
    `liftV=${liftV.toFixed(1)} descendV=${descendV.toFixed(1)}`);
}
{
  const t = new Ship(stubEngine, BODIES);
  t.worldPos.set(0, earth.radius + 200, 0);
  t.velocity.set(0, 0, 0);
  t.quaternion.identity();
  t.landed = false;
  t.fuel = 100;
  t.stats.ready = true;
  const ctl = { pitch: 0, yaw: 0.65, roll: 1, thrustUp: false, descend: false, brake: false, assist: true, assistForward: 0, assistStrafe: 0 };
  const dt = 1 / 60;
  const startFwd = new THREE.Vector3(0, 0, 1).applyQuaternion(t.quaternion);
  for (let i = 0; i < 45; i++) t.tick(dt, true, ctl);
  const endFwd = new THREE.Vector3(0, 0, 1).applyQuaternion(t.quaternion);
  check('assisted bank button turns ship nose and rolls', startFwd.dot(endFwd) < 0.85 && Math.abs(t.assistRoll) > 0.2,
    `dot=${startFwd.dot(endFwd).toFixed(2)} roll=${(t.assistRoll || 0).toFixed(2)}`);
  check('local ship visual is wired to authoritative rotation', t._trackEntry.quaternion === t.quaternion,
    'track entry missing ship quaternion');
}
{
  const t = new Ship(stubEngine, BODIES);
  const aethelgard = getBody('aethelgard');
  t.worldPos.copy(aethelgard._centerV).add(new THREE.Vector3(0, aethelgard.radius + aethelgard.atmosphere.height + 30000, 0));
  t.velocity.set(0, 0, 0);
  t.quaternion.identity();
  t.landed = false;
  t.fuel = 100;
  t.stats.ready = true;
  const ctl = { pitch: -1, yaw: 0, roll: 0, thrustUp: false, descend: false, brake: false, assist: true, assistForward: 0, assistStrafe: 0 };
  const dt = 1 / 60;
  const startFwd = new THREE.Vector3(0, 0, 1).applyQuaternion(t.quaternion);
  for (let i = 0; i < 45; i++) t.tick(dt, true, ctl);
  const endFwd = new THREE.Vector3(0, 0, 1).applyQuaternion(t.quaternion);
  check('true-space NOSE pitch tilts the visible ship',
    startFwd.dot(endFwd) < 0.85,
    `dot=${startFwd.dot(endFwd).toFixed(2)}`);
}
{
  const t = new Ship(stubEngine, BODIES);
  const aethelgard = getBody('aethelgard');
  t.worldPos.copy(aethelgard._centerV).add(new THREE.Vector3(0, aethelgard.radius + aethelgard.atmosphere.height + 30000, 0));
  t.velocity.set(0, 0, 0);
  t.quaternion.setFromEuler(new THREE.Euler(0.7, 1.1, -0.4, 'XYZ'));
  t.landed = false;
  t.fuel = 100;
  t.stats.ready = true;
  const before = t.quaternion.clone();
  const ctl = { pitch: 0, yaw: 0, roll: 0, thrustUp: false, descend: false, brake: false, assist: true, assistForward: 0, assistStrafe: 0 };
  const dt = 1 / 60;
  for (let i = 0; i < 30; i++) t.tick(dt, true, ctl);
  check('true-space attitude does not snap to dominant body up',
    Math.abs(before.dot(t.quaternion)) > 0.999,
    `quatDot=${before.dot(t.quaternion).toFixed(4)} body=${t.dominant().id}`);
}
{
  const t = new Ship(stubEngine, BODIES);
  const aethelgard = getBody('aethelgard');
  t.worldPos.copy(aethelgard._centerV).add(new THREE.Vector3(0, aethelgard.radius + aethelgard.atmosphere.height + 30000, 0));
  t.velocity.set(0, 0, 0);
  t.quaternion.identity();
  t.landed = false;
  t.fuel = 100;
  t.stats.ready = true;
  const ctl = { pitch: -1, yaw: 0, roll: 0, thrustUp: false, descend: false, brake: false, assist: true, assistForward: 0, assistStrafe: 0 };
  const dt = 1 / 60;
  const startFwd = new THREE.Vector3(0, 0, 1).applyQuaternion(t.quaternion);
  for (let i = 0; i < 135; i++) t.tick(dt, true, ctl);
  const endFwd = new THREE.Vector3(0, 0, 1).applyQuaternion(t.quaternion);
  const turned = Math.acos(Math.max(-1, Math.min(1, startFwd.dot(endFwd))));
  check('true-space pitch can pass the old nose wall',
    turned > 1.6,
    `turnedDeg=${(turned * 180 / Math.PI).toFixed(0)} dot=${startFwd.dot(endFwd).toFixed(2)}`);
}
{
  const t = new Ship(stubEngine, BODIES);
  t.worldPos.set(0, earth.radius + 200, 0);
  t.velocity.set(0, 0, 0);
  t.quaternion.identity();
  t.landed = false;
  t.fuel = 100;
  t.stats.ready = true;
  const turn = { pitch: 0, yaw: 0.65, roll: 1, thrustUp: false, descend: false, brake: false, assist: true, assistForward: 0, assistStrafe: 0 };
  const neutral = {
    pitch: 0, yaw: 0, roll: 0, thrustUp: false, descend: false, brake: false, assist: true,
    assistForward: 0, assistStrafe: 0,
    assistForwardDir: new THREE.Vector3(0, 0, -1),
  };
  for (let i = 0; i < 35; i++) t.tick(dt, true, turn);
  const bankedFwd = new THREE.Vector3(0, 0, 1).applyQuaternion(t.quaternion);
  for (let i = 0; i < 35; i++) t.tick(dt, true, neutral);
  const heldFwd = new THREE.Vector3(0, 0, 1).applyQuaternion(t.quaternion);
  check('assisted bank heading persists after release without camera basis reset', bankedFwd.dot(heldFwd) > 0.96,
    `dot=${bankedFwd.dot(heldFwd).toFixed(2)}`);
}
{
  const t = new Ship(stubEngine, BODIES);
  t.worldPos.set(0, earth.radius + 200, 0);
  t.velocity.set(0, 0, 0);
  t.quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
  t.landed = false;
  t.fuel = 100;
  t.stats.ready = true;
  const nose = new THREE.Vector3(0, 0, 1).applyQuaternion(t.quaternion);
  const oldCameraForward = new THREE.Vector3(0, 0, 1);
  const ctl = {
    pitch: 0, yaw: 0, roll: 0, thrustUp: false, descend: false, brake: false, assist: true,
    assistForward: 1, assistStrafe: 0,
    assistForwardDir: oldCameraForward,
  };
  for (let i = 0; i < 20; i++) t.tick(dt, true, ctl);
  const flatV = t.velocity.clone().addScaledVector(new THREE.Vector3(0, 1, 0), -t.velocity.y);
  check('assisted forward thrust follows ship nose, not camera forward', flatV.dot(nose) > flatV.dot(oldCameraForward) + 4,
    `noseDot=${flatV.dot(nose).toFixed(1)} cameraDot=${flatV.dot(oldCameraForward).toFixed(1)}`);
}
{
  const t = new Ship(stubEngine, BODIES);
  const aethelgard = getBody('aethelgard');
  t.worldPos.copy(aethelgard._centerV).add(new THREE.Vector3(0, aethelgard.radius + aethelgard.atmosphere.height + 30000, 0));
  t.velocity.set(0, 0, 0);
  t.quaternion.identity();
  t.landed = false;
  t.fuel = 100;
  t.stats.ready = true;
  const dt = 1 / 60;
  const pitchUp = { pitch: -1, yaw: 0, roll: 0, thrustUp: false, descend: false, brake: false, assist: true, assistForward: 0, assistStrafe: 0 };
  const burn = { pitch: 0, yaw: 0, roll: 0, thrustUp: false, descend: false, brake: false, assist: true, assistForward: 1, assistStrafe: 0 };
  for (let i = 0; i < 50; i++) t.tick(dt, true, pitchUp);
  const nose = new THREE.Vector3(0, 0, 1).applyQuaternion(t.quaternion).normalize();
  const ghost = new Ship(stubEngine, BODIES);
  ghost.worldPos.copy(t.worldPos);
  ghost.velocity.copy(t.velocity);
  ghost.quaternion.copy(t.quaternion);
  ghost.landed = false;
  ghost.fuel = 100;
  ghost.stats.ready = true;
  const coast = { pitch: 0, yaw: 0, roll: 0, thrustUp: false, descend: false, brake: false, assist: true, assistForward: 0, assistStrafe: 0 };
  for (let i = 0; i < 25; i++) t.tick(dt, true, burn);
  for (let i = 0; i < 25; i++) ghost.tick(dt, true, coast);
  const thrustDelta = t.velocity.clone().sub(ghost.velocity).normalize();
  check('true-space thrust follows pitched nose',
    thrustDelta.dot(nose) > 0.65,
    `deltaDot=${thrustDelta.dot(nose).toFixed(2)} vy=${t.velocity.y.toFixed(1)}`);
}
{
  const t = new Ship(stubEngine, BODIES);
  const zone = earth.landingZones.find(z => z.id === 'fortis_outpost');
  const insideBunker = offsetWorld(earth, zone, 40, 0, 3);
  t.placeAt(insideBunker, upAt(earth, insideBunker));
  t.landed = false;
  t.fuel = 100;
  t.stats.ready = true;
  t.velocity.set(0, 0, 0);
  const ctl = { pitch: 0, yaw: 0, roll: 0, thrustUp: false, brake: false, assist: true, assistForward: 0 };
  t.tick(1 / 60, true, ctl);
  const en = localOffset(earth, zone, t.worldPos);
  const outside = Math.abs(en.east - 40) >= 12.75 || Math.abs(en.north) >= 10.75;
  check('ship hull collides with authored structures', outside,
    `east=${en.east.toFixed(2)} north=${en.north.toFixed(2)}`);
}

console.log('\n== 8b. 2026-07-04 root-cause regressions ==');
{
  // Assisted flight can never pass below terrain (the old assist branch
  // returned before ground collision — ships flew through planets).
  const t = new Ship(stubEngine, BODIES);
  const zone = earth.landingZones.find(z => z.id === 'fortis_outpost');
  const start = zoneWorldPos(earth, zone, 40);
  t.placeAt(start, upAt(earth, start));
  t.landed = false;
  t.fuel = 100;
  t.stats.ready = true;
  const upD = upAt(earth, t.worldPos, new THREE.Vector3());
  t.velocity.copy(upD).multiplyScalar(-60); // diving hard
  const ctl = { pitch: 0, yaw: 0, roll: 0, thrustUp: false, brake: false, assist: true, assistForward: 1 };
  let minAlt = Infinity;
  for (let i = 0; i < 240; i++) {
    t.tick(1 / 60, true, ctl);
    minAlt = Math.min(minAlt, altitudeAt(earth, t.worldPos));
  }
  check('assisted flight clamps at the terrain, never through it', minAlt > -1.0,
    `minAlt=${minAlt.toFixed(2)}`);
}
{
  // Collision surface === rendered surface: every mesh vertex radius must
  // equal terrainRadiusAt along that vertex direction (mesh-true collision).
  const g = earth._terrainGrid;
  check('terrain collision grid exists after buildBodyVisual', !!g, g ? `${g.W}x${g.H}` : 'missing');
  let maxErr = 0;
  const dir = new THREE.Vector3();
  for (let k = 0; k < 500; k++) {
    const iy = 1 + Math.floor(Math.random() * (g.H - 2));
    const ix = Math.floor(Math.random() * g.W);
    const theta = (iy / g.H) * Math.PI, phi = (ix / g.W) * Math.PI * 2;
    dir.set(-Math.cos(phi) * Math.sin(theta), Math.cos(theta), Math.sin(phi) * Math.sin(theta)).normalize();
    const err = Math.abs(terrainRadiusAt(earth, dir) - g.radii[iy * (g.W + 1) + ix]);
    maxErr = Math.max(maxErr, err);
  }
  check('collision equals the rendered mesh at every vertex', maxErr < 1e-6, `maxErr=${maxErr}`);
  // And between vertices it must be continuous (no cliffs from cell logic).
  let maxJump = 0;
  for (let k = 0; k < 300; k++) {
    dir.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
    const r1 = terrainRadiusAt(earth, dir);
    const dir2 = dir.clone().add(new THREE.Vector3(1e-5, 1e-5, 0)).normalize();
    maxJump = Math.max(maxJump, Math.abs(terrainRadiusAt(earth, dir2) - r1));
  }
  check('collision surface is continuous (no seams)', maxJump < 0.5, `maxJump=${maxJump.toFixed(4)}`);
}
{
  // Player cannot fall through terrain even at high speed.
  const stubInput = { down: () => false, mouseDX: 0, mouseDY: 0 };
  const pl = new Player(stubEngine, stubInput, BODIES);
  const zone = earth.landingZones.find(z => z.id === 'earth_relay_south');
  pl.placeAt(zoneWorldPos(earth, zone, 80));
  const upD = upAt(earth, pl.worldPos, new THREE.Vector3());
  pl.velocity.copy(upD).multiplyScalar(-150);
  let minAlt = Infinity;
  for (let i = 0; i < 180; i++) {
    pl.tick(1 / 60, false);
    minAlt = Math.min(minAlt, altitudeAt(earth, pl.worldPos));
  }
  check('player never passes below the terrain surface', minAlt > -0.5, `minAlt=${minAlt.toFixed(2)}`);
}
{
  // The ship hull is solid to the player (and the roof is walkable).
  const stubInput = { down: () => false, mouseDX: 0, mouseDY: 0 };
  const pl = new Player(stubEngine, stubInput, BODIES);
  const t = new Ship(stubEngine, BODIES);
  const zone = earth.landingZones.find(z => z.id === 'fortis_outpost');
  const shipPos = zoneWorldPos(earth, zone, 1.95);
  t.placeAt(shipPos, upAt(earth, shipPos));
  pl.shipRef = t;
  // Put the player INSIDE the hull footprint.
  pl.placeAt(shipPos.clone());
  pl.tick(1 / 60, false);
  const local = pl.worldPos.clone().sub(t.worldPos).applyQuaternion(t.quaternion.clone().invert());
  const outsideOrOnTop = Math.abs(local.x) >= 2.35 || Math.abs(local.z) >= 6.4 || local.y >= 2.25;
  check('player cannot stand inside the ship hull', outsideOrOnTop,
    `local=${local.toArray().map(v => v.toFixed(2)).join(',')}`);
}

console.log('\n== 9. Dev editor tools ==');
{
  const testShip = new Ship(stubEngine, BODIES);
  readyShip(testShip);
  check('dev readyShip makes the ship flight-ready', testShip.stats.ready);
  check('dev readyShip fills fuel to capacity', testShip.fuel === testShip.stats.fuelCap && testShip.fuel > 0);
  check('dev readyShip installs the readiness-critical slots',
    !!testShip.modules.frame_core && !!testShip.modules.cockpit_fwd &&
    !!testShip.modules.engine_main && !!testShip.modules.power_bay &&
    !!testShip.modules.tank_left && testShip.stats.gearCount >= 3);

  const kitInv = new Inventory();
  giveInventoryKit(kitInv);
  check('dev giveInventoryKit adds resources', kitInv.count('salvage_alloy') >= 8 && kitInv.count('fuel_hydrazine') >= 8);
  check('dev giveInventoryKit adds installable parts', ITEMS.filter(i => i.kind === 'part').every(i => kitInv.count(i.id) >= 1));
}

console.log('\n== 10. Settings ==');
{
  const s = new Settings();
  check('settings defaults are sane', s.get('mouseSens') === 1.0 && s.get('touchSens') === 1.0 && s.get('graphics') === 'high' && s.get('sound') === 'on');
  s.set('mouseSens', 2.5);
  check('settings set/get round-trip', s.get('mouseSens') === 2.5);
  s.set('mouseSens', 5.0);
  check('settings clamp above max', s.get('mouseSens') === 3.0);
  s.set('mouseSens', -1.0);
  check('settings clamp below min', s.get('mouseSens') === 0.1);
  s.set('graphics', 'low');
  check('settings string value round-trip', s.get('graphics') === 'low');
  s.reset();
  check('settings reset restores defaults', s.get('mouseSens') === 1.0 && s.get('graphics') === 'high');
}

console.log('\n== 11. Space props ==');
{
  const sp = new SpaceProps(stubEngine);
  check('space props spawns between 40 and 60 objects', sp.props.length >= 40 && sp.props.length <= 60, `got ${sp.props.length}`);
  check('every prop is tracked by the engine', sp.props.every(p => p.trackEntry && p.trackEntry.object3d === p.mesh));
  check('props have world positions far from origin', sp.props.every(p => p.worldPos.length() >= 500000));
  sp.tick(0.016);
  check('space props tick does not throw', true);
}


console.log('\n== 12. Render layer: textures, props, grounding, detail collision ==');
{
  // Textures must be Node-safe (no document): every factory returns null here.
  check('textures are headless-safe (return null without a DOM)',
    RenderTextures.groundDetailTexture() === null &&
    RenderTextures.padTexture(0xff0000) === null &&
    RenderTextures.buildingWallTexture(1, 2) === null);

  // Prop builders produce real geometry.
  const rngA = (() => { let t = 42; return () => { t = (t * 1103515245 + 12345) & 0x7fffffff; return t / 0x7fffffff; }; })();
  const rock = RenderProps.makeRock(rngA, 0x888888);
  check('makeRock returns a mesh with vertices', rock.isMesh && rock.geometry.attributes.position.count > 20);
  const tree = RenderProps.makeTree(rngA, 0x4b3621, 0x6fa35f);
  check('makeTree returns trunk + canopy group', tree.isObject3D && tree.children.length >= 2);
  const hut = RenderProps.makeQuonsetHut(rngA, 12, 10, 0x4a5c66, 0xff0000, 0.6);
  check('makeQuonsetHut has foundation + shell + caps + door', hut.children.length >= 5);
  const gab = RenderProps.makeGabledBuilding(rngA, 10, 6, 8, 0x4a5c66, 0xff0000, 0.6);
  check('makeGabledBuilding has foundation + walls + roof + door', gab.children.length >= 4);

  // displace is deterministic for the same seed.
  const g1 = RenderProps.displace(new THREE.IcosahedronGeometry(2, 1), 0.5, 7);
  const g2 = RenderProps.displace(new THREE.IcosahedronGeometry(2, 1), 0.5, 7);
  let same = true;
  for (let i = 0; i < g1.attributes.position.array.length; i++) {
    if (Math.abs(g1.attributes.position.array[i] - g2.attributes.position.array[i]) > 1e-9) { same = false; break; }
  }
  check('displace is deterministic per seed', same);

  // Grounding: footprint sampling brackets the truth and normals are sane.
  const earth = getBody('earth');
  const zone = earth.landingZones[0];
  const fp = RenderProps.sampleFootprint(earth, zone._dirV, 6, 6, terrainRadiusAt);
  check('sampleFootprint: minR <= avgR <= maxR', fp.minR <= fp.avgR + 1e-9 && fp.avgR <= fp.maxR + 1e-9);
  check('sampleFootprint: flat pad normal is near-radial', fp.normal.dot(zone._dirV) > 0.99);

  // Settlement layout is deterministic and produces buildings + colliders.
  const layoutA = WorldDetails.computeSettlementLayout(earth, zone, 'mobile');
  const layoutB = WorldDetails.computeSettlementLayout(earth, zone, 'mobile');
  check('settlement layout is deterministic', JSON.stringify(layoutA) === JSON.stringify(layoutB));
  const colliders = WorldDetails.detailCollidersForLayout(layoutA);
  check('settlement layout emits building colliders', colliders.length >= 3 && colliders.every(c => c.kind === 'box' || c.kind === 'circle'));

  // Detail colliders integrate with planet collision: standing inside a
  // detail building must push the player out (no more walking through).
  zone._extraColliders = colliders;
  const bld = layoutA.find(sp => sp.type === 'gabled' || sp.type === 'quonset' || sp.type === 'tower');
  check('layout contains at least one building', !!bld);
  if (bld) {
    const pos = offsetWorld(earth, zone, bld.east, bld.north, 1.0);
    const moved = resolveStructureCollision(earth, pos, 0.45);
    const after = localOffset(earth, zone, pos);
    const clearedE = Math.abs(after.east - bld.east) >= bld.w / 2 - 0.2;
    const clearedN = Math.abs(after.north - bld.north) >= bld.d / 2 - 0.2;
    check('player inside a settlement building is pushed out', moved && (clearedE || clearedN),
      `east ${after.east.toFixed(1)} vs bld ${bld.east.toFixed(1)}`);
  }
  check('allCollidersForZone merges zone + detail colliders',
    allCollidersForZone(zone).length > colliders.length - 1);
  zone._extraColliders = undefined;

  // Lighting: init + update against a stub engine, on-surface vs in space.
  const { initLighting, updateLighting } = await import('../src/render/lighting.js');
  const fakeRenderer = { outputColorSpace: null, toneMapping: null, toneMappingExposure: 0, shadowMap: {} };
  const lscene = new THREE.Scene();
  const lengine = { scene: lscene, renderer: fakeRenderer, cameraWorldPos: new THREE.Vector3() };
  const L = initLighting(lengine, new Settings());
  check('lighting creates sun + hemi + fog', !!L.sun && !!L.hemi && !!lscene.fog);
  // On Earth's surface: fog should be on; far in space: off.
  lengine.cameraWorldPos.copy(zoneWorldPosOf(earth, zone, 2));
  updateLighting(L, lengine, BODIES);
  const fogOnGround = lscene.fog.density;
  lengine.cameraWorldPos.set(9e7, 9e7, 9e7);
  updateLighting(L, lengine, BODIES);
  check('fog exists at the surface and dies in space', fogOnGround > 1e-5 && lscene.fog.density === 0,
    `ground ${fogOnGround}, space ${lscene.fog.density}`);
}

function zoneWorldPosOf(body, zone, extraHeight = 0) {
  const r = terrainRadiusAt(body, zone._dirV) + extraHeight;
  return zone._dirV.clone().multiplyScalar(r).add(body._centerV);
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

function resolvesItem(itemId) {
  try { return !!getItem(itemId); }
  catch { return false; }
}

function bodyMatchesSchema(b) {
  const num = (n) => typeof n === 'number' && Number.isFinite(n);
  const vec3 = (v) => Array.isArray(v) && v.length === 3 && v.every(num);
  const colorRamp = b.colors && num(b.colors.low) && num(b.colors.mid) && num(b.colors.high) &&
    (b.colors.water === undefined || num(b.colors.water));
  const atmosphere = b.atmosphere === null ||
    (b.atmosphere && num(b.atmosphere.color) && num(b.atmosphere.height) && num(b.atmosphere.density));
  const terrain = b.terrain && num(b.terrain.seed) && num(b.terrain.amplitude) &&
    num(b.terrain.octaves) && num(b.terrain.freq);
  const zones = Array.isArray(b.landingZones) && b.landingZones.every((z) =>
    z.id && z.name && vec3(z.dir) && num(z.angularRadius) && typeof z.flatten === 'boolean' &&
    (z.factionId === null || z.factionId === undefined || typeof z.factionId === 'string') &&
    (!z.discovery || (z.discovery.resourceItemId && typeof z.discovery.note === 'string')));
  return b.id && b.name && vec3(b.position) && num(b.radius) && b.radius > 0 &&
    num(b.surfaceGravity) && b.surfaceGravity > 0 && colorRamp && atmosphere &&
    terrain && (b.seaLevel === null || num(b.seaLevel)) && zones;
}
