class TemperatureBarCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  setConfig(config) {
    if (!config.entities || !Array.isArray(config.entities)) {
      throw new Error('You need to define entities');
    }
    this._config = {
      title: config.title || '',
      unit: config.unit || 'fahrenheit',
      text_color: config.text_color || 'rgba(255,255,255,0.9)',
      icon: config.icon || 'mdi:thermometer',
      show_icon: config.show_icon !== undefined ? config.show_icon : false,
      min_temp: config.min_temp !== undefined ? config.min_temp : (config.unit === 'celsius' ? -10 : 14),
      max_temp: config.max_temp !== undefined ? config.max_temp : (config.unit === 'celsius' ? 45 : 113),
      temperature_thresholds: config.temperature_thresholds || (config.unit === 'celsius'
        ? [35, 30, 25, 20, 15, 10, 0]
        : [95, 86, 77, 68, 59, 50, 32]),
      temperature_colors: config.temperature_colors || [
        'rgba(255,0,0,1)',
        'rgba(255,165,0,1)',
        'rgba(255,255,0,1)',
        'rgba(0,255,0,1)',
        'rgba(0,255,255,1)',
        'rgba(0,0,255,1)',
        'rgba(128,0,128,1)',
        'rgba(75,0,130,1)'
      ],
      entities: config.entities.map(e => typeof e === 'string' ? { entity: e } : e)
    };
  }

  _convertTemp(value, fromUnit, toUnit) {
    if (fromUnit === toUnit) return value;
    if (fromUnit === 'celsius' && toUnit === 'fahrenheit') {
      return (value * 9/5) + 32;
    }
    if (fromUnit === 'fahrenheit' && toUnit === 'celsius') {
      return (value - 32) * 5/9;
    }
    return value;
  }

  _getEntityUnit(entity) {
    const unit = entity.attributes?.unit_of_measurement || '';
    if (unit.includes('°F') || unit.toLowerCase().includes('fahrenheit')) return 'fahrenheit';
    if (unit.includes('°C') || unit.toLowerCase().includes('celsius')) return 'celsius';
    return this._config.unit;
  }

  _getColorForTemp(temp) {
    const { temperature_thresholds, temperature_colors } = this._config;
    for (let i = 0; i < temperature_thresholds.length; i++) {
      if (temp >= temperature_thresholds[i]) {
        return temperature_colors[i];
      }
    }
    return temperature_colors[temperature_colors.length - 1];
  }

  _getBarWidth(temp) {
    const { min_temp, max_temp } = this._config;
    const percentage = ((temp - min_temp) / (max_temp - min_temp)) * 100;
    return Math.max(0, Math.min(100, percentage));
  }

  _render() {
    if (!this._hass || !this._config) return;

    const { title, unit, text_color, icon, show_icon, entities } = this._config;
    const unitSymbol = unit === 'celsius' ? '°C' : '°F';

    const barsHtml = entities.map(entityConfig => {
      const entity = this._hass.states[entityConfig.entity];
      if (!entity) {
        return '<div class="bar-container"><div class="bar error">Entity not found: ' + entityConfig.entity + '</div></div>';
      }

      const rawTemp = parseFloat(entity.state);
      if (isNaN(rawTemp)) {
        return '<div class="bar-container"><div class="bar error">Invalid temperature: ' + entity.state + '</div></div>';
      }

      const entityUnit = this._getEntityUnit(entity);
      const displayTemp = this._convertTemp(rawTemp, entityUnit, unit);
      const color = this._getColorForTemp(displayTemp);
      const width = this._getBarWidth(displayTemp);
      const name = entityConfig.name || entity.attributes.friendly_name || entityConfig.entity;

      const iconHtml = show_icon
        ? '<ha-icon icon="' + (entityConfig.icon || icon) + '" class="bar-icon"></ha-icon>'
        : '';

      return '<div class="bar-container">' +
        '<div class="bar" style="background: linear-gradient(to right, ' + color + ' ' + width + '%, rgba(0,0,0,0.3) ' + width + '%);">' +
        iconHtml +
        '<span class="name">' + name + '</span>' +
        '<span class="temp">' + displayTemp.toFixed(1) + unitSymbol + '</span>' +
        '</div></div>';
    }).join('');

    this.shadowRoot.innerHTML = 
      '<style>' +
        ':host { display: block; }' +
        'ha-card { padding: 16px; }' +
        '.title { font-size: 1.2em; font-weight: 500; margin-bottom: 12px; color: var(--primary-text-color); }' +
        '.bar-container { margin-bottom: 8px; }' +
        '.bar-container:last-child { margin-bottom: 0; }' +
        '.bar { height: 30px; border-radius: 8px; display: flex; align-items: center; padding: 0 12px; color: ' + text_color + '; font-size: 14px; transition: background 0.3s ease; }' +
        '.bar.error { background: rgba(255,0,0,0.3); font-size: 12px; }' +
        '.bar-icon { --mdc-icon-size: 18px; margin-right: 8px; flex-shrink: 0; }' +
        '.name { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }' +
        '.temp { font-weight: 600; margin-left: 8px; flex-shrink: 0; }' +
      '</style>' +
      '<ha-card>' +
        (title ? '<div class="title">' + title + '</div>' : '') +
        barsHtml +
      '</ha-card>';
  }

  getCardSize() {
    return 1 + (this._config?.entities?.length || 0);
  }

  static getStubConfig() {
    return { entities: [] };
  }
}

customElements.define('temperature-bar-card', TemperatureBarCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'temperature-bar-card',
  name: 'Temperature Bar Card',
  description: 'A card that displays temperature entities with gradient color backgrounds'
});
