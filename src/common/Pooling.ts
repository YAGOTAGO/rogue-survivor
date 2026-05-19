import { EntityId, removeEntity } from "bitecs";
import { GameObjects } from "phaser";
import { GameWorld } from "./ECS";

export const MAX_ENEMY_POOL_SIZE = 2000 as const;
export const MAX_ORB_POOL_SIZE = 2000 as const;
export const MAX_PROJECTILE_POOL_SIZE = 2000 as const;

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

export const GetOrCreateSprite = (
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