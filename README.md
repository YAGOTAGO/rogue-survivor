# Survivors-like game build (ECS architecture)

### 🛠️ Tech Stack
* **Framework:** [Phaser 4.1](https://phaser.io/) (WebGL/Canvas 2D Rendering)
* **ECS Framework:** [bitECS](https://github.com/NateTheGreatt/bitECS)
* **Language:** TypeScript
* **Tools:** Vite, npm, Tiled, [RexUI](https://www.npmjs.com/package/phaser3-rex-plugins)
* **Art:** [32rogues](https://sethbb.itch.io/32rogues)

## Architecture Highlights
* **Thousands of entities:** Testing showed stable framerate at over 2k entities
* **Cache Locality:** The ECS architecture stores all state in flat TypesArrays
* **Sprite Pooling:** Use object pooling for sprites to reduce instancing 
* **Spatial Hashing:** Use spatial hash to reduce collision checks allowing more entities to be in the world

## Overview
Entire game is build from systems
```ts
runSystems = (world: GameWorld) => {
    for (const system of systems) {
        system(world)
    }
}
```

Components are used as data
```ts
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
etc...
```

### Work in Progress
**TODO**
* Win condition
* Level up rewards
* More abilities

