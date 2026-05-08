import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        const width = this.scale.width;
        const height = this.scale.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const barMaxWidth = 460;
        this.add.rectangle(centerX, centerY, 468, 32).setStrokeStyle(1, 0xffffff); //Loading bar background
        const bar = this.add.rectangle(centerX - 230, centerY, 4, 28, 0xffffff); //Loading bar fill
        this.load.on('progress', (progress: number) => {
            bar.width = 4 + (barMaxWidth * progress);
        });
        this.add.text(centerX, centerY-40, 'Loading...', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '30px',
            color: '#ffffff',
            padding: { x: 6, y: 4 },
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.cameras.main.setBackgroundColor('#1f2024');
    }

    preload ()
    {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');

        this.load.image('logo', 'logo.png');
        this.load.spritesheet('test-hero', 'sprites/units/archer/Archer_Idle.png', {
            frameWidth: 192,
            frameHeight: 192
        })

    }

    create ()
    {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        // TODO Here can swap which scene is loaded
        this.scene.start('Game');
    }
}
