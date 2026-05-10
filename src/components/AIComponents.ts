import { createRelation, makeExclusive, withAutoRemoveSubject } from "bitecs"

// For AI: One unit tracks one target.
export const Targeting = createRelation(makeExclusive);

// For Abilities: Links the ability entity to the unit.
// withAutoRemoveSubject ensures that if the Unit is deleted, 
// the Ability entity is cleaned up automatically.
export const AbilityOf = createRelation(withAutoRemoveSubject);