import { query } from "bitecs";
import { Collider, Position } from "../components/MovementComponents";
import { GameWorld } from "../game/scenes/Game";
import { HurtCircle } from "../components/AbilityComponents";


const DEBUG_COLLIDER = false;
const DEBUG_HURT_CIRCLE = true;

export const debugSystem = (world: GameWorld) => {
    const debugGraphics = world.debugGraphics;
    debugGraphics.clear();
    debugGraphics.lineStyle(1, 0x00ff00, 1);

    //Collider Debug Rectangles
    if (DEBUG_COLLIDER) {
        for (const eid of query(world, [Position, Collider])) {
            const x = Position.x[eid];
            const y = Position.y[eid];
            const w = Collider.width[eid];
            const h = Collider.height[eid];
            const offX = Collider.offsetX[eid] ?? 0;
            const offY = Collider.offsetY[eid] ?? 0;

            // Draw the rectangle centered on Position + Offset
            // We subtract w/2 and h/2 because Position is the center
            debugGraphics.strokeRect(
                x + offX - (w / 2), 
                y + offY - (h / 2), 
                w, 
                h
            );
        }
    }

    // Hurt Circle Debug
    if (DEBUG_HURT_CIRCLE) {
        debugGraphics.lineStyle(1, 0xff0000, 1);
        for (const eid of query(world, [Position, HurtCircle])) {
            const radius = HurtCircle.radius[eid];
            if (radius <= 0) continue;

        const x = Position.x[eid] + (HurtCircle.offsetX[eid] ?? 0);
        const y = Position.y[eid] + (HurtCircle.offsetY[eid] ?? 0);

        debugGraphics.strokeCircle(x, y, radius);
        }
    }
}
