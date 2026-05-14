import {
    MIN_PARTICLE_SIZE,
    MAX_PARTICLE_SIZE,
    MOUSE_MIN_DISTANCE,
    PARTICLE_MIN_DISTANCE,
    FORCE_STRENGTH,
    LEFT_CLICK,
    RIGHT_CLICK,
    ctx,
    mouse,
    canvas
} from "./constants.js"
import { getRandomInt, getRandomColor } from "./utils.js"

export class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.1
        this.vy = (Math.random() - 0.5) * 0.1
        this.size = getRandomInt(MIN_PARTICLE_SIZE, MAX_PARTICLE_SIZE);
        this.color = getRandomColor();
    }

    reactToMouse(mouseMode) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0 && distance < MOUSE_MIN_DISTANCE) {
            const force = (MOUSE_MIN_DISTANCE - distance) / MOUSE_MIN_DISTANCE;
            if (mouseMode === "attract") {
                this.vx += (dx / distance) * force * FORCE_STRENGTH;
                this.vy += (dy / distance) * force * FORCE_STRENGTH;
            } else if (mouseMode === "repulse") {
                this.vx -= (dx / distance) * force * FORCE_STRENGTH;
                this.vy -= (dy / distance) * force * FORCE_STRENGTH;
            }
        }
    }

    reactToNeighbors(neighbors) {
        neighbors.forEach(n => {
            const dx = n.x - this.x;
            const dy = n.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance > 0 && distance < PARTICLE_MIN_DISTANCE) {
                const force = (PARTICLE_MIN_DISTANCE - distance) / PARTICLE_MIN_DISTANCE;
                this.vx -= (dx / distance) * force * FORCE_STRENGTH;
                this.vy -= (dy / distance) * force * FORCE_STRENGTH;
            }
        });
    }

    moveParticle() {
        this.vx *= 0.92
        this.vy *= 0.92
        this.x += this.vx;
        this.y += this.vy;
        const MARGIN_SIZE = 5;
        if (this.x < MARGIN_SIZE) {
            this.vx *= -1;
            this.x = MARGIN_SIZE;
        }
        if (this.x > canvas.width - MARGIN_SIZE) {
            this.vx *= -1;
            this.x = canvas.width - MARGIN_SIZE;
        }
        if (this.y < MARGIN_SIZE) {
            this.vy *= -1;
            this.y = MARGIN_SIZE;
        }
        if (this.y > canvas.height - MARGIN_SIZE) {
            this.vy *= -1;
            this.y = canvas.height - MARGIN_SIZE;
        }
    }

    update(mouseMode, neighbors) {
        this.reactToMouse(mouseMode);
        this.reactToNeighbors(neighbors);
        this.moveParticle();
    }

    draw() {
            // halo
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
    ctx.fillStyle = this.color + '22'; // very transparent
    ctx.fill();

    // core
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * 0.6, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    }
}
