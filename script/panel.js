
import { RULES_PANEL_CONFIG, TYPES } from "./constants.js";

// ********************************************************************* BASICS
export function initPanel(setMode) {
    document.querySelectorAll('#modePanel button').forEach(btn => {
        btn.addEventListener('click', () => setMode(btn.dataset.mode));
    })
}

export function hidePanel(type) {
    if (!type) return;
    document.getElementById(type).style.display = 'none';
}

export function showPanel(type, mode, activeMode) {
    if (!type) return;
    if (type === 'rulesPanelContainer') buildRulesPanel(RULES_PANEL_CONFIG[mode], activeMode);
    document.getElementById(type).style.display = 'flex';
}

// **************************************************************** RULES PANEL
function buildBoidsControlPanel(panel, title, activeMode) {
    const counts = activeMode.getCountByType();

    title.textContent = "Flock Controls";

    TYPES.forEach(type => {
        const row = document.createElement('div');
        row.className = 'rule-row';

        const label = document.createElement('span');
        label.textContent = type.name;
        label.style.color = type.color;
        label.style.fontWeight = 'bold';

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = 0;
        slider.max = 500;
        slider.step = 1;
        slider.value = counts[type.name];

        const value = document.createElement('span');
        value.textContent = counts[type.name];

        slider.addEventListener('input', () => {
            activeMode.syncCountByType(type.name, parseInt(slider.value));
            value.textContent = slider.value;
        });

        row.appendChild(label);
        row.appendChild(slider);
        row.appendChild(value);
        panel.appendChild(row);
    })
}

export function buildRulesPanel(rulesConfig, activeMode) {
    const panel = document.getElementById('rulesPanel');
    const title = document.getElementById('rulesPanelTitle');
    const boidsPanel = document.getElementById('boidsControlPanel');
    const boidsTitle = document.getElementById('boidsControlPanelTitle');

    panel.innerHTML = '';
    boidsPanel.innerHTML = '';
    title.textContent = rulesConfig.title;
    boidsTitle.textContent = "";

    Object.keys(rulesConfig.rules).forEach(from => {
        Object.keys(rulesConfig.rules[from]).forEach(to => {
            const row = document.createElement('div');
            row.className = 'rule-row';

            const label = document.createElement('span');
            label.textContent = rulesConfig.labelFn(from, to);

            const slider = document.createElement('input');
            slider.type = 'range';
            slider.min = rulesConfig.slider.min;
            slider.max = rulesConfig.slider.max;
            slider.step = rulesConfig.slider.step;
            slider.value = rulesConfig.rules[from][to];

            const valueDisplay = document.createElement('span');
            valueDisplay.textContent = rulesConfig.rules[from][to].toFixed(rulesConfig.decimals);

            slider.addEventListener('input', () => {
                rulesConfig.rules[from][to] = parseFloat(slider.value);
                valueDisplay.textContent = parseFloat(slider.value).toFixed(rulesConfig.decimals);
            });

            row.appendChild(label);
            row.appendChild(slider);
            row.appendChild(valueDisplay);
            panel.appendChild(row);
        });
    });

    if (rulesConfig.mode === "boids") buildBoidsControlPanel(boidsPanel, boidsTitle, activeMode);
}