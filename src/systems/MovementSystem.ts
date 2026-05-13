import { addComponent, hasComponent, query, removeComponent } from "bitecs"
import { MoveTo, Position, Speed, Velocity } from "../components/MovementComponents"
import { GameWorld } from "../game/scenes/Game";
import { Enemy, Player } from "../components/TagComponents";

export const movementSystem = (world: GameWorld) => {
    const dt = world.time.delta / 1000;
    for (const eid of query(world, [Position, Velocity])) {
        Position.x[eid] += Velocity.x[eid] * dt
        Position.y[eid] += Velocity.y[eid] * dt
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