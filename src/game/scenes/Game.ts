import { createWorld, EntityId, World } from 'bitecs';
import { Scene, Math as PhaserMath } from 'phaser';
import { enemySeparationSystem, followPlayerSystem, movementSystem, moveToSystem, playerVelocitySystem, spriteSyncSystem } from '../../systems/MovementSystem';
import { inputSystem } from '../../systems/InputHandler';
import { uiSystem } from '../../systems/UISystem';
import { SpawnEnemy, SpawnPlayer } from '../../factories/UnitFactory';
import { HealthBar } from '../../ui/HealthBarUI';
import { OnTouchDamage } from '../../components/AbilityComponents';
import { cooldownSystem } from '../../systems/CooldownSystem';
import { debugSystem } from '../../systems/DebugSystem';
import { colliderSystem } from '../../systems/ColliderSystem';
import { eventSystem } from '../../systems/EventsSystem';
import { SpatialHash } from '../../common/SpatialHash';
import { spatialHashSystem } from '../../systems/SpatialHashSystem';

export type HitEvent = { source: EntityId; target: EntityId };

interface WorldData {
    scene: Phaser.Scene;
    time: {
        delta: number;
        elapsed: number;
    },
    input: {
        xAxis: number;
        yAxis: number;
        cursors: Phaser.Types.Input.Keyboard.CursorKeys;
        wasdKeys: any;
        pointer: Phaser.Input.Pointer;
        gamepad: Phaser.Input.Gamepad.GamepadPlugin;
    },
    events: {
        hitEvents: HitEvent[];
    },
    ui: {
        healthBarUi: HealthBar;
    },
    debugGraphics: Phaser.GameObjects.Graphics,
    spriteMap: Map<EntityId, Phaser.GameObjects.Sprite>,
    spatialHash: SpatialHash;
}
export type GameWorld = World & WorldData;

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    world!: GameWorld;
    fpsText!: Phaser.GameObjects.Text;
    player!: EntityId;

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.camera = this.cameras.main;      
        this.world = createWorld({
            scene: this,
            time: { delta: 0, elapsed: 0 },
            input: { 
                xAxis: 0, 
                yAxis: 0,
                cursors: this.input.keyboard!.createCursorKeys(),
                wasdKeys: this.input.keyboard!.addKeys('W,A,S,D'),
                pointer: this.input.activePointer,
                gamepad: this.input.gamepad,
             },
            events: {
                hitEvents: [] as HitEvent[],
            },
            ui: {
                healthBarUi: new HealthBar(this),
            },
            debugGraphics: this.add.graphics().setDepth(1000),
            spriteMap: new Map<EntityId, Phaser.GameObjects.Sprite>(),
            spatialHash: new SpatialHash(),
        }) as GameWorld;

        const map = this.add.tilemap('world-map');
        const tileset = map.addTilesetImage('tiles', 'tiles')!;
        const animatedTileset = map.addTilesetImage('animated-tiles', 'animated-tiles')!;
        map.createLayer('Ground', [tileset, animatedTileset]);
        map.createLayer('Surface', [tileset, animatedTileset]);

        const centerX = map.widthInPixels / 2;
        const centerY = map.heightInPixels / 2;
        this.player = SpawnPlayer(this.world, { x: centerX, y: centerY });
        const playerSprite = this.world.spriteMap.get(this.player);
        if (playerSprite) {
            this.camera.startFollow(playerSprite, false, 1, 1);
        }
        
        for(let i = 0; i < 1000; i++) {
            // Spawn in a 200px radius circle around the center
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * 200;
            const x = centerX + Math.cos(angle) * dist;
            const y = centerY + Math.sin(angle) * dist;
            SpawnEnemy(this.world, { x, y });
        }

        this.fpsText = this.add.text(10, 10, '', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '16px',
            color: '#ffffff',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            padding: { x: 6, y: 4 },
            resolution: 1
        }).setScrollFactor(0);
    }

    systems = [
        cooldownSystem,
        inputSystem,
        playerVelocitySystem,
        moveToSystem,
        // followPlayerSystem,
        movementSystem,
        spatialHashSystem, // Must run before colliderSystem/enemySeparationSystem
        enemySeparationSystem,
        colliderSystem,
        eventSystem,
        spriteSyncSystem,
        uiSystem,
        debugSystem,
    ];

    runSystems = (world: GameWorld) => {
        for (const system of this.systems) {
            system(world)
        }
    }

    update(time: number, delta: number): void {
        this.world.time.delta = delta;
        this.world.time.elapsed = time;
        this.runSystems(this.world);

        const fps = Math.round(this.game.loop.actualFps || 0);
        this.fpsText.setText(`FPS: ${fps}`);
    }
}
