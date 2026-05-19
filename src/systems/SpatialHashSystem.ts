import { query } from "bitecs";
import { Position } from "../components/MovementComponents";
import { GameWorld } from "../common/ECS";

export const spatialHashSystem = (world: GameWorld) => {
    world.spatialHash.clear();
    const physicalEntities = query(world, [Position]);
    for (let i = 0; i < physicalEntities.length; i++) {
        const eid = physicalEntities[i];
        world.spatialHash.insert(eid, Position.x[eid], Position.y[eid]);
    }
}