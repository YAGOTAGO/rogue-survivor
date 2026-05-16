import { MAX_ENTITIES } from "../common/Constants";

export const Health = { 
    current: new Int16Array(MAX_ENTITIES), 
    max: new Int16Array(MAX_ENTITIES) 
}
export const Regen = { 
    value: new Float32Array(MAX_ENTITIES) // HP per second
}
export const XpGain = { 
    multiplier: new Float32Array(MAX_ENTITIES) 
}
export const DamageInfo = { 
    value: new Uint16Array(MAX_ENTITIES) 
}
export const DamagePercent = { 
    multiplier: new Float32Array(MAX_ENTITIES) 
}
export const Cooldown = {
    current: new Float32Array(MAX_ENTITIES), 
    max: new Float32Array(MAX_ENTITIES) 
}
export const InvulnerabilityTimer = { 
    current: new Float32Array(MAX_ENTITIES)
}
export const HitCircle = {
    radius: new Float32Array(MAX_ENTITIES),
    offsetX: new Float32Array(MAX_ENTITIES),
    offsetY: new Float32Array(MAX_ENTITIES),
    damage: new Uint16Array(MAX_ENTITIES),
}
export const HurtCircle = {
    radius: new Float32Array(MAX_ENTITIES),
    offsetX: new Float32Array(MAX_ENTITIES),
    offsetY: new Float32Array(MAX_ENTITIES),
}