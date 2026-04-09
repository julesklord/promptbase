# Architecture Documentation - Promptbase

## Overview

This document describes the technical architecture and data flow of the Promptbase repository. It provides a roadmap for developers wishing to understand how the zero-backend, JSON-driven system operates.

## Core Concepts

Promptbase is built on three architectural pillars:

1. **Zero-Backend Persistence**: All data resides in a static `prompts.json` file.
2. **Modular ESM Architecture**: Logic is split into specialized ES modules to ensure separation of concerns.
3. **Event-Driven UI**: State changes trigger custom DOM events that notify the rendering layer.

## Architecture & Flow

### Logic Flow Diagram

```text
   +----------------+
   |  prompts.json  | (Static Data Source)
   +-------+--------+
           |
           v
   +-------+--------+
   |     api.js     | (Fetch, HTTP Handler, 
   | (Validation)   |  Schema Guard)
   +-------+--------+
           | 
           | [Trigger: dataLoaded Event]
           v
   +-------+--------+      +----------------+
   |    state.js    | <----+     app.js     | (Main Orchestrator,
   | (Global State) |      | (UI Listeners) |  Modal & IO Control)
   +-------+--------+      +-------+--------+
           |                       ^
           | [Trigger: stateChange]| [User Input]
           v                       |
   +-------+--------+      +-------+--------+
   |   renderer.js  | <----+  index.html    | (Entry Point,
   | (DOM Builder)  |      |   (DOM Tree)   |  Skeleton Loaders)
   +----------------+      +----------------+
```

### Module Responsibilities

| Module | Responsibility | Key Export(s) |
| --- | --- | --- |
| `api.js` | Fetching data and verifying schema integrity. | `loadPrompts()` |
| `state.js` | Managing active filters, search queries, and prompt subsets. | `state`, `applyFilters()` |
| `renderer.js` | Pure UI generation from state. Handles cards, stats, and modals. | `renderGrid()`, `buildStats()` |
| `utils.js` | Reusable helpers: text escaping, toasts, and animations. | `escHtml()`, `showToast()` |
| `app.js` | Binds DOM listeners and coordinates cross-module lifecycle. | (Entry point) |

## Design Decisions

### Why ESM over Bundlers?

We chose native ES Modules (`type="module"`) to minimize build-time complexity. As a FOSS community project, removing the need for Webpack/Vite reduces the barrier to entry for new contributors.

### The stateChange Event

Instead of direct coupling between `state.js` and `renderer.js`, we use `window.dispatchEvent(new CustomEvent('stateChange'))`. This allows multiple UI components to listen for data updates independently without adding complexity to the core logic.

## Maintenance Notes

- **Dependencies**: browser-sync (Dev), Playwright (Test).
- **Version**: Native JS (ES2022+ recommended).

---
Last updated: 2026-04-09
Maintainer: Jules Martins (@julesklord)
