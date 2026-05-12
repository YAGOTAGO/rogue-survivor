import { addComponent, hasComponent, query, removeComponent } from "bitecs"
import { MoveTo, Position, Speed, Velocity } from "../components/MovementComponents"
import { GameWorld } from "../game/scenes/Game";
import { Enemy, Player } from "../components/TagComponents";

export const physicsSyncSystem = (world: GameWorld) => {
    for (const eid of query(world, [Position, Velocity])) {
        const sprite = world.spriteMap.get(eid)
        if (!sprite || !sprite.body) continue;

        if (sprite.body.velocity.x !== Velocity.x[eid] || sprite.body.velocity.y !== Velocity.y[eid]) {
            sprite.body.setVelocity(Velocity.x[eid], Velocity.y[eid]);
        }
        
        Position.x[eid] = sprite.x;
        Position.y[eid] = sprite.y;

        if (Velocity.x[eid] < 0) {
            sprite.flipX = false;
        } else if (Velocity.x[eid] > 0) {
            sprite.flipX = true;
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