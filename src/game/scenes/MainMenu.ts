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
        const halfWidth = width / 2;
        const halfHeight = height / 2;
        const textOffsetY = 70;
        const playBtnOffsetY = -50;

        this.scene.launch('Game');
        this.scene.bringToTop();
        this.scene.pause('Game');

        this.add.rectangle(0, 0, width, height, 0x000000, 0.6).setOrigin(0, 0); //Gray overlay
        
        //Title Text
        this.add.rectangle(halfWidth, halfHeight - textOffsetY, 400, 70, 0x111f12)
            .setStrokeStyle(4, 0xffffff)
        this.add.bitmapText(
            halfWidth, 
            halfHeight - textOffsetY, 
            'rogue', 
            'Rogue Survivor', 
            48
        ).setOrigin(0.5);
        this.add.sprite(halfWidth, halfHeight - playBtnOffsetY+4, ASSETS.SPRITESHEETS.ITEMS, 231);

        //Start Button
        const playerBtn = this.add.rectangle(halfWidth, halfHeight - playBtnOffsetY, 200, 70, 0x0f1833)
            .setStrokeStyle(4, 0xffffff)
            .setRounded();
        this.add.bitmapText(
            halfWidth, 
            halfHeight - playBtnOffsetY, 
            'rogue', 
            'Start', 
            48
        ).setOrigin(0.5);
        this.add.sprite(halfWidth-70, halfHeight - playBtnOffsetY+4, ASSETS.SPRITESHEETS.ITEMS, 231); //Scroll sprite

        // Play button
        playerBtn.setInteractive({ useHandCursor: true });
        playerBtn.on('pointerdown', () => {
            this.scene.stop();
            this.scene.resume('Game');
        });
    }
}
