import { addComponents, addEntity, EntityId, removeEntity } from "bitecs";
import { GameWorld } from "../game/scenes/Game";
import { Position, Speed, Velocity } from "../components/MovementComponents";
import { Enemy, Player } from "../components/TagComponents";
import { Health } from "../components/StatComponents";
import { OnTouchDamage } from "../components/AbilityComponents";

interface BaseUnitData{
    position: { x: number, y: number },
    speed: number,
    maxHealth: number,
    spriteKey: string,
    spriteFrame?: number,
    tags: any[],
    onTouchDamage?: number,
}

const BaseUnit = (world: GameWorld, data: BaseUnitData): EntityId => {
    const eid = addEntity(world);
    addComponents(world, eid, [Position, Speed, Velocity, Health, OnTouchDamage]);
    Position.x[eid] = data.position.x;
    Position.y[eid] = data.position.y;
    Velocity.x[eid] = 0;
    Velocity.y[eid] = 0;
    Speed.value[eid] = data.speed;
    Health.current[eid] = data.maxHealth;
    Health.max[eid] = data.maxHealth;
    OnTouchDamage.value[eid] = data.onTouchDamage || 0;

    if(data.tags){
        addComponents(world, eid, data.tags);
    }

    const sprite = world.scene.add.sprite(data.position.x, data.position.y, data.spriteKey, data.spriteFrame);
    sprite.setData('eid', eid);
    world.spriteMap.set(eid, sprite);

    return eid;
}

export const SpawnPlayer = (world: GameWorld, pos: { x: number, y: number }): EntityId => {
    const data: BaseUnitData = {
        position: pos,
        speed: 500,
        maxHealth: 100,
        spriteKey: 'rogues',
        spriteFrame: 3,
        tags: [Player],
    }
    const eid = BaseUnit(world, data);
    return eid;
}

export const SpawnEnemy = (world: GameWorld, pos: { x: number, y: number }): EntityId => {
    const data: BaseUnitData = {
        position: pos,
        speed: 200,
        maxHealth: 100,
        spriteKey: 'monsters',
        spriteFrame: 48,
        tags: [Enemy],
        onTouchDamage: 10,
    }
    const eid = BaseUnit(world, data);
    return eid;
}

export const DespawnUnit = (world: GameWorld, eid: EntityId) => {
    const sprite = world.spriteMap.get(eid);
    if(sprite){
        sprite.destroy();
        world.spriteMap.delete(eid);
    }
    removeEntity(world, eid);
}
