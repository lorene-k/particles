
import { TYPES } from "./constants.js";

export function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function getRandomColor() {
    return TYPES[getRandomInt(0, TYPES.length - 1)].color;
};

export function getDistance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return { distance, dx, dy };
}