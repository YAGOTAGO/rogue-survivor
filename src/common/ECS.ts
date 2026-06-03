import { EntityId, World } from "bitecs";
import { GameObjects, Input, Scene, Types } from "phaser";
import { ExperienceBar } from "../ui/ExperienceBarUI";
import { SpatialHash } from "./SpatialHash";
import { HealthBar } from "../ui/HealthBarUI";
import { inputSystem, playerVelocitySystem } from "../systems/InputSystem";
import { lifespanSystem, timerSystem } from "../systems/TimerSystem";
import { enemySeparationSystem, followPlayerSystem, knockbackUpdateSystem, constrainedMovementSystem, moveToSystem, orbitPlayerSystem, spriteSyncSystem, unconstrainedMovementSystem } from "../systems/MovementSystem";
import { spatialHashSystem } from "../systems/SpatialHashSystem";
import { colliderSystem } from "../systems/ColliderSystem";
import { eventSystem } from "../systems/EventSystem";
import { uiSystem } from "../systems/UISystem";
import { debugSystem } from "../systems/DebugSystem";
import { PositionType } from "./Constants";
import { abilitySpawnerSystem } from "../systems/AbilitySystem";
import { AbilityBar } from "../ui/AbilityBarUI";
import { enemySpawnerSystem } from "../systems/EnemySpawner";

export type OverlapEvent = { source: EntityId; target: EntityId };

interface WorldData {
    scene: Scene,
    playerEid: EntityId,
    time: {
        delta: number;
        elapsed: number;
    },
    input: {
        xAxis: number;
        yAxis: number;
        cursors: Types.Input.Keyboard.CursorKeys;
        wasdKeys: any;
        pointer: Input.Pointer;
        gamepad: Input.Gamepad.GamepadPlugin;
    },
    events: {
        overlapEvents: OverlapEvent[];
    },
    ui: {
        healthBarUi: HealthBar;
        experienceBarUi: ExperienceBar;
        abilityBarUi: AbilityBar;
    },
    pools: {
        enemyPool: GameObjects.Group;
        orbPool: GameObjects.Group;
        projectilePool: GameObjects.Group;
    },
    abilityPrefabs: Map<EntityId, (world: GameWorld, pos: PositionType)=> EntityId>,
    projectileHitTrackers: Map<EntityId, Set<EntityId>>,
    debugGraphics: GameObjects.Graphics,
    spriteMap: Map<EntityId, GameObjects.Sprite>,
    spatialHash: SpatialHash;
}
export type GameWorld = World & WorldData;


const inputPhases = [
    inputSystem,
    timerSystem,
];
const spawningPhases = [
    enemySpawnerSystem,
];
const movementPhases = [
    knockbackUpdateSystem,
    playerVelocitySystem,
    moveToSystem,
    orbitPlayerSystem,
    followPlayerSystem,
    constrainedMovementSystem,
    unconstrainedMovementSystem
];
const abiltyPhases = [
    abilitySpawnerSystem,
    lifespanSystem
];
const collisionPhases = [
    spatialHashSystem,
    enemySeparationSystem,
    colliderSystem,
    eventSystem
];
const presentationSystems = [
    spriteSyncSystem,
    uiSystem,
    debugSystem
];

export const systems = [
    ...inputPhases,
    ...spawningPhases,
    ...movementPhases,
    ...abiltyPhases,
    ...collisionPhases,
    ...presentationSystems
] as const;
