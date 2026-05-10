import { query } from "bitecs";
import { GameWorld } from "../game/scenes/Game";
import { Cooldown } from "../components/AbilityComponents";

export const cooldownSystem = (world: GameWorld) => {
    const dt = world.time.delta / 1000;
    for (const eid of query(world, [Cooldown])){
        Cooldown.value[eid] -= dt;
    }
}

export const targetingSystem = (world: GameWorld) => {
    for (const eid of query(world, [Cooldown])){
        
    }
}