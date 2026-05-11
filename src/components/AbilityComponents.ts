import { createRelation, withAutoRemoveSubject } from "bitecs"

export const Targeting = createRelation();

// For Abilities: Links the ability entity to the unit.
// withAutoRemoveSubject ensures that if the Unit is deleted, 
// the Ability entity is cleaned up automatically.
export const AbilityOf = createRelation(withAutoRemoveSubject);

export const Cooldown = { current: [] as number[], max: [] as number[] }
export const OnTouchDamage = { value: [] as number[] }
export const InvulnerabilityTimer = { current: [] as number[], max: [] as number[] }