import { query } from "bitecs";
import { Collider, Position } from "../components/MovementComponents";
import { GameWorld } from "../game/scenes/Game";
import { HitCircle, HurtCircle } from "../components/AbilityComponents";

const DEBUG_COLLIDER = false;
const DEBUG_HURT_CIRCLE = false;
const DEBUG_HIT_CIRCLE = false;

export const debugSystem = (world: GameWorld) => {
    const debugGraphics = world.debugGraphics;
    debugGraphics.clear();
    debugGraphics.lineStyle(1, 0x00ff00, 1);

    if (DEBUG_COLLIDER) { // Green
        for (const eid of query(world, [Position, Collider])) {
            const x = Position.x[eid];
            const y = Position.y[eid];
            const w = Collider.width[eid];
            const h = Collider.height[eid];
            const offX = Collider.offsetX[eid] ?? 0;
            const offY = Collider.offsetY[eid] ?? 0;
            debugGraphics.strokeRect(
                x + offX - (w / 2), 
                y + offY - (h / 2), 
                w, 
                h
            );
        }
    }

    if (DEBUG_HURT_CIRCLE) {
        debugGraphics.lineStyle(1, 0xff0000, 1); //Red
        for (const eid of query(world, [Position, HurtCircle])) {
            const radius = HurtCircle.radius[eid];
            if (radius <= 0) continue;

            const x = Position.x[eid] + (HurtCircle.offsetX[eid] ?? 0);
            const y = Position.y[eid] + (HurtCircle.offsetY[eid] ?? 0);

            debugGraphics.strokeCircle(x, y, radius);
        }
    }

    if (DEBUG_HIT_CIRCLE) {
        debugGraphics.lineStyle(1, 0x00ffff, 1); // Cyan
        for (const eid of query(world, [Position, HitCircle])) {
            const radius = HitCircle.radius[eid];
            if (radius <= 0) continue;

            const x = Position.x[eid] + (HitCircle.offsetX[eid] ?? 0);
            const y = Position.y[eid] + (HitCircle.offsetY[eid] ?? 0);

            debugGraphics.strokeCircle(x, y, radius);
        }
    }



}
