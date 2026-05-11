import { addComponent, addComponents, addEntity, EntityId, removeEntity } from "bitecs";
import { GameWorld } from "../game/scenes/Game";
import { Position, Speed, Velocity } from "../components/MovementComponents";
import { Player } from "../components/TagComponents";
import { Health } from "../components/StatComponents";
import { InvulnerabilityTimer, OnTouchDamage } from "../components/AbilityComponents";

enum CollisionGroup{
    Player,
    Enemy,
}

interface ColliderConfig {
    radiusPercent: number;
    offsetXPercent: number; // 0.5 is center
    offsetYPercent: number;
}

interface BaseUnitData{
    position: { x: number, y: number },
    speed: number,
    maxHealth: number,
    spriteKey: string,
    tags: any[],
    colllisionGroup: CollisionGroup,
    colliderConfig?: ColliderConfig,
    onTouchDamage?: number,
}

const BaseUnit = (world: GameWorld, data: BaseUnitData): EntityId => {
    const eid = addEntity(world);
    addComponents(world, eid, [Position, Speed, Velocity, Health, OnTouchDamage]);
    Position.x[eid] = data.position.x;
    Position.y[eid] = data.position.y;
    Velocity.x[eid] = 0;
    Velocity.y[eid] = 0;
    Speed.value[eid] = data.speed;
    Health.current[eid] = data.maxHealth;
    Health.max[eid] = data.maxHealth;
    OnTouchDamage.value[eid] = data.onTouchDamage || 0;

    if(data.tags){
        addComponents(world, eid, data.tags);
    }

    const sprite = world.scene.physics.add.sprite(
        data.position.x, 
        data.position.y, 
        data.spriteKey
    ) as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    const { 
        radiusPercent = 0.25, 
        offsetXPercent = 0.5, 
        offsetYPercent = 0.5 
    } = data.colliderConfig || {};
    const radius = (sprite.width / 2) * radiusPercent;
    const ox = (sprite.width * offsetXPercent) - radius;
    const oy = (sprite.height * offsetYPercent) - radius;
    sprite.setCircle(radius, ox, oy);
    sprite.setCollideWorldBounds(true);
    sprite.body.setDrag(0, 0);
    sprite.setData('eid', eid);
    
    if(data.colllisionGroup === CollisionGroup.Player){
        world.playerGroup.add(sprite);
    }else if(data.colllisionGroup === CollisionGroup.Enemy){
        world.enemyGroup.add(sprite);
    }

    world.spriteMap.set(eid, sprite);

    return eid;
}

export const SpawnPlayer = (world: GameWorld, pos: { x: number, y: number }): EntityId => {
    const data: BaseUnitData = {
        position: pos,
        speed: 200,
        maxHealth: 100,
        spriteKey: 'test-hero',
        tags: [Player],
        colllisionGroup: CollisionGroup.Player,
    }
    const eid = BaseUnit(world, data);
    return eid;
}

export const SpawnEnemy = (world: GameWorld, pos: { x: number, y: number }): EntityId => {
    const data: BaseUnitData = {
        position: pos,
        speed: 200,
        maxHealth: 100,
        spriteKey: 'test-hero',
        tags: [],
        colllisionGroup: CollisionGroup.Enemy,
        onTouchDamage: 10,
    }
    const eid = BaseUnit(world, data);
    return eid;
}

export const DespawnUnit = (world: GameWorld, eid: EntityId) => {
    const sprite = world.spriteMap.get(eid);
    if(sprite){
        sprite.destroy();
        world.spriteMap.delete(eid);
    }
    removeEntity(world, eid);
}
