import { createWorld, EntityId } from 'bitecs';
import { Scene, Math as PhaserMath, GameObjects, Cameras } from 'phaser';
import { SpawnEnemy, SpawnExperienceOrb, SpawnPlayer } from '../../factories/SpawnerFactory';
import { HealthBar } from '../../ui/HealthBarUI';
import { SpatialHash } from '../../common/SpatialHash';
import { ASSETS } from '../../common/Assets';
import { ExperienceBar } from '../../ui/ExperienceBarUI';
import { MAX_ENEMY_POOL_SIZE, MAX_ORB_POOL_SIZE, MAX_PROJECTILE_POOL_SIZE } from '../../common/Pooling';
import { SpawnDaggerAbility, SpawnShieldAbility } from '../../factories/AbilityFactory';
import { GameWorld, OverlapEvent, systems } from '../../common/ECS';
import { PositionType } from '../../common/Constants';
import { AbilityBar } from '../../ui/AbilityBarUI';

export class Game extends Scene
{
    private camera: Cameras.Scene2D.Camera;
    private world!: GameWorld;
    private fpsText!: GameObjects.Text;

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.camera = this.cameras.main;      
        this.world = createWorld({
            scene: this,
            playerEid: 0,
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
                overlapEvents: [] as OverlapEvent[],
            },
            ui: {
                healthBarUi: new HealthBar(this),
                experienceBarUi: new ExperienceBar(this),
                abilityBarUi: new AbilityBar(this)
            },
            pools: {
                enemyPool: this.add.group({ classType: GameObjects.Sprite, maxSize: MAX_ENEMY_POOL_SIZE }),
                orbPool: this.add.group({ classType: GameObjects.Sprite, maxSize: MAX_ORB_POOL_SIZE }),
                projectilePool: this.add.group({ classType: GameObjects.Sprite, maxSize: MAX_PROJECTILE_POOL_SIZE }),
            },
            abilityPrefabs: new Map<EntityId , (world: GameWorld, pos: PositionType)=>EntityId>(),
            debugGraphics: this.add.graphics().setDepth(1000),
            spriteMap: new Map<EntityId, GameObjects.Sprite>(),
            spatialHash: new SpatialHash(),
        }) as GameWorld;

        const map = this.add.tilemap(ASSETS.TILEMAPS.MAP);
        const tileset = map.addTilesetImage(ASSETS.IMAGES.TILES, ASSETS.IMAGES.TILES)!;
        const animatedTileset = map.addTilesetImage(ASSETS.IMAGES.ANIMATED_TILES, ASSETS.IMAGES.ANIMATED_TILES)!;
        map.createLayer('Ground', [tileset, animatedTileset]);
        map.createLayer('Surface', [tileset, animatedTileset]);

        const centerX = map.widthInPixels / 2;
        const centerY = map.heightInPixels / 2;
        const player = SpawnPlayer(this.world, { x: centerX, y: centerY });
        this.world.playerEid = player;
        const playerSprite = this.world.spriteMap.get(player);
        if (playerSprite) {
            this.camera.startFollow(playerSprite, false, 1, 1);
        }

        SpawnExperienceOrb(this.world, { x: centerX + 50, y: centerY }, 120);
        SpawnShieldAbility(this.world);
        SpawnDaggerAbility(this.world);
        for(let i = 0; i < 10; i++) {
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
    

    runSystems = (world: GameWorld) => {
        for (const system of systems) {
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
