import { addComponent, addComponents, addEntity, createWorld, observe, onSet, query, World } from 'bitecs';
import { Scene } from 'phaser';
import { movementSystem } from '../../systems/MovementSystem';
import { Position, Velocity } from '../../components/MovementComponents';


interface WorldData {
    time: {
        delta: number;
        elapsed: number;
    }
}
export type GameWorld = World & WorldData;

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    world: any;

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.camera = this.cameras.main;
        
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNames('test-hero', {
                start: 0,
                end: 5,
            }),
            frameRate: 10,
            repeat: -1 // Loop infinitely
        });

        this.add.sprite(100, 100, 'test-hero');
        // player.play('idle');
        
        // Create the world
        this.world = createWorld({
            time: {
                delta: 0,
                elapsed: 0            
            }
        }) as GameWorld;

        // Add the player to the world
        let player = addEntity(this.world);
        addComponent(this.world, player, Position)
        addComponent(this.world, player, Velocity)
        Position.x[player] = 100;
        Position.y[player] = 200;
        Velocity.x[player] = 5;
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
        this.world.time.delta = delta;
        this.world.time.elapsed = time;
        this.runSystems(this.world);
    }
}
