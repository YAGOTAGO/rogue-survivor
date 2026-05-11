import { query, removeComponent } from "bitecs";
import { GameWorld } from "../game/scenes/Game";
import { Cooldown, InvulnerabilityTimer } from "../components/AbilityComponents";
import { TintModes } from "phaser";

export const cooldownSystem = (world: GameWorld) => {
    const dt = world.time.delta / 1000;
    for (const eid of query(world, [Cooldown])){
        Cooldown.value[eid] -= dt;
    }

    for (const eid of query(world, [InvulnerabilityTimer])){
        if(InvulnerabilityTimer.current[eid] > 0){
            InvulnerabilityTimer.current[eid] -= dt;
            const sprite = world.spriteMap.get(eid);
            if (sprite) {

                if (Math.floor(world.time.elapsed / 100) % 2 === 0) {
                    sprite.setTint(0xffffff).setTintMode(TintModes.FILL);
                } else {
                    sprite.clearTint(); 
                }
            }
        }else{
            const sprite = world.spriteMap.get(eid);
            if (sprite) sprite.clearTint();
            removeComponent(world, eid, InvulnerabilityTimer);
        }
    }
}

export const targetingSystem = (world: GameWorld) => {
    for (const eid of query(world, [Cooldown])){
        
    }
}