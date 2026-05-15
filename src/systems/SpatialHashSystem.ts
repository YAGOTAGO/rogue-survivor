import { query } from "bitecs";
import { GameWorld } from "../game/scenes/Game";
import { Position } from "../components/MovementComponents";
import { Team } from "../components/TagComponents";

export const spatialHashSystem = (world: GameWorld) => {
    world.spatialHash.clear();
    const physicalEntities = query(world, [Position, Team]);
    for (let i = 0; i < physicalEntities.length; i++) {
        const eid = physicalEntities[i];
        world.spatialHash.insert(eid, Position.x[eid], Position.y[eid]);
    }
}