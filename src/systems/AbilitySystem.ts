import { addComponent, getRelationTargets, hasComponent, query } from "bitecs";
import { GameWorld } from "../common/ECS";
import { Ability, AbilityOf, Cooldown, MaxActiveCount, ProjectileOf } from "../components/StatComponents";
import { Position } from "../components/MovementComponents";

export const abilitySpawnerSystem = (world: GameWorld) => {
    const dt = world.time.delta / 1000;

    for (const abilityEid of query(world, [Ability, Cooldown])){
        Cooldown.current[abilityEid] -= dt;

        if (Cooldown.current[abilityEid] <= 0){
            const spawnFn = world.abilityPrefabs.get(abilityEid);

            const [owner] = getRelationTargets(world, abilityEid, AbilityOf);
            if (owner === undefined) continue;
            const ownerPos = { x: Position.x[owner], y: Position.y[owner] };
                
            if (hasComponent(world, abilityEid, MaxActiveCount)){
                const activeCount = query(world, [ProjectileOf(abilityEid)]).length;
                
                if (activeCount < MaxActiveCount.max[abilityEid]) {
                    if(spawnFn){
                        const projectileEid = spawnFn(world, ownerPos);
                        addComponent(world, projectileEid, ProjectileOf(abilityEid));
                    }
                    Cooldown.current[abilityEid] = Cooldown.maxTimer[abilityEid];
                }else{
                    Cooldown.current[abilityEid] = 0;
                }
            } else {
                if (spawnFn) {
                    spawnFn(world, ownerPos);
                }
                Cooldown.current[abilityEid] = Cooldown.maxTimer[abilityEid];
            }
        }
    }
}