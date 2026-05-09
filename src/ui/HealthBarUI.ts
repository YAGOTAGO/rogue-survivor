import Phaser from 'phaser';

export class HealthBar extends Phaser.GameObjects.Container {
    private barFill: Phaser.GameObjects.Rectangle;
    private healthText: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene) {
        const screenWidth = scene.scale.width;
        const barWidth = screenWidth * 0.5;
        const x = (screenWidth / 2) - (barWidth / 2);
        const y = 30;
        super(scene, x, y);

        const height = 20;
        const stroke = 2;

        const barBg = scene.add.rectangle(0, 0, barWidth, height, 0x000000)
            .setStrokeStyle(stroke, 0xffffff)
            .setOrigin(0, 0.5);
        
        this.barFill = scene.add.rectangle(stroke / 2, 0, barWidth - stroke, height - stroke, 0xff0000)
            .setOrigin(0, 0.5);

        this.healthText = scene.add.text(barWidth / 2, 0, '100 / 100', {
            fontSize: '14px',
            fontStyle: 'bold',
            color: '#ffffff'
        })
        .setOrigin(0.5) 
        .setStroke('#000000', 4);

        this.add([barBg, this.barFill, this.healthText]);
        scene.add.existing(this);
        this.setScrollFactor(0);
    }

    updateHealth(current: number, max: number) {
        const percent = Phaser.Math.Clamp(current / max, 0, 1);
        this.barFill.scaleX = percent;
        this.healthText.setText(`${Math.floor(current)} / ${max}`);
    }

}