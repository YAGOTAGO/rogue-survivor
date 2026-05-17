import { addComponents, addEntity, EntityId, removeEntity } from "bitecs";
import { GameWorld } from "../game/scenes/Game";
import { Collider, Position, Speed, Velocity } from "../components/MovementComponents";
import { Enemy, Player } from "../components/TagComponents";
import { DamageInfo, HurtCircle, Experience, ExperienceValue, Health, HitCircle, InvulnerabilityTimer } from "../components/StatComponents";
import { ASSETS } from "../common/Assets";
import { OVERLAP_LAYERS } from "../common/Constants";

const DEFAULT_COLLIDER = { width: 14, height: 12, offsetX: 0, offsetY: 8 };

interface BaseUnitData{
    position: { x: number, y: number },
    speed: number,
    maxHealth: number,
    spriteKey: string,
    spriteFrame?: number,
    collider?: { width: number, height: number, offsetX: number, offsetY: number },
}

interface BaseSpriteData {
    position: { x: number, y: number },
    speed: number,
    spriteKey: string,
    spriteFrame?: number,
}

const BaseSpriteEntity = (world: GameWorld, data: BaseSpriteData): EntityId => {
    const eid = addEntity(world);
    addComponents(world, eid, [Position, Speed, Velocity]);

    Position.x[eid] = data.position.x;
    Position.y[eid] = data.position.y;
    Velocity.x[eid] = 0;
    Velocity.y[eid] = 0;
    Speed.value[eid] = data.speed;

    const sprite = world.scene.add.sprite(data.position.x, data.position.y, data.spriteKey, data.spriteFrame);
    world.spriteMap.set(eid, sprite);

    return eid;
};

const BaseUnit = (world: GameWorld, data: BaseUnitData): EntityId => {
    const eid = BaseSpriteEntity(world, {
        position: data.position,
        speed: data.speed,
        spriteKey: data.spriteKey,
        spriteFrame: data.spriteFrame,
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

export const SpawnPlayer = (world: GameWorld, pos: { x: number, y: number }): EntityId => {
    const data: BaseUnitData = {
        position: pos,
        speed: 200,
        maxHealth: 100,
        spriteKey: ASSETS.SPRITESHEETS.PLAYERS,
        spriteFrame: 3,
    }
    const eid = BaseUnit(world, data);
    addComponents(world, eid, [InvulnerabilityTimer, Experience, Player, HurtCircle, HitCircle]);
    InvulnerabilityTimer.current[eid] = 0;
    Experience.level[eid] = 1;
    Experience.current[eid] = 0;
    Experience.max[eid] = 100;
    HurtCircle.radius[eid] = 6;
    HurtCircle.offsetX[eid] = 0;
    HurtCircle.offsetY[eid] = 1;
    HurtCircle.layer[eid] = OVERLAP_LAYERS.PLAYER;
    HitCircle.radius[eid] = 16;
    HitCircle.offsetX[eid] = 0;
    HitCircle.offsetY[eid] = 1;
    HitCircle.mask[eid] = OVERLAP_LAYERS.XP_ORB;
    return eid;
}

export const SpawnEnemy = (world: GameWorld, pos: { x: number, y: number }): EntityId => {
    const data: BaseUnitData = {
        position: pos,
        speed: 200,
        maxHealth: 100,
        spriteKey: ASSETS.SPRITESHEETS.ENEMIES,
        spriteFrame: 48,
    }
    const eid = BaseUnit(world, data);
    addComponents(world, eid, [DamageInfo, HitCircle, Enemy, HurtCircle, HitCircle]);
    DamageInfo.value[eid] = 10;
    HitCircle.radius[eid] = 12;
    HitCircle.offsetX[eid] = 0;
    HitCircle.offsetY[eid] = 0;
    HitCircle.mask[eid] = OVERLAP_LAYERS.PLAYER;
    HurtCircle.radius[eid] = 12;
    HurtCircle.offsetX[eid] = 0;
    HurtCircle.offsetY[eid] = 0;
    HurtCircle.layer[eid] = OVERLAP_LAYERS.ENEMY;
    return eid;
}

export const DespawnSpriteEntity = (world: GameWorld, eid: EntityId) => {
    const sprite = world.spriteMap.get(eid);
    if(sprite){
        sprite.destroy();
        world.spriteMap.delete(eid);
    }
    removeEntity(world, eid);
}

export const SpawnExperienceOrb = (world: GameWorld, pos: { x: number, y: number }, amount: number) => {
    const eid = BaseSpriteEntity(world, {
        position: pos,
        speed: 0,
        spriteKey: ASSETS.IMAGES.EXPERIENCE
    });
    world.spriteMap.get(eid)?.play({key: ASSETS.ANIMATIONS.EXPERIENCE_PULSE, repeat: -1});
    addComponents(world, eid, [ExperienceValue, HurtCircle]);
    ExperienceValue.value[eid] = amount;
    HurtCircle.radius[eid] = 16;
    HurtCircle.offsetX[eid] = 0;
    HurtCircle.offsetY[eid] = 0;
    HurtCircle.layer[eid] = OVERLAP_LAYERS.XP_ORB;
    return eid;
}
