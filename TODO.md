**TODO**

- add dots on resize
- generate random colors / sizes
- add minimum spacing (border around dots)
- make particles bounce against edges
- attract/repulse

- Trails
Instead of fully clearing the canvas each frame, clear it with a semi-transparent rectangle:
jsctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
ctx.fillRect(0, 0, canvas.width, canvas.height)
Particles leave a fading trail behind them. Very satisfying visual.

- Size

Make particles grow when close to the mouse
Random sizes instead of all size 3


- Connections
Draw a line between particles that are close to each other. Creates a web effect. Research "particle network effect canvas".

- Attraction + repulsion
Right click repels, left click attracts. Gives you something to play with.

- Click explosion
On click, blast all nearby particles outward with high force.


Here it is:

---

**Phase 1 — Foundation**
- [ ] Add mode-switching logic to `animate.js` (active mode, init/update/draw/destroy pattern)
- [ ] Build `UI.js` — small corner panel with a button per mode, highlights active mode
- [ ] Wire UI panel to `animate.js` so clicking a button switches the active mode
- [ ] Extract free particles into a mode object so it fits the new pattern

**Phase 2 — Simulations (in order)**
- [ ] `ParticleLife.js` — type per color, rules matrix, color-based attraction/repulsion
- [ ] `Boids.js` — separation, alignment, cohesion rules
- [ ] `ReactionDiffusion.js` — pixel grid, two-chemical simulation
- [ ] `FourierSeries.js` — rotating circles, epicycles, path tracing

---

Start with Phase 1, task 1 — want me to walk you through what to change in `animate.js`?