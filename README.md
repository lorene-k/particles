# Particles

A browser-based particle simulation playground built with vanilla JavaScript and HTML5 Canvas.
Switch between four  simulation modes and tweak their parameters in real time through a side panel.

## Modes

| Mode | Description |
|---|---|
| **Free Particles** | Particles that attract or repel toward your cursor |
| **Particle Life** | Colored particle types with configurable attraction/repulsion rules between them |
| **Boids** | Flocking simulation driven by cohesion, separation, and alignment forces |
| **Reaction Diffusion** | Gray-Scott model producing organic patterns |


## Running locally

Any static server works. A few options:

```bash
# Python
python3 -m http.server 8080

# Node (npx, no install needed)
npx serve .

# VS Code
# Use the "Live Server" extension and click "Go Live"
```

Then open `http://localhost:8080` in your browser.


## Controls

| Action | Effect |
|---|---|
| Left click | Attract (Free Particles) / Spawn boids (Boids) |
| Right click | Repulse (Free Particles) / Clear boids (Boids) |
