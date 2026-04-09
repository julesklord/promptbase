# Contributing to PROMPTBASE

PROMPTBASE is community-driven. Our goal is to maintain a high-quality, verified library of prompts for technical workflows.

## Quick Start
1. Fork the repository.
2. [Generate your JSON](https://julesklord.github.io/promptbase) using the website's submission modal.
3. Paste the entry into `prompts.json`.
4. Open a PR.

## Resource Directory
Before contributing, please review the following technical standards:

| Resource | Description |
|---|---|
| [Governance](/g:/DEVELOPMENT/promptbase/docs/GOVERNANCE.md) | Who approves PRs and the review process. |
| [Prompt Schema](/g:/DEVELOPMENT/promptbase/docs/API_SCHEMA.md) | Detailed JSON field definitions and validation. |
| [Testing Guide](/g:/DEVELOPMENT/promptbase/docs/TESTING.md) | How to run Playwright tests before submitting. |
| [Architecture](/g:/DEVELOPMENT/promptbase/docs/ARCHITECTURE.md) | Detailed technical overview of the ESM system. |

## Submission Guidelines

### 1. Automation First
Use the **+ Submit Prompt** form on the main site. It automatically handles ID generation and formatting according to our current schema.

### 2. Validation & Testing
We use Playwright for E2E validation. Before opening a PR, ensure that your additions don't break the rendering grid:
```bash
npx playwright test
```

### 3. Safety & Moderate Use
We prioritize prompts that are:
- **Resilient**: Handle errors and edge cases.
- **Ethical**: Avoid generating harmful or illegal content.
- **Safe**: Do not encourage insecure coding practices (e.g., hardcoded credentials).

## Review Process
All submissions are reviewed by **Jules Martins** (@julesklord). Expect feedback or a request for changes if the prompt is too generic or lacks clear `[PLACEHOLDERS]`.

---
Last updated: 2026-04-09
Maintainer: Jules Martins (@julesklord)
