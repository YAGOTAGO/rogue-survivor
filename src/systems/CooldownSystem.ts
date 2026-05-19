import { query } from "bitecs";
import { GameWorld } from "../game/scenes/Game";
import { TintModes } from "phaser";
import { Cooldown, InvulnerabilityTimer } from "../components/StatComponents";

export const cooldownSystem = (world: GameWorld) => {
    const dt = world.time.delta / 1000;
    for (const eid of query(world, [Cooldown])){
        if(Cooldown.current[eid] > 0) {
            Cooldown.current[eid] -= dt;
        }else{
            Cooldown.current[eid] = Cooldown.max[eid];
        }
    }

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