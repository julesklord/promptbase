# Gemini CLI Rules

Specific instructions for the **Gemini CLI** agent in the Promptbase repository.

## Working Context
- Project follows the Jules Dev Standard.
- Frontend is pure Vanilla HTML/JS/CSS.
- Core data resides in `data/prompts.json`.
- Testing is handled by Playwright.

## Workflow
1. Research -> 2. Strategy -> 3. Execution (Plan-Act-Validate).
2. Validate UI changes with `npm test`.
3. Adhere to the `/make-doc` standard for internal documentation.

## Constraints
- Do not introduce external libraries or frameworks for the UI.
- Maintain consistent schema validation for all prompts.
- Always use relative paths for internal documentation links.
- Update `docs/MEMORY.md` after every feature addition or prompt update.
- Ensure all new features are documented in the Wiki.
- Consult `docs/AGENT.md` for specific operational SOPs.