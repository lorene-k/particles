import {
    ctx,
    canvas,
    MIN_PARTICLE_SIZE,
    MAX_PARTICLE_SIZE,
    MARGIN_SIZE
} from "./constants.js"
import { getRandomInt, getRandomColor, } from "./utils.js"

export class Particle {
    constructor(type) {
        this.x = Math.random() * canvas.width + MARGIN_SIZE;
        this.y = Math.random() * canvas.height + MARGIN_SIZE;
        if (type) {
            this.size = type.size;
            this.color = type.color;
            this.type = type.name;
            this.vx = 0;
            this.vy = 0;
        } else {
            this.size = getRandomInt(MIN_PARTICLE_SIZE, MAX_PARTICLE_SIZE);
            this.color = getRandomColor();
            this.vx = (Math.random() - 0.5) * 0.1;
            this.vy = (Math.random() - 0.5) * 0.1;
        }
    }

    moveParticle() {
        this.vx *= 0.92
        this.vy *= 0.92
        this.x += this.vx;
        this.y += this.vy;
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

    draw() {
        // halo
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = this.color + '22';
        ctx.fill();

        // core
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}
