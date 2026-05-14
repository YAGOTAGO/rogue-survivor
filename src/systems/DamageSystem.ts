import { addComponent, hasComponent } from "bitecs";
import { InvulnerabilityTimer } from "../components/AbilityComponents";
import { GameWorld } from "../game/scenes/Game";
import { Health } from "../components/StatComponents";
import { Player } from "../components/TagComponents";

const PLAYER_INVULNERABILITY_DURATION = 0.5; // seconds

export const damageSystem = (world: GameWorld) => {
    for (const event of world.events.damageEvents) {
        const { target, amount } = event;
        
        if (hasComponent(world, target, InvulnerabilityTimer) && InvulnerabilityTimer.current[target] > 0) {
            continue; 
        }

        let finalDamage = amount;
        //TODO some armor reduction thing here

        Health.current[target] -= finalDamage;

        if (hasComponent(world, target, Player)) {
            if (!hasComponent(world, target, InvulnerabilityTimer)) {
                addComponent(world, target, InvulnerabilityTimer);
            }
            InvulnerabilityTimer.current[target] = PLAYER_INVULNERABILITY_DURATION; 
        }
    }
    world.events.damageEvents = [];
}