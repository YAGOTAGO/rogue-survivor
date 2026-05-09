export const AIState = {
    value: [] as number[]
}

export const AIStateType = {
    Idle: 0,
    Chase: 1,
    Attack: 2,
}

export const EnemyBehavior = {
    detectionRadius: [] as number[],
    attackRange: [] as number[],
    cooldown: [] as number[],
    lastAction: [] as number[],
}
