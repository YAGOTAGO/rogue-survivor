import { GameObjects, Scene, Cameras } from 'phaser';

export class GameOver extends Scene
{
    camera: Cameras.Scene2D.Camera;
    background: GameObjects.Image;
    gameover_text : GameObjects.Text;

    constructor ()
    {
        super('GameOver');
    }

    create ()
    {
        this.camera = this.cameras.main
        const width = this.scale.width;
        const height = this.scale.height;
        const halfWidth = width / 2;
        const halfHeight = height / 2;
        const textOffsetY = 70;
        const buttonOffsetY = -50;

        this.add.rectangle(0, 0, width, height, 0x000000, 0.6).setOrigin(0, 0); //Gray overlay

        //Game Over Text
        this.add.bitmapText(
            halfWidth, 
            halfHeight - textOffsetY, 
            'rogue', 
            'Game Over', 
            48
        ).setOrigin(0.5);

        // Restart Button
        const replayBtn = this.add.rectangle(halfWidth, halfHeight - buttonOffsetY, 150, 70, 0x5e0600)
            .setStrokeStyle(4, 0xffffff)
            .setRounded();
        this.add.bitmapText(
            halfWidth, 
            halfHeight - buttonOffsetY, 
            'rogue', 
            'Retry', 
            48
        ).setOrigin(0.5);

        replayBtn.setInteractive({ useHandCursor: true });
        replayBtn.on('pointerdown', () => {
            this.scene.stop();
            this.scene.get('Game').scene.restart();
        });
    }
}
