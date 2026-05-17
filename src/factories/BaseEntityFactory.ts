import { addComponents, addEntity, EntityId, removeEntity } from "bitecs";
import { GameWorld } from "../game/scenes/Game";
import { Collider, Position, Speed, Velocity } from "../components/MovementComponents";
import { Health } from "../components/StatComponents";
import { GameObjects } from "phaser";

const DEFAULT_COLLIDER = { width: 14, height: 12, offsetX: 0, offsetY: 8 };

export interface BaseUnitData{
    position: { x: number, y: number },
    speed: number,
    maxHealth: number,
    spriteKey: string,
    spriteFrame?: number,
    collider?: { width: number, height: number, offsetX: number, offsetY: number },
    pool?: GameObjects.Group,
}

export interface BaseSpriteData {
    position: { x: number, y: number },
    speed: number,
    spriteKey: string,
    spriteFrame?: number,
    pool?: GameObjects.Group,
}

export const BaseSpriteEntity = (world: GameWorld, data: BaseSpriteData): EntityId => {
    const eid = addEntity(world);
    addComponents(world, eid, [Position, Speed, Velocity]);

    Position.x[eid] = data.position.x;
    Position.y[eid] = data.position.y;
    Velocity.x[eid] = 0;
    Velocity.y[eid] = 0;
    Speed.value[eid] = data.speed;

    let sprite: GameObjects.Sprite;
    if (data.pool) {
        sprite = GetOrCreateSprite(data.position.x, data.position.y, data.spriteKey, data.spriteFrame ?? 0, data.pool);
    } else {
        sprite = world.scene.add.sprite(data.position.x, data.position.y, data.spriteKey, data.spriteFrame);
    }
    world.spriteMap.set(eid, sprite);

    return eid;
};

export const BaseUnit = (world: GameWorld, data: BaseUnitData): EntityId => {
    const eid = BaseSpriteEntity(world, {
        position: data.position,
        speed: data.speed,
        spriteKey: data.spriteKey,
        spriteFrame: data.spriteFrame,
        pool: data.pool,
    });

    addComponents(world, eid, [Health, Collider]);
    Health.current[eid] = data.maxHealth;
    Health.max[eid] = data.maxHealth;

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
    return eid;
};

export const DespawnSpriteEntity = (world: GameWorld, eid: EntityId) => {
    const sprite = world.spriteMap.get(eid);
    if(sprite){
        const pool = sprite.getData('pool') as GameObjects.Group | undefined;
        if (pool) {
            pool.killAndHide(sprite);
        } else {
            sprite.destroy();
        }
        world.spriteMap.delete(eid);
    }
    removeEntity(world, eid);
}

const GetOrCreateSprite = (
    x: number, 
    y: number, 
    texture: string, 
    frame: string | number, 
    pool: GameObjects.Group
): GameObjects.Sprite => {

    const sprite = pool.get(x, y, texture, frame) as GameObjects.Sprite | undefined;
    if (!sprite) throw new Error(`[BaseEntityFactory] Critical: Sprite Pool Exhausted. Max size of ${pool.maxSize} reached.`);
    sprite.setData('pool', pool);
    sprite.setActive(true);
    sprite.setVisible(true);
    sprite.setAlpha(1);
    sprite.setScale(1);
    sprite.setTint(0xffffff);
    sprite.setTexture(texture, frame);
    return sprite;
};