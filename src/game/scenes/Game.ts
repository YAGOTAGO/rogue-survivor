import { addComponent, addEntity, createWorld, World } from 'bitecs';
import { Scene } from 'phaser';
import { movementSystem, moveToSystem, playerInputSystem } from '../../systems/MovementSystem';
import { createSpriteSyncSystem } from '../../systems/SpriteSyncSystem';
import { Position, Speed, Velocity } from '../../components/MovementComponents';
import { updateWorldInput } from '../../systems/InputHandler';
import { Player } from '../../components/TagComponents';


interface WorldData {
    time: {
        delta: number;
        elapsed: number;
    },
    input: {
        xAxis: number; // -1 (Left) to 1 (Right)
        yAxis: number; // -1 (Up) to 1 (Down)
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

        this.fpsText = this.add.text(10, 10, '', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '16px',
            color: '#ffffff',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            padding: { x: 6, y: 4 }
        }).setScrollFactor(0);

        this.systems = [
            playerInputSystem,
            moveToSystem,
            movementSystem,
            createSpriteSyncSystem(this.spriteMap),
        ];
    }

    private createUnit(spriteKey: string, x: number, y: number, tag: any, speed = 200) {
        const eid = addEntity(this.world);

        addComponent(this.world, eid, Position);
        addComponent(this.world, eid, Velocity);
        addComponent(this.world, eid, Speed);
        addComponent(this.world, eid, tag);

        Position.x[eid] = x;
        Position.y[eid] = y;
        Speed.value[eid] = speed;

        const sprite = this.add.sprite(x, y, spriteKey);
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
