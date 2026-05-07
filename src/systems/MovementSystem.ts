import { query } from "bitecs"
import { Position, Velocity } from "../components/MovementComponents"
import { GameWorld } from "../game/scenes/Game";

export const movementSystem = (world: GameWorld) => {
    const dt = world.time.delta / 1000;
    for (const eid of query(world, [Position, Velocity])) {
        Position.x[eid] += Velocity.x[eid] * dt
        Position.y[eid] += Velocity.y[eid] * dt
    }
}