import {
    CELLSIZE,
    PARTICLE_POPULATION,
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
        this.grid = new Grid(CELLSIZE);
        this.particles = [];
        let type = 0;
        for (let i = 0; i < PARTICLE_POPULATION; i++) {
            this.particles.push(new Particle(TYPES[1]))
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
        this.particles.forEach(p => this.grid.insert(p));
        this.particles.forEach(p => {
            this.applyRules(p, this.grid.getNeighbors(p), ruleType);
            p.moveParticle();
            p.draw();
        })
    }

    destroy() {
        this.particles = [];
    }

    handleResize() {
        this.particles.forEach(p => {
            p.x = Math.min(p.x, canvas.width);
            p.y = Math.min(p.y, canvas.height);
        });
    }
}