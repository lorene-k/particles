export const MOUSE_MIN_DISTANCE = 80;
export const PARTICLE_MIN_DISTANCE = 5;
export const FORCE_STRENGTH = 5;
export const CELLSIZE = 50;
export const MIN_PARTICLE_SIZE = 4;
export const MAX_PARTICLE_SIZE = 7;
export const PARTICLE_POPULATION = 2000;
export const MARGIN_SIZE = 5;

export const canvas = document.getElementById('canvas');
export const ctx = canvas.getContext('2d');
export const mouse = { x: -9999, y: -9999 };

export const LEFT_CLICK = 0;
export const RIGHT_CLICK = 2;

export const COLORS = [
    '#aa34ff', '#232fb4', '#ff2fa0', '#2fffd8',
];

export const TYPES = [
    { name: 'blue', color: '#232fb4', size: 4 },
    { name: 'pink', color: '#ff2fa0', size: 5 },
    { name: 'purple', color: '#aa34ff', size: 6 },
    { name: 'cyan', color: '#2fffd8', size: 7 }
];

export const PARTICLE_RULES = {
    blue:   { purple:  0.4, blue:  0.1, pink: -0.3, cyan:  0.5 },
    pink:   { purple: -0.2, blue:  0.3, pink:  0.1, cyan: -0.4 },
    purple: { purple:  0.1, blue: -0.5, pink:  0.3, cyan: -0.2 },
    cyan:   { purple:  0.1, blue: -0.1, pink:  0.4, cyan:  0.2 },
}