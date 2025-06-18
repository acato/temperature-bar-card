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
