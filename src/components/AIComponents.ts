export const AIState = {
    value: [] as number[]
}

export const AIStateType = {
    Idle: 0,
    Chase: 1,
    Action: 2,
}

export const AIBehavior = {
    detectionRadius: [] as number[],
    actionRange: [] as number[],
    cooldown: [] as number[],
    lastAction: [] as number[],
    targetTag: [] as number[],
    targetingStrategy: [] as number[],
    actionType: [] as number[],
}

export const CurrentTarget = {
    eid: [] as number[],
}

export const AITargetTag = {
    Player: 0,
    Enemy: 1,
    Ally: 2,
}

export const AITargetingStrategyType = {
    Closest: 0,
    Farthest: 1,
}

export const AIActionType = {
    Attack: 0,
    Heal: 1,
}
