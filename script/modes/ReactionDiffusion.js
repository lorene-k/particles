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
        this.gridA = new Float32Array(this.width * this.height).fill(1);
        this.gridB = new Float32Array(this.width * this.height).fill(0);

        this.nextGridA = new Float32Array(this.width * this.height).fill(1);
        this.nextGridB = new Float32Array(this.width * this.height).fill(0);

        const centerX = Math.floor(this.width / 2);
        const centerY = Math.floor(this.height / 2);

        for (let y = centerY - RD_SEED_RADIUS; y < centerY + RD_SEED_RADIUS; y++) {
            for (let x = centerX - RD_SEED_RADIUS; x < centerX + RD_SEED_RADIUS; x++) {
                if (Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2) < RD_SEED_RADIUS) {
                    this.gridB[y * this.width + x] = 1;
                    this.gridA[y * this.width + x] = 0;
                }
            }
        }
    }

    getLaplacian(i, grid) {
        const g = grid;
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

        const laplacian = (RD_WEIGHTS.center * center)
            + RD_WEIGHTS.cardinal * (top + left + right + bottom)
            + RD_WEIGHTS.diagonal * (topLeft + topRight + bottomLeft + bottomRight);

        return laplacian;
    }

    applyGrayScott(i) {
        const { feed, kill } = RD_RULES.rates;
        const cellA = this.gridA[i];
        const cellB = this.gridB[i];
        const laplacianA = this.getLaplacian(i, this.gridA);
        const laplacianB = this.getLaplacian(i, this.gridB);

        const diffusionA = RD_DA * laplacianA;
        const diffusionB = RD_DB * laplacianB;
        const reaction = cellA * cellB * cellB;
        const feedTerm = feed * (1 - cellA);
        const killTerm = (kill + feed) * cellB;
        const newA = cellA + (diffusionA - reaction + feedTerm);
        const newB = cellB + (diffusionB + reaction - killTerm);

        return {
            newA: Math.max(0, Math.min(1, newA)),
            newB: Math.max(0, Math.min(1, newB))
        };
    }

    render() {
        for (let i = 0; i < this.gridB.length; i++) {
            const px = RD_RESOLUTION * (i % this.width);
            const py = RD_RESOLUTION * Math.floor(i / this.width);
            const brightness = Math.pow(this.gridB[i], 0.3);

            for (let dy = 0; dy < RD_RESOLUTION; dy++) {
                for (let dx = 0; dx < RD_RESOLUTION; dx++) {
                    const index = ((py + dy) * canvas.width + (px + dx)) * 4;
                    this.imageData.data[index] = 47 * brightness;       // R
                    this.imageData.data[index + 1] = 255 * brightness;  // G
                    this.imageData.data[index + 2] = 216 * brightness;  // B
                    this.imageData.data[index + 3] = 255;               // A
                }
            }
        }
        ctx.putImageData(this.imageData, 0, 0);
    }

    update(mouseMode) {
        // this.handleMouse(mouseMode);
        for (let i = 0; i < this.gridA.length; i++) {
            const { newA, newB } = this.applyGrayScott(i);
            this.nextGridA[i] = newA;
            this.nextGridB[i] = newB;
        }
        [this.gridA, this.nextGridA] = [this.nextGridA, this.gridA];
        [this.gridB, this.nextGridB] = [this.nextGridB, this.gridB];
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

        const size = this.height * this.width;
        const offsetX = Math.floor((this.width - oldWidth) / 2);
        const offsetY = Math.floor((this.height - oldHeight) / 2);

        const tmpGridA = new Float32Array(size).fill(1);
        const tmpGridB = new Float32Array(size).fill(0);
        this.nextGridA = new Float32Array(size).fill(1);
        this.nextGridB = new Float32Array(size).fill(0);

        for (let i = 0; i < this.gridA.length; i++) {
            const x = i % oldWidth;
            const y = Math.floor(i / oldWidth);
            const newX = x + offsetX;
            const newY = y + offsetY;

            if (newX >= 0 && newY >= 0 && newX < this.width && newY < this.height) {
                const index = newY * this.width + newX;
                tmpGridA[index] = this.gridA[i];
                tmpGridB[index] = this.gridB[i];
            }
        }

        this.gridA = tmpGridA;
        this.gridB = tmpGridB;
        this.imageData = ctx.createImageData(canvas.width, canvas.height);
    }
}
