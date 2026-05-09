import { query } from 'bitecs';
import { Player } from '../components/TagComponents';
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
};