# Installation

## Prerequisites

- Home Assistant **2021.3.0** or newer
- For the HACS method: [HACS](https://hacs.xyz/) installed and configured

## HACS (Recommended)

Since this card is not yet in the default HACS store, you need to add it as a **custom repository**:

1. Open Home Assistant and go to **HACS** in the sidebar
2. Click **Frontend**
3. Click the **three-dot menu** (top right) and select **Custom repositories**
4. Enter the repository URL:
   ```
   https://github.com/acato/temperature-bar-card
   ```
5. Select **Dashboard** as the category
6. Click **Add**
7. The card will now appear in HACS — click **Install**
8. Restart Home Assistant
9. Hard-refresh your browser (`Ctrl+Shift+R` / `Cmd+Shift+R`)

## Manual Installation

1. Download `temperature-bar-card.js` from the [latest release](https://github.com/acato/temperature-bar-card/releases/latest)
2. Copy the file to your Home Assistant config directory:
   ```
   /config/www/temperature-bar-card.js
   ```
3. Add the resource so Lovelace knows about it. Pick **one** of these methods:

### Option A — UI

1. Go to **Settings > Dashboards**
2. Click the **three-dot menu** (top right) and select **Resources**
3. Click **Add Resource**
4. Enter the URL:
   ```
   /local/temperature-bar-card.js
   ```
5. Set the type to **JavaScript Module**
6. Click **Create**

### Option B — YAML

Add the following to your `configuration.yaml`:

```yaml
lovelace:
  resources:
    - url: /local/temperature-bar-card.js
      type: module
```

Then restart Home Assistant.

## Adding the Card to a Dashboard

### Card Picker (UI mode)

1. Open a dashboard and click **Edit** (pencil icon, top right)
2. Click **Add Card**
3. Search for **Temperature Bar Card**
4. Configure the card in the visual editor or switch to the YAML editor
5. Click **Save**

### YAML Editor

In any dashboard YAML, add:

```yaml
type: custom:temperature-bar-card
entities:
  - sensor.living_room_temperature
  - sensor.bedroom_temperature
```

## Updating

### HACS

HACS will notify you when a new version is available. Click **Update**, then hard-refresh your browser.

### Manual

1. Download the new `temperature-bar-card.js` from the [releases page](https://github.com/acato/temperature-bar-card/releases)
2. Replace the file in `/config/www/`
3. Hard-refresh your browser (`Ctrl+Shift+R` / `Cmd+Shift+R`)

> **Tip:** After any update, clear your browser cache or hard-refresh to make sure the new version loads. You can verify the loaded version by opening your browser's developer console — the card logs its version on startup.
