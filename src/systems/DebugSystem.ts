import { query } from "bitecs";
import { Collider, Position } from "../components/MovementComponents";
import { GameWorld } from "../game/scenes/Game";


export const debugSystem = (world: GameWorld) => {
    const debugGraphics = world.debugGraphics;
    debugGraphics.clear();
    debugGraphics.lineStyle(1, 0x00ff00, 1);

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

        // Optional: Draw a tiny cross at the actual Position.x/y (the pivot)
        debugGraphics.lineStyle(1, 0xff0000, 1); // Red for pivot
        debugGraphics.lineBetween(x - 2, y, x + 2, y);
        debugGraphics.lineBetween(x, y - 2, x, y + 2);
        debugGraphics.lineStyle(1, 0x00ff00, 1); // Reset to Green
    }
}
