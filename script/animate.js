
import { canvas, ctx, mouse, CELLSIZE, PARTICLE_POPULATION } from "./constants.js";
import { Particle } from "./Particle.js";
import { Grid } from "./Grid.js";

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let mouseMode = "neutral";

const grid = new Grid(CELLSIZE);
const particles = [];
for (let i = 0; i < PARTICLE_POPULATION; i++) {
    particles.push(new Particle())
}

window.addEventListener('contextmenu', (e) => e.preventDefault());

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

window.addEventListener('mousedown', (e) => {
    if (e.button === 0) {
        mouseMode = "attract";
    }
    if (e.button === 2) {
        mouseMode = "repulse";
    }
})

window.addEventListener('mouseup', (e) => {
    mouseMode = "neutral";
})

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    particles.forEach(p => {
        p.x = Math.min(p.x, canvas.width);
        p.y = Math.min(p.y, canvas.height);
    });
})

function animate() {
    ctx.fillStyle = 'rgba(11, 11, 17, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    grid.clear();
    particles.forEach(p => grid.insert(p));
    particles.forEach(p => {
        p.update(mouseMode, grid.getNeighbors(p));
        p.draw();
    })

    requestAnimationFrame(animate);
}

animate();