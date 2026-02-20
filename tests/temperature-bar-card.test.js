import { describe, it, expect, beforeAll, beforeEach } from 'vitest';

let card;

beforeAll(async () => {
  await import('../temperature-bar-card.js');
});

beforeEach(() => {
  card = document.createElement('temperature-bar-card');
});

// ---------------------------------------------------------------------------
// _convertTemp
// ---------------------------------------------------------------------------
describe('_convertTemp', () => {
  it('converts 0°C to 32°F', () => {
    expect(card._convertTemp(0, 'C', 'F')).toBe(32);
  });

  it('converts 100°C to 212°F', () => {
    expect(card._convertTemp(100, 'C', 'F')).toBe(212);
  });

  it('converts 32°F to 0°C', () => {
    expect(card._convertTemp(32, 'F', 'C')).toBe(0);
  });

  it('converts 212°F to 100°C', () => {
    expect(card._convertTemp(212, 'F', 'C')).toBe(100);
  });

  it('returns value unchanged when units are the same', () => {
    expect(card._convertTemp(42, 'C', 'C')).toBe(42);
    expect(card._convertTemp(42, 'F', 'F')).toBe(42);
  });

  it('handles negative values', () => {
    expect(card._convertTemp(-40, 'C', 'F')).toBe(-40);
    expect(card._convertTemp(-40, 'F', 'C')).toBe(-40);
  });
});

// ---------------------------------------------------------------------------
// _getTemperatureColor
// ---------------------------------------------------------------------------
describe('_getTemperatureColor', () => {
  const cfg = {
    temperature_thresholds: [95, 85, 75, 65, 55, 45, 32],
    temperature_colors: [
      'rgba(255,0,0,1)',
      'rgba(255,165,0,1)',
      'rgba(255,255,0,1)',
      'rgba(0,255,0,1)',
      'rgba(0,255,255,1)',
      'rgba(0,0,255,1)',
      'rgba(128,0,128,1)',
      'rgba(75,0,130,1)',
    ],
  };

  it('returns first color when temp is above highest threshold', () => {
    expect(card._getTemperatureColor(100, cfg)).toBe('rgba(255,0,0,1)');
  });

  it('returns last color when temp is below lowest threshold', () => {
    expect(card._getTemperatureColor(0, cfg)).toBe('rgba(75,0,130,1)');
  });

  it('returns correct color at exact threshold boundary', () => {
    expect(card._getTemperatureColor(95, cfg)).toBe('rgba(255,0,0,1)');
    expect(card._getTemperatureColor(85, cfg)).toBe('rgba(255,165,0,1)');
    expect(card._getTemperatureColor(32, cfg)).toBe('rgba(128,0,128,1)');
  });

  it('returns correct color between thresholds', () => {
    expect(card._getTemperatureColor(90, cfg)).toBe('rgba(255,165,0,1)');
    expect(card._getTemperatureColor(50, cfg)).toBe('rgba(0,0,255,1)');
  });

  it('works with custom thresholds and colors', () => {
    const custom = {
      temperature_thresholds: [30, 20, 10],
      temperature_colors: ['red', 'yellow', 'blue', 'purple'],
    };
    expect(card._getTemperatureColor(35, custom)).toBe('red');
    expect(card._getTemperatureColor(25, custom)).toBe('yellow');
    expect(card._getTemperatureColor(15, custom)).toBe('blue');
    expect(card._getTemperatureColor(5, custom)).toBe('purple');
  });
});

// ---------------------------------------------------------------------------
// _getBarWidth
// ---------------------------------------------------------------------------
describe('_getBarWidth', () => {
  const cfg = { min_temp: 0, max_temp: 120 };

  it('returns 0 at min_temp', () => {
    expect(card._getBarWidth(0, cfg)).toBe(0);
  });

  it('returns 100 at max_temp', () => {
    expect(card._getBarWidth(120, cfg)).toBe(100);
  });

  it('returns 50 at midpoint', () => {
    expect(card._getBarWidth(60, cfg)).toBeCloseTo(50);
  });

  it('clamps to 0 when below min', () => {
    expect(card._getBarWidth(-10, cfg)).toBe(0);
  });

  it('clamps to 100 when above max', () => {
    expect(card._getBarWidth(200, cfg)).toBe(100);
  });
});

// ---------------------------------------------------------------------------
// setConfig
// ---------------------------------------------------------------------------
describe('setConfig', () => {
  it('sets correct Fahrenheit defaults for minimal config', () => {
    card.setConfig({ entities: ['sensor.temp'] });
    expect(card._config.unit).toBe('fahrenheit');
    expect(card._config.min_temp).toBe(0);
    expect(card._config.max_temp).toBe(120);
    expect(card._config.temperature_thresholds).toEqual([95, 85, 75, 65, 55, 45, 32]);
    expect(card._config.show_icon).toBe(true);
    expect(card._config.icon).toBe('mdi:thermometer');
  });

  it('sets correct Celsius defaults', () => {
    card.setConfig({ entities: ['sensor.temp'], unit: 'celsius' });
    expect(card._config.unit).toBe('celsius');
    expect(card._config.min_temp).toBe(-20);
    expect(card._config.max_temp).toBe(50);
    expect(card._config.temperature_thresholds).toEqual([35, 30, 25, 20, 15, 10, 0]);
  });

  it('preserves custom thresholds and colors', () => {
    const thresholds = [80, 60, 40];
    const colors = ['red', 'yellow', 'blue', 'green'];
    card.setConfig({ entities: ['sensor.temp'], temperature_thresholds: thresholds, temperature_colors: colors });
    expect(card._config.temperature_thresholds).toEqual(thresholds);
    expect(card._config.temperature_colors).toEqual(colors);
  });

  it('resolves string entity to { entity, name: null }', () => {
    card.setConfig({ entities: ['sensor.temp'] });
    expect(card._config.entities[0]).toEqual({ entity: 'sensor.temp', name: null });
  });

  it('resolves object entity correctly', () => {
    card.setConfig({ entities: [{ entity: 'sensor.temp', name: 'Living Room' }] });
    expect(card._config.entities[0]).toEqual({ entity: 'sensor.temp', name: 'Living Room' });
  });

  it('resolves object entity with missing name to null', () => {
    card.setConfig({ entities: [{ entity: 'sensor.temp' }] });
    expect(card._config.entities[0]).toEqual({ entity: 'sensor.temp', name: null });
  });

  it('throws when entities is missing', () => {
    expect(() => card.setConfig({})).toThrow('Please define at least one entity');
  });

  it('throws when entities is empty array', () => {
    expect(() => card.setConfig({ entities: [] })).toThrow('Please define at least one entity');
  });

  it('throws when entities is not an array', () => {
    expect(() => card.setConfig({ entities: 'sensor.temp' })).toThrow('Please define at least one entity');
  });
});

// ---------------------------------------------------------------------------
// getCardSize
// ---------------------------------------------------------------------------
describe('getCardSize', () => {
  it('returns entity count when there is no title', () => {
    card.setConfig({ entities: ['sensor.a', 'sensor.b'] });
    expect(card.getCardSize()).toBe(2);
  });

  it('returns entity count + 1 when there is a title', () => {
    card.setConfig({ entities: ['sensor.a', 'sensor.b'], title: 'Temps' });
    expect(card.getCardSize()).toBe(3);
  });

  it('returns 1 when config is not set', () => {
    const fresh = document.createElement('temperature-bar-card');
    expect(fresh.getCardSize()).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// getStubConfig (static)
// ---------------------------------------------------------------------------
describe('getStubConfig', () => {
  it('returns expected default structure', () => {
    const stub = customElements.get('temperature-bar-card').getStubConfig();
    expect(stub).toEqual({
      title: 'Temperatures',
      unit: 'fahrenheit',
      entities: [],
    });
  });
});

// ---------------------------------------------------------------------------
// _renderBar
// ---------------------------------------------------------------------------
describe('_renderBar', () => {
  const baseCfg = {
    show_icon: true,
    icon: 'mdi:thermometer',
    text_color: 'rgba(255,255,255,0.9)',
    temperature_thresholds: [95, 85, 75, 65, 55, 45, 32],
    temperature_colors: [
      'rgba(255,0,0,1)', 'rgba(255,165,0,1)', 'rgba(255,255,0,1)',
      'rgba(0,255,0,1)', 'rgba(0,255,255,1)', 'rgba(0,0,255,1)',
      'rgba(128,0,128,1)', 'rgba(75,0,130,1)',
    ],
    min_temp: 0,
    max_temp: 120,
  };

  it('renders N/A when temp is null', () => {
    const html = card._renderBar('Sensor', null, '°F', baseCfg);
    expect(html).toContain('N/A');
    expect(html).toContain('Sensor');
  });

  it('renders formatted temperature when temp is valid', () => {
    const html = card._renderBar('Sensor', 72.5, '°F', baseCfg);
    expect(html).toContain('72.5°F');
    expect(html).toContain('Sensor');
  });

  it('includes icon when show_icon is true', () => {
    const html = card._renderBar('Sensor', 72, '°F', baseCfg);
    expect(html).toContain('ha-icon');
    expect(html).toContain('mdi:thermometer');
  });

  it('excludes icon when show_icon is false', () => {
    const cfg = { ...baseCfg, show_icon: false };
    const html = card._renderBar('Sensor', 72, '°F', cfg);
    expect(html).not.toContain('ha-icon');
  });
});
