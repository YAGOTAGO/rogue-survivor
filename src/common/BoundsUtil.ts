
export function circlesIntersect(
    ax: number, ay: number, ar: number, aOffX: number, aOffY: number,
    bx: number, by: number, br: number, bOffX: number, bOffY: number
): boolean {
    // 1. Get the actual center points including offsets
    const centerX_A = ax + aOffX;
    const centerY_A = ay + aOffY;
    const centerX_B = bx + bOffX;
    const centerY_B = by + bOffY;

    // 2. Calculate distance squared (saves a square root!)
    const dx = centerX_A - centerX_B;
    const dy = centerY_A - centerY_B;
    const distanceSq = dx * dx + dy * dy;

    // 3. Compare to the sum of radii squared
    const radiusSum = ar + br;
    return distanceSq < (radiusSum * radiusSum);
}

export function constrainToMap(position: number, offset: number, halfSize: number, minBound: number, maxBound: number): { pos: number, collided: boolean } {
    const edgeMin = position + offset - halfSize;
    const edgeMax = position + offset + halfSize;

    if (edgeMin < minBound) {
        return { pos: minBound - offset + halfSize, collided: true };
    } else if (edgeMax > maxBound) {
        return { pos: maxBound - offset - halfSize, collided: true };
    }
    return { pos: position, collided: false };
}