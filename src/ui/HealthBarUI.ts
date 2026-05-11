import { GameObjects, Math as PhaserMath } from 'phaser';

export class HealthBar extends GameObjects.Container {
    private barFill: GameObjects.Rectangle;
    private healthText: GameObjects.Text;
    private barGhost: GameObjects.Rectangle;

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

        this.barGhost = scene.add.rectangle(stroke / 2, 0, barWidth - stroke, height - stroke, 0xffffff)
            .setOrigin(0, 0.5)
            .setAlpha(0.6);

        this.barFill = scene.add.rectangle(stroke / 2, 0, barWidth - stroke, height - stroke, 0xff1919)
            .setOrigin(0, 0.5);

        this.healthText = scene.add.text(barWidth / 2, 0, 'text', {
            fontSize: '14px',
            fontStyle: 'bold',
            color: '#ffffff',
        })
        .setOrigin(0.5) 
        .setStroke('#000000', 4);

        this.add([barBg, this.barGhost, this.barFill, this.healthText]); //add to the container
        scene.add.existing(this);
        this.setScrollFactor(0);
    }

    updateHealth(current: number, max: number) {
        const percent = PhaserMath.Clamp(current / max, 0, 1);
        this.healthText.setText(`${Math.floor(current)} / ${max}`);

        this.scene.tweens.add({
            targets: this.barFill,
            scaleX: percent,
            duration: 150, // Very fast snap
            ease: 'Cubic.easeOut'
        });

        this.scene.tweens.add({
            targets: this.barGhost,
            scaleX: percent,
            duration: 800, // Slower catch-up
            delay: 200,    // Wait a bit before catching up
            ease: 'Expo.easeOut',
            onStart: () => {
                this.barGhost.setAlpha(0.6);
            },
            onComplete: () => {
                this.scene.tweens.add({
                    targets: this.barGhost,
                    alpha: 1,
                    duration: 200
                });
            }
        });
    }

}