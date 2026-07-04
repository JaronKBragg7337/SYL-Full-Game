# Controls, Camera, and Vehicle Wiring Guide

Status as of 2026-07-04.

This guide is for Jaron or any agent who needs to change ship controls without
guessing through chat history. It explains where the keyboard/touch input,
camera, and ship physics are wired.

Important current repo note: this guide is rebased on top of Claude/Fable's
2026-07-04 root-cause repair (`e056ff7` on `origin/main`), which removed the
assisted-flight early return, restored a chase camera that follows the ship,
made terrain collision mesh-true, and added a solid ship hull.

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
- `A`: yaw left
- `D`: yaw right
- `Space`: thrust/lift up
- `X` / Ctrl: brake
- Touch analog: forward/reverse + yaw

Current missing mapping:

- `Q` / `R` roll is not wired in assisted mode.
- Arrow keys are not wired as ship camera controls.

### Ship Camera

File: `src/main.js`

Function: `updateCamera(dt)`

This decides where the camera is while:

- on foot
- piloting in chase camera
- piloting in cockpit camera

Key variables:

- `chaseCam`: true = third-person chase, false = cockpit.
- `shipTouchCamYaw` / `shipTouchCamPitch`: extra orbit offset for chase camera.
- `shipCamBaseQuat`: current chase-camera base orientation.

This file should be the only place where ship camera orbit is changed. Ship
physics should not read mouse input directly.

### Ship Physics And Rotation

File: `src/ship/ship.js`

Function: `tick(dt, piloted, controls)`

This owns what the ship actually does with the controls.

In assisted mode, current flow is:

1. `controls.yaw` rotates the ship quaternion around local planet up.
2. Ship forward is calculated from local `+Z`.
3. `controls.assistForward` accelerates along that forward direction.
4. `controls.thrustUp` accelerates along planet up.
5. Damp/brake/speed cap are applied.
6. Position is updated.

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

## Desired Control Map From Jaron

This is the target behavior Jaron described:

- `W`: forward thrust through the ship's front/windows.
- `S`: reverse thrust through the ship's back.
- `A`: turn/yaw the ship left.
  - The front/windows rotate left.
  - The back shifts right/opposite.
  - This is ship rotation, not camera orbit.
- `D`: turn/yaw the ship right.
  - The front/windows rotate right.
  - The back shifts left/opposite.
  - This is ship rotation, not camera orbit.
- `Space`: thrust up.
- `R`: roll the ship one direction.
- `Q`: roll the ship the opposite direction.
- Arrow keys: camera only.
- Mouse cursor / mouse look: camera only.
- Mobile analog: ship forward/reverse/yaw only.
- Mobile look drag outside the analog: camera only.

## How To Wire That Exact Map

### 1. Wire `Q` / `R` Roll

Open `src/main.js`, find `readShipControls(dt)`.

Current code has:

```js
controls.roll = 0;
```

Change it to:

```js
const keyRoll = (input.down('KeyR') ? 1 : 0) - (input.down('KeyQ') ? 1 : 0);
controls.roll = keyRoll;
```

Then open `src/ship/ship.js`.

Current assisted mode ignores roll because it forces the ship upright with:

```js
_mobileMatrix.makeBasis(_mobileRight, up, fwdFlat);
this.quaternion.setFromRotationMatrix(_mobileMatrix);
this.angVel.set(0, 0, 0);
```

That means even if `controls.roll` is set, assisted mode erases it. To make
roll real, assisted mode needs a stored bank/roll angle or it needs to stop
fully rebuilding the quaternion from `right/up/forward` every frame.

Safer first version:

- Add a `this.assistRoll = 0` field to the ship.
- In assisted mode, update it from `controls.roll`.
- After making the upright basis, rotate around `fwdFlat` by `this.assistRoll`.

Pseudo-shape:

```js
this.assistRoll = (this.assistRoll || 0) + controls.roll * ROLL_RATE * dt;
this.assistRoll *= Math.max(0, 1 - 1.5 * dt); // auto-level slowly
_q.setFromAxisAngle(fwdFlat, this.assistRoll);
this.quaternion.premultiply(_q).normalize();
```

If you want permanent aircraft-style roll, lower or remove the auto-level line.

### 2. Keep `W` / `S` As Nose Thrust

Open `src/main.js`, `readShipControls(dt)`.

This part is correct for the desired map:

```js
const keyForward = (input.down('KeyW') ? 1 : 0) - (input.down('KeyS') ? 1 : 0);
controls.assistForward = assistForward;
```

Open `src/ship/ship.js`, assisted mode.

This is the important physics line:

```js
this.velocity.addScaledVector(fwdFlat, forward * ASSIST_FORWARD_ACCEL * dt);
```

That means W/S thrust through the ship's calculated front. If it feels like W
does not push through the windows, inspect the visual orientation in
`rebuildVisual()`. The glass/front must be on local `+Z`.

### 3. Keep `A` / `D` As Ship Yaw, Not Camera

Open `src/main.js`, `readShipControls(dt)`.

Current mapping:

```js
const keyYaw = (input.down('KeyD') ? 1 : 0) - (input.down('KeyA') ? 1 : 0);
controls.yaw = input.touchMode ? (input.touchShipYaw || 0) : keyYaw;
```

If left/right are backwards, flip the subtraction:

```js
const keyYaw = (input.down('KeyA') ? 1 : 0) - (input.down('KeyD') ? 1 : 0);
```

Open `src/ship/ship.js`, assisted mode.

This is the yaw rotation. The negative sign is deliberate in the current build:
D / stick-right should turn right under the chase camera.

```js
_q.setFromAxisAngle(up, -controls.yaw * ASSIST_YAW_RATE * dt);
this.quaternion.premultiply(_q).normalize();
```

If A/D visually turn the camera instead of the ship, the issue is probably in
`updateCamera(dt)`, not here.

### 4. Wire Arrow Keys To Camera Only

Open `src/main.js`, `updateCamera(dt)`.

Right now chase camera orbit is mostly mouse/touch based:

```js
shipTouchCamYaw -= input.mouseDX * 0.003;
shipTouchCamPitch = ...
```

Add keyboard camera input near the same place:

```js
const arrowYaw = (input.down('ArrowRight') ? 1 : 0) - (input.down('ArrowLeft') ? 1 : 0);
const arrowPitch = (input.down('ArrowDown') ? 1 : 0) - (input.down('ArrowUp') ? 1 : 0);
shipTouchCamYaw += arrowYaw * 1.8 * dt;
shipTouchCamPitch = Math.max(-0.75, Math.min(0.55, shipTouchCamPitch + arrowPitch * 1.2 * dt));
```

Do not send arrow keys into `controls.yaw`, `controls.pitch`, or `controls.roll`
if the arrows should be camera only.

### 5. Decide The Chase Camera Rule

There are two valid choices. Pick one deliberately.

Option A: camera follows the ship front like many arcade flight games.

This is the current post-Claude behavior and should stay the default.

In `updateCamera(dt)`, chase camera should apply `ship.quaternion` directly:

```js
_cv.applyQuaternion(ship.quaternion);
```

This means when the ship yaws, the camera swings with it and the world turns on
screen. It feels like the camera is attached behind the ship.

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
