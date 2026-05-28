import { EntityId } from "bitecs";
import { GameObjects, Scene } from "phaser";
import Sizer from "phaser4-rex-plugins/templates/ui/sizer/Sizer";
    
const COLOR_MAIN = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

export class AbilityBar extends GameObjects.Container {
    private sizer: Sizer;

    constructor(scene: Scene) {
        const screenWidth = scene.scale.width;
        const screenHeight = scene.scale.height;
        const x = screenWidth / 2;
        const y = screenHeight - 40;
        super(scene, x, y);

        var background = scene.add.rectangle(0, 0, 0, 0, COLOR_DARK);

        var gameObjects = [];
        for (var i = 0; i < 5; i++) {
            gameObjects.push(scene.add.rectangle(0, 0, 30, 30, COLOR_LIGHT));
        }
        this.sizer = scene.rexUI.add.sizer({
            x: 0, 
            y: 0,
            space: { left: 5, right: 5, top: 5, bottom: 5 }
        })
        .addBackground(background)
        // .addMultiple(
        //     gameObjects,
        //     { padding: { left: 5, right: 5, top: 5, bottom: 5}}
        // )
        .layout();

        this.add(this.sizer);
        this.setScrollFactor(0);
        this.setDepth(100);
        
        scene.add.existing(this);
    }

    AddAbility(spriteKey: string, abilityEid: EntityId, spriteFrame?: number){
        //TODO use the sprite key to add to the ability bar
        const sprite = this.scene.add.sprite(0, 0, spriteKey, spriteFrame);
        this.sizer.add(sprite);
        this.sizer.layout();
        
        // Might need to know the eid, so can get the ability cooldown

    }

}