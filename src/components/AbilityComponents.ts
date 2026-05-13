import { createRelation, withAutoRemoveSubject } from "bitecs"
import { MAX_ENTITIES } from "../common/Constants";

export const Targeting = createRelation();

// For Abilities: Links the ability entity to the unit.
// withAutoRemoveSubject ensures that if the Unit is deleted, 
// the Ability entity is cleaned up automatically.
export const AbilityOf = createRelation(withAutoRemoveSubject);

export const Cooldown = {
    current: new Float32Array(MAX_ENTITIES), 
    max: new Float32Array(MAX_ENTITIES) 
}
export const OnTouchDamage = { 
    value: new Uint16Array(MAX_ENTITIES) //0 to 32k
}
export const InvulnerabilityTimer = { 
    current: new Float32Array(MAX_ENTITIES), 
    max: new Float32Array(MAX_ENTITIES) 
}