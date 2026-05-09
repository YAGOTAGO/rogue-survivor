import { addComponent, hasComponent, query, removeComponent } from 'bitecs';
import { Enemy, Player } from '../components/TagComponents';
import { Position, Velocity, Speed, MoveTo } from '../components/MovementComponents';
import { AIState, AIStateType, EnemyBehavior } from '../components/AIComponents';
import { GameWorld } from '../game/scenes/Game';

export const enemyAISystem = (world: GameWorld) => {
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

    for (const eid of query(world, [Enemy, Position, Speed, Velocity, AIState, EnemyBehavior])) {
        const dx = playerX - Position.x[eid];
        const dy = playerY - Position.y[eid];
        const distance = Math.sqrt(dx * dx + dy * dy);
        const state = AIState.value[eid];
        const detectRange = EnemyBehavior.detectionRadius[eid];
        const attackRange = EnemyBehavior.attackRange[eid];

        if (state === AIStateType.Idle) {
            if (distance <= detectRange) {
                AIState.value[eid] = AIStateType.Chase;
            }
        }

        if (AIState.value[eid] === AIStateType.Chase) {
            if (distance <= attackRange) {
                AIState.value[eid] = AIStateType.Attack;
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

        if (AIState.value[eid] === AIStateType.Attack) {
            if (distance > attackRange) {
                AIState.value[eid] = AIStateType.Chase;
            } else {
                EnemyBehavior.lastAction[eid] += world.time.delta;
                if (EnemyBehavior.lastAction[eid] >= EnemyBehavior.cooldown[eid]) {
                    EnemyBehavior.lastAction[eid] = 0;
                    // TODO: fire a projectile, play an attack animation, or trigger damage
                }
            }
        }
    }
};
