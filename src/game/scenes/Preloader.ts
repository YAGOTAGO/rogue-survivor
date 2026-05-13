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
        this.add.image(width - 90, height - 80, 'logo').setScale(0.4);
    }

    preload ()
    {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');
        this.load.spritesheet('rogues', 'sprites/rogues.png', {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet('monsters', 'sprites/monsters.png', {
            frameWidth: 32,
            frameHeight: 32
        });    
        this.load.bitmapFont('rogue', 'fonts/m5x7_font.png', 'fonts/m5x7_font.fnt');  
        this.load.image('tiles', 'maps/tilesets/tiles.png');
        this.load.image('animated-tiles', 'maps/tilesets/animated-tiles.png');
        this.load.tilemapTiledJSON('world-map', 'maps/tilemaps/world-map.json');
    }

    create ()
    {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        // this.scene.start('MainMenu');
        this.scene.start('Game');
    }
}
