import { addComponents, addEntity, EntityId, removeEntity } from "bitecs";
import { GameWorld } from "../game/scenes/Game";
import { Collider, Position, Speed, Velocity } from "../components/MovementComponents";
import { Enemy, Player, Team, TEAM_ID, TeamId } from "../components/TagComponents";
import { DamageInfo, Experience, ExperienceValue, Health, HitCircle, HurtCircle, InvulnerabilityTimer } from "../components/StatComponents";
import { ASSETS } from "../common/Assets";

const DEFAULT_COLLIDER = { width: 14, height: 12, offsetX: 0, offsetY: 8 };

interface BaseUnitData{
    position: { x: number, y: number },
    speed: number,
    maxHealth: number,
    spriteKey: string,
    spriteFrame?: number,
    teamId: TeamId,
    collider?: { width: number, height: number, offsetX: number, offsetY: number },
    hurtCircle: { radius: number, offsetX: number, offsetY: number },
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
    sprite.setData('eid', eid);
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

    addComponents(world, eid, [Health, Collider, HurtCircle, Team]);
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

    HurtCircle.radius[eid] = data.hurtCircle.radius;
    HurtCircle.offsetX[eid] = data.hurtCircle.offsetX;
    HurtCircle.offsetY[eid] = data.hurtCircle.offsetY;
    Team.id[eid] = data.teamId;

    return eid;
};

export const SpawnPlayer = (world: GameWorld, pos: { x: number, y: number }): EntityId => {
    const data: BaseUnitData = {
        position: pos,
        speed: 200,
        maxHealth: 100,
        spriteKey: ASSETS.SPRITESHEETS.PLAYERS,
        spriteFrame: 3,
        teamId: TEAM_ID.ALLY,
        hurtCircle: { radius: 6, offsetX: 0, offsetY: 1 },
    }
    const eid = BaseUnit(world, data);
    addComponents(world, eid, [InvulnerabilityTimer, Experience, Player]);
    InvulnerabilityTimer.current[eid] = 0;
    Experience.level[eid] = 1;
    Experience.current[eid] = 0;
    Experience.max[eid] = 100;
    return eid;
}

export const SpawnEnemy = (world: GameWorld, pos: { x: number, y: number }): EntityId => {
    const data: BaseUnitData = {
        position: pos,
        speed: 200,
        maxHealth: 100,
        spriteKey: ASSETS.SPRITESHEETS.ENEMIES,
        spriteFrame: 48,
        teamId: TEAM_ID.ENEMY,
        hurtCircle: { radius: 12, offsetX: 0, offsetY: 0 },
    }
    const eid = BaseUnit(world, data);
    addComponents(world, eid, [DamageInfo, HitCircle, Enemy]);
    DamageInfo.value[eid] = 10;
    HitCircle.radius[eid] = 12;
    HitCircle.offsetX[eid] = 0;
    HitCircle.offsetY[eid] = 0;
    HitCircle.damage[eid] = 10;
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

//TODO work in progress
export const SpawnExperienceOrb = (world: GameWorld, pos: { x: number, y: number }, amount: number) => {
    const eid = BaseSpriteEntity(world, {
        position: pos,
        speed: 0,
        spriteKey: ASSETS.IMAGES.EXPERIENCE
    });
    world.spriteMap.get(eid)?.play({key: 'pulse', repeat: -1});
    addComponents(world, eid, [ExperienceValue, HitCircle, Team]);
    ExperienceValue.value[eid] = amount;
    HitCircle.radius[eid] = 16;
    HitCircle.offsetX[eid] = 0;
    HitCircle.offsetY[eid] = 0;
    Team.id[eid] = TEAM_ID.ENEMY;
    return eid;
}
