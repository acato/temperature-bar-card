# Examples

Ready-to-paste YAML configurations for common setups. Copy any of these into your dashboard's YAML editor.

## Minimal

Just entity IDs — everything else uses defaults (Fahrenheit, default colors):

```yaml
type: custom:temperature-bar-card
entities:
  - sensor.living_room_temperature
  - sensor.bedroom_temperature
  - sensor.kitchen_temperature
```

## Named Entities

Use the object format to give entities custom display names:

```yaml
type: custom:temperature-bar-card
title: "House Temperatures"
entities:
  - entity: sensor.living_room_temperature
    name: "Living Room"
  - entity: sensor.master_bedroom_temperature
    name: "Master Bedroom"
  - entity: sensor.kids_room_temperature
    name: "Kids Room"
  - entity: sensor.garage_temperature
    name: "Garage"
```

## Celsius Setup

Celsius mode with matching thresholds and range:

```yaml
type: custom:temperature-bar-card
title: "Temperatures"
unit: celsius
entities:
  - entity: sensor.outdoor_temperature
    name: "Outside"
  - entity: sensor.living_room_temperature
    name: "Living Room"
  - entity: sensor.bedroom_temperature
    name: "Bedroom"
```

The defaults for Celsius mode are:
- Thresholds: `[35, 30, 25, 20, 15, 10, 0]`
- Range: `-20°C` to `50°C`

## Custom Color Scheme — Indoor Comfort

A warm-palette card focused on indoor comfort range (60–85°F):

```yaml
type: custom:temperature-bar-card
title: "Indoor Comfort"
min_temp: 55
max_temp: 90
temperature_thresholds: [82, 78, 72, 68, 62]
temperature_colors:
  - "#e74c3c"    # Too hot (>= 82°F)
  - "#e67e22"    # Warm (78–81°F)
  - "#27ae60"    # Ideal (72–77°F)
  - "#2ecc71"    # Cool-comfortable (68–71°F)
  - "#3498db"    # Cool (62–67°F)
  - "#2980b9"    # Too cold (< 62°F)
entities:
  - entity: sensor.thermostat_current_temperature
    name: "Thermostat"
  - entity: sensor.bedroom_temperature
    name: "Bedroom"
```

## Whole-Home Dashboard

Many entities with custom icon and compact layout:

```yaml
type: custom:temperature-bar-card
title: "Whole House"
icon: mdi:home-thermometer
show_icon: true
entities:
  - entity: sensor.living_room_temperature
    name: "Living"
  - entity: sensor.kitchen_temperature
    name: "Kitchen"
  - entity: sensor.master_bedroom_temperature
    name: "Master"
  - entity: sensor.kids_room_temperature
    name: "Kids"
  - entity: sensor.bathroom_temperature
    name: "Bath"
  - entity: sensor.basement_temperature
    name: "Basement"
  - entity: sensor.attic_temperature
    name: "Attic"
  - entity: sensor.garage_temperature
    name: "Garage"
```

## Mixed Sensors

Entities that report in different units from the display unit. The card converts automatically based on each sensor's `unit_of_measurement` attribute:

```yaml
type: custom:temperature-bar-card
title: "Mixed Sources"
unit: fahrenheit
entities:
  - entity: sensor.ecobee_temperature
    name: "Ecobee (reports °F)"
  - entity: sensor.xiaomi_temperature
    name: "Xiaomi (reports °C)"
  - entity: sensor.outdoor_weather
    name: "Weather Service"
```

No manual conversion needed — the card reads each sensor's unit and converts to your chosen display unit.

## Simple 3-Color Setup

A minimal hot / ok / cold scheme with just 2 thresholds:

```yaml
type: custom:temperature-bar-card
title: "Quick Glance"
temperature_thresholds: [80, 60]
temperature_colors:
  - "red"      # >= 80°F — hot
  - "green"    # 60–79°F — comfortable
  - "blue"     # < 60°F — cold
entities:
  - sensor.living_room_temperature
  - sensor.outdoor_temperature
```

## Celsius — Custom Thresholds

A 5-color Celsius setup for European climate:

```yaml
type: custom:temperature-bar-card
title: "Climate Monitor"
unit: celsius
min_temp: -10
max_temp: 45
temperature_thresholds: [35, 25, 18, 5]
temperature_colors:
  - "#ff1744"    # Extreme heat (>= 35°C)
  - "#ff9100"    # Hot (25–34°C)
  - "#4caf50"    # Comfortable (18–24°C)
  - "#2196f3"    # Cold (5–17°C)
  - "#7c4dff"    # Freezing (< 5°C)
entities:
  - entity: sensor.outdoor_temperature
    name: "Outside"
  - entity: sensor.indoor_temperature
    name: "Inside"
```

## Dark Text on Light Bars

If your bars use light colors, switch to dark text:

```yaml
type: custom:temperature-bar-card
title: "Pastel Theme"
text_color: "#333333"
temperature_thresholds: [85, 70, 55]
temperature_colors:
  - "#ffcdd2"    # Light red
  - "#fff9c4"    # Light yellow
  - "#c8e6c9"    # Light green
  - "#bbdefb"    # Light blue
entities:
  - sensor.living_room_temperature
```

## No Icons

A cleaner look without icons:

```yaml
type: custom:temperature-bar-card
title: "Temps"
show_icon: false
entities:
  - entity: sensor.living_room_temperature
    name: "Living Room"
  - entity: sensor.bedroom_temperature
    name: "Bedroom"
```
