# Contributing to Promptbase

First off, thank you for considering contributing to Promptbase! It's people like you who make this library a valuable resource for the builder community.

## 🌈 How Can I Contribute?

### Adding New Prompts
The easiest way to contribute is by adding your high-quality prompts to our library.

1.  **Run the project locally**:
    ```bash
    npm install
    npm start
    ```
2.  **Use the built-in generator**:
    - Open `http://localhost:5500`.
    - Click the **"Submit"** button (or "Add Prompt").
    - Fill out the form with your prompt's details (Title, Tag, Category, Body, etc.).
    - Click **"Generate JSON"**.
3.  **Submit your data**:
    - Copy the generated JSON object.
    - Find the relevant category file in `data/prompts/` (e.g., `backend-development.json`).
    - Paste your object into the JSON array. **Ensure the JSON remains valid.**
4.  **Create a Pull Request**:
    - Push your changes to a fork and submit a PR.

### Bug Reports & Feature Requests
- Use GitHub Issues to report bugs or suggest new features.
- Provide as much detail as possible, including steps to reproduce for bugs.

## 🛠️ Development Setup

### Requirements
- Node.js (v18+)
- npm

### Installation
```bash
git clone https://github.com/your-username/promptbase.git
cd promptbase
npm install
```

### Local Development
We use `browser-sync` for a live-reloading development server:
```bash
npm start
```

### Quality Control
Before submitting a PR, please ensure your code passes our quality checks:

```bash
# Linting
npm run lint

# Formatting
npm run format

# Testing
npm test
```

## 📐 Project Standards

- **Vanilla First**: We avoid external frameworks. Keep logic in clean, modular ES6+ JavaScript.
- **CSS Custom Properties**: Use the tokens defined in `css/style.css` for any new styling.
- **Atomic Commits**: Keep your commits focused and descriptive.
- **Schema Compliance**: All prompts MUST follow the schema defined in `docs/API_SCHEMA.md`.

## 📜 Code of Conduct
By participating in this project, you agree to abide by our Code of Conduct (be kind, be professional, and stay focused on building great tools).

---

Questions? Feel free to open an issue or reach out to the maintainers!
