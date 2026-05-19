import { addComponent, EntityId, hasComponent } from "bitecs";
import { ActiveKnockback, DamageInfo, Experience, ExperienceValue, Health, InvulnerabilityTimer, KnockbackInfo } from "../components/StatComponents";
import { Player } from "../components/TagComponents";
import { LEVEL_UP_SCALING } from "../common/Constants";
import { SpawnExperienceOrb } from "../factories/SpawnerFactory";
import { Position, Velocity } from "../components/MovementComponents";
import { DespawnSpriteEntity } from "../common/Pooling";
import { GameWorld } from "../common/ECS";

const PLAYER_INVULNERABILITY_DURATION = 0.5; // seconds

export const eventSystem = (world: GameWorld) => {
    for (const { source, target } of world.events.overlapEvents) {
        
        //Experience event
        if(hasComponent(world, target, ExperienceValue) && hasComponent(world, source, Player)){
            experienceSystem(world, source, target);
            continue;
        }

        //Knockback
        if(hasComponent(world, source, KnockbackInfo) && hasComponent(world, target, Position)){
            applyKnockback(world, source, target);
        }

        //Damage event
        if(hasComponent(world, source, DamageInfo) && hasComponent(world, target, Health)){
            damageSystem(world, source, target);
            continue;
        } 
    }
    world.events.overlapEvents = [];
}

const applyKnockback = (world: GameWorld, source: EntityId, target: EntityId) => {
    const dx = Position.x[target] - Position.x[source];
    const dy = Position.y[target] - Position.y[source];
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;

    addComponent(world, target, ActiveKnockback);
    ActiveKnockback.timer[target] = KnockbackInfo.time[source];

    if (hasComponent(world, target, Velocity)) {
        Velocity.x[target] = (dx / dist) * KnockbackInfo.force[source];
        Velocity.y[target] = (dy / dist) * KnockbackInfo.force[source];
    }
}

const experienceSystem = (world: GameWorld, source: EntityId, target: EntityId) => {    
    const expValue = ExperienceValue.value[target];
    let totalExp = Experience.current[source] + expValue;
    while (totalExp >= Experience.max[source]) {
        totalExp -= Experience.max[source];         
        Experience.level[source] += 1;
        Experience.max[source] = Math.floor(Experience.max[source] * LEVEL_UP_SCALING);
    }
    Experience.current[source] = totalExp;
    DespawnSpriteEntity(world, target);
}

const damageSystem = (world: GameWorld, source: EntityId, target: EntityId) => {
    if (hasComponent(world, target, InvulnerabilityTimer) && InvulnerabilityTimer.current[target] > 0) {
        return;
    }

    let finalDamage = hasComponent(world, source, DamageInfo) ? DamageInfo.damage[source] : 0;

    //TODO some armor reduction thing here

    Health.current[target] -= finalDamage;
    if (Health.current[target] <= 0) {

        if (hasComponent(world, target, Player)) {
            //Trigger some event that will end game
        }else {
            const targetSprite = world.spriteMap.get(target);
            if (hasComponent(world, target, ExperienceValue) && targetSprite) {
                SpawnExperienceOrb(world, { x: targetSprite.x, y: targetSprite.y }, ExperienceValue.value[target]);
            }    
            DespawnSpriteEntity(world, target);
        }
    }

    if (hasComponent(world, target, Player)) {
        InvulnerabilityTimer.current[target] = PLAYER_INVULNERABILITY_DURATION; 
    }
    
}