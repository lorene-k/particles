
import { COLORS } from "./constants.js";

export function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function getRandomColor() {
    return COLORS[getRandomInt(0, COLORS.length - 1)];
};