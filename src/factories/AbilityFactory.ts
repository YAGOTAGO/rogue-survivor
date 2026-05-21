import { addComponent, addComponents, addEntity, EntityId } from "bitecs";
import { Ability, AbilityOf, Cooldown, HitCircle, KnockbackInfo, MaxActiveCount, OrbitPlayer } from "../components/StatComponents";
import { BaseSpriteData, BaseSpriteEntity } from "./BaseEntityFactory";
import { ASSETS } from "../common/Assets";
import { OVERLAP_LAYERS, PositionType } from "../common/Constants";
import { GameWorld } from "../common/ECS";


export const SpawnShieldAbility = (world: GameWorld) => {
    const playerEid = world.playerEid;
    if(playerEid <= 0){
        console.error("Player EID not set on world");
        return;
    }
    const eid = addEntity(world);
    world.abilityPrefabs.set(eid, SpawnShield);
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