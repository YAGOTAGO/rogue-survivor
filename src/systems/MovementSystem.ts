import { addComponent, EntityId, hasComponent, query, removeComponent } from "bitecs"
import { Collider, MoveTo, Position, Speed, Velocity } from "../components/MovementComponents"
import { constrainToMap } from "./ColliderSystem";
import { ActiveKnockback, Enemy, OrbitPlayer, Player } from "../components/StatComponents";
import { GameWorld } from "../common/ECS";

const ENEMY_SEPARATION_RADIUS = 24; // pixels
const QUERY_BUFFER: EntityId[] = [];

// Tile Map Facts
const TILE_SIZE = 32;
const PADDING_X = 10 * TILE_SIZE;
const PADDING_Y = 8 * TILE_SIZE;
const MAP_WIDTH = 83 * TILE_SIZE;
const MAP_HEIGHT = 73 * TILE_SIZE;
const BOUNDS = {
    left: PADDING_X,
    top: PADDING_Y,
    right: MAP_WIDTH - PADDING_X,
    bottom: MAP_HEIGHT - PADDING_Y
};

export const movementSystem = (world: GameWorld) => {
    const dt = world.time.delta / 1000;

    for (const eid of query(world, [Position, Velocity, Collider])) {
        const vx = Velocity.x[eid] * dt;
        const vy = Velocity.y[eid] * dt;
        if(vx === 0 && vy === 0) continue;

        const halfWidth = Collider.width[eid] / 2;
        const halfHeight = Collider.height[eid] / 2;
        const offsetX = Collider.offsetX[eid] ?? 0;
        const offsetY = Collider.offsetY[eid] ?? 0;

        const resultX = constrainToMap(Position.x[eid] + vx, offsetX, halfWidth, BOUNDS.left, BOUNDS.right);
        Position.x[eid] = resultX.pos;
        if (resultX.collided) Velocity.x[eid] = 0;

        const resultY = constrainToMap(Position.y[eid] + vy, offsetY, halfHeight, BOUNDS.top, BOUNDS.bottom);
        Position.y[eid] = resultY.pos;
        if (resultY.collided) Velocity.y[eid] = 0;
    }
}

export const moveToSystem = (world: GameWorld) => {
    for (const eid of query(world, [Position, MoveTo, Speed, Velocity])){
        if (hasComponent(world, eid, ActiveKnockback)) continue;

        const dx = MoveTo.x[eid] - Position.x[eid];
        const dy = MoveTo.y[eid] - Position.y[eid];
        const distSquared = dx * dx + dy * dy;
        
        if (distSquared < 25) {
            Velocity.x[eid] = 0;
            Velocity.y[eid] = 0;
        } else {
            let distance = Math.sqrt(distSquared);
            Velocity.x[eid] = (dx / distance) * Speed.value[eid];
            Velocity.y[eid] = (dy / distance) * Speed.value[eid];
        }
    }
}

export const orbitPlayerSystem = (world: GameWorld) => {
    const dt = world.time.delta / 1000;
    const player = query(world, [Player]);
    if (player.length === 0) return;
    const playerId = player[0];
    const playerX = Position.x[playerId];
    const playerY = Position.y[playerId];

    for (const eid of query(world, [OrbitPlayer])){
        OrbitPlayer.baseAngle[eid] += OrbitPlayer.speed[eid] * dt;
        OrbitPlayer.baseAngle[eid] %= (Math.PI * 2);

        const radius = OrbitPlayer.radius[eid];
        const currentAngle = OrbitPlayer.baseAngle[eid];

        Position.x[eid] = playerX + Math.cos(currentAngle) * radius;
        Position.y[eid] = playerY + Math.sin(currentAngle) * radius;
    }

}

export const followPlayerSystem = (world: GameWorld) => {
    const players = query(world, [Player]);
    if (players.length === 0) return;
    
    const playerId = players[0];
    const playerX = Position.x[playerId];
    const playerY = Position.y[playerId];
    
    for (const eid of query(world, [Enemy])) {
        if (!hasComponent(world, eid, MoveTo)) {
            addComponent(world, eid, MoveTo);
        }
        MoveTo.x[eid] = playerX;
        MoveTo.y[eid] = playerY;
    }
}

export const spriteSyncSystem = (world: GameWorld) => {
    for (const eid of query(world, [Position, Velocity])) {
        const sprite = world.spriteMap.get(eid)
        if (!sprite) continue

        sprite.x = Position.x[eid]
        sprite.y = Position.y[eid]
        
        if (Velocity.x[eid] < 0) {
            sprite.flipX = false;
        } else if (Velocity.x[eid] > 0) {
            sprite.flipX = true;
        }
    } 
}

export const knockbackUpdateSystem = (world: GameWorld) => {
    const dt = world.time.delta / 1000;
    const knockedEntities = query(world, [ActiveKnockback, Velocity]);

    for (const eid of knockedEntities) {
        ActiveKnockback.timer[eid] -= dt;

        if (ActiveKnockback.timer[eid] <= 0) {
            removeComponent(world, eid, ActiveKnockback);
            Velocity.x[eid] = 0;
            Velocity.y[eid] = 0;
        }
    }
};

export const enemySeparationSystem = (world: GameWorld) => {
    const enemies = query(world, [Enemy, Position, Collider]);
    const separationDistSq = ENEMY_SEPARATION_RADIUS * ENEMY_SEPARATION_RADIUS;
    
    for (let i = 0; i < enemies.length; i++) {
        const eidA = enemies[i];
        
        const xA = Position.x[eidA];
        const yA = Position.y[eidA];
        world.spatialHash.getNearby(xA, yA, QUERY_BUFFER);
        
        const offsetXA = Collider.offsetX[eidA] ?? 0;
        const offsetYA = Collider.offsetY[eidA] ?? 0;
        const halfWidthA = Collider.width[eidA] / 2;
        const halfHeightA = Collider.height[eidA] / 2;

        for (let j = 0; j < QUERY_BUFFER.length; j++) {
            const eidB = QUERY_BUFFER[j];

            if (eidA >= eidB) continue;
            if (!hasComponent(world, eidB, Enemy)) continue;

            let dx = Position.x[eidA] - Position.x[eidB];
            let dy = Position.y[eidA] - Position.y[eidB];
            const distSq = dx * dx + dy * dy;

            if (distSq < separationDistSq && distSq > 0) {
                const dist = Math.sqrt(distSq);
                const overlap = ENEMY_SEPARATION_RADIUS - dist;
                const moveX = (dx / dist) * overlap * 0.5;
                const moveY = (dy / dist) * overlap * 0.5; // Multiply by a strength factor so they don't jitter

                //Update entity A
                Position.x[eidA] = constrainToMap(Position.x[eidA] + moveX, offsetXA, halfWidthA, BOUNDS.left, BOUNDS.right).pos;
                Position.y[eidA] = constrainToMap(Position.y[eidA] + moveY, offsetYA, halfHeightA, BOUNDS.top, BOUNDS.bottom).pos;

                //Update entity B
                const offXB = Collider.offsetX[eidB] ?? 0;
                const offYB = Collider.offsetY[eidB] ?? 0;
                const halfWB = Collider.width[eidB] / 2;
                const halfHB = Collider.height[eidB] / 2;
                Position.x[eidB] = constrainToMap(Position.x[eidB] - moveX, offXB, halfWB, BOUNDS.left, BOUNDS.right).pos;
                Position.y[eidB] = constrainToMap(Position.y[eidB] - moveY, offYB, halfHB, BOUNDS.top, BOUNDS.bottom).pos;

            } else if (distSq === 0) {
                // If they are at the exact same pixel, nudge them apart randomly
                Position.x[eidA] += Math.random() - 0.5;
                Position.y[eidA] += Math.random() - 0.5;
            }
        }
    }
    
}