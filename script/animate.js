
import { canvas, ctx, mouse, CURSOR_RADIUS } from "./constants.js";
import { initPanel, showPanel, hidePanel, buildRulesPanel } from "./panel.js";
import { FreeParticles } from "./modes/FreeParticles.js";
import { ParticleLife } from "./modes/ParticleLife.js";
import { Boids } from "./modes/Boids.js";
import { ReactionDiffusion } from "./modes/ReactionDiffusion.js";
// import { Fourier } from "./modes/Fourier.js";

// ******************************************************************** GLOBALS
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let mouseMode = "neutral";
let activeModeStr = "freeParticles";
let activeMode = new FreeParticles();

const MODE_MAP = {
    freeParticles: () => new FreeParticles(),
    particleLife: () => new ParticleLife(),
    boids: () => new Boids(),
    reactionDiffusion: () => new ReactionDiffusion()
};

// ************************************************************ EVENT LISTENERS
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
    if (activeMode.handleResize) activeMode.handleResize();
})

document.getElementById('leftPanel').addEventListener('mousedown', (e) => {
    e.stopPropagation();
});

// *************************************************************** CURSOR STYLE
function drawCursor() {
    ctx.beginPath();
    ctx.arc(mouse.x, mouse.y, CURSOR_RADIUS, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(mouse.x, mouse.y, CURSOR_RADIUS, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgb(255, 255, 255)';
    ctx.lineWidth = 1;
    ctx.stroke();

    if (mouseMode === "repulse" && activeModeStr === "boids") {
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, CURSOR_RADIUS * 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
        ctx.fill();
    }
}

// *************************************************************** ANIMATE MODE
function setMode(mode) {
    activeModeStr = mode;
    activeMode.panels.forEach(p => hidePanel(p));
    activeMode.destroy();
    activeMode = MODE_MAP[mode]();
    activeMode.panels.forEach(p => showPanel(p, mode, activeMode));
}

function animate() {
    ctx.fillStyle = 'rgba(11, 11, 17, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    activeMode.update(mouseMode);
    drawCursor();
    requestAnimationFrame(animate);
}

initPanel(setMode);
animate();