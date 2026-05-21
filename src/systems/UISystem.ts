import { query } from 'bitecs';
import { Enemy, Level, Health, Player } from '../components/StatComponents';
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
    for (const eid of query(world, [Player, Level])) {
        const current = Level.currentExperience[eid];
        const max = Level.maxExperience[eid];
        world.ui.experienceBarUi.updateExperience(current, max, Level.level[eid]);
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