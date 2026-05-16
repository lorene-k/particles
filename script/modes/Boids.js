import {
    CELLSIZE,
    MARGIN_SIZE,
    WALL_TURNFORCE,
    BOID_POPULATION,
    MOUSE_MIN_DISTANCE,
    BOIDS_MIN_DISTANCE,
    BOIDS_FORCES,
    BOIDS_MAX_SPEED,
    BOIDS_MIN_SPEED,
    BOIDS_PERCEPTION_RADIUS,
    canvas,
    TYPES,
    mouse,
} from "../constants.js";
import { Particle } from "../Particle.js";
import { Grid } from "../Grid.js";
import { getDistance, getRandomInt } from "../utils.js"

export class Boids {
    constructor() {
        this.panels = ["boidsInfoPanel", "rulesPanelContainer"];
        this.grid = new Grid(CELLSIZE);
        this.boids = [];
        let type = 0;
        for (let i = 0; i < BOID_POPULATION; i++) {
            if (i < BOID_POPULATION * 0.25) type = 0;
            else if (i < BOID_POPULATION * 0.5) type = 1;
            else if (i < BOID_POPULATION * 0.75) type = 2;
            else type = 3;

            const b = new Particle(TYPES[type]);
            b.vx = (Math.random() - 0.5) * 2;
            b.vy = (Math.random() - 0.5) * 2;
            this.boids.push(b)
        }
    }

    applyForces(b, neighbors) {
        if (neighbors.length === 0) return;

        let px = 0;
        let py = 0;
        let vx = 0;
        let vy = 0;
        let count = 0;
        let separationX = 0;
        let separationY = 0;

        neighbors.forEach(n => {
            if (n.type !== b.type) return;
            const { distance, dx, dy } = getDistance(b.x, b.y, n.x, n.y);

            if (distance > BOIDS_PERCEPTION_RADIUS) return;
            if (distance < BOIDS_MIN_DISTANCE) {
                separationX -= dx;
                separationY -= dy;
            }
            px += n.x;
            py += n.y;
            vx += n.vx;
            vy += n.vy;
            count++;
        })

        if (count === 0) return;
        px /= count;
        py /= count;
        vx /= count;
        vy /= count;

        const cohesionX = px - b.x;
        const cohesionY = py - b.y;
        const alignmentX = vx - b.vx;
        const alignmentY = vy - b.vy;

        const { cohesion, separation, alignment } = BOIDS_FORCES.weights;
        b.vx += (cohesionX * cohesion) + (separationX * separation) + (alignmentX * alignment);
        b.vy += (cohesionY * cohesion) + (separationY * separation) + (alignmentY * alignment);
    }

    adjustSpeed(b) {
        const speed = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
        if (speed > BOIDS_MAX_SPEED) {
            b.vx = (b.vx / speed) * BOIDS_MAX_SPEED;
            b.vy = (b.vy / speed) * BOIDS_MAX_SPEED;
        } else if (speed < BOIDS_MIN_SPEED && speed > 0) {
            b.vx = (b.vx / speed) * BOIDS_MIN_SPEED;
            b.vy = (b.vy / speed) * BOIDS_MIN_SPEED;
        }
    }

    moveBoid(b) {
        if (b.x < MARGIN_SIZE) b.vx += WALL_TURNFORCE;
        if (b.x > canvas.width - MARGIN_SIZE) b.vx -= WALL_TURNFORCE;
        if (b.y < MARGIN_SIZE) b.vy += WALL_TURNFORCE;
        if (b.y > canvas.height - MARGIN_SIZE) b.vy -= WALL_TURNFORCE;

        b.x += b.vx;
        b.y += b.vy;
    }

    update(mouseMode, ruleType = "STRONG") {
        this.grid.clear();
        this.boids.forEach(b => this.grid.insert(b));
        this.boids.forEach(b => {
            this.applyForces(b, this.grid.getNeighbors(b));
            this.moveBoid(b);
            this.adjustSpeed(b);
            b.draw();
        })
    }

    destroy() {
        this.boids = [];
    }

    handleResize() {
        this.boids.forEach(b => {
            b.x = Math.min(b.x, canvas.width);
            b.y = Math.min(b.y, canvas.height);
        });
    }
}