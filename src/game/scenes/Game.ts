import { addComponents, addEntity, createWorld, EntityId, World } from 'bitecs';
import { Scene } from 'phaser';
import { movementSystem, moveToSystem, playerVelocitySystem } from '../../systems/MovementSystem';
import { enemyAISystem } from '../../systems/EnemyAISystem';
import { spriteSyncSystem } from '../../systems/SpriteSyncSystem';
import { inputSystem } from '../../systems/InputHandler';
import { Position, Speed, Velocity } from '../../components/MovementComponents';
import { AIState, AIStateType, AIBehavior } from '../../components/AIComponents';
import { Enemy } from '../../components/TagComponents';
import { SpawnPlayer } from '../../systems/SpawnerSystem';

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
    spriteMap: Map<EntityId, Phaser.GameObjects.Sprite>;
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
            spriteMap: new Map<EntityId, Phaser.GameObjects.Sprite>(),
        }) as GameWorld;

        this.player = SpawnPlayer(this.world, { x: 100, y: 300 });

        const enemy = this.createUnit('test-hero', 600, 300, Enemy, 200);
        addComponents(this.world, enemy, [AIState, AIBehavior]);
        AIState.value[enemy] = AIStateType.Idle;
        AIBehavior.detectionRadius[enemy] = 260;
        AIBehavior.actionRange[enemy] = 10;
        AIBehavior.cooldown[enemy] = 1200;
        AIBehavior.lastAction[enemy] = 0;

        this.fpsText = this.add.text(10, 10, '', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '16px',
            color: '#ffffff',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            padding: { x: 6, y: 4 }
        }).setScrollFactor(0);

    }

    private createUnit(spriteKey: string, x: number, y: number, tag: any, speed = 200) {
        const eid = addEntity(this.world);

        addComponents(this.world, eid, [Position, Velocity, Speed, tag]);
        Position.x[eid] = x;
        Position.y[eid] = y;
        Velocity.x[eid] = 0;
        Velocity.y[eid] = 0;
        Speed.value[eid] = speed;
        
        const sprite = this.add.sprite(x, y, spriteKey).setScale(1);
        this.world.spriteMap.set(eid, sprite);

        return eid;
    }
    
    systems = [
        inputSystem,
        playerVelocitySystem,
        enemyAISystem,
        moveToSystem,
        movementSystem,
        spriteSyncSystem,
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
