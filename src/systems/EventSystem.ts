import { EntityId, hasComponent } from "bitecs";
import { GameWorld } from "../game/scenes/Game";
import { DamageInfo, Experience, ExperienceValue, Health, InvulnerabilityTimer } from "../components/StatComponents";
import { Player } from "../components/TagComponents";
import { LEVEL_UP_SCALING } from "../common/Constants";
import { DespawnSpriteEntity } from "../factories/BaseEntityFactory";

const PLAYER_INVULNERABILITY_DURATION = 0.5; // seconds

export const eventSystem = (world: GameWorld) => {
    for (const { source, target } of world.events.overlapEvents) {
        
        //Experience event
        if(hasComponent(world, target, ExperienceValue) && hasComponent(world, source, Player)){
            experienceSystem(world, source, target);
            continue;
        }

        //Damage event
        if(hasComponent(world, source, DamageInfo) && hasComponent(world, target, Health)){
            damageSystem(world, source, target);
            continue;
        } 
    }
    world.events.overlapEvents = [];
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

    let finalDamage = hasComponent(world, source, DamageInfo) ? DamageInfo.value[source] : 0;

    //TODO some armor reduction thing here

    Health.current[target] -= finalDamage;
    if (Health.current[target] <= 0) {
        console.log(`Entity ${target} was killed by Entity ${source}`);
    }

    if (hasComponent(world, target, Player)) {
        InvulnerabilityTimer.current[target] = PLAYER_INVULNERABILITY_DURATION; 
    }
    
}