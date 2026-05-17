import { EntityId, hasComponent, query } from "bitecs";
import { GameWorld } from "../game/scenes/Game";
import { Position } from "../components/MovementComponents";
import { HitCircle, HurtCircle } from "../components/StatComponents";
import { OVERLAP_LAYERS } from "../common/Constants";

const queryBuffer: EntityId[] = [];

export const colliderSystem = (world: GameWorld) => {
    const sources = query(world, [Position, HitCircle]);

    for (const sourceId of sources) {
        const sourceMask = HitCircle.mask[sourceId];
        if (sourceMask === OVERLAP_LAYERS.NONE) continue;

        const sourceX = Position.x[sourceId] + (HitCircle.offsetX[sourceId] || 0);
        const sourceY = Position.y[sourceId] + (HitCircle.offsetY[sourceId] || 0);
        const sourceRadius = HitCircle.radius[sourceId];

        world.spatialHash.getNearby(sourceX, sourceY, queryBuffer);

        for (const targetId of queryBuffer) {
            if (sourceId === targetId) continue; // Skip self
            if (!hasComponent(world, targetId, HurtCircle)) continue;
            const targetMask = HurtCircle.layer[targetId];
            if ((sourceMask & targetMask) === 0) continue; // Masking check

            const targetX = Position.x[targetId] + (HurtCircle.offsetX[targetId] || 0);
            const targetY = Position.y[targetId] + (HurtCircle.offsetY[targetId] || 0);
            const targetRadius = HurtCircle.radius[targetId] || 0;

            const dx = sourceX - targetX;
            const dy = sourceY - targetY;
            const distSquared = dx * dx + dy * dy;
            const radiiSum = sourceRadius + targetRadius;

            if (distSquared < (radiiSum * radiiSum)) {
                world.events.overlapEvents.push({ source: sourceId, target: targetId });
            }
        }
    }

}

export function constrainToMap(position: number, offset: number, halfSize: number, minBound: number, maxBound: number): { pos: number, collided: boolean } {
    const edgeMin = position + offset - halfSize;
    const edgeMax = position + offset + halfSize;

    if (edgeMin < minBound) {
        return { pos: minBound - offset + halfSize, collided: true };
    } else if (edgeMax > maxBound) {
        return { pos: maxBound - offset - halfSize, collided: true };
    }
    return { pos: position, collided: false };
}