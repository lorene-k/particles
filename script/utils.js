
import { COLORS } from "./constants.js";

export function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function getRandomColor() {
    return COLORS[getRandomInt(0, COLORS.length - 1)];
};

export function getGradient(x, y, size, color) {
    const gradient = ctx.createRadialGradient(
        x, y, 0,
        x, y, size
    )
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, 'white')
    return gradient;
}