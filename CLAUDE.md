# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Temperature Bar Card is a custom Home Assistant Lovelace card that displays temperature sensor entities with gradient color backgrounds. It's distributed via HACS (Home Assistant Community Store).

## Architecture

- **Main component**: `temperature-bar-card.js` - A single JavaScript file that defines the custom element for Home Assistant's Lovelace UI
- **HACS integration**: `hacs.json` configures HACS distribution with `content_in_root: true` (JS file lives in repo root)
- **Releases**: GitHub Actions workflow (`.github/workflows/release.yml`) creates releases on version tags (`v*`)

## Key Configuration Options

The card supports:
- `unit`: `fahrenheit` (default) or `celsius` with automatic conversion
- `temperature_thresholds` / `temperature_colors`: Arrays defining color gradient breakpoints
- `min_temp` / `max_temp`: Temperature range bounds
- `show_icon` / `icon`: Optional MDI icon display