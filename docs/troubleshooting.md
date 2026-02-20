# Troubleshooting

## Card Not Showing Up

**Symptom:** You added the YAML but see "Custom element doesn't exist: temperature-bar-card" or a blank space.

**Fixes:**

1. **Resource not added** — The card JS file must be registered as a Lovelace resource. Go to **Settings > Dashboards > Resources** and confirm `/local/temperature-bar-card.js` is listed with type **JavaScript Module**. If you installed via HACS, this is usually automatic.

2. **Wrong resource type** — The type must be `module`, not `js`. If you added it via YAML, check that you have `type: module`.

3. **Browser cache** — Hard-refresh your browser with `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac). This is the most common issue after installing or updating.

4. **File not in the right location** — For manual installs, verify the file exists at `/config/www/temperature-bar-card.js`. You can check via the **File Editor** add-on or SSH.

5. **Restart needed** — After adding a new resource, restart Home Assistant and refresh your browser.

## Entity Shows "N/A"

**Symptom:** The bar appears but shows "N/A" instead of a temperature.

**Causes:**

- **Entity unavailable** — The sensor may be offline or disconnected. Check the entity in **Developer Tools > States** to see its current state.
- **Wrong entity ID** — Double-check the entity ID for typos. Entity IDs are case-sensitive and use underscores, not spaces (e.g., `sensor.living_room_temperature`).
- **Non-numeric state** — The card expects a numeric temperature value. If the entity's state is a string like "unknown" or "unavailable", it will show N/A.

## Temperatures Look Wrong

**Symptom:** The values displayed don't match what you expect.

**Causes:**

- **Unit mismatch** — The card defaults to Fahrenheit. If your sensors report in Celsius, set `unit: celsius` in your card config. The card will also auto-convert if the sensor's `unit_of_measurement` attribute indicates a different unit than your display unit.

- **Conversion not happening** — Auto-conversion relies on the sensor's `unit_of_measurement` attribute containing `C` or `F`. Check your entity in **Developer Tools > States** and look at its attributes. Some integrations may not set this attribute.

## Colors Don't Match Expectations

**Symptom:** A temperature shows a color you didn't expect.

**Check these:**

1. **Threshold order** — Thresholds must be in **descending** order (highest first). The card checks from highest to lowest and uses the first threshold the temperature is greater than or equal to.

   Correct: `[95, 85, 75, 65, 55, 45, 32]`
   Wrong: `[32, 45, 55, 65, 75, 85, 95]`

2. **Color count** — You need exactly **one more color than thresholds**. If you have 4 thresholds, you need 5 colors. The extra color is for temperatures below the lowest threshold.

   ```yaml
   # 3 thresholds = 4 colors
   temperature_thresholds: [80, 65, 50]
   temperature_colors:
     - "red"      # >= 80
     - "orange"   # 65 to 79
     - "green"    # 50 to 64
     - "blue"     # < 50
   ```

3. **Threshold values don't match your unit** — If you set `unit: celsius` but use Fahrenheit threshold values (like `[95, 85, 75]`), the colors will be wrong. Make sure thresholds match your display unit.

## Bar Is Empty or Completely Full

**Symptom:** The colored bar fills 0% or 100% of the space regardless of temperature.

**Causes:**

- **`min_temp` / `max_temp` range too narrow** — If the actual temperature is outside the `min_temp`–`max_temp` range, the bar clamps to 0% or 100%. Widen the range to cover your expected temperatures.

- **Wrong unit for range** — If you set `unit: celsius` but left `min_temp: 0` and `max_temp: 120` (the Fahrenheit defaults), most Celsius readings will appear as tiny bars. Set appropriate values for your unit, or omit `min_temp`/`max_temp` to use the automatic defaults.

- **Defaults are fine** — If you don't set `min_temp`/`max_temp`, the card uses `0–120°F` or `-20–50°C` depending on your `unit` setting.

## Checking the Version

Open your browser's developer console to verify which version is loaded:

1. Right-click anywhere on the page and select **Inspect** (or press `F12`)
2. Go to the **Console** tab
3. Look for a log entry like:

   ```
   TEMPERATURE-BAR-CARD  v1.1.0
   ```

If you don't see this, the card JS file is not loading. See [Card Not Showing Up](#card-not-showing-up).

## Filing an Issue

If you've tried the steps above and the problem persists:

1. Go to [github.com/acato/temperature-bar-card/issues](https://github.com/acato/temperature-bar-card/issues)
2. Click **New Issue**
3. Include:
   - Your card YAML configuration (remove any sensitive entity IDs if needed)
   - The card version (from the browser console)
   - Your Home Assistant version
   - What you expected vs. what happened
   - Any errors from the browser console
