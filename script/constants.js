// ********************************************************************* GLOBAL
export const canvas = document.getElementById('canvas');
export const ctx = canvas.getContext('2d');
export const mouse = { x: -9999, y: -9999 };

export const LEFT_CLICK = 0;
export const RIGHT_CLICK = 2;
export const CURSOR_RADIUS = 12;

// ****************************************************************** PARTICLES
export const MOUSE_MIN_DISTANCE = 80;
export const PARTICLE_MIN_DISTANCE = 20;
export const FORCE_STRENGTH = 5;
export const CELLSIZE = 50;
export const MIN_PARTICLE_SIZE = 4;
export const MAX_PARTICLE_SIZE = 7;
export const PARTICLE_POPULATION = 1000;
export const MARGIN_SIZE = 5;

export const TYPES = [
    { name: 'blue', color: '#232fb4', size: 4 },
    { name: 'pink', color: '#ff2fa0', size: 5 },
    { name: 'purple', color: '#aa34ff', size: 6 },
    { name: 'cyan', color: '#2fffd8', size: 7 }
];

// ************************************************************** PARTICLE LIFE
export const PARTICLE_SLIDER = {
    min: -1,
    max: 1,
    step: 0.01,
}

export const PARTICLE_RULES = {
    blue: { purple: 0.4, blue: 0.1, pink: -0.3, cyan: 0.5 },
    pink: { purple: -0.2, blue: 0.3, pink: 0.1, cyan: -0.4 },
    purple: { purple: 0.1, blue: -0.5, pink: 0.3, cyan: -0.2 },
    cyan: { purple: 0.1, blue: -0.1, pink: 0.4, cyan: 0.2 },
}

// ********************************************************************** BOIDS
export const WALL_TURNFORCE = 0.5;
export const BOID_POPULATION = 400;
export const BOIDS_MIN_DISTANCE = 30;
export const BOIDS_MIN_SPEED = 1;
export const BOIDS_MAX_SPEED = 3;
export const BOIDS_PERCEPTION_RADIUS = 80;

export const BOIDS_FORCES = {
    weights: {
        cohesion: 0.0003,
        separation: 0.02,
        alignment: 0.03,
    }
};
export const BOIDS_SLIDER = {
    min: 0,
    max: 0.05,
    step: 0.0001,
}

// ********************************************************* REACTION DIFFUSION
export const RD_DA = 1.0;
export const RD_DB = 0.5;
export const RD_RESOLUTION = 2; // 1 cell = 2x2 px
export const RD_SEED_RADIUS = 10;

export const RD_RULES = {
    rates: {
        feed: 0.025,
        kill: 0.055,
    }
}

export const RD_WEIGHTS = {
    center: -1.0,
    cardinal: 0.2,
    diagonal: 0.05,
}

export const RD_PRESETS = {
    stripes: { f: 0.040, k: 0.060 },
    coral: { f: 0.055, k: 0.062 },
    labyrinth: { f: 0.029, k: 0.057 },
}

export const RD_SLIDER = {
    min: 0,
    max: 0.1,
    step: 0.0005,
}

// **************************************************************** RULES PANEL

export const RULES_PANEL_CONFIG = {
    particleLife: {
        title: "Attraction rules",
        slider: PARTICLE_SLIDER,
        rules: PARTICLE_RULES,
        labelFn: (from, to) => `${from} → ${to}`,
        decimals: 2,
        mode: "particleLife"
    },
    boids: {
        title: "Force weights",
        slider: BOIDS_SLIDER,
        rules: BOIDS_FORCES,
        labelFn: (from, to) => to,
        decimals: 4,
        mode: "boids"
    },
    reactionDiffusion: {
        title: "Feed and Kill rate",
        slider: RD_SLIDER,
        rules: RD_RULES,
        labelFn: (from, to) => to,
        decimals: 4,
        mode: "reactionDiffusion",
    }
}
