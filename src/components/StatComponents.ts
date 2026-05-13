import { MAX_ENTITIES } from "../common/Constants";

export const Health = { 
    current: new Uint16Array(MAX_ENTITIES), 
    max: new Uint16Array(MAX_ENTITIES) 
};
export const Regen = { 
    value: new Float32Array(MAX_ENTITIES) // HP per second
};
export const XpGain = { 
    multiplier: new Float32Array(MAX_ENTITIES) 
};
export const Damage = { 
    value: new Uint16Array(MAX_ENTITIES) 
};
export const DamagePercent = { 
    multiplier: new Float32Array(MAX_ENTITIES) 
};