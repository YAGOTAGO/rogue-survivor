import { addComponent, hasComponent, query, removeComponent } from 'bitecs';
import { Enemy, Player } from '../components/TagComponents';
import { Position, Velocity, Speed, MoveTo } from '../components/MovementComponents';
import { AIState, AIStateType, AIBehavior } from '../components/AIComponents';
import { GameWorld } from '../game/scenes/Game';

export const aiSystem = (world: GameWorld) => {
    let playerId = -1;

    for (const eid of query(world, [Player, Position])) {
        playerId = eid;
        break;
    }

    if (playerId < 0) {
        console.error("No player entity found for enemy AI system");
        return;
    }
    
    const playerX = Position.x[playerId];
    const playerY = Position.y[playerId];

    //TODO add a switch for behavior based on eney states

    for (const eid of query(world, [Enemy, Position, Speed, Velocity, AIState, AIBehavior])) {
        const dx = playerX - Position.x[eid];
        const dy = playerY - Position.y[eid];
        const distance = Math.sqrt(dx * dx + dy * dy);
        const state = AIState.value[eid];
        const detectRange = AIBehavior.detectionRadius[eid];
        const actionRange = AIBehavior.actionRange[eid];

        if (state === AIStateType.Idle) {
            if (distance <= detectRange) {
                AIState.value[eid] = AIStateType.Chase;
            }
        }

        if (AIState.value[eid] === AIStateType.Chase) {
            if (distance <= actionRange) {
                AIState.value[eid] = AIStateType.Action;
                if (hasComponent(world, eid, MoveTo)) {
                    removeComponent(world, eid, MoveTo);
                }
                Velocity.x[eid] = 0;
                Velocity.y[eid] = 0;
            } else {
                if (!hasComponent(world, eid, MoveTo)) {
                    addComponent(world, eid, MoveTo);
                }
                MoveTo.x[eid] = playerX;
                MoveTo.y[eid] = playerY;
            }
        }

        if (AIState.value[eid] === AIStateType.Action) {
            if (distance > actionRange) {
                AIState.value[eid] = AIStateType.Chase;
            } else {
                AIBehavior.lastAction[eid] += world.time.delta;
                if (AIBehavior.lastAction[eid] >= AIBehavior.cooldown[eid]) {
                    AIBehavior.lastAction[eid] = 0;
                    // TODO: fire a projectile, play an attack animation, or trigger damage
                    console.log(`Enemy ${eid} performs action on player!`);
                }
            }
        }
    }
};
