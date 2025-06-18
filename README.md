### 3. `README.md`

# Temperature Bar Card

[![GitHub Release][releases-shield]][releases]
[![License][license-shield]](LICENSE)
[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg?style=for-the-badge)](https://github.com/custom-components/hacs)

A beautiful custom Home Assistant Lovelace card for displaying temperature entities with gradient backgrounds.

![Temperature Bar Card](https://raw.githubusercontent.com/yourusername/temperature-bar-card/main/screenshot.png)

## Features

🌡️ **Temperature-based color coding** - Colors automatically change from cold blue to hot red  
🌍 **Fahrenheit & Celsius support** - Choose your preferred unit with automatic conversion  
🎨 **Fully customizable** - Custom thresholds, colors, icons, and text styling  
📱 **Responsive design** - Compact bars that work on all screen sizes  
🎯 **Optional icons** - Show/hide thermometer icons with customization  
⚙️ **Easy configuration** - Simple YAML setup with sensible defaults  

## Installation

### HACS (Recommended)

1. Open HACS in Home Assistant
2. Go to "Frontend"  
3. Click "+" and search for "Temperature Bar Card"
4. Install the card
5. Restart Home Assistant
6. Add the card to your dashboard

### Manual Installation

1. Download `temperature-bar-card.js`
2. Copy to `/config/www/`
3. Add resource in `configuration.yaml`:
```yaml
lovelace:
  resources:
    - url: /local/temperature-bar-card.js
      type: module

## Basic Configuration

type: custom:temperature-bar-card
title: "Room Temperatures"
entities:
  - sensor.living_room_temperature
  - sensor.bedroom_temperature

## Advanced Configuration

type: custom:temperature-bar-card
title: "Climate Control"
unit: celsius
text_color: rgba(255,255,255,0.9)
icon: mdi:home-thermometer
show_icon: true
min_temp: -10
max_temp: 45
temperature_thresholds: [35, 30, 25, 20, 15, 10, 0]
temperature_colors:
  - rgba(255,0,0,1)      # Very hot
  - rgba(255,165,0,1)    # Hot
  - rgba(255,255,0,1)    # Warm
  - rgba(0,255,0,1)      # Perfect  
  - rgba(0,255,255,1)    # Cool
  - rgba(0,0,255,1)      # Cold
  - rgba(128,0,128,1)    # Very cold
  - rgba(75,0,130,1)     # Freezing
entities:
  - entity: sensor.outdoor_temperature
    name: "Outside"
  - entity: sensor.indoor_temperature
    name: "Inside"



