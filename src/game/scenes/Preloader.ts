import { Scene } from 'phaser';
import { ASSETS } from '../../common/Assets';

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
        this.load.spritesheet(ASSETS.SPRITESHEETS.PLAYERS, 'sprites/rogues.png', {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet(ASSETS.SPRITESHEETS.ENEMIES, 'sprites/monsters.png', {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet(ASSETS.SPRITESHEETS.ITEMS, 'sprites/items.png', {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.bitmapFont('rogue', 'fonts/m5x7_font.png', 'fonts/m5x7_font.fnt');  
        this.load.image(ASSETS.IMAGES.TILES, 'maps/tilesets/tiles.png');
        this.load.image(ASSETS.IMAGES.ANIMATED_TILES, 'maps/tilesets/animated-tiles.png');
        this.load.tilemapTiledJSON(ASSETS.TILEMAPS.MAP, 'maps/tilemaps/world-map.json');
        this.load.aseprite(ASSETS.IMAGES.EXPERIENCE, 'sprites/experience.png', 'animations/experience.json');
        this.load.image(ASSETS.IMAGES.PLAY_BUTTON, 'sprites/play-btn.png');
    }

    create ()
    {
        this.anims.createFromAseprite(ASSETS.IMAGES.EXPERIENCE);
        this.scene.start('MainMenu');
    }
}
