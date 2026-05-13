export const MOUSE_MIN_DISTANCE = 80;
export const PARTICLE_MIN_DISTANCE = 5;
export const FORCE_STRENGTH = 5;
export const CELLSIZE = 50;
export const MIN_PARTICLE_SIZE = 4;
export const MAX_PARTICLE_SIZE = 7;
export const PARTICLE_POPULATION = 2000;

export const canvas = document.getElementById('canvas');
export const ctx = canvas.getContext('2d');
export const mouse = { x: -9999, y: -9999 };

export const LEFT_CLICK = 0;
export const RIGHT_CLICK = 2;

export const COLORS = [
    '#aa34ff', '#3c46b4', '#f65cbe', '#35d8de',
];