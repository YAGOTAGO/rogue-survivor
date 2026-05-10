import { addComponents, addEntity, EntityId } from "bitecs";
import { GameWorld } from "../game/scenes/Game";
import { Cooldown } from "../components/AbilityComponents";

interface BaseAbilityData {
    name: string;
    cooldown: number;
    spriteKey: string;
    range: number;
}

const BaseAbility = (world: GameWorld, data: BaseAbilityData): EntityId => {
    const eid = addEntity(world);
    addComponents(world, eid, [Cooldown]);
    Cooldown.value[eid] = data.cooldown;
    
    return eid;
}