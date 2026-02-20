const CARD_VERSION = '1.2.0';

const DEFAULT_THRESHOLDS_F = [95, 85, 75, 65, 55, 45, 32];
const DEFAULT_THRESHOLDS_C = [35, 30, 25, 20, 15, 10, 0];

const DEFAULT_COLORS = [
  'rgba(255,0,0,1)',
  'rgba(255,165,0,1)',
  'rgba(255,255,0,1)',
  'rgba(0,255,0,1)',
  'rgba(0,255,255,1)',
  'rgba(0,0,255,1)',
  'rgba(128,0,128,1)',
  'rgba(75,0,130,1)',
];

class TemperatureBarCard extends HTMLElement {
  setConfig(config) {
    if (!config.entities || !Array.isArray(config.entities) || config.entities.length === 0) {
      throw new Error('Please define at least one entity');
    }

    const unit = config.unit || 'fahrenheit';
    const isCelsius = unit === 'celsius';

    this._config = {
      title: config.title || '',
      unit: unit,
      min_temp: config.min_temp != null ? config.min_temp : (isCelsius ? -20 : 0),
      max_temp: config.max_temp != null ? config.max_temp : (isCelsius ? 50 : 120),
      temperature_thresholds: config.temperature_thresholds || (isCelsius ? DEFAULT_THRESHOLDS_C : DEFAULT_THRESHOLDS_F),
      temperature_colors: config.temperature_colors || DEFAULT_COLORS,
      icon: config.icon || 'mdi:thermometer',
      show_icon: config.show_icon !== false,
      text_color: config.text_color || 'rgba(255,255,255,0.9)',
      entities: config.entities.map(e => this._resolveEntity(e)),
    };
  }

  _resolveEntity(entityConfig) {
    if (typeof entityConfig === 'string') {
      return { entity: entityConfig, name: null };
    }
    return { entity: entityConfig.entity, name: entityConfig.name || null };
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  _render() {
    if (!this._config || !this._hass) return;

    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
    }

    const cfg = this._config;
    const unitLabel = cfg.unit === 'celsius' ? '°C' : '°F';

    let barsHtml = '';
    for (const entityCfg of cfg.entities) {
      const stateObj = this._hass.states[entityCfg.entity];
      const displayName = entityCfg.name || (stateObj ? stateObj.attributes.friendly_name : entityCfg.entity);

      if (!stateObj || stateObj.state === 'unavailable' || stateObj.state === 'unknown') {
        barsHtml += this._renderBar(displayName, null, unitLabel, cfg);
        continue;
      }

      const rawValue = parseFloat(stateObj.state);
      if (isNaN(rawValue)) {
        barsHtml += this._renderBar(displayName, null, unitLabel, cfg);
        continue;
      }

      // Determine the entity's native unit from attributes
      const nativeUnit = stateObj.attributes.unit_of_measurement || '';
      let displayTemp = rawValue;

      if (nativeUnit.includes('C') && cfg.unit === 'fahrenheit') {
        displayTemp = this._convertTemp(rawValue, 'C', 'F');
      } else if (nativeUnit.includes('F') && cfg.unit === 'celsius') {
        displayTemp = this._convertTemp(rawValue, 'F', 'C');
      }

      barsHtml += this._renderBar(displayName, displayTemp, unitLabel, cfg);
    }

    this.shadowRoot.innerHTML = `
      <style>
        ha-card {
          padding: 16px;
        }
        .card-title {
          font-size: 1.2em;
          font-weight: 500;
          margin-bottom: 12px;
          color: var(--primary-text-color);
        }
        .bar-container {
          margin-bottom: 8px;
        }
        .bar-label {
          display: flex;
          align-items: center;
          margin-bottom: 4px;
          font-size: 0.9em;
          color: var(--primary-text-color);
        }
        .bar-label ha-icon {
          --mdc-icon-size: 18px;
          margin-right: 6px;
        }
        .bar-wrapper {
          position: relative;
          height: 30px;
          background: var(--secondary-background-color, #e0e0e0);
          border-radius: 4px;
          overflow: hidden;
        }
        .bar-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.5s ease;
          min-width: 0;
        }
        .bar-text {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding: 0 8px;
          font-size: 0.85em;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
        }
      </style>
      <ha-card>
        ${cfg.title ? `<div class="card-title">${cfg.title}</div>` : ''}
        ${barsHtml}
      </ha-card>
    `;
  }

  _renderBar(name, temp, unitLabel, cfg) {
    const iconHtml = cfg.show_icon
      ? `<ha-icon icon="${cfg.icon}"></ha-icon>`
      : '';

    if (temp === null) {
      return `
        <div class="bar-container">
          <div class="bar-label">${iconHtml}<span>${name}</span></div>
          <div class="bar-wrapper">
            <div class="bar-fill" style="width: 100%; background: #9e9e9e;"></div>
            <div class="bar-text" style="color: ${cfg.text_color};">N/A</div>
          </div>
        </div>
      `;
    }

    const color = this._getTemperatureColor(temp, cfg);
    const width = this._getBarWidth(temp, cfg);
    const displayValue = `${temp.toFixed(1)}${unitLabel}`;

    return `
      <div class="bar-container">
        <div class="bar-label">${iconHtml}<span>${name}</span></div>
        <div class="bar-wrapper">
          <div class="bar-fill" style="width: ${width}%; background: ${color};"></div>
          <div class="bar-text" style="color: ${cfg.text_color};">${displayValue}</div>
        </div>
      </div>
    `;
  }

  _getTemperatureColor(temp, cfg) {
    const thresholds = cfg.temperature_thresholds;
    const colors = cfg.temperature_colors;

    for (let i = 0; i < thresholds.length; i++) {
      if (temp >= thresholds[i]) {
        return colors[i] || colors[colors.length - 1];
      }
    }
    return colors[colors.length - 1];
  }

  _getBarWidth(temp, cfg) {
    const min = cfg.min_temp;
    const max = cfg.max_temp;
    const pct = ((temp - min) / (max - min)) * 100;
    return Math.max(0, Math.min(100, pct));
  }

  _convertTemp(value, from, to) {
    if (from === 'C' && to === 'F') {
      return (value * 9) / 5 + 32;
    }
    if (from === 'F' && to === 'C') {
      return ((value - 32) * 5) / 9;
    }
    return value;
  }

  getCardSize() {
    return (this._config ? this._config.entities.length : 1) + (this._config && this._config.title ? 1 : 0);
  }

  static getStubConfig() {
    return {
      title: 'Temperatures',
      unit: 'fahrenheit',
      entities: [],
    };
  }
}

customElements.define('temperature-bar-card', TemperatureBarCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'temperature-bar-card',
  name: 'Temperature Bar Card',
  description: 'A card that displays temperature sensors as colored bars',
});

console.info(
  `%c TEMPERATURE-BAR-CARD %c v${CARD_VERSION} `,
  'color: white; background: #555; font-weight: bold; padding: 2px 4px; border-radius: 3px 0 0 3px;',
  'color: white; background: #1976d2; font-weight: bold; padding: 2px 4px; border-radius: 0 3px 3px 0;'
);
