# Controls, Camera, and Vehicle Wiring Guide

Status as of 2026-07-04.

This guide is for Jaron or any agent who needs to change ship controls without
guessing through chat history. It explains where the keyboard/touch input,
camera, and ship physics are wired.

Important current repo note: this guide is rebased on top of Claude/Fable's
2026-07-04 root-cause repair (`e056ff7` on `origin/main`), which removed the
assisted-flight early return, restored a chase camera that follows the ship,
made terrain collision mesh-true, and added a solid ship hull.

Critical 2026-07-04 lesson from Jaron's phone tests: physics rotation is not
enough. The ship quaternion was changing while the visible `ship.group`
remained visually fixed because the floating-origin renderer only copied
position. Vehicle work must verify both:

- `game.ship.quaternion`
- `game.ship.group.quaternion`

They should match during play. The ship now registers its visual with
`trackWorldObject({ worldPos, object3d, quaternion })`, and `engine.js` copies
that quaternion during floating-origin sync.

## The Files That Matter

### Raw Input

File: `src/core/engine.js`

This owns raw keyboard/mouse state:

- `Input.keys`: real keyboard keys currently down.
- `Input.virtualKeys`: touch buttons/joystick pretending to be keyboard keys.
- `Input.mouseDX` / `Input.mouseDY`: pointer-lock mouse movement or touch-look movement.
- `Input.down(code)`: the main way gameplay asks "is this key down?"

Change this file only if you need a new kind of input device or raw input state.
Most control changes should happen in `src/main.js`, not here.

### Mobile Touch Controls

File: `src/ui/touch.js`

This owns the on-screen analog stick and mobile buttons.

Key places:

- `joystickShipControls(dx, dy, radius)` maps analog stick movement to ship
  steering/throttle.
- `setMove(dx, dy, radius)` decides whether the stick controls on-foot movement
  or ship movement.
- The look handler near the bottom adds to `input.mouseDX` / `input.mouseDY`
  only for touches outside the joystick/buttons/panels.

If mobile analog left/right feels backwards, change the sign in
`joystickShipControls`.

Current ship mapping:

```js
return {
  yaw: axes.x * 0.65,
  pitch: 0,
  throttle: -axes.y,
};
```

### Keyboard-To-Ship Routing

File: `src/main.js`

Function: `readShipControls(dt)`

This is the most important place for changing ship keybindings.

It converts keyboard/touch input into one `controls` object:

```js
const controls = { pitch: 0, yaw: 0, roll: 0, thrustUp: false, brake: false };
```

Current mapping in this repo:

- `W`: forward throttle
- `S`: reverse
- `A`: strafe left
- `D`: strafe right
- `Q`: bank/turn left
- `R`: bank/turn right
- `ArrowUp`: nose up in high flight/free attitude
- `ArrowDown`: nose down in high flight/free attitude
- `Space`: thrust/lift up
- `Z`: descend
- `X` / Ctrl: brake
- Touch analog: forward/reverse + strafe + auto-lift while held
- Touch BANK buttons: ship heading/roll, not camera orbit
- Touch NOSE buttons: high-flight pitch
- Touch DESCEND: overrides lift for landing

Current missing gameplay verbs:

- Weapon, scanner, and shield modules are stat-accounted, but FIRE/SCAN/SHIELD
  actions are not implemented yet.

### Ship Camera

File: `src/main.js`

Function: `updateCamera(dt)`

This decides where the camera is while:

- on foot
- piloting in chase camera
- piloting in cockpit camera

Current chase behavior:

- `chaseCam`: true = third-person locked chase, false = cockpit.
- Chase camera sits behind/above the ship nose.
- Chase camera follows the ship's real 3D nose, so pitch is visible in
  high-flight/free-attitude mode.
- Chase camera uses current planet up as its preferred up vector, so ship
  banking does not roll the horizon unless the nose is nearly vertical and a
  fallback up vector is needed.
- BANK/Q/R, NOSE buttons, and analog controls must never directly orbit the
  camera. They rotate/move the ship; the camera follows as a rig.

This file should be the only place where ship camera behavior is changed. Ship
physics should not read mouse input directly.

### Ship Physics And Rotation

File: `src/ship/ship.js`

Function: `tick(dt, piloted, controls)`

This owns what the ship actually does with the controls.

In assisted mode, current flow is:

1. `controls.yaw` rotates the ship quaternion around local planet up.
2. `controls.pitch` updates stored `assistPitch` once the ship is safely
   airborne (`alt > 60` in `ship.js`).
3. Ship forward is calculated from local `+Z`.
4. `controls.assistForward` accelerates along flat forward near the ground and
   along the real 3D nose in high flight.
5. `controls.thrustUp` accelerates along planet up.
6. Damp/brake/speed cap are applied.
7. Position is updated.

Important convention:

- The ship's front/nose/windows should point along local `+Z`.
- The ship's local up is `+Y`.
- The camera is a view adapter; the ship's real direction is `ship.quaternion`.

### Ship Visual Front

File: `src/ship/ship.js`

Function: `rebuildVisual()`

This code builds the Fortis visual. If the glass/nose looks like it points a
different way than physics, controls will feel wrong even if the math is right.

The current physics says ship front is local `+Z`. Keep the cockpit glass/nose
on the positive-Z side of the visual.

## Current Working Control Map From Jaron's Phone Tests

This is the behavior Jaron confirmed felt right, plus the high-flight pitch
addition:

- `W`: forward thrust through the ship's front/windows.
- `S`: reverse thrust through the ship's back.
- `A`: strafe left.
- `D`: strafe right.
- `Space`: thrust up.
- `R`: bank/turn right.
- `Q`: bank/turn left.
- `ArrowUp`: pitch nose up once safely airborne.
- `ArrowDown`: pitch nose down once safely airborne.
- Mouse cursor / mouse look: on-foot camera only; ship chase stays locked.
- Mobile analog: ship forward/reverse/strafe + lift while held.
- Mobile BANK buttons: turn-bank the ship.
- Mobile NOSE buttons: pitch the ship in high flight.
- Mobile look drag outside the analog: do not use for ship chase orbit unless
  a separate free-camera mode is deliberately added.

## How The Working Map Is Wired

### 1. `Q` / `R` Bank-Turn

Open `src/main.js`, find `readShipControls(dt)`.

```js
const keyRoll = (input.down('KeyR') ? 1 : 0) - (input.down('KeyQ') ? 1 : 0);
controls.yaw = keyRoll * 0.65;
controls.roll = keyRoll;
```

Open `src/ship/ship.js`. Assisted mode rebuilds an upright basis for phone
stability, then applies stored roll:

```js
this.assistRoll = (this.assistRoll || 0) + (controls.roll || 0) * ROLL_RATE * torqueMul * dt;
this.assistRoll *= Math.max(0, 1 - 1.5 * dt);
_q.setFromAxisAngle(fwdFlat, this.assistRoll);
this.quaternion.premultiply(_q).normalize();
```

Do not move the camera directly here. Rotate the ship; the locked chase rig
will follow.

### 2. `ArrowUp` / `ArrowDown` And NOSE Buttons

Open `src/main.js`, `readShipControls(dt)`.

```js
const keyPitch = (input.down('ArrowDown') ? 1 : 0) - (input.down('ArrowUp') ? 1 : 0);
controls.pitch = keyPitch;
```

Open `src/ui/touch.js`. Mobile NOSE buttons set the same virtual keys:

```html
<button data-code="ArrowUp">NOSE UP</button>
<button data-code="ArrowDown">NOSE DOWN</button>
```

Open `src/ship/ship.js`. Assisted mode only applies stored pitch once safely
airborne:

```js
freeAttitude = !this.landed && alt > 60;
this.assistPitch = (this.assistPitch || 0) + (controls.pitch || 0) * ASSIST_PITCH_RATE * torqueMul * dt;
```

If the buttons feel backwards in a phone test, flip the subtraction in
`keyPitch`. Do not solve it by rotating the camera.

### 3. Keep `W` / `S` As Nose Thrust

Open `src/main.js`, `readShipControls(dt)`.

```js
const keyForward = (input.down('KeyW') ? 1 : 0) - (input.down('KeyS') ? 1 : 0);
controls.assistForward = assistForward;
```

Open `src/ship/ship.js`, assisted mode. Near the ground this uses flat forward
for stable landings. In high flight it uses the ship's real pitched nose:

```js
const assistFwd = freeAttitude
  ? _assistFwd3.set(0, 0, 1).applyQuaternion(this.quaternion).normalize()
  : fwdFlat;
```

### 4. Keep `A` / `D` As Strafe, Not Camera And Not Yaw

```js
const keySide = (input.down('KeyD') ? 1 : 0) - (input.down('KeyA') ? 1 : 0);
const assistStrafe = input.touchMode ? (input.touchShipYaw || 0) : keySide;
controls.assistStrafe = assistStrafe;
```

### 5. Chase Camera Rule

The ship chase camera is a locked rig. It follows the ship's real 3D nose and
uses planet-up as the preferred up vector:

```js
_shipCamFwd.set(0, 0, 1).applyQuaternion(ship.quaternion);
_cm.lookAt(camPos, _shipCamTarget, _shipCamViewUp);
```

BANK, NOSE, analog, W/S, and A/D should never directly orbit this camera. They
change the ship; the camera follows.

Option B: camera is independent unless the player moves camera.

This was the old Codex-style camera lock. It can make the ship turn under the
camera, which some people like for editor mode, but it made the vehicle feel
like it had no front. Do not restore it for normal piloting unless Jaron asks
for a separate editor/free-camera mode.

For the desired "space/flying game" feel, start with Option A. If that feels too
spinny, add smoothing:

```js
shipCamBaseQuat.slerp(ship.quaternion, Math.min(1, 7 * dt));
_cv.applyQuaternion(shipCamBaseQuat);
```

That follows the ship front, but not instantly.

## Quick Debug Checklist

When a control feels wrong, check these in order:

1. Is the key mapped in `src/main.js` -> `readShipControls(dt)`?
2. Does `src/ship/ship.js` actually use that `controls.*` field?
3. Is the camera also reading that same key in `updateCamera(dt)`?
4. Is the ship visual front aligned with physics local `+Z`?
5. Is assisted mode returning early before gravity/collision/rotation code you expect?
6. Are mobile touches being converted in `src/ui/touch.js` instead of keyboard?

## Console Snippets For Debugging

Temporary debug log in `readShipControls(dt)`:

```js
if (Math.abs(controls.yaw) || Math.abs(controls.assistForward) || controls.roll) {
  console.log('ship controls', {
    forward: controls.assistForward,
    yaw: controls.yaw,
    roll: controls.roll,
    thrustUp: controls.thrustUp,
  });
}
```

Temporary debug log in `src/ship/ship.js` after calculating `fwdFlat`:

```js
console.log('ship front', fwdFlat.toArray().map(n => n.toFixed(2)).join(','));
```

Remove these logs before pushing live unless they are behind a dev flag.

## Current Biggest Design Warning

The current assisted mode is trying to be phone-friendly by keeping the ship
upright to the nearest planet. That is useful, but it fights true aircraft/space
roll. If `Q`/`R` roll becomes important, assisted mode needs a deliberate bank
angle instead of rebuilding the ship as perfectly upright every frame.

In short:

- Yaw-only hovercraft feel: current assisted mode is close.
- Full flight feel with roll: add stored bank/roll or use non-assisted 6DOF.
- Walk-in vehicle future: pilot camera/seat should become an anchor inside the
  ship, but the same input boundaries should remain.
