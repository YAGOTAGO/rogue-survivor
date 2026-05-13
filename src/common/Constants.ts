/** 
 * Typed Array Options:
 * -------------------------------
 * Float32Array                Moderate Precision
 * Float64Array                High Precision (more memory usage)   
 * Int8Array / Uint8Array	   -128 to 127 / 0 to 255
 * Int16Array / Uint16Array	   -32,768 to 32,767 / 0 to 65,535
 * Int32Array / Uint32Array	   -2,147,483,648 to 2,147,483,647 / 0 to 4,294,967,295
*/

export const MAX_ENTITIES = 10000;
export const PLAYER_INVULNERABILITY_DURATION = 0.5; // seconds
export const ENEMY_SEPARATION_RADIUS = 24; // pixels
export const DEFAULT_COLLIDER_PADDING = 8; // pixels to subtract from sprite size for default collider