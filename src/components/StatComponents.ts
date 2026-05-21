import { createRelation, withAutoRemoveSubject } from "bitecs";
import { MAX_ENTITIES } from "../common/Constants";

export const AbilityOf = createRelation(withAutoRemoveSubject);
export const ProjectileOf = createRelation(withAutoRemoveSubject);

export const Player = { }
export const Enemy = { }
export const Ability = {}
export const Health = { 
    current: new Int16Array(MAX_ENTITIES), 
    max: new Int16Array(MAX_ENTITIES) 
}
export const DamageInfo = { 
    damage: new Uint16Array(MAX_ENTITIES),
}
export const KnockbackInfo = {
    force: new Float32Array(MAX_ENTITIES),
    time: new Float32Array(MAX_ENTITIES),
}
export const MaxActiveCount = {
    max: new Uint16Array(MAX_ENTITIES),
}
export const Cooldown = {
    current: new Float32Array(MAX_ENTITIES),
    maxTimer: new Float32Array(MAX_ENTITIES)
}
export const ActiveKnockback = {
    timer: new Float32Array(MAX_ENTITIES)
}
export const Level = {
    level: new Uint16Array(MAX_ENTITIES),
    currentExperience: new Uint16Array(MAX_ENTITIES),
    maxExperience: new Uint16Array(MAX_ENTITIES)
}
export const ExperienceValue = {
    value: new Uint16Array(MAX_ENTITIES)
}
export const OrbitPlayer = {
    radius: new Float32Array(MAX_ENTITIES),
    speed: new Float32Array(MAX_ENTITIES),
    baseAngle: new Float32Array(MAX_ENTITIES)
}
export const InvulnerabilityTimer = { 
    current: new Float32Array(MAX_ENTITIES)
}
export const HitCircle = {
    radius: new Float32Array(MAX_ENTITIES),
    offsetX: new Float32Array(MAX_ENTITIES),
    offsetY: new Float32Array(MAX_ENTITIES),
    mask: new Uint8Array(MAX_ENTITIES),
}
export const HurtCircle = {
    radius: new Float32Array(MAX_ENTITIES),
    offsetX: new Float32Array(MAX_ENTITIES),
    offsetY: new Float32Array(MAX_ENTITIES),
    layer: new Uint8Array(MAX_ENTITIES),
}