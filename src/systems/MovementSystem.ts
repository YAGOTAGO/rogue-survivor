import { query, removeComponent } from "bitecs"
import { MoveTo, Position, Speed, Velocity } from "../components/MovementComponents"
import { GameWorld } from "../game/scenes/Game";
import { Player } from "../components/TagComponents";

export const movementSystem = (world: GameWorld) => {
    const dt = world.time.delta / 1000;
    for (const eid of query(world, [Position, Velocity])) {
        Position.x[eid] += Velocity.x[eid] * dt
        Position.y[eid] += Velocity.y[eid] * dt
    }
}

export const playerInputSystem = (world: GameWorld) => {
    for (const eid of query(world, [Player, Speed, Velocity])){
        Velocity.x[eid] = world.input.xAxis * Speed.value[eid];
        Velocity.y[eid] = world.input.yAxis * Speed.value[eid];
    }
}

export const moveToSystem = (world: GameWorld) => {
    for (const eid of query(world, [Position, MoveTo, Speed, Velocity])){
        const dx = MoveTo.x[eid] - Position.x[eid];
        const dy = MoveTo.y[eid] - Position.y[eid];
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 5) { //reach destination
            Velocity.x[eid] = 0;
            Velocity.y[eid] = 0;
            removeComponent(world, eid, MoveTo);
        } else {
            Velocity.x[eid] = (dx / distance) * Speed.value[eid];
            Velocity.y[eid] = (dy / distance) * Speed.value[eid];
        }
    }
}