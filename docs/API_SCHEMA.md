# API & Schema Reference - Promptbase

## Overview

This document defines the data structures and internal interfaces used by Promptbase. It serves as a contract for both data contributors and module developers.

## Core Concepts

The "API" of Promptbase consists of a sharded JSON database managed via a central manifest (`data/manifest.json`) and the exported members of the core ES modules.

## Resource: Sharded Database

Instead of a single heavy file, the database is split into category shards located in `data/prompts/`.

### Manifest (`data/manifest.json`)
An array of strings listing all active shard filenames (e.g., `["backend-development.json", "security-auth.json", ...]`).

### Shards (`data/prompts/*.json`)
Each shard is an array of objects belonging to that specific category.

### Object Schema

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `string` | Yes | Unique slug. Pattern: `category-title-random`. |
| `category` | `string` | Yes | Functional group (e.g., "Backend Development"). |
| `tag` | `string` | Yes | Inline categorization (e.g., "node · auth"). |
| `title` | `string` | Yes | Human-readable name. |
| `description`| `string` | Yes | One-sentence summary. |
| `body` | `string` | Yes | The actual prompt text. Use `[PLACEHOLDERS]`. |
| `author` | `string` | No | GitHub username or "community". |
| `votes` | `number` | Yes | Initial vote count (usually 0). |
| `model` | `string[]` | Yes | Supported models: `["claude", "gemini", "gpt", "ollama"]`. |
| `usecase` | `string[]` | Yes | Searchable specialized tags. |
| `difficulty` | `string` | Yes | Enum: `beginner`, `intermediate`, `advanced`. |

### Example

```json
{
  "id": "devops-wsl-024",
  "category": "DevOps & Infrastructure",
  "tag": "wsl2 · network",
  "title": "WSL2 Connectivity Fix",
  "description": "Configures internet bridge behind corporate VPNs.",
  "body": "Set networkingMode=mirrored in .wslconfig for [PROJECT]...",
  "author": "jules",
  "votes": 10,
  "model": ["gpt", "claude"],
  "usecase": ["wsl2", "proxy"],
  "difficulty": "advanced"
}
```

## Internal Module Interface

### api.js

| Method | Params | Returns | Description |
| --- | --- | --- | --- |
| `loadPrompts()` | N/A | `Promise<void>` | Fetches data, validates schema, and dispatches `dataLoaded`. |

### state.js

| Property | Type | Description |
|---|---|---|
| `state` | `Object` | Global state object containing `allPrompts`, `filtered`, and active filters. |

| Method | Params | Returns | Description |
| --- | --- | --- | --- |
| `applyFilters()` | N/A | `void` | Mutates `state.filtered` based on current UI inputs and dispatches `stateChange`. |

## Error Conditions

- **Missing Required Field**: Logged as a `warn` in the console; the prompt is skipped from the render grid.
- **HTTP 404/500**: Triggers an empty state in the UI via the `dataLoaded` cleanup logic.

---
Last updated: 2026-04-09
Maintainer: Jules Martins (@julesklord)
