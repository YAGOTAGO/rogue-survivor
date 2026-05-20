import { EntityId, World } from "bitecs";
import { GameObjects, Input, Scene, Types } from "phaser";
import { ExperienceBar } from "../ui/ExperienceBarUI";
import { SpatialHash } from "./SpatialHash";
import { HealthBar } from "../ui/HealthBarUI";
import { inputSystem, playerVelocitySystem } from "../systems/InputSystem";
import { cooldownSystem } from "../systems/CooldownSystem";
import { enemySeparationSystem, followPlayerSystem, knockbackUpdateSystem, movementSystem, moveToSystem, orbitPlayerSystem, spriteSyncSystem } from "../systems/MovementSystem";
import { spatialHashSystem } from "../systems/SpatialHashSystem";
import { colliderSystem } from "../systems/ColliderSystem";
import { eventSystem } from "../systems/EventSystem";
import { uiSystem } from "../systems/UISystem";
import { debugSystem } from "../systems/DebugSystem";

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
    },
    pools: {
        enemyPool: GameObjects.Group;
        orbPool: GameObjects.Group;
        projectilePool: GameObjects.Group;
    },
    debugGraphics: GameObjects.Graphics,
    spriteMap: Map<EntityId, GameObjects.Sprite>,
    spatialHash: SpatialHash;
}
export type GameWorld = World & WorldData;


const inputPhases = [
    inputSystem,
    cooldownSystem,
];
const movementPhases = [
    knockbackUpdateSystem,
    playerVelocitySystem,
    moveToSystem,
    orbitPlayerSystem,
    // followPlayerSystem,
    movementSystem
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
    ...movementPhases,
    ...collisionPhases,
    ...presentationSystems
] as const;
