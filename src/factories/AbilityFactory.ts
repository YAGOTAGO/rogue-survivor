import { addComponents, EntityId } from "bitecs";
import { Cooldown, HitCircle, KnockbackInfo, OrbitPlayer } from "../components/StatComponents";
import { BaseSpriteData, BaseSpriteEntity } from "./BaseEntityFactory";
import { ASSETS } from "../common/Assets";
import { OVERLAP_LAYERS } from "../common/Constants";
import { GameWorld } from "../common/ECS";


export const SpawnShield = (world: GameWorld, pos: { x: number, y: number }): EntityId => {
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