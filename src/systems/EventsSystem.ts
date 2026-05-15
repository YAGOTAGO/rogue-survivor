import { hasComponent } from "bitecs";
import { GameWorld, HitEvent } from "../game/scenes/Game";
import { DamageInfo, Health, InvulnerabilityTimer } from "../components/StatComponents";
import { Player } from "../components/TagComponents";

const PLAYER_INVULNERABILITY_DURATION = 0.5; // seconds

export const eventSystem = (world: GameWorld) => {
    for (const event of world.events.hitEvents) {
        damageSystem(world, event);
    }
    world.events.hitEvents = [];
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