import { GameObjects, Math as PhaserMath } from 'phaser';

export class ExperienceBar extends GameObjects.Container {
    private barFill: GameObjects.Rectangle;
    private levelText: GameObjects.BitmapText;
    private previousLevel: number = 0;
    private lastPercent: number = -1;

    private originalTextY: number = -20;

    constructor(scene: Phaser.Scene) {
        const screenWidth = scene.scale.width;
        const barWidth = screenWidth * 0.5;
        const x = (screenWidth / 2) - (barWidth / 2);
        const y = 50;
        super(scene, x, y);

        const height = 4;
        const stroke = 1;

        const barBg = scene.add.rectangle(0, 0, barWidth, height, 0x000000)
            .setStrokeStyle(stroke, 0x00008b)
            .setOrigin(0, 0.5);

        this.barFill = scene.add.rectangle(stroke / 2, 0, barWidth - stroke, height - stroke, 0x2563eb)
            .setOrigin(0, 0.5);

        this.levelText = scene.add.bitmapText(
            -5,
            this.originalTextY,
            'rogue',
            'Lvl 1',
            16
        )
        .setOrigin(1, 0.5);

        this.add([barBg, this.barFill, this.levelText]);
        scene.add.existing(this);
        this.setScrollFactor(0);
        this.setDepth(100); // Always render in front
    }

    updateExperience(current: number, max: number, level: number) {
        const percent = PhaserMath.Clamp(current / max, 0, 1);
        
        if (percent === this.lastPercent) return;
        this.lastPercent = percent;
        if (level !== this.previousLevel) {
            this.levelText.setText(`Lvl ${level}`);
        }

        if (percent === 0) {
            this.barFill.setScale(0, 1);
        } else {
            this.scene.tweens.add({
                targets: this.barFill,
                scaleX: percent,
                duration: 200,
                ease: 'Linear'
             });
        }

        // Juicy level up animation
        if (level > this.previousLevel && level > 1) {
            this.previousLevel = level;
            const baseY = this.levelText.y;
            this.levelText.setScale(1);
            this.levelText.setTint(0xffd166);

            this.scene.tweens.chain({
                targets: this.levelText,
                ease: 'Cubic.easeOut',
                tweens: [
                    { scaleX: 1.8, scaleY: 1.8, y: baseY - 10, duration: 200 },
                    { scaleX: 1.0, scaleY: 1.0, y: baseY + 2, duration: 300, ease: 'Back.easeOut' },
                    { y: baseY, duration: 120 }
                ],
                onComplete: () => {
                    this.levelText.clearTint();
                    this.levelText.setScale(1);
                    this.levelText.setY(baseY);
                }
            });
        } else {
            this.previousLevel = level;
        }
    }

}