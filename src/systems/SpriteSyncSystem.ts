import { query } from "bitecs"
import { Position } from "../components/MovementComponents"
import { GameWorld } from "../game/scenes/Game"
import type { GameObjects } from "phaser"

export const createSpriteSyncSystem = (spriteMap: Map<number, GameObjects.Sprite>) => {
    return (world: GameWorld) => {
        for (const eid of query(world, [Position])) {
            const sprite = spriteMap.get(eid)
            if (!sprite) continue
            sprite.x = Math.round(Position.x[eid])
            sprite.y = Math.round(Position.y[eid])
        }
    }
}
