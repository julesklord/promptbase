# Contributing to PROMPTBASE

PROMPTBASE is community-driven. Prompts live in `prompts.json`. No backend, no database — just a JSON file and GitHub PRs.

## How to submit a prompt

### Option A — Use the website (easiest)
1. Go to [promptbase](https://julesklord.github.io/promptbase)
2. Click **+ Submit Prompt**
3. Fill the form → click **Generate JSON**
4. Copy the JSON → click **Open PR on GitHub**
5. Paste your entry inside the `[...]` array in `prompts.json`
6. Open the PR with title: `feat: add prompt — Your Prompt Title`

### Option B — Direct PR
1. Fork the repo
2. Edit `prompts.json`, add your entry following the schema below
3. Open a PR

## Prompt schema

```json
{
  "id": "category-title-XXXX",
  "category": "Dev / Agents",
  "tag": "agent · init",
  "title": "Descriptive title",
  "description": "One sentence describing what this prompt does",
  "body": "The full prompt text. Use [PLACEHOLDERS] for variables.",
  "author": "your-github-username",
  "votes": 0,
  "model": ["claude", "gemini", "gpt"],
  "usecase": ["agents", "coding"],
  "difficulty": "beginner | intermediate | advanced"
}
```

## Guidelines

- **Use `[PLACEHOLDERS]`** for anything that varies between uses
- **Be specific** — prompts that work in real workflows, not academic examples
- **Test your prompt** before submitting
- **One prompt per PR** keeps reviews clean
- Difficulty: `beginner` (no setup needed), `intermediate` (needs context), `advanced` (complex setup/chaining)

## Categories

| Category | Description |
|---|---|
| Dev / Agents | Autonomous agent design, code review, scaffolding |
| MCP / Integrations | MCP servers, clients, protocol debugging |
| Audio / REAPER | ReaScript, OSC, DAW automation, LLM↔audio |
| askgem / LLM | Gemini API, prompt optimization, agent CLI tools |
| System / WSL2 | Arch Linux, WSL2, Docker Engine, networking |
| FMG / Business | Music industry, content strategy, beat metadata |
| Other | Anything that doesn't fit above |

## What makes a good prompt

- Has clear `[PLACEHOLDERS]` so it's reusable
- Works without needing to explain what LLM you're using (or specifies)
- Handles edge cases (errors, ambiguity) in the prompt itself
- Produces parseable/actionable output

## License

All prompts submitted are MIT licensed. By submitting you agree to this.
