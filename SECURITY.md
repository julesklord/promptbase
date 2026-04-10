Quick Start
Fork the repository.
Generate your JSON using the website's submission modal.
Paste the entry into the corresponding category shard within data/prompts/ (e.g., security-auth.json).
(Optional) If it's a new category, add the filename to data/manifest.json.
Open a PR.
Resource Directory
Before contributing, please review the following technical standards:

Resource	Description
Governance	Who approves PRs and the review process.
Prompt Schema	Detailed JSON field definitions and validation.
Testing Guide	How to run Playwright tests before submitting.
Architecture	Detailed technical overview of the ESM system.
Submission Guidelines
1. Automation First
Use the + Submit Prompt form on the main site. It automatically handles ID generation and formatting according to our current schema.

2. Validation & Testing
We use Playwright for E2E validation. Before opening a PR, ensure that your additions don't break the rendering grid:

npx playwright test
3. Safety & Moderate Use
We prioritize prompts that are:

Resilient: Handle errors and edge cases.
Ethical: Avoid generating harmful or illegal content.
Safe: Do not encourage insecure coding practices (e.g., hardcoded credentials).
Review Process
All submissions are reviewed by Jules Martins (@julesklord). Expect feedback or a request for changes if the prompt is too generic or lacks clear [PLACEHOLDERS].
