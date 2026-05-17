import { EntityId, hasComponent, query } from "bitecs";
import { GameWorld } from "../game/scenes/Game";
import { Position } from "../components/MovementComponents";
import { Team } from "../components/TagComponents";
import { HitCircle, DetectCircle } from "../components/StatComponents";

const queryBuffer: EntityId[] = [];

export const colliderSystem = (world: GameWorld) => {
    const attackers = query(world, [Position, HitCircle, Team]);

    for (const attackerId of attackers) {
        const sourceX = Position.x[attackerId] + (HitCircle.offsetX[attackerId] || 0);
        const sourceY = Position.y[attackerId] + (HitCircle.offsetY[attackerId] || 0);
        const sourceRadius = HitCircle.radius[attackerId];
        
        world.spatialHash.getNearby(sourceX, sourceY, queryBuffer);
        for (const targetId of queryBuffer) {
            
            if (attackerId === targetId) continue; // Skip self
            if (Team.id[attackerId] === Team.id[targetId]) continue; // Skip same team
            if (!hasComponent(world, targetId, DetectCircle)) continue;

            const targetX = Position.x[targetId] + (DetectCircle.offsetX[targetId] || 0);
            const targetY = Position.y[targetId] + (DetectCircle.offsetY[targetId] || 0);
            const targetRadius = DetectCircle.radius[targetId] || 0;

            const dx = sourceX - targetX;
            const dy = sourceY - targetY;
            const distSquared = dx * dx + dy * dy;
            const radiiSum = sourceRadius + targetRadius;

            if (distSquared < (radiiSum * radiiSum)) {
                world.events.overlapEvents.push({ source: attackerId, target: targetId });
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