import { query, removeEntity } from "bitecs";
import { TintModes } from "phaser";
import { InvulnerabilityTimer, Lifespan } from "../components/StatComponents";
import { GameWorld } from "../common/ECS";
import { DespawnSpriteEntity } from "../common/Pooling";

export const timerSystem = (world: GameWorld) => {
    const dt = world.time.delta / 1000;

    for (const eid of query(world, [InvulnerabilityTimer])){
        if(InvulnerabilityTimer.current[eid] > 0){
            InvulnerabilityTimer.current[eid] -= dt;
            const sprite = world.spriteMap.get(eid);
            if (sprite) {
                // Invulnerable animation
                if (Math.floor(world.time.elapsed / 100) % 2 === 0) {
                    sprite.setTint(0xffffff).setTintMode(TintModes.FILL);
                } else {
                    sprite.clearTint(); 
                }
            }
        }else{
            const sprite = world.spriteMap.get(eid);
            if (sprite) sprite.clearTint();
        }
    }
}

export const lifespanSystem = (world: GameWorld) => {
    const dt = world.time.delta / 1000;

    for (const eid of query(world, [Lifespan])){
        Lifespan.current[eid] -= dt;
        if (Lifespan.current[eid] <= 0) {
            DespawnSpriteEntity(world, eid);
        }
    }
}