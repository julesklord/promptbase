<div align="center">
  <img src="docs/logo_promptbase.png" alt="PROMPTBASE Logo" width="100%" />
  <h1>PROMPTBASE</h1>
</div>

![Version](https://img.shields.io/badge/version-0.2.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Build](https://img.shields.io/github/actions/workflow/status/julesklord/promptbase/playwright.yml?branch=main)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)
![GitHub pages](https://img.shields.io/badge/GitHub%20Pages-deployed-success)

> **The community-driven LLM prompt library for builders.**

Promptbase is a production-grade collection of technical prompts optimized for real-world engineering workflows. From agentic logic and DAW automation to WSL2 networking and AI safety guardrails, we curate prompts that work where it matters.

**🌐 Explore the library:** [https://julesklord.github.io/promptbase/](https://julesklord.github.io/promptbase/)

## 🚀 Quick Start

1. **Clone & Install**
   ```bash
   git clone https://github.com/julesklord/promptbase.git
   cd promptbase
   npm install
   ```
2. **Launch Dev Server**
   ```bash
   npm start
   ```
3. **Explore**
   Navigate to `http://localhost:5500` to browse the library.

## 📚 Technical Documentation

We maintain a distributed documentation suite following the `/make-doc` standard for maximum clarity and maintainability.

| Document                                                           | Description                                                      |
| ------------------------------------------------------------------ | ---------------------------------------------------------------- |
| [🏗️ Architecture](/g:/DEVELOPMENT/promptbase/docs/ARCHITECTURE.md) | Technical deep-dive into the modular ESM and event-driven state. |
| [📋 API & Schema](/g:/DEVELOPMENT/promptbase/docs/API_SCHEMA.md)   | Definition of `prompts.json` and internal module interfaces.     |
| [🧪 Testing](/g:/DEVELOPMENT/promptbase/docs/TESTING.md)           | E2E validation strategy using Playwright.                        |
| [⚖️ Governance](/g:/DEVELOPMENT/promptbase/docs/GOVERNANCE.md)     | Approval authority and contribution policies.                    |
| [🤝 Contributing](/g:/DEVELOPMENT/promptbase/CONTRIBUTING.md)      | How to submit your own prompts to the community.                 |

## 🛠️ Technology Stack

- **Frontend**: Vanilla HTML/JS (ES6+ Modules).
- **Styling**: Zero-framework CSS (Custom Properties, Flexbox, Grid).
- **Data**: Static JSON persistence.
- **Testing**: Playwright.
- **DevOps**: GitHub Pages (hosting) + browser-sync.

## ⚖️ License

Promptbase is Open Source and licensed under the [MIT License](LICENSE).

---

Built with 🔴 by **Jules Martins** and the dev community.
