import {
    CELLSIZE,
    BOID_POPULATION,
    MOUSE_MIN_DISTANCE,
    canvas,
    TYPES,
    mouse
} from "../constants.js";
import { Particle } from "../Particle.js";
import { Grid } from "../Grid.js";
import { getRandomInt } from "../utils.js"

export class Boids {
    constructor() {
        this.panel = "boidsInfoPanel";
        this.grid = new Grid(CELLSIZE);
        this.boids = [];
        let type = 0;
        for (let i = 0; i < BOID_POPULATION; i++) {
            this.boids.push(new Particle(TYPES[1]))
        }
    }

    applyRules(p, neighbors, ruleType) {
        // let fx = 0;
        // let fy = 0;

        // neighbors.forEach(n => {
        //     const dx = n.x - p.x;
        //     const dy = n.y - p.y;
        //     const distance = Math.sqrt(dx * dx + dy * dy);
        //     if (distance > 0 && distance < 80) {
        //         const attraction = PARTICLE_RULES[p.type][n.type];
        //         const force = attraction / distance;
        //         fx += force * dx;
        //         fy += force * dy;
        //     }
        // });

        // p.vx = (p.vx + fx) * 0.5;
        // p.vy = (p.vy + fy) * 0.5;
    }

    update(mouseMode, ruleType = "STRONG") {
        this.grid.clear();
        this.boids.forEach(p => this.grid.insert(p));
        this.boids.forEach(p => {
            this.applyRules(p, this.grid.getNeighbors(p), ruleType);
            p.moveParticle();
            p.draw();
        })
    }

    destroy() {
        this.boids = [];
    }

    handleResize() {
        this.boids.forEach(p => {
            p.x = Math.min(p.x, canvas.width);
            p.y = Math.min(p.y, canvas.height);
        });
    }
}