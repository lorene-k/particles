import {
    canvas,
    ctx,
    RD_RESOLUTION,
    RD_SEED_RADIUS,
    RD_F,
    RD_K,
    RD_DB,
    RD_DA,
    RD_WEIGHTS
} from "../constants.js"

export class ReactionDiffusion {
    constructor() {
        this.panels = [];
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

        const diffusionA = RD_DA * laplacianA;
        const diffusionB = RD_DB * laplacianB;
        const reaction = cell.a * cell.b * cell.b;
        const feedTerm = RD_F * (1 - cell.a);
        const killTerm = (RD_K + RD_F) * cell.b;
        const newA = cell.a + (diffusionA - reaction + feedTerm);
        const newB = cell.b + (diffusionB + reaction - killTerm);

        return {
            newA: Math.max(0, Math.min(1, newA)),
            newB:  Math.max(0, Math.min(1, newB))
        };
    }

    render() {
        this.grid.forEach((cell, i) => {
            const px = RD_RESOLUTION * (i % this.width);
            const py = RD_RESOLUTION * Math.floor(i / this.width);

            for (let dy = 0; dy < RD_RESOLUTION; dy++) {
                for (let dx = 0; dx < RD_RESOLUTION; dx++) {
                    const index = ((py + dy) * canvas.width + (px + dx)) * 4;
                    this.imageData.data[index] = 255 * cell.b;      // R
                    this.imageData.data[index + 1] = 255 * cell.b;  // G
                    this.imageData.data[index + 2] = 255 * cell.b;  // B
                    this.imageData.data[index + 3] = 255;           // A
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
    }

    handleResize() {
        // this.boids.forEach(b => {
        //     b.x = Math.min(b.x, canvas.width);
        //     b.y = Math.min(b.y, canvas.height);
        // });
    }
}

/*
STEPS :

2. Grid
OK - Create a flat array of width * height cells, each { a: 1, b: 0 }
OK - Seed the center with a small patch of B (concentration = 1)

3. Update logic
- For each cell, calculate laplacian(A) and laplacian(B) using the 8 neighbors
- Apply the Gray-Scott formula to get new A and B values
- Write results to a second buffer (never update in place — you'd corrupt neighbors)
- Swap buffers at end of frame

4. Rendering
- Create an ImageData object
- Map each cell's B concentration to a color
- Write RGBA values to ImageData
- Call ctx.putImageData() to render

5. Interaction
- Mouse draw — add B where mouse is pressed
- Panel with f and k sliders

*/

/*
-  Diffusion : chemicals spread to neighbors -> A spreads faster than B
new A = A + dA * laplacian(A)
new B = B + dB * laplacian(B)

- Reaction : A & B meet -> B consumes A (the more B there is the faster it eats A)
reaction = A * B * B

- Feed & Kill : f constantly adds A, k constant removes B
new A = A + (dA * laplacian(A) - reaction + f * (1 - A))
new B = B + (dB * laplacian(B)) + reaction - (k + f) * B
*/

/*
- RESEARCH : laplacian
1. look at cell and 8 neighbors + weights
2. multiply each neighbor value by its weights -> sum all together

- RESEARCH : gray scott model
new A = A + (dA * laplacian(A) - reaction + f * (1 - A))
new B = B + (dB * laplacian(B)) + reaction - (k + f) * B

dA * laplacian(A) -> diffusion of A (dA = how fast)
- (A * B * B) -> reaction = A gets consumed propotional to how much A & B²
+ (A * B * B) -> reaction = B gains what A loses
f * (1 - A) -> feed term = replenishes A towards concentration 1
- (k + f) * B -> kill term = removes B so it doesnt take over
*/