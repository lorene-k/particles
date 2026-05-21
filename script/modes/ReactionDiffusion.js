import {
    canvas,
    ctx,
    RD_RESOLUTION,
    RD_SEED_RADIUS,
    RD_RULES,
    RD_DB,
    RD_DA,
    RD_WEIGHTS
} from "../constants.js"

export class ReactionDiffusion {
    constructor() {
        this.panels = ["rulesPanelContainer", "rulesPanel"];
        this.imageData = ctx.createImageData(canvas.width, canvas.height);
        this.width = Math.floor(canvas.width / RD_RESOLUTION);
        this.height = Math.floor(canvas.height / RD_RESOLUTION);
        this.grid = new Array(this.width * this.height).fill(null).map(() => ({ a: 1, b: 0 }));
        this.nextGrid = new Array(this.width * this.height).fill(null).map(() => ({ a: 1, b: 0 }));

        const centerX = Math.floor(this.width / 2);
        const centerY = Math.floor(this.height / 2);

        for (let y = centerY - RD_SEED_RADIUS; y < centerY + RD_SEED_RADIUS; y++) {
            for (let x = centerX - RD_SEED_RADIUS; x < centerX + RD_SEED_RADIUS; x++) {
                if (Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2) < RD_SEED_RADIUS) {
                    this.grid[y * this.width + x].b = 1;
                    this.grid[y * this.width + x].a = 0;
                }
            }
        }
    }

    getLaplacians(i) {
        const g = this.grid;
        const w = this.width;
        const h = this.height;
        const x = i % w;
        const y = Math.floor(i / w);

        const xL = ((x - 1) + w) % w;
        const xR = (x + 1) % w;
        const yU = ((y - 1) + h) % h;
        const yD = (y + 1) % h;

        const topLeft = g[yU * w + xL];
        const top = g[yU * w + x];
        const topRight = g[yU * w + xR];
        const left = g[y * w + xL];
        const center = g[y * w + x];
        const right = g[y * w + xR];
        const bottomLeft = g[yD * w + xL];
        const bottom = g[yD * w + x];
        const bottomRight = g[yD * w + xR];

        const laplacianA = (RD_WEIGHTS.center * center.a)
            + RD_WEIGHTS.cardinal * (top.a + left.a + right.a + bottom.a)
            + RD_WEIGHTS.diagonal * (topLeft.a + topRight.a + bottomLeft.a + bottomRight.a);

        const laplacianB = (RD_WEIGHTS.center * center.b)
            + RD_WEIGHTS.cardinal * (top.b + left.b + right.b + bottom.b)
            + RD_WEIGHTS.diagonal * (topLeft.b + topRight.b + bottomLeft.b + bottomRight.b);

        return { laplacianA, laplacianB };
    }

    applyGrayScott(cell, i) {
        const { laplacianA, laplacianB } = this.getLaplacians(i);
        const { feed, kill } = RD_RULES.rates;

        const diffusionA = RD_DA * laplacianA;
        const diffusionB = RD_DB * laplacianB;
        const reaction = cell.a * cell.b * cell.b;
        const feedTerm = feed * (1 - cell.a);
        const killTerm = (kill + feed) * cell.b;
        const newA = cell.a + (diffusionA - reaction + feedTerm);
        const newB = cell.b + (diffusionB + reaction - killTerm);

        return {
            newA: Math.max(0, Math.min(1, newA)),
            newB: Math.max(0, Math.min(1, newB))
        };
    }

    render() {
        this.grid.forEach((cell, i) => {
            const px = RD_RESOLUTION * (i % this.width);
            const py = RD_RESOLUTION * Math.floor(i / this.width);

            for (let dy = 0; dy < RD_RESOLUTION; dy++) {
                for (let dx = 0; dx < RD_RESOLUTION; dx++) {
                    const index = ((py + dy) * canvas.width + (px + dx)) * 4;
                    const brightness = Math.pow(cell.b, 0.3);
                    this.imageData.data[index] = 47 * brightness;       // R
                    this.imageData.data[index + 1] = 255 * brightness;  // G
                    this.imageData.data[index + 2] = 216 * brightness;  // B
                    this.imageData.data[index + 3] = 255;               // A
                }
            }
        })
        ctx.putImageData(this.imageData, 0, 0);
    }

    update(mouseMode) {
        // this.handleMouse(mouseMode);
        this.grid.forEach((cell, i) => {
            const { newA, newB } = this.applyGrayScott(cell, i);
            this.nextGrid[i].a = newA;
            this.nextGrid[i].b = newB;
        });
        [this.grid, this.nextGrid] = [this.nextGrid, this.grid];
        this.render();
    }

    destroy() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    handleResize() {
        const oldWidth = this.width;
        const oldHeight = this.height;

        this.width = Math.floor(canvas.width / RD_RESOLUTION);
        this.height = Math.floor(canvas.height / RD_RESOLUTION);
        this.nextGrid = new Array(this.width * this.height).fill(null).map(() => ({ a: 1, b: 0 }));

        const tmpGrid = new Array(this.width * this.height).fill(null).map(() => ({ a: 1, b: 0 }));
        const offsetX = Math.floor((this.width - oldWidth) / 2);
        const offsetY = Math.floor((this.height - oldHeight) / 2);

        this.grid.forEach((cell, i) => {
            const x = i % oldWidth;
            const y = Math.floor(i / oldWidth);
            const newX = x + offsetX;
            const newY = y + offsetY;
            
            if (newX >= 0 && newY >= 0
                && newX < this.width && newY < this.height)
                tmpGrid[newY * this.width + newX] = { ...cell };
        })

        this.grid = tmpGrid;
        this.imageData = ctx.createImageData(canvas.width, canvas.height);
    }
}
