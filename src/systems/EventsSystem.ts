import { hasComponent } from "bitecs";
import { GameWorld, HitEvent } from "../game/scenes/Game";
import { DamageInfo, Experience, ExperienceValue, Health, InvulnerabilityTimer } from "../components/StatComponents";
import { Player } from "../components/TagComponents";
import { LEVEL_UP_SCALING } from "../common/Constants";
import { DespawnSpriteEntity } from "../factories/EntityFactory";

const PLAYER_INVULNERABILITY_DURATION = 0.5; // seconds

export const eventSystem = (world: GameWorld) => {
    for (const event of world.events.hitEvents) {
        damageSystem(world, event);
        experienceSystem(world, event);
    }
    world.events.hitEvents = [];
}

const experienceSystem = (world: GameWorld, hitEvent: HitEvent) => {
    const { target, source } = hitEvent;
    if (!hasComponent(world, target, Player)) return;
    if (!hasComponent(world, source, ExperienceValue)) return;
    const expValue = ExperienceValue.value[source];
    let totalExp = Experience.current[target] + expValue;
    while (totalExp >= Experience.max[target]) {
        totalExp -= Experience.max[target];         
        Experience.level[target] += 1;
        Experience.max[target] = Math.floor(Experience.max[target] * LEVEL_UP_SCALING);
    }
    Experience.current[target] = totalExp;
    DespawnSpriteEntity(world, source);
}

const damageSystem = (world: GameWorld, hitEvent: HitEvent) => {
    const { target, source } = hitEvent;

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