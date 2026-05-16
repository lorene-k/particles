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
    CURSOR_RADIUS,
    canvas,
    TYPES,
    mouse,
} from "../constants.js";
import { Particle } from "../Particle.js";
import { Grid } from "../Grid.js";
import { getDistance, getRandomInt } from "../utils.js"

export class Boids {
    constructor() {
        this.sliderRefs = {};
        this.panels = ["boidsInfoPanel", "rulesPanelContainer", "rulesPanel", "boidsControlPanel"];
        this.grid = new Grid(CELLSIZE);
        this.boids = [];
        this.spawnType = 2;
        let type = 0;
        for (let i = 0; i < BOID_POPULATION; i++) {
            const type = Math.floor(i / BOID_POPULATION * TYPES.length);
            const b = new Particle(TYPES[type]);

            b.vx = (Math.random() - 0.5) * 2;
            b.vy = (Math.random() - 0.5) * 2;
            this.boids.push(b)
        }
    }

    getCountByType() {
        const counts = {};
        TYPES.forEach(t => counts[t.name] = 0);
        this.boids.forEach(b => counts[b.type]++);
        return counts;
    }

    syncCountByType(type, targetValue) {
        const count = this.boids.filter(b => b.type === type).length;
        if (count < targetValue) {
            for (let i = 0; i < targetValue - count; i++) {
                this.spawnBoid(type);
            }
        } else if (count > targetValue) {
            let removed = 0;
            this.boids = this.boids.filter(b => {
                if (b.type === type && removed < count - targetValue) {
                    removed++;
                    return false;
                }
                return true;
            });
        }
    }

    clearBoidsInZone(x, y, radius) {
        this.boids = this.boids.filter(b => {
            const { distance } = getDistance(b.x, b.y, x, y);
            return distance > radius;
        })
    }

    spawnBoid(typeName, x, y) {
        const type = TYPES.find(t => t.name === typeName) || TYPES[this.spawnType];
        const b = new Particle(type);

        if (x !== undefined && y !== undefined) {
            b.x = x;
            b.y = y;
        }
        b.vx = (Math.random() - 0.5) * 2;
        b.vy = (Math.random() - 0.5) * 2;
        this.boids.push(b);
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

    handleMouse(mouseMode) {
        if (mouseMode === "attract")
            this.spawnBoid(null, mouse.x, mouse.y);
        if (mouseMode === "repulse")
            this.clearBoidsInZone(mouse.x, mouse.y, CURSOR_RADIUS * 3);
    }

    updateSliders() {
        if (this.sliderRefs) {
            const counts = this.getCountByType();
            TYPES.forEach(type => {
                const ref = this.sliderRefs[type.name];
                if (ref) {
                    ref.slider.value = counts[type.name];
                    ref.value.textContent = counts[type.name];
                }
            })
        }
    }

    update(mouseMode, ruleType = "STRONG") {
        this.handleMouse(mouseMode);
        this.grid.clear();
        this.boids.forEach(b => this.grid.insert(b));
        this.boids.forEach(b => {
            this.applyForces(b, this.grid.getNeighbors(b));
            this.moveBoid(b);
            this.adjustSpeed(b);
            b.draw();
        })
        this.updateSliders();
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