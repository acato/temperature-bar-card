# Temperature Bar Card

A custom Lovelace card that displays temperature sensors as colored bars. Each bar fills proportionally to the current reading and automatically changes color through a gradient — blue for cold, green for comfortable, red for hot — giving you an instant visual overview of temperatures across your home.

## Features

- Automatic color coding from cold (blue/purple) to hot (red)
- Fahrenheit and Celsius support with automatic unit conversion
- Customizable temperature thresholds and color palettes
- Optional MDI icons next to entity names
- Compact, responsive design for any dashboard
- Simple YAML configuration with sensible defaults

## Quick Setup

```yaml
type: custom:temperature-bar-card
entities:
  - sensor.living_room_temperature
  - sensor.bedroom_temperature
```

For Celsius, add `unit: celsius`. For custom names, use the object format:

```yaml
entities:
  - entity: sensor.living_room_temperature
    name: "Living Room"
```

## Documentation

Full documentation is available on GitHub:

- [Installation Guide](https://github.com/acato/temperature-bar-card/blob/main/docs/installation.md)
- [Configuration Reference](https://github.com/acato/temperature-bar-card/blob/main/docs/configuration.md)
- [Examples](https://github.com/acato/temperature-bar-card/blob/main/docs/examples.md)
- [Troubleshooting](https://github.com/acato/temperature-bar-card/blob/main/docs/troubleshooting.md)
