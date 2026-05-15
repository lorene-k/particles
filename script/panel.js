
export function initPanel(setMode) {
    document.querySelectorAll('#modePanel button').forEach(btn => {
        btn.addEventListener('click', () => setMode(btn.dataset.mode));
    })
}

export function showPanel(type) {
    if (!type) return;
    document.getElementById(type).style.display = 'flex';
}

export function hidePanel(type) {
    if (!type) return;
    document.getElementById(type).style.display = 'none';
}

import { PARTICLE_RULES } from "./constants.js";

export function buildRulesPanel() {
    const panel = document.getElementById('rulesPanel');

    Object.keys(PARTICLE_RULES).forEach(from => {
        Object.keys(PARTICLE_RULES[from]).forEach(to => {
            const row = document.createElement('div');
            row.className = 'rule-row';

            const label = document.createElement('span');
            label.textContent = `${from} → ${to}`;

            const slider = document.createElement('input');
            slider.type = 'range';
            slider.min = -1;
            slider.max = 1;
            slider.step = 0.01;
            slider.value = PARTICLE_RULES[from][to];

            const valueDisplay = document.createElement('span');
            valueDisplay.textContent = PARTICLE_RULES[from][to].toFixed(2);

            slider.addEventListener('input', () => {
                PARTICLE_RULES[from][to] = parseFloat(slider.value);
                valueDisplay.textContent = parseFloat(slider.value).toFixed(2);
            });

            row.appendChild(label);
            row.appendChild(slider);
            row.appendChild(valueDisplay);
            panel.appendChild(row);
        });
    });
}