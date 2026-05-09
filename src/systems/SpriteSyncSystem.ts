import { query } from "bitecs"
import { Position, Velocity } from "../components/MovementComponents"
import { GameWorld } from "../game/scenes/Game"

export const spriteSyncSystem = (world: GameWorld) => {
    for (const eid of query(world, [Position, Velocity])) {
        const sprite = world.spriteMap.get(eid)
        if (!sprite) continue
        
        if(Velocity.x[eid] === 0 && Velocity.y[eid] === 0){
            console.log("snapping to grid")
            sprite.x = Math.round(Position.x[eid])
            sprite.y = Math.round(Position.y[eid])
        }else{
            sprite.x = Position.x[eid]
            sprite.y = Position.y[eid]
        }
    }
}