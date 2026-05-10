import { addComponent, hasComponent, query, removeComponent } from "bitecs";
import { GameWorld } from "../game/scenes/Game";
import { MoveTo } from "../components/MovementComponents";
import { Player } from "../components/TagComponents";

const deadzone = 0.1;

export const inputSystem = (world: GameWorld) => {

    const players = query(world, [Player]);
    const playerId = players.length > 0 ? players[0] : -1;
    
    if (playerId < 0) {
        console.error("No player entity found for input system");
        return;
    }

    const { cursors, wasdKeys, gamepad, pointer } = world.input;
    let rawX = 0;
    let rawY = 0;

    // 1. Keyboard (Arrows & WASD)
    if (cursors.left.isDown || wasdKeys.A.isDown) rawX -= 1;
    if (cursors.right.isDown || wasdKeys.D.isDown) rawX += 1;
    if (cursors.up.isDown || wasdKeys.W.isDown) rawY -= 1;
    if (cursors.down.isDown || wasdKeys.S.isDown) rawY += 1;

    // 2. Gamepad (Overrides keyboard if active)
    const pad = gamepad?.pad1;
    if (pad) {
        const stickX = pad.axes[0].getValue();
        const stickY = pad.axes[1].getValue();

        if (Math.abs(stickX) > deadzone || Math.abs(stickY) > deadzone) {
            rawX = stickX;
            rawY = stickY;
        }
    }

    //Normalize diagonal movement
    const lengthSquared = rawX * rawX + rawY * rawY;
    if (lengthSquared > 1) {
        const length = Math.sqrt(lengthSquared);
        rawX /= length;
        rawY /= length;
    }
    
    //Any movement is given priority over moveTo
    if (rawX !== 0 || rawY !== 0) {
        if (hasComponent(world, playerId, MoveTo)) {
            removeComponent(world, playerId, MoveTo);
        }
    }

    // 3. Touch / Pointer (Overrides others if active)
    if (pointer.isDown) {
        if (!hasComponent(world, playerId, MoveTo)) {
            addComponent(world, playerId, MoveTo);
        }

        //This is here so dragging works
        const worldPoint = world.scene.cameras.main.getWorldPoint(pointer.x, pointer.y);
        MoveTo.x[playerId] = worldPoint.x;
        MoveTo.y[playerId] = worldPoint.y;
        rawX = 0;
        rawY = 0;

    }

    world.input.xAxis = rawX;
    world.input.yAxis = rawY;
}