import { Scene, GameObjects } from 'phaser';
import { ASSETS } from '../../common/Assets';

export class MainMenu extends Scene
{
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;

    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        const width = this.scale.width;
        const height = this.scale.height;
        const textOffsetY = 70;
        const playBtnOffsetY = 40;

        this.scene.launch('Game');
        this.scene.bringToTop();
        this.scene.pause('Game');

        this.add.rectangle(0, 0, width, height, 0x000000, 0.6).setOrigin(0, 0); //Gray overlay
        this.add.rectangle(width / 2, (height / 2) - textOffsetY, 400, 70, 0x111f12) //Text background
            .setStrokeStyle(4, 0xffffff);
        this.add.bitmapText(
            width / 2, 
            (height / 2) - textOffsetY, 
            'rogue', 
            'Rogue Survivor', 
            48
        ).setOrigin(0.5);

        // Play button
        const btnY = height / 2 + playBtnOffsetY;
        const playerBtn = this.add.sprite(width / 2, btnY, ASSETS.IMAGES.PLAY_BUTTON)
            .setOrigin(0.5);
        playerBtn.setInteractive({ useHandCursor: true });
        playerBtn.on('pointerdown', () => {
            this.scene.stop();
            this.scene.resume('Game');
        });
    }
}
