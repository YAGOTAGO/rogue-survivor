import { MAX_ENTITIES } from "../common/Constants"

export const Position = { 
  x: new Float32Array(MAX_ENTITIES), 
  y: new Float32Array(MAX_ENTITIES) 
}

export const Velocity = {
  x: new Float32Array(MAX_ENTITIES),
  y: new Float32Array(MAX_ENTITIES),
}

export const MoveTo = {
  x: new Float32Array(MAX_ENTITIES),
  y: new Float32Array(MAX_ENTITIES),
}

export const Speed = {
  value: new Uint16Array(MAX_ENTITIES)
}

export const Collider = {
  // Use wider ranges for width/height and signed values for offsets
  width: new Uint16Array(MAX_ENTITIES),
  height: new Uint16Array(MAX_ENTITIES),
  offsetX: new Int16Array(MAX_ENTITIES),
  offsetY: new Int16Array(MAX_ENTITIES),
}