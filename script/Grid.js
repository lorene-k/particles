export class Grid {
    constructor(cellSize) {
        this.cellSize = cellSize;
        this.cells = {};
    }

    clear() {
        this.cells = {};
    }

    getCellKey(x, y) {
        const col = Math.floor(x / this.cellSize);
        const row = Math.floor(y / this.cellSize);
        return `${col},${row}`;
    }

    insert(particle) {
        const key = this.getCellKey(particle.x, particle.y);
        if (!this.cells[key]) this.cells[key] = [];
        this.cells[key].push(particle);

    }

    getNeighbors(particle) {
        const col = Math.floor(particle.x / this.cellSize);
        const row = Math.floor(particle.y / this.cellSize);
        const neighbors = [];

        for (let x = -1; x <= 1; x++) {
            for (let y = -1 ; y <= 1; y++) {
                const key = `${col + x},${row + y}`;
                if (this.cells[key]) {
                    neighbors.push(...this.cells[key]);
                }
            }
        }

        return neighbors.filter(n => n !== particle);
    }
}