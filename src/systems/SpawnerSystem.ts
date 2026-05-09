import { addComponents, addEntity, addPrefab, EntityId, observe, onSet } from "bitecs";
import { GameWorld } from "../game/scenes/Game";
import { Position, Speed, Velocity } from "../components/MovementComponents";

interface BaseUnitData{
    position: { x: number, y: number },
    velocity: { x: number, y: number },
    speed: number,
    spriteKey: string,
    tags: [{}],
}

const BaseUnit = (world: GameWorld): EntityId => {
    const entity = addEntity(world);
    addComponents(world, entity, [Position, Speed, Velocity]);
    Position.x[entity] = 0;
    Position.y[entity] = 0;
    Velocity.x[entity] = 0;
    Velocity.y[entity] = 0;
    Speed.value[entity] = 0;
    return entity;
}
