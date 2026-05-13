import { addComponent, hasComponent, query, removeComponent } from "bitecs"
import { Collider, MoveTo, Position, Speed, Velocity } from "../components/MovementComponents"
import { GameWorld } from "../game/scenes/Game";
import { Enemy, Player } from "../components/TagComponents";
import { ENEMY_SEPARATION_RADIUS } from "../common/Constants";

function rectCollidesWithLayer(layer: Phaser.Tilemaps.TilemapLayer | Phaser.Tilemaps.TilemapGPULayer, centerX: number, centerY: number, width: number, height: number): boolean {
    if (!layer) return false;
    const map = layer.tilemap;
    const tileW = map.tileWidth;
    const tileH = map.tileHeight;

    const left = Math.floor((centerX - width / 2) / tileW);
    const right = Math.floor((centerX + width / 2 - 1) / tileW);
    const top = Math.floor((centerY - height / 2) / tileH);
    const bottom = Math.floor((centerY + height / 2 - 1) / tileH);

    for (let tx = left; tx <= right; tx++) {
        for (let ty = top; ty <= bottom; ty++) {
            const tile = layer.getTileAt(tx, ty);
            if (tile && tile.collides) return true;
        }
    }
    return false;
}

export const movementSystem = (world: GameWorld) => {
    const dt = world.time.delta / 1000;
    const layer = world.collisionLayer;

    for (const eid of query(world, [Position, Velocity, Collider])) {
        const vx = Velocity.x[eid] * dt;
        const vy = Velocity.y[eid] * dt;

        if(vx === 0 && vy === 0) continue;

        const cWidth = Collider.width[eid];
        const cHeight = Collider.height[eid];
        const cOffsetX = Collider.offsetX[eid] ?? 0;
        const cOffsetY = Collider.offsetY[eid] ?? 0;

        const w = cWidth;
        const h = cHeight;

        // Move X axis and resolve against tiles independently to avoid sticking
        const targetX = Position.x[eid] + vx;
        // center used for collision checks includes collider offset
        const cxTarget = targetX + cOffsetX;
        const cy = Position.y[eid] + cOffsetY;
        if (!rectCollidesWithLayer(layer, cxTarget, cy, w, h)) {
            Position.x[eid] = targetX;
        } else {
            Velocity.x[eid] = 0;
        }

        // Move Y axis and resolve against tiles independently
        const targetY = Position.y[eid] + vy;
        const cx = Position.x[eid] + cOffsetX;
        const cyTarget = targetY + cOffsetY;
        if (!rectCollidesWithLayer(layer, cx, cyTarget, w, h)) {
            Position.y[eid] = targetY;
        } else {
            Velocity.y[eid] = 0;
        }
    }
}

export const playerVelocitySystem = (world: GameWorld) => {
    for (const eid of query(world, [Player, Speed, Velocity])){
        Velocity.x[eid] = world.input.xAxis * Speed.value[eid];
        Velocity.y[eid] = world.input.yAxis * Speed.value[eid];
    }
}

export const moveToSystem = (world: GameWorld) => {
    for (const eid of query(world, [Position, MoveTo, Speed, Velocity])){
        const dx = MoveTo.x[eid] - Position.x[eid];
        const dy = MoveTo.y[eid] - Position.y[eid];
        const distSquared = dx * dx + dy * dy;
        
        if (distSquared < 25) {
            Velocity.x[eid] = 0;
            Velocity.y[eid] = 0;
            removeComponent(world, eid, MoveTo);
        } else {
            let distance = Math.sqrt(distSquared);
            Velocity.x[eid] = (dx / distance) * Speed.value[eid];
            Velocity.y[eid] = (dy / distance) * Speed.value[eid];
        }
    }
}

export const followPlayerSystem = (world: GameWorld) => {
    const players = query(world, [Player]);
    if (players.length === 0) return;
    
    const playerId = players[0];
    const playerX = Position.x[playerId];
    const playerY = Position.y[playerId];
    
    const enemies = query(world, [Enemy]);
    for (const eid of enemies) {
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
        
        if(Velocity.x[eid] === 0 && Velocity.y[eid] === 0){
            sprite.x = Math.round(Position.x[eid])
            sprite.y = Math.round(Position.y[eid])
        }else{
            sprite.x = Position.x[eid]
            sprite.y = Position.y[eid]
        }
        
        if (Velocity.x[eid] < 0) {
            sprite.flipX = false;
        } else if (Velocity.x[eid] > 0) {
            sprite.flipX = true;
        }
    } 
}

export const enemySeparationSystem = (world: GameWorld) => {
    const enemies = query(world, [Enemy, Position, Collider]);
    const layer = world.collisionLayer;
    const separationDistSq = ENEMY_SEPARATION_RADIUS * ENEMY_SEPARATION_RADIUS;

    for (let i = 0; i < enemies.length; i++) {
        const eidA = enemies[i];

        for (let j = i + 1; j < enemies.length; j++) {
            const eidB = enemies[j];

            let dx = Position.x[eidA] - Position.x[eidB];
            let dy = Position.y[eidA] - Position.y[eidB];
            const distSq = dx * dx + dy * dy;

            if (distSq < separationDistSq && distSq > 0) {
                const dist = Math.sqrt(distSq);
                const overlap = ENEMY_SEPARATION_RADIUS - dist;

                const nx = dx / dist;
                const ny = dy / dist;
                
                // Multiply by a strength factor so they don't jitter
                const moveX = nx * overlap * 0.5;
                const moveY = ny * overlap * 0.5;
                
                // Validate collision for A
                const wA = Collider.width[eidA];
                const hA = Collider.height[eidA];
                const offXA = Collider.offsetX[eidA] ?? 0;
                const offYA = Collider.offsetY[eidA] ?? 0;

                // if (!rectCollidesWithLayer(layer, Position.x[eidA] + moveX + offXA, Position.y[eidA] + offYA, wA, hA)) {
                    Position.x[eidA] += moveX;
                //}
                // if (!rectCollidesWithLayer(layer, Position.x[eidA] + offXA, Position.y[eidA] + moveY + offYA, wA, hA)) {
                    Position.y[eidA] += moveY;
                // }

                // Validate collision for B
                const wB = Collider.width[eidB];
                const hB = Collider.height[eidB];
                const offXB = Collider.offsetX[eidB] ?? 0;
                const offYB = Collider.offsetY[eidB] ?? 0;

                // if (!rectCollidesWithLayer(layer, Position.x[eidB] - moveX + offXB, Position.y[eidB] + offYB, wB, hB)) {
                    Position.x[eidB] -= moveX;
                // }
                // if (!rectCollidesWithLayer(layer, Position.x[eidB] + offXB, Position.y[eidB] - moveY + offYB, wB, hB)) {
                    Position.y[eidB] -= moveY;
                // }

            } else if (distSq === 0) {
                // If they are at the exact same pixel, nudge them apart randomly
                Position.x[eidA] += Math.random() - 0.5;
                Position.y[eidA] += Math.random() - 0.5;
            }
        }
    }
    
}