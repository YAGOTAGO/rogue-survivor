import { addComponents, addEntity, EntityId } from "bitecs";
import { GameWorld } from "../game/scenes/Game";

interface BaseAbilityData {
    name: string;
    cooldown: number;
    spriteKey: string;
    range: number;
}

// const BaseAbility = (world: GameWorld, data: BaseAbilityData): EntityId => {
//     const eid = addEntity(world);
//     addComponents(world, eid, [Cooldown]);
//     Cooldown.current[eid] = data.cooldown;
    
//     return eid;
// }