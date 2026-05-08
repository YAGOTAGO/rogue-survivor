import { addComponent, addEntity, createWorld, World } from 'bitecs';
import { Scene } from 'phaser';
import { movementSystem } from '../../systems/MovementSystem';
import { Position, Velocity } from '../../components/MovementComponents';
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
    world: any;
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    wasdKeys!: any;
    spriteMap = new Map<number, Phaser.GameObjects.Sprite>();
    player: number;

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.camera = this.cameras.main;        
        this.cursors = this.input.keyboard!.createCursorKeys();
        this.wasdKeys = this.input.keyboard!.addKeys('W,A,S,D');

        this.add.sprite(100, 100, 'test-hero');
        // player.play('idle');
        
        // Create the world
        this.world = createWorld({
            time: { delta: 0, elapsed: 0 },
            input: { xAxis: 0, yAxis: 0 }
        }) as GameWorld;

        // Add the player to the world
        this.player = addEntity(this.world);
        addComponent(this.world, this.player, Position)
        addComponent(this.world, this.player, Velocity)
        addComponent(this.world, this.player, Player)
        Position.x[this.player] = 100;
        Position.y[this.player] = 200;
        Velocity.x[this.player] = 5;
    }

    systems = [
        movementSystem,
    ]
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
    }
}
