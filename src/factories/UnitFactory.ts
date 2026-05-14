import { addComponents, addEntity, EntityId, removeEntity } from "bitecs";
import { GameWorld } from "../game/scenes/Game";
import { Collider, Position, Speed, Velocity } from "../components/MovementComponents";
import { Enemy, Player } from "../components/TagComponents";
import { Health } from "../components/StatComponents";
import { HitCircle, HurtCircle, OnTouchDamage } from "../components/AbilityComponents";

const DEFAULT_COLLIDER = { width: 14, height: 12, offsetX: 0, offsetY: 8 };

interface BaseUnitData{
    position: { x: number, y: number },
    speed: number,
    maxHealth: number,
    spriteKey: string,
    spriteFrame?: number,
    tags: any[],
    collider?: { width: number, height: number, offsetX: number, offsetY: number },
    hurtCircle: { radius: number, offsetX: number, offsetY: number },
}

const BaseUnit = (world: GameWorld, data: BaseUnitData): EntityId => {
    const eid = addEntity(world);
    addComponents(world, eid, [Position, Speed, Velocity, Health, Collider, HurtCircle]);
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

    const sprite = world.scene.add.sprite(data.position.x, data.position.y, data.spriteKey, data.spriteFrame);
    sprite.setData('eid', eid);
    world.spriteMap.set(eid, sprite);

    if (data.collider) {
        Collider.width[eid] = data.collider.width;
        Collider.height[eid] = data.collider.height;
        Collider.offsetX[eid] = data.collider.offsetX;
        Collider.offsetY[eid] = data.collider.offsetY;
    } else {
        Collider.width[eid] = DEFAULT_COLLIDER.width;
        Collider.height[eid] = DEFAULT_COLLIDER.height;
        Collider.offsetX[eid] = DEFAULT_COLLIDER.offsetX;
        Collider.offsetY[eid] = DEFAULT_COLLIDER.offsetY;
    }

    HurtCircle.radius[eid] = data.hurtCircle.radius;
    HurtCircle.offsetX[eid] = data.hurtCircle.offsetX;
    HurtCircle.offsetY[eid] = data.hurtCircle.offsetY;

    return eid;
}

export const SpawnPlayer = (world: GameWorld, pos: { x: number, y: number }): EntityId => {
    const data: BaseUnitData = {
        position: pos,
        speed: 900,
        maxHealth: 100,
        spriteKey: 'rogues',
        spriteFrame: 3,
        tags: [Player],
        hurtCircle: { radius: 6, offsetX: 0, offsetY: 1 },
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
        hurtCircle: { radius: 12, offsetX: 0, offsetY: 0 },
    }
    const eid = BaseUnit(world, data);
    addComponents(world, eid, [OnTouchDamage, HitCircle]);
    OnTouchDamage.value[eid] = 10;
    HitCircle.radius[eid] = 12;
    HitCircle.offsetX[eid] = 0;
    HitCircle.offsetY[eid] = 0;
    HitCircle.damage[eid] = 10;
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
