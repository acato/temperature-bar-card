# Temperature Bar Card

[![GitHub Release][releases-shield]][releases]
[![License][license-shield]][license]
[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg?style=for-the-badge)](https://github.com/custom-components/hacs)

A custom Home Assistant Lovelace card that displays temperature sensors as colored bars. Each bar fills based on the current temperature and changes color through a gradient — blue for cold, green for comfortable, red for hot — so you can see the state of every room at a glance.

## Quick Start

1. Install via [HACS](docs/installation.md#hacs-recommended) or [manually](docs/installation.md#manual-installation)
2. Add this to a dashboard:

```yaml
type: custom:temperature-bar-card
entities:
  - sensor.living_room_temperature
  - sensor.bedroom_temperature
```

That's it. The card uses sensible Fahrenheit defaults. For Celsius, add `unit: celsius`.

## Documentation

| Guide | What's inside |
|-------|---------------|
| [Installation](docs/installation.md) | HACS setup, manual install, adding to dashboards, updating |
| [Configuration](docs/configuration.md) | All options, entity formats, unit system, color & threshold system |
| [Examples](docs/examples.md) | Copy-paste YAML configs for common setups |
| [Troubleshooting](docs/troubleshooting.md) | Common problems and how to fix them |

## Features

- **Automatic color coding** — bars change color from cold (blue) to hot (red) based on temperature
- **Fahrenheit & Celsius** — set `unit: celsius` and defaults adjust automatically
- **Auto-conversion** — sensors reporting in a different unit are converted on the fly
- **Customizable thresholds & colors** — define your own breakpoints and color palette
- **Optional icons** — show MDI icons next to entity names
- **Compact & responsive** — works on desktop and mobile dashboards

## Configuration at a Glance

| Option | Default | Description |
|--------|---------|-------------|
| `entities` | *required* | List of `sensor.*` entity IDs or `{entity, name}` objects |
| `title` | `""` | Card title |
| `unit` | `"fahrenheit"` | `"fahrenheit"` or `"celsius"` |
| `min_temp` / `max_temp` | auto | Bar width range (auto-set per unit) |
| `temperature_thresholds` | auto | Descending breakpoints for color buckets |
| `temperature_colors` | auto | One more color than thresholds |
| `icon` | `"mdi:thermometer"` | MDI icon name |
| `show_icon` | `true` | Show/hide icons |
| `text_color` | `"rgba(255,255,255,0.9)"` | CSS color for bar text |

See [Configuration](docs/configuration.md) for full details.

## Contributing

Contributions are welcome! Please open an issue or pull request on [GitHub](https://github.com/acato/temperature-bar-card).

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

[releases-shield]: https://img.shields.io/github/release/acato/temperature-bar-card.svg?style=for-the-badge
[releases]: https://github.com/acato/temperature-bar-card/releases
[license-shield]: https://img.shields.io/github/license/acato/temperature-bar-card.svg?style=for-the-badge
[license]: LICENSE
