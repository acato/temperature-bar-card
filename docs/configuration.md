# Configuration Reference

## Minimal Configuration

The only required option is `entities`:

```yaml
type: custom:temperature-bar-card
entities:
  - sensor.living_room_temperature
  - sensor.bedroom_temperature
```

Everything else has sensible defaults.

## All Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `entities` | list | **Required** | Temperature entities to display (see [Entity Formats](#entity-formats)) |
| `title` | string | `""` | Card title shown above the bars |
| `unit` | string | `"fahrenheit"` | Display unit: `"fahrenheit"` or `"celsius"` |
| `min_temp` | number | `0` (F) / `-20` (C) | Minimum temperature for bar width scaling |
| `max_temp` | number | `120` (F) / `50` (C) | Maximum temperature for bar width scaling |
| `temperature_thresholds` | list | See [Defaults](#default-thresholds) | Descending temperature breakpoints for color buckets |
| `temperature_colors` | list | See [Defaults](#default-colors) | Colors for each bucket (must have one more entry than thresholds) |
| `icon` | string | `"mdi:thermometer"` | [MDI icon](https://pictogrammers.com/library/mdi/) name |
| `show_icon` | boolean | `true` | Show an icon next to each entity name |
| `text_color` | string | `"rgba(255,255,255,0.9)"` | Text color on the bar (any CSS color value) |

## Entity Formats

Entities can be specified in two ways:

### Simple — entity ID string

```yaml
entities:
  - sensor.living_room_temperature
  - sensor.bedroom_temperature
```

The card will use each entity's `friendly_name` attribute as the display name.

### Object — with custom name

```yaml
entities:
  - entity: sensor.living_room_temperature
    name: "Living Room"
  - entity: sensor.bedroom_temperature
    name: "Bedroom"
```

Use the object format when you want a shorter or different display name than the entity's `friendly_name`.

## Unit System

The `unit` option controls three things:

1. **Display** — temperatures are shown with `°F` or `°C`
2. **Defaults** — when you don't specify `min_temp`, `max_temp`, or `temperature_thresholds`, the card picks unit-appropriate defaults
3. **Conversion** — if an entity reports in a different unit than your `unit` setting (based on its `unit_of_measurement` attribute), the card converts it automatically

For example, if you set `unit: celsius` but a sensor reports in Fahrenheit, the card will convert the value to Celsius for display.

## Color & Threshold System

The card uses a **threshold-bucket** system to assign colors. Here's how it works:

- You define **N thresholds** (temperature breakpoints) in **descending order**
- You define **N + 1 colors** — one for each bucket between and beyond the thresholds

The card checks the temperature against each threshold from highest to lowest. The first threshold the temperature is **greater than or equal to** determines the color.

### How 7 Thresholds Create 8 Color Buckets

Using the Fahrenheit defaults as an example:

| Bucket | Temperature Range | Color | Description |
|--------|------------------|-------|-------------|
| 1 | >= 95°F | `rgba(255,0,0,1)` | Red — very hot |
| 2 | 85°F to 94°F | `rgba(255,165,0,1)` | Orange — hot |
| 3 | 75°F to 84°F | `rgba(255,255,0,1)` | Yellow — warm |
| 4 | 65°F to 74°F | `rgba(0,255,0,1)` | Green — comfortable |
| 5 | 55°F to 64°F | `rgba(0,255,255,1)` | Cyan — cool |
| 6 | 45°F to 54°F | `rgba(0,0,255,1)` | Blue — cold |
| 7 | 32°F to 44°F | `rgba(128,0,128,1)` | Purple — very cold |
| 8 | < 32°F | `rgba(75,0,130,1)` | Indigo — freezing |

### Default Thresholds

**Fahrenheit** (default):

```yaml
temperature_thresholds: [95, 85, 75, 65, 55, 45, 32]
```

**Celsius:**

```yaml
temperature_thresholds: [35, 30, 25, 20, 15, 10, 0]
```

### Default Colors

Both unit systems use the same default color palette:

```yaml
temperature_colors:
  - "rgba(255,0,0,1)"       # Red — hottest
  - "rgba(255,165,0,1)"     # Orange
  - "rgba(255,255,0,1)"     # Yellow
  - "rgba(0,255,0,1)"       # Green
  - "rgba(0,255,255,1)"     # Cyan
  - "rgba(0,0,255,1)"       # Blue
  - "rgba(128,0,128,1)"     # Purple
  - "rgba(75,0,130,1)"      # Indigo — coldest
```

### Custom Thresholds and Colors

When defining your own thresholds and colors, follow these rules:

1. **Thresholds must be in descending order** (highest first)
2. **You need exactly one more color than thresholds** — if you have 4 thresholds, provide 5 colors

Example — a simple 3-color setup with 2 thresholds:

```yaml
temperature_thresholds: [80, 60]
temperature_colors:
  - "red"       # >= 80°F
  - "orange"    # 60°F to 79°F
  - "blue"      # < 60°F
```

Colors can be any valid CSS color value: named colors (`red`, `blue`), hex (`#ff0000`), `rgb()`, or `rgba()`.

## Bar Width Scaling

The `min_temp` and `max_temp` options define the range for the bar fill width. A temperature at `min_temp` shows an empty bar, and a temperature at `max_temp` shows a full bar. Values outside this range are clamped to 0% or 100%.

Choose values that make sense for your use case:

- **Indoor rooms:** `min_temp: 50`, `max_temp: 90` (F) or `min_temp: 10`, `max_temp: 35` (C)
- **Outdoor/general:** use the defaults (`0–120°F` or `-20–50°C`)

## Icon Options

The `icon` option accepts any [Material Design Icons](https://pictogrammers.com/library/mdi/) name in the `mdi:icon-name` format.

Some useful icons for temperature cards:

| Icon | Name |
|------|------|
| Thermometer | `mdi:thermometer` (default) |
| Home thermometer | `mdi:home-thermometer` |
| Snowflake | `mdi:snowflake` |
| Fire | `mdi:fire` |
| Sun | `mdi:white-balance-sunny` |
| Water | `mdi:water` |

Set `show_icon: false` to hide icons entirely.

## Text Color

The `text_color` option sets the color of the temperature text displayed on top of the bar. It accepts any CSS color value:

```yaml
text_color: "white"
text_color: "#333333"
text_color: "rgba(0,0,0,0.8)"
```

The default `rgba(255,255,255,0.9)` (slightly transparent white) works well on the colorful bar backgrounds. If you use a lighter color scheme, you may want darker text.
