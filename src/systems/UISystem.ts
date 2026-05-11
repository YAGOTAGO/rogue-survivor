import { query } from 'bitecs';
import { Enemy, Player } from '../components/TagComponents';
import { Health } from '../components/StatComponents';
import { GameWorld } from '../game/scenes/Game';

export const uiSystem = (world: GameWorld) => {
    const scene = world.scene as any; // Access UI objects from the scene

    //Player Health Bar
    for (const eid of query(world, [Player, Health])) {
        const current = Health.current[eid];
        const max = Health.max[eid];
        scene.healthBarUi.updateHealth(current, max);
        break;
    }

    //Tint Enemies based on health
    for (const eid of query(world, [Enemy, Health])) {
        const percent = Health.current[eid] / Health.max[eid];
        const gb = Math.floor(255 * percent);
        const tint = (255 << 16) | (gb << 8) | gb;
        world.spriteMap.get(eid)?.setTint(tint);
    }
};