import { GameObjects, Math as PhaserMath, Scene } from 'phaser';

export class HealthBar extends GameObjects.Container {
    private barFill: GameObjects.Rectangle;
    private healthText: GameObjects.BitmapText;
    private barGhost: GameObjects.Rectangle;

    private lastPercent: number = -1;

    constructor(scene: Scene) {
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

        this.healthText = scene.add.bitmapText(
            barWidth / 2, 
            -2, 
            'rogue', 
            '100/100', 
            16
        )
        .setOrigin(0.5);

        this.add([barBg, this.barGhost, this.barFill, this.healthText]); //add to the container
        scene.add.existing(this);
        this.setScrollFactor(0);
        this.setDepth(100); // Always render in front
    }

    updateHealth(current: number, max: number) {
        const percent = PhaserMath.Clamp(current / max, 0, 1);
        if (percent === this.lastPercent) return;
        this.lastPercent = percent;
        
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