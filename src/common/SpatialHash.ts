import { EntityId } from "bitecs";

export class SpatialHash {
    private cellSize: number;
    private grid: Map<number, number[]>;

    constructor(cellSize: number = 64) {
        this.cellSize = cellSize;
        this.grid = new Map();
    }

    private getHash(cx: number, cy: number): number {
        // Shift x by 16 bits, OR with y. Works safely for maps up to 65535x65535 cells.
        return (cx << 16) | (cy & 0xFFFF); 
    }

    public clear() {
        // Keep the arrays in memory, just empty them. Prevents massive Garbage Collection.
        for (const cell of this.grid.values()) {
            cell.length = 0; 
        }
    }

    public insert(eid: number, x: number, y: number) {
        const cx = Math.floor(x / this.cellSize);
        const cy = Math.floor(y / this.cellSize);
        const hash = this.getHash(cx, cy);

        let cell = this.grid.get(hash);
        if (!cell) {
            cell = [];
            this.grid.set(hash, cell);
        }
        cell.push(eid);
    }

    // Returns 8 surrounding cells
    public getNearby(x: number, y: number, result: EntityId[]): void {
        result.length = 0;
        const cx = Math.floor(x / this.cellSize);
        const cy = Math.floor(y / this.cellSize);

        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                const hash = this.getHash(cx + dx, cy + dy);
                const cell = this.grid.get(hash);
                if (cell && cell.length > 0) {
                    for (let i = 0; i < cell.length; i++) {
                        result.push(cell[i]);
                    }
                }
            }
        }
    }
}