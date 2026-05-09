import { addComponents, addEntity, addPrefab, EntityId, observe, onSet } from "bitecs";
import { GameWorld } from "../game/scenes/Game";
import { Position, Speed, Velocity } from "../components/MovementComponents";

interface BaseUnitData{
    position: { x: number, y: number },
    velocity: { x: number, y: number },
    speed: number,
    spriteKey: string,
    tags?: [{}],
}

const BaseUnit = (world: GameWorld, data: BaseUnitData): EntityId => {
    const eid = addEntity(world);
    addComponents(world, eid, [Position, Speed, Velocity]);
    Position.x[eid] = data.position.x;
    Position.y[eid] = data.position.y;
    Velocity.x[eid] = data.velocity.x;
    Velocity.y[eid] = data.velocity.y;
    Speed.value[eid] = data.speed;

    if(data.tags){
        addComponents(world, eid, data.tags);
    }

    //TODO in the future we want a group with a get or create
    const sprite = world.scene.add.sprite(data.position.x, data.position.y, data.spriteKey);
    world.spriteMap.set(eid, sprite);

    return eid;
}

const PlayerUnit = (world: GameWorld, data: BaseUnitData): EntityId => {
    const eid = BaseUnit(world, data);
    //Any extra components would go here
    return eid;
}
