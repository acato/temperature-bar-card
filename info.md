# Temperature Bar Card

A beautiful custom Home Assistant Lovelace card that displays temperature entities with stunning colored gradient backgrounds.

## Features

- **Temperature-based color coding** - Automatic colors from cold blue to hot red
- **Fahrenheit & Celsius support** - Choose your preferred unit
- **Customizable thresholds** - Set your own temperature ranges and colors
- **Optional icons** - Show/hide thermometer icons with custom options
- **Compact design** - Small, sleek bars with modern styling
- **Custom text colors** - Personalize the appearance
- **Responsive** - Works perfectly on mobile and desktop

## Quick Setup

```yaml
type: custom:temperature-bar-card
title: "Room Temperatures"
unit: fahrenheit
entities:
  - sensor.living_room_temperature
  - sensor.bedroom_temperature
```

## Customization

```yaml
type: custom:temperature-bar-card
title: "Climate Monitor"
unit: celsius
text_color: rgba(255,255,255,0.9)
icon: mdi:home-thermometer
temperature_thresholds: [35, 30, 25, 20, 15, 10, 0]
temperature_colors:
  - rgba(255,0,0,1)      # Hot
  - rgba(255,165,0,1)    # Warm
  - rgba(255,255,0,1)    # Mild
  - rgba(0,255,0,1)      # Perfect
  - rgba(0,255,255,1)    # Cool
  - rgba(0,0,255,1)      # Cold
  - rgba(128,0,128,1)    # Very cold
  - rgba(75,0,130,1)     # Freezing
entities:
  - entity: sensor.outdoor_temperature
    name: "Outside"
```
