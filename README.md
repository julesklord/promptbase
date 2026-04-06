# PROMPTBASE

> Community-driven LLM prompt library for builders — agents, MCP, DAW automation, WSL2, and more.

**[→ Open the library](https://julesklord.github.io/promptbase)**

## What is this?

A community-maintained, zero-backend prompt library. Prompts live in `prompts.json`. The site is pure HTML/JS, hosted on GitHub Pages.

No login. No database. Just a JSON file and GitHub PRs.

## Stack

- `index.html` — the entire frontend (vanilla HTML/CSS/JS)
- `prompts.json` — the database
- `CONTRIBUTING.md` — how to submit prompts
- GitHub Pages — hosting

## Quick contribute

1. Edit `prompts.json` directly on GitHub
2. Add your prompt following the schema in [CONTRIBUTING.md](CONTRIBUTING.md)
3. Open a PR

Or use the [submit form](https://julesklord.github.io/promptbase) on the site.

## Run locally

```bash
git clone https://github.com/julesklord/promptbase
cd promptbase
python -m http.server 8080
# open http://localhost:8080
```

## License

MIT
