import { query } from "bitecs";
import { GameWorld } from "../common/ECS";
import { Enemy } from "../components/StatComponents";
import { SpawnEnemy } from "../factories/SpawnerFactory";
import { Position } from "../components/MovementComponents";

const MAX_ENEMIES = 50;
const SPAWN_RATE = 0.2; // How often to spawn an enemy (in seconds)
const SPAWN_RADIUS_MIN = 400;
const SPAWN_RADIUS_MAX = 500;

let spawnTimer = 0;
export const enemySpawnerSystem = (world: GameWorld) => {

    const playerEid = world.playerEid;
    if (playerEid <= 0) return;

    const dt = world.time.delta / 1000;
    spawnTimer += dt;

    const activeEnemies = query(world, [Enemy]).length;
    if (activeEnemies < MAX_ENEMIES) {
        while (spawnTimer >= SPAWN_RATE) {
            spawnTimer -= SPAWN_RATE;

            if (query(world, [Enemy]).length >= MAX_ENEMIES) break; 

            const playerX = Position.x[playerEid];
            const playerY = Position.y[playerEid];

            const angle = Math.random() * Math.PI * 2;
            const dist = SPAWN_RADIUS_MIN + Math.random() * (SPAWN_RADIUS_MAX - SPAWN_RADIUS_MIN);
            
            const spawnX = playerX + Math.cos(angle) * dist;
            const spawnY = playerY + Math.sin(angle) * dist;

            SpawnEnemy(world, { x: spawnX, y: spawnY });
        }
    }else {
        spawnTimer = 0;
    }
}