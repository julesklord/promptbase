
  # 🔐 PROMPTVAULT
  **Your Personal & Private Network-Accessible Prompt Library**

  [![Version](https://img.shields.io/badge/version-1.0.0-blue.svg?style=for-the-badge)](https://github.com/julesklord/promptbase)
  [![License](https://img.shields.io/badge/license-MIT-green.svg?style=for-the-badge)](LICENSE)
  [![Self-Hosted](https://img.shields.io/badge/deployment-self--hosted-orange.svg?style=for-the-badge)](#)
</div>

---

## 🌟 Overview

**PromptVault** is a specialized repository for high-signal LLM prompts. It is designed to be self-hosted on your local machine and served across your home or office network, providing a beautiful and searchable interface for your entire prompt collection.

> **Why PromptVault?** Stop losing your best engineering prompts in Slack threads or random `.txt` files. Keep them in a structured, version-controlled vault that you can access from your workstation, laptop, or mobile device.

---

## ✨ Key Features

| Feature | Description |
| :--- | :--- |
| 🏠 **LAN Exposure** | Access your vault via `http://<local-ip>:5500` from any device on your Wi-Fi. |
| 🧩 **Sharded Data** | Organized JSON shards for high-speed loading and easy manual editing. |
| 🌓 **Adaptive UI** | Clean, developer-focused interface with Light/Dark mode support. |
| 🔍 **Pro Search** | Filter by model (GPT, Claude, Gemini, Ollama), difficulty, or technical tags. |
| 🚀 **Zero Backend** | Lightweight Vanilla JS/HTML/CSS architecture with zero dependency bloat. |

---

## 🚀 Getting Started

### 1. Installation
Clone the repository and install the dev dependencies:
```bash
git clone https://github.com/julesklord/promptbase.git vault
cd vault
npm install
```

### 2. Launch the Vault
Start the local server with network exposure enabled:
```bash
npm start
```

> [!TIP]
> Check your terminal output for the **"External"** URL. This is the address you should use to access the vault from your phone or tablet!

---

## 📥 Adding New Prompts

PromptVault uses a **Static-First** approach. Adding prompts is a simple 3-step process:

1.  **Generate**: Open the UI and click the **"+ New Prompt"** button. Fill out the details.
2.  **Copy**: Click **"Generate JSON"** and then **"Copy JSON"**.
3.  **Paste**: Open the corresponding file in `data/prompts/` (e.g., `ai-agents-mcp.json`) and paste your new object into the array.

*Refresh your browser, and your vault is updated!*

---

## 🛠️ Technical Specs

- **Core**: Vanilla ES6+ Modules
- **Dev Server**: Browser-sync (Port 5500, Host 0.0.0.0)
- **Data Model**: Categorized JSON Shards
- **Styling**: Modern CSS (Grid & Flexbox)
- **Quality**: ESLint, Prettier, Jest, Playwright

---

## ⚖️ License

PromptVault is Open Source and licensed under the [MIT License](LICENSE).

<div align="center">
  <br />
  <sub>Built for builders who need their tools everywhere.</sub>
</div>
