import { addComponents, addEntity, EntityId } from "bitecs";
import { Ability, AbilityOf, Cooldown, DamageInfo, HitCircle, KnockbackInfo, Lifespan, MaxActiveCount, OrbitPlayer, Pierce } from "../components/StatComponents";
import { BaseSpriteData, BaseSpriteEntity } from "./BaseEntityFactory";
import { ASSETS } from "../common/Assets";
import { OVERLAP_LAYERS, PositionType } from "../common/Constants";
import { GameWorld } from "../common/ECS";
import { Speed, Velocity } from "../components/MovementComponents";

export const SpawnDaggerAbility = (world: GameWorld) => {
    const playerEid = world.playerEid;
    if(playerEid <= 0){
        console.error("Player EID not set on world");
        return;
    }
    const eid = addEntity(world);
    world.abilityPrefabs.set(eid, SpawnDagger);
    world.ui.abilityBarUi.addAbility(ASSETS.SPRITESHEETS.ITEMS, eid, 0);
    addComponents(world, eid, [AbilityOf(playerEid), Ability, Cooldown]);
    Cooldown.current[eid] = 0;
    Cooldown.maxTimer[eid] = 2;
}

export const SpawnDagger = (world: GameWorld, pos: PositionType): EntityId => {
    const data: BaseSpriteData = {
        position: pos,
        speed: 250,
        spriteKey: ASSETS.SPRITESHEETS.ITEMS,
        spriteFrame: 0,
        pool: world.pools.projectilePool,
    }
    const eid = BaseSpriteEntity(world, data);
    addComponents(world, eid, [HitCircle, Lifespan, DamageInfo, Pierce]);
    HitCircle.radius[eid] = 11;
    HitCircle.offsetX[eid] = 0;
    HitCircle.offsetY[eid] = 1;
    HitCircle.mask[eid] = OVERLAP_LAYERS.ENEMY;
    Lifespan.current[eid] = 4;
    DamageInfo.damage[eid] = 5;
    Pierce.current[eid] = 0;
    Pierce.max[eid] = 2;
    const playerSprite = world.spriteMap.get(world.playerEid);
    const dirX = playerSprite?.flipX ? 1 : -1;
    Velocity.x[eid] = dirX * Speed.value[eid];
    const daggerSprite = world.spriteMap.get(eid);
    if (daggerSprite) {
        daggerSprite.angle = dirX * 42; 
    }
    return eid;
}

export const SpawnShieldAbility = (world: GameWorld) => {
    const playerEid = world.playerEid;
    if(playerEid <= 0){
        console.error("Player EID not set on world");
        return;
    }
    const eid = addEntity(world);
    world.abilityPrefabs.set(eid, SpawnShield);
    world.ui.abilityBarUi.addAbility(ASSETS.SPRITESHEETS.ITEMS, eid, 121);
    addComponents(world, eid, [AbilityOf(playerEid), Ability, Cooldown, MaxActiveCount]);
    Cooldown.current[eid] = 0;
    Cooldown.maxTimer[eid] = 5;
    MaxActiveCount.max[eid] = 3;
}

export const SpawnShield = (world: GameWorld, pos: PositionType): EntityId => {
    const data: BaseSpriteData = {
        position: pos,
        speed: 200,
        spriteKey: ASSETS.SPRITESHEETS.ITEMS,
        spriteFrame: 121,
        pool: world.pools.projectilePool,
    }
    const eid = BaseSpriteEntity(world, data);
    addComponents(world, eid, [HitCircle, KnockbackInfo, OrbitPlayer]);
    HitCircle.radius[eid] = 12;
    HitCircle.offsetX[eid] = 0;
    HitCircle.offsetY[eid] = 1;
    HitCircle.mask[eid] = OVERLAP_LAYERS.ENEMY;
    KnockbackInfo.force[eid] = 200;
    KnockbackInfo.time[eid] = .2;
    OrbitPlayer.baseAngle[eid] = 0;
    OrbitPlayer.radius[eid] = 45;
    OrbitPlayer.speed[eid] = 2;
    return eid;
}