import { EntityId } from "bitecs";
import { GameObjects, Scene } from "phaser";
import Sizer from "phaser4-rex-plugins/templates/ui/sizer/Sizer";
    
const BAR_BACKGROUND = 0x260e04;
const ICON_SIZE = 48;

export class AbilityBar extends GameObjects.Container {
    private sizer: Sizer;
    private abilityElements: Map<EntityId, { overlay: GameObjects.Graphics, line: GameObjects.Rectangle }> = new Map();
    
    constructor(scene: Scene) {
        const screenWidth = scene.scale.width;
        const screenHeight = scene.scale.height;
        const x = screenWidth / 2;
        const y = screenHeight - 40;
        super(scene, x, y);

        var background = scene.add.rectangle(0, 0, 0, 0, BAR_BACKGROUND);
        this.sizer = scene.rexUI.add.sizer({
            x: 0, 
            y: 0,
            space: { left: 5, right: 5, top: 5, bottom: 5, item: 10 }

        })
        .addBackground(background)
        .layout();

        this.add(this.sizer);
        this.setScrollFactor(0);
        this.setDepth(100);
        
        scene.add.existing(this);
    }

    addAbility(spriteKey: string, abilityEid: EntityId, spriteFrame?: number){
        const container = this.scene.add.container(0, 0);
        container.setSize(ICON_SIZE, ICON_SIZE);
        const icon = this.scene.add.image(0, 0, spriteKey, spriteFrame)
            .setDisplaySize(ICON_SIZE, ICON_SIZE);
        const overlay = this.scene.add.graphics();
        const line = this.scene.add.rectangle(0, 0, ICON_SIZE, 2, 0xffffff, 1);
        container.add([icon, overlay, line]);
        this.sizer.add(container);
        this.sizer.layout();
        this.abilityElements.set(abilityEid, { overlay, line});
    }

    updateCooldown(eid: EntityId, percent: number){
        const elements = this.abilityElements.get(eid);
        if(!elements) return;
        elements.overlay.clear();
        
        const currentHeight = ICON_SIZE * percent;
        const topY = (ICON_SIZE / 2) - currentHeight;
        
        elements.overlay.fillStyle(0x000000, 0.6);
        elements.overlay.fillRect(
            -ICON_SIZE / 2, 
            topY, 
            ICON_SIZE, 
            currentHeight
        );
        elements.line.y = topY;
    }

}