const CELL_KEY_OFFSET = 100000;
const CELL_KEY_RANGE = CELL_KEY_OFFSET * 2;

export class Grid {
    constructor(cellSize) {
        this.cellSize = cellSize;
        this.cells = new Map();
    }

    clear() {
        this.cells.clear();
    }

    getColumn(x) {
        return Math.floor(x / this.cellSize);
    }

    getRow(y) {
        return Math.floor(y / this.cellSize);
    }

    hashCell(col, row) {
        return (col + CELL_KEY_OFFSET) * CELL_KEY_RANGE + (row + CELL_KEY_OFFSET);
    }

    insert(particle) {
        const col = this.getColumn(particle.x);
        const row = this.getRow(particle.y);
        const key = this.hashCell(col, row);

        let cell = this.cells.get(key);
        if (!cell) {
            cell = [];
            this.cells.set(key, cell);
        }
        cell.push(particle);
    }

    getNeighbors(particle) {
        const col = this.getColumn(particle.x);
        const row = this.getRow(particle.y);
        const neighbors = [];

        for (let colOffset = -1; colOffset <= 1; colOffset++) {
            for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
                const key = this.hashCell(col + colOffset, row + rowOffset);
                const cell = this.cells.get(key);
                if (!cell) continue;

                for (const neighbor of cell) {
                    if (neighbor !== particle) neighbors.push(neighbor);
                }
            }
        }

        return neighbors;
    }
}
