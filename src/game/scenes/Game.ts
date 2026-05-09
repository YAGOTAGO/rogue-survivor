import { addComponents, addEntity, createWorld, World } from 'bitecs';
import { Scene } from 'phaser';
import { movementSystem, moveToSystem, playerInputSystem } from '../../systems/MovementSystem';
import { enemyAISystem } from '../../systems/EnemyAISystem';
import { createSpriteSyncSystem } from '../../systems/SpriteSyncSystem';
import { Position, Speed, Velocity } from '../../components/MovementComponents';
import { updateWorldInput } from '../../systems/InputHandler';
import { AIState, AIStateType, EnemyBehavior } from '../../components/AIComponents';
import { Enemy, Player } from '../../components/TagComponents';

interface WorldData {
    time: {
        delta: number;
        elapsed: number;
    },
    input: {
        xAxis: number;
        yAxis: number;
    }
}
export type GameWorld = World & WorldData;

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    world!: GameWorld;
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    wasdKeys!: any;
    spriteMap = new Map<number, Phaser.GameObjects.Sprite>();
    fpsText!: Phaser.GameObjects.Text;
    player!: number;
    systems: Array<(world: GameWorld) => void> = [];

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.camera = this.cameras.main;        
        this.cursors = this.input.keyboard!.createCursorKeys();
        this.wasdKeys = this.input.keyboard!.addKeys('W,A,S,D');
        
        // Create the world
        this.world = createWorld({
            time: { delta: 0, elapsed: 0 },
            input: { xAxis: 0, yAxis: 0 }
        }) as GameWorld;

        this.player = this.createUnit('test-hero', 100, 200, Player, 200);

        const enemy = this.createUnit('test-hero', 600, 300, Enemy, 200);
        addComponents(this.world, enemy, [AIState, EnemyBehavior]);
        AIState.value[enemy] = AIStateType.Idle;
        EnemyBehavior.detectionRadius[enemy] = 260;
        EnemyBehavior.attackRange[enemy] = 10;
        EnemyBehavior.cooldown[enemy] = 1200;
        EnemyBehavior.lastAction[enemy] = 0;

        this.fpsText = this.add.text(10, 10, '', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '16px',
            color: '#ffffff',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            padding: { x: 6, y: 4 }
        }).setScrollFactor(0);

        this.systems = [
            playerInputSystem,
            enemyAISystem,
            moveToSystem,
            movementSystem,
            createSpriteSyncSystem(this.spriteMap),
        ];
    }

    private createUnit(spriteKey: string, x: number, y: number, tag: any, speed = 200) {
        const eid = addEntity(this.world);

        addComponents(this.world, eid, [Position, Velocity, Speed, tag]);
        Position.x[eid] = x;
        Position.y[eid] = y;
        Velocity.x[eid] = 0;
        Velocity.y[eid] = 0;
        Speed.value[eid] = speed;
        
        const sprite = this.add.sprite(x, y, spriteKey).setScale(0.5);
        this.spriteMap.set(eid, sprite);

        return eid;
    }

    runSystems = (world: GameWorld) => {
        for (const system of this.systems) {
            system(world)
        }
    }

    update(time: number, delta: number): void {        
        updateWorldInput(this, this.world, this.player)
        this.world.time.delta = delta;
        this.world.time.elapsed = time;

        this.runSystems(this.world);

        const fps = Math.round(this.game.loop.actualFps || 0);
        this.fpsText.setText(`FPS: ${fps}`);
    }
}
