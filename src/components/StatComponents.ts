import { MAX_ENTITIES } from "../common/Constants";

export const Player = { }
export const Enemy = { }
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
export const ActiveKnockback = {
    timer: new Float32Array(MAX_ENTITIES)
}
export const Experience = {
    level: new Uint16Array(MAX_ENTITIES),
    current: new Uint16Array(MAX_ENTITIES),
    max: new Uint16Array(MAX_ENTITIES)
}
export const ExperienceValue = {
    value: new Uint16Array(MAX_ENTITIES)
}
export const OrbitPlayer = {
    radius: new Float32Array(MAX_ENTITIES),
    speed: new Float32Array(MAX_ENTITIES),
    baseAngle: new Float32Array(MAX_ENTITIES)
}
export const Cooldown = {
    current: new Float32Array(MAX_ENTITIES), 
    max: new Float32Array(MAX_ENTITIES),
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