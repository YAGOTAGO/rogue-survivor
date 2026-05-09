import { addComponents, addEntity, EntityId } from "bitecs";
import { GameWorld } from "../game/scenes/Game";
import { Position, Speed, Velocity } from "../components/MovementComponents";
import { Player } from "../components/TagComponents";
import { Health } from "../components/StatComponents";

interface BaseUnitData{
    position: { x: number, y: number },
    speed: number,
    maxHealth: number,
    spriteKey: string,
    tags?: [{}],
}

const BaseUnit = (world: GameWorld, data: BaseUnitData): EntityId => {
    const eid = addEntity(world);
    addComponents(world, eid, [Position, Speed, Velocity, Health]);
    Position.x[eid] = data.position.x;
    Position.y[eid] = data.position.y;
    Velocity.x[eid] = 0;
    Velocity.y[eid] = 0;
    Speed.value[eid] = data.speed;
    Health.current[eid] = data.maxHealth;
    Health.max[eid] = data.maxHealth;

    if(data.tags){
        addComponents(world, eid, data.tags);
    }

    //TODO in the future we want a group with a get or create
    const sprite = world.scene.add.sprite(data.position.x, data.position.y, data.spriteKey);
    world.spriteMap.set(eid, sprite);

    return eid;
}

export const SpawnPlayer = (world: GameWorld, pos: { x: number, y: number }): EntityId => {
    const data: BaseUnitData = {
        position: pos,
        speed: 200,
        maxHealth: 100,
        spriteKey: 'test-hero',
        tags: [Player],
    }
    const eid = BaseUnit(world, data);
    return eid;
}
