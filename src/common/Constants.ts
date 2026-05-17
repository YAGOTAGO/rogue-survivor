/** 
 * Typed Array Options:
 * -------------------------------
 * Float32Array                Moderate Precision
 * Float64Array                High Precision (more memory usage)   
 * Int8Array / Uint8Array	   -128 to 127 / 0 to 255
 * Int16Array / Uint16Array	   -32,768 to 32,767 / 0 to 65,535
 * Int32Array / Uint32Array	   -2,147,483,648 to 2,147,483,647 / 0 to 4,294,967,295
*/

export const MAX_ENTITIES = 10000 as const;
export const MAX_ENEMY_POOL_SIZE = 2000 as const;
export const MAX_ORB_POOL_SIZE = 2000 as const;
export const LEVEL_UP_SCALING = 1.2 as const;
export const OVERLAP_LAYERS = {
    NONE:       0,
    PLAYER:     1 << 0,  // 1
    ENEMY:      1 << 1,  // 2
    PROJECTILE: 1 << 2,  // 4
    XP_ORB:     1 << 3,  // 8
    POWERUP:    1 << 4,  // 16
} as const;