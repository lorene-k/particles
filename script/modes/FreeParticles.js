import {
    CELLSIZE,
    PARTICLE_POPULATION,
    MOUSE_MIN_DISTANCE,
    PARTICLE_MIN_DISTANCE,
    FORCE_STRENGTH,
    canvas,
    mouse
} from "../constants.js";
import { Particle } from "../Particle.js";
import { Grid } from "../Grid.js";

export class FreeParticles {
    constructor() {
        this.panel = "freeParticlesInfoPanel";
        this.grid = new Grid(CELLSIZE);
        this.particles = [];
        for (let i = 0; i < PARTICLE_POPULATION; i++) {
            this.particles.push(new Particle())
        }
    }

    reactToMouse(p, mouseMode) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0 && distance < MOUSE_MIN_DISTANCE) {
            const force = (MOUSE_MIN_DISTANCE - distance) / MOUSE_MIN_DISTANCE;
            if (mouseMode === "attract") {
                p.vx += (dx / distance) * force * FORCE_STRENGTH;
                p.vy += (dy / distance) * force * FORCE_STRENGTH;
            } else if (mouseMode === "repulse") {
                p.vx -= (dx / distance) * force * FORCE_STRENGTH;
                p.vy -= (dy / distance) * force * FORCE_STRENGTH;
            }
        }
    }

    reactToNeighbors(p, neighbors) {
        neighbors.forEach(n => {
            const dx = n.x - p.x;
            const dy = n.y - p.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance > 0 && distance < PARTICLE_MIN_DISTANCE) {
                const force = (PARTICLE_MIN_DISTANCE - distance) / PARTICLE_MIN_DISTANCE;
                p.vx -= (dx / distance) * force * FORCE_STRENGTH;
                p.vy -= (dy / distance) * force * FORCE_STRENGTH;
            }
        });
    }

    update(mouseMode) {
        this.grid.clear();
        this.particles.forEach(p => this.grid.insert(p));
        this.particles.forEach(p => {
            this.reactToMouse(p, mouseMode);
            this.reactToNeighbors(p, this.grid.getNeighbors(p));
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