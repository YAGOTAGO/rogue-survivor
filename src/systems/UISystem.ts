import { query } from 'bitecs';
import { Enemy, Experience, Health, Player } from '../components/StatComponents';
import { GameWorld } from '../common/ECS';

export const uiSystem = (world: GameWorld) => {
    
    //Player Health Bar
    for (const eid of query(world, [Player, Health])) {
        const current = Health.current[eid];
        const max = Health.max[eid];
        world.ui.healthBarUi.updateHealth(current, max);
        break;
    }

    //Experience Bar
    for (const eid of query(world, [Player, Experience])) {
        const current = Experience.current[eid];
        const max = Experience.max[eid];
        world.ui.experienceBarUi.updateExperience(current, max, Experience.level[eid]);
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