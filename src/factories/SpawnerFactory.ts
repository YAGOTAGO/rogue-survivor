import { addComponents, EntityId } from "bitecs";
import { BaseSpriteEntity, BaseUnit, BaseUnitData } from "./BaseEntityFactory";
import { ASSETS } from "../common/Assets";
import { DamageInfo, Enemy, Level, ExperienceValue, HitCircle, HurtCircle, InvulnerabilityTimer, KnockbackInfo, Player } from "../components/StatComponents";
import { OVERLAP_LAYERS, PositionType } from "../common/Constants";
import { GameWorld } from "../common/ECS";

export const SpawnPlayer = (world: GameWorld, pos: PositionType): EntityId => {
    const data: BaseUnitData = {
        position: pos,
        speed: 200,
        maxHealth: 100,
        spriteKey: ASSETS.SPRITESHEETS.PLAYERS,
        spriteFrame: 3,
    }
    const eid = BaseUnit(world, data);
    addComponents(world, eid, [InvulnerabilityTimer, Level, Player, HurtCircle, HitCircle]);
    InvulnerabilityTimer.current[eid] = 0;
    Level.level[eid] = 1;
    Level.currentExperience[eid] = 0;
    Level.maxExperience[eid] = 100;
    HurtCircle.radius[eid] = 6;
    HurtCircle.offsetX[eid] = 0;
    HurtCircle.offsetY[eid] = 1;
    HurtCircle.layer[eid] = OVERLAP_LAYERS.PLAYER;
    HitCircle.radius[eid] = 32;
    HitCircle.offsetX[eid] = 0;
    HitCircle.offsetY[eid] = 1;
    HitCircle.mask[eid] = OVERLAP_LAYERS.XP_ORB;
    return eid;
}

export const SpawnEnemy = (world: GameWorld, pos: PositionType): EntityId => {
    const data: BaseUnitData = {
        position: pos,
        speed: 200,
        maxHealth: 100,
        spriteKey: ASSETS.SPRITESHEETS.ENEMIES,
        spriteFrame: 48,
        pool: world.pools.enemyPool,
    }
    const eid = BaseUnit(world, data);
    addComponents(world, eid, [DamageInfo, Enemy, HurtCircle, HitCircle, ExperienceValue, KnockbackInfo]);
    DamageInfo.damage[eid] = 10;
    HitCircle.radius[eid] = 12;
    HitCircle.offsetX[eid] = 0;
    HitCircle.offsetY[eid] = 0;
    HitCircle.mask[eid] = OVERLAP_LAYERS.PLAYER;
    HurtCircle.radius[eid] = 12;
    HurtCircle.offsetX[eid] = 0;
    HurtCircle.offsetY[eid] = 0;
    HurtCircle.layer[eid] = OVERLAP_LAYERS.ENEMY;
    ExperienceValue.value[eid] = 20;
    return eid;
}


export const SpawnExperienceOrb = (world: GameWorld, pos: PositionType, amount: number) => {
    const eid = BaseSpriteEntity(world, {
        position: pos,
        speed: 0,
        spriteKey: ASSETS.IMAGES.EXPERIENCE,    
        pool: world.pools.orbPool,
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