import { state, applyFilters } from "./state.js";
import { loadPrompts } from "./api.js";
import { 
  buildStats, 
  buildCategories, 
  buildTagCloud, 
  buildDiffCounts, 
  renderGrid 
} from "./renderer.js";
import { showToast } from "./utils.js";

// Event Listeners for State Changes
window.addEventListener("dataLoaded", () => {
  init();
});

window.addEventListener("stateChange", () => {
  renderGrid();
});

function init() {
  buildStats();
  buildCategories();
  buildTagCloud();
  buildDiffCounts();
  applyFilters();

  // Deep linking auto-open
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (id) {
    setTimeout(() => {
      const btn = document.getElementById(`fullview-${id}`);
      if (btn) btn.click();
    }, 100);
  }
}

// UI Event Listeners
document.getElementById("search")?.addEventListener("input", (e) => {
  const target = e.target;
  state.searchQuery = target instanceof HTMLInputElement ? target.value.trim() : "";
  const clearBtn = document.getElementById("clearSearch");
  if (clearBtn) clearBtn.style.display = state.searchQuery ? "block" : "none";
  applyFilters();
});

document.getElementById("clearSearch")?.addEventListener("click", () => {
  const searchInput = document.getElementById("search");
  if (searchInput instanceof HTMLInputElement) {
    searchInput.value = "";
    state.searchQuery = "";
    const clearBtn = document.getElementById("clearSearch");
    if (clearBtn) clearBtn.style.display = "none";
    applyFilters();
    searchInput.focus();
  }
});

document.getElementById("sortSelect")?.addEventListener("change", applyFilters);

// Modals
const submitOverlay = document.getElementById("submitModal");
const fullViewOverlay = document.getElementById("fullViewModal");

document.getElementById("openModal")?.addEventListener("click", () => submitOverlay?.classList.add("open"));
document.getElementById("openModal2")?.addEventListener("click", () => submitOverlay?.classList.add("open"));
document.getElementById("closeSubmitModal")?.addEventListener("click", () => submitOverlay?.classList.remove("open"));

window.addEventListener("click", (e) => {
  if (e.target === submitOverlay) submitOverlay?.classList.remove("open");
  if (e.target === fullViewOverlay) fullViewOverlay?.classList.remove("open");
});

// Scroll to top
window.addEventListener("scroll", () => {
  const btn = document.getElementById("backToTop");
  if (!btn) return;
  if (window.scrollY > 400) {
    btn.style.display = "flex";
  } else {
    btn.style.display = "none";
  }
});

document.getElementById("backToTop")?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Theme Toggle
const themeToggle = document.getElementById("themeToggle");
const currentTheme = localStorage.getItem("theme");

if (currentTheme === "light") {
  document.documentElement.setAttribute("data-theme", "light");
  if (themeToggle) themeToggle.innerText = "☾";
}

themeToggle?.addEventListener("click", () => {
  let theme = document.documentElement.getAttribute("data-theme");
  if (theme === "light") {
    document.documentElement.removeAttribute("data-theme");
    localStorage.setItem("theme", "dark");
    themeToggle.innerText = "☀";
  } else {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
    themeToggle.innerText = "☾";
  }
});

// JSON Generation Logic
function generateJSON() {
  const title = document.getElementById("f-title").value.trim();
  const tag = document.getElementById("f-tag").value.trim();
  const cat = document.getElementById("f-cat").value;
  const diff = document.getElementById("f-diff").value;
  const desc = document.getElementById("f-desc").value.trim();
  const body = document.getElementById("f-body").value.trim();
  const author = document.getElementById("f-author").value.trim() || "anonymous";
  const usecases = document
    .getElementById("f-usecase")
    .value.split(",")
    .map((s) => s.trim())
    .filter(Boolean);
    
  const models = ["claude", "gemini", "gpt", "ollama"].filter((m) => document.getElementById("m-" + m).checked);

  const catMap = {
    "Backend Development": "backend",
    "Frontend Development": "frontend",
    "Database & Data": "database",
    "DevOps & Infrastructure": "devops",
    "Security & Auth": "security",
    "Testing & QA": "testing",
    "System Design": "system",
    "AI/ML & LLM": "ai",
    "AI Agents & MCP": "agents",
    Other: "other",
  };
  
  const prefix = catMap[cat] || cat.split(" ")[0].toLowerCase().replace(/[^a-z]/g, "");
  const id = (prefix + "-" + title.toLowerCase().replace(/[^a-z]/g, "-")).replace(/-+/g, "-").slice(0, 40) + "-" + Math.floor(Math.random() * 1000).toString().padStart(3, "0");

  if (!title || !tag || !cat || !diff || !body) {
    showToast("Fill required fields first");
    return;
  }

  const entry = { id, category: cat, tag, title, description: desc, body, author, votes: 0, model: models, usecase: usecases, difficulty: diff };
  const outputEl = document.getElementById("f-output");
  if (outputEl instanceof HTMLTextAreaElement) {
    outputEl.value = JSON.stringify(entry, null, 2);
  }
}

document.getElementById("generateJson")?.addEventListener("click", generateJSON);
document.getElementById("copyJson")?.addEventListener("click", () => {
  const outputEl = document.getElementById("f-output");
  if (outputEl instanceof HTMLTextAreaElement) {
    const val = outputEl.value;
    if (!val) generateJSON();
    navigator.clipboard.writeText(outputEl.value);
    showToast("JSON copied — paste it in the correct file in data/prompts/");
  }
});

// Bootstrap
loadPrompts();
