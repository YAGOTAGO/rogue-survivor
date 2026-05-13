import { createWorld, EntityId, World } from 'bitecs';
import { Scene, Math as PhaserMath } from 'phaser';
import { enemySeparationSystem, followPlayerSystem, movementSystem, moveToSystem, playerVelocitySystem, spriteSyncSystem } from '../../systems/MovementSystem';
import { inputSystem } from '../../systems/InputHandler';
import { uiSystem } from '../../systems/UISystem';
import { SpawnEnemy, SpawnPlayer } from '../../factories/UnitFactory';
import { HealthBar } from '../../ui/HealthBarUI';
import { OnTouchDamage } from '../../components/AbilityComponents';
import { damageSystem } from '../../systems/DamageSystem';
import { cooldownSystem } from '../../systems/AbilitySystem';

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
        damageEvents: Array<{ target: EntityId, source: EntityId, amount: number }>;
    },
    ui: {
        healthBarUi: HealthBar;
    },
    spriteMap: Map<EntityId, Phaser.GameObjects.Sprite>,
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
                damageEvents: [],
            },
            ui: {
                healthBarUi: new HealthBar(this),
            },
            spriteMap: new Map<EntityId, Phaser.GameObjects.Sprite>(),
        }) as GameWorld;
        const map = this.add.tilemap('world-map');
        const tileset = map.addTilesetImage('tiles', 'tiles')!;
        const animatedTileset = map.addTilesetImage('animated-tiles', 'animated-tiles')!;
        map.createLayer('Ground', [tileset, animatedTileset]);
        map.createLayer('Surface', [tileset, animatedTileset]);
        
        //TODO add back inthe overlap once we do it a non physics way
        // this.physics.add.overlap(
        //     playerGroup, 
        //     enemyGroup, 
        //     (playerObj, enemyObj) => {
        //         const p = playerObj as Phaser.GameObjects.Sprite;
        //         const e = enemyObj as Phaser.GameObjects.Sprite;

        //         const playerEid = p.getData('eid');
        //         const enemyEid = e.getData('eid');
                
        //         const damage = OnTouchDamage.value[enemyEid] || 0;
        //         this.world.events.damageEvents.push({
        //             target: playerEid,
        //             source: enemyEid,
        //             amount: damage
        //         });
        //     }
        // );
        const centerX = map.widthInPixels / 2;
        const centerY = map.heightInPixels / 2;
        this.player = SpawnPlayer(this.world, { x: centerX, y: centerY });
        const playerSprite = this.world.spriteMap.get(this.player);
        if (playerSprite) {
            this.camera.startFollow(playerSprite, false, 1, 1);
        }

        for(let i = 0; i < 10; i++) {
            let x = PhaserMath.Between(centerX, centerX + 400);
            let y = PhaserMath.Between(centerY, centerY + 300);
            SpawnEnemy(this.world, { x: x, y: y });
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
        inputSystem,
        playerVelocitySystem,
        moveToSystem,
        movementSystem,
        // followPlayerSystem,
        enemySeparationSystem,
        cooldownSystem,
        damageSystem,
        spriteSyncSystem,
        uiSystem,
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
