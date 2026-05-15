import { MAX_ENTITIES } from "../common/Constants"

export const Player = { }
export const Enemy = { }
export const Ally = { }

export const Team = {
    id: new Uint8Array(MAX_ENTITIES)
}

export const TEAM_ID = { //Teams are for collission purposes
    NEUTRAL: 0,
    ENEMY: 1,
    ALLY: 2
} as const;
export type TeamId = typeof TEAM_ID[keyof typeof TEAM_ID];