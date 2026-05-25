import { GameObjects, Scene } from "phaser";
    
const COLOR_MAIN = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

export class AbilityBar extends GameObjects.Container {
    constructor(scene: Scene) {
        const screenWidth = scene.scale.width;
        const screenHeight = scene.scale.height;
        const x = screenWidth / 2;
        const y = screenHeight - 100;
        super(scene, x, y);

        console.log("Is RexUI available?", scene.rexUI); // Should log 'true'

        var background = scene.add.rectangle(0, 0, 0, 0, COLOR_DARK);

        var gameObjects = [];
        for (var i = 0; i < 5; i++) {
            gameObjects.push(scene.add.rectangle(0, 0, 50, 50, COLOR_LIGHT));
        }
        const sizer = scene.rexUI.add.sizer({
            x: 0, 
            y: 0,
            space: { left: 10, right: 10, top: 10, bottom: 10 }
        })
        .addBackground(background)
        .addMultiple(
            gameObjects,
            { padding: { left: 5, right: 5, top: 5, bottom: 5}}
        )
        .layout();

        this.add(sizer);
        this.setScrollFactor(0);
        this.setDepth(100);
        
        scene.add.existing(this);
    }
}