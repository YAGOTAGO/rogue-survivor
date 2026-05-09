import { query } from "bitecs"
import { Position } from "../components/MovementComponents"
import { GameWorld } from "../game/scenes/Game"

export const SpriteSyncSystem = (world: GameWorld) => {
    for (const eid of query(world, [Position])) {
        const sprite = world.spriteMap.get(eid)
        if (!sprite) continue
        
        // TODO: need to test more to see which is better
        // sprite.x = Math.round(Position.x[eid])
        // sprite.y = Math.round(Position.y[eid])
        sprite.x = Position.x[eid]
        sprite.y = Position.y[eid]
    }
}