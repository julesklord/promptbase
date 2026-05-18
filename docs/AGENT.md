# Agent SOP: Promptbase Operations

## Operational Mandates
- **Single Source of Truth:** `prompts.json` in the `data/` directory is the core dataset.
- **Frontend Purity:** Use Vanilla JS (ESM) and CSS Custom Properties. No external frameworks.
- **Testing:** All UI changes must be verified with Playwright tests in `tests/`.
- **Schema Parity:** Ensure any change to the prompt structure is reflected in `docs/wiki/API_SCHEMA.md`.

## Core Workflows
1. **Adding a Prompt:**
   - Update `data/prompts.json` following the established schema.
   - Run `npm test` to ensure the dashboard still renders correctly.
2. **Modifying the UI:**
   - Implement changes in `index.html`, `css/`, or `js/`.
   - Update E2E tests in `tests/` if DOM structure changes significantly.
3. **Documentation Updates:**
   - Update `CHANGELOG.md` for setiap release.
   - Maintain the wiki in `docs/wiki/`.
   - Keep `docs/MEMORY.md` updated with the latest project status.

## Documentation SOP
- Use absolute relative links within the repo (no machine-specific paths).
- Update the Wiki Index after adding new technical documents.

## Related Docs
- [Project Identity](./IDENTITY.md)
- [Project Soul](./SOUL.md)
- [Wiki Index](./wiki/index.md)
- [API Schema](./wiki/API_SCHEMA.md)