import { addComponents, addEntity, EntityId, removeEntity } from "bitecs";
import { GameWorld } from "../game/scenes/Game";
import { Position, Speed, Velocity } from "../components/MovementComponents";
import { Player } from "../components/TagComponents";
import { Health } from "../components/StatComponents";


enum CollisionGroup{
    Player,
    Enemy,
}

interface BaseUnitData{
    position: { x: number, y: number },
    speed: number,
    maxHealth: number,
    spriteKey: string,
    tags: any[],
    colllisionGroup: CollisionGroup,
}

const BaseUnit = (world: GameWorld, data: BaseUnitData): EntityId => {
    const eid = addEntity(world);
    addComponents(world, eid, [Position, Speed, Velocity, Health]);
    Position.x[eid] = data.position.x;
    Position.y[eid] = data.position.y;
    Velocity.x[eid] = 0;
    Velocity.y[eid] = 0;
    Speed.value[eid] = data.speed;
    Health.current[eid] = data.maxHealth;
    Health.max[eid] = data.maxHealth;

    if(data.tags){
        addComponents(world, eid, data.tags);
    }

    const sprite = world.scene.physics.add.sprite(
        data.position.x, 
        data.position.y, 
        data.spriteKey
    ) as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    sprite.setCollideWorldBounds(true);
    sprite.setCircle(sprite.width * 0.4, sprite.width * 0.1, sprite.height * 0.1);
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
