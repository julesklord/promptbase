const PROMPTS_URL = "prompts.json";
let allPrompts = [];
let filtered = [];
let activeCategory = "all";
let activeDiff = "all";
let activeModel = "all";
let activeTag = null;
let searchQuery = "";
let votes = JSON.parse(localStorage.getItem("pb-votes") || "{}");

async function loadPrompts() {
  renderSkeletons();
  try {
    const r = await fetch(PROMPTS_URL);
    allPrompts = await r.json();
    setTimeout(() => init(), 300);
  } catch (e) {
    console.error("Error loading prompts:", e);
    allPrompts = [];
    init();
  }
}

function renderSkeletons() {
  const grid = document.getElementById("promptGrid");
  grid.innerHTML = "";
  for (let i = 0; i < 6; i++) {
    grid.innerHTML += `
      <div class="skeleton-card">
        <div class="skeleton-item" style="height: 18px; width: 40%; margin-bottom: 12px;"></div>
        <div class="skeleton-item" style="height: 24px; width: 80%; margin-bottom: 12px;"></div>
        <div class="skeleton-item" style="height: 14px; width: 100%; margin-bottom: 6px;"></div>
        <div class="skeleton-item" style="height: 14px; width: 90%; margin-bottom: 20px;"></div>
        <div class="skeleton-item" style="height: 60px; width: 100%; margin-bottom: 14px;"></div>
      </div>
    `;
  }
}

function init() {
  buildStats();
  buildCategories();
  buildTagCloud();
  buildDiffCounts();
  applyFilters();
}

function buildStats() {
  const authors = new Set(allPrompts.map((p) => p.author)).size;
  const totalVotes = allPrompts.reduce((a, p) => a + (p.votes || 0), 0);
  const cats = new Set(allPrompts.map((p) => p.category)).size;
  animateNum("statPrompts", allPrompts.length);
  animateNum("statCats", cats);
  animateNum("statAuthors", authors);
  animateNum("statVotes", totalVotes);
}

function animateNum(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  let cur = 0;
  const step = Math.ceil(target / 30);
  const t = setInterval(() => {
    cur = Math.min(cur + step, target);
    el.textContent = cur;
    if (cur >= target) clearInterval(t);
  }, 30);
}

function buildCategories() {
  const tabs = document.getElementById("filterTabs");
  const cats = ["all", ...new Set(allPrompts.map((p) => p.category))];
  tabs.innerHTML = "";
  cats.forEach((cat) => {
    const btn = document.createElement("button");
    btn.className = "filter-tab" + (cat === "all" ? " active" : "");
    btn.dataset.cat = cat;
    btn.textContent = cat === "all" ? "All" : cat;
    btn.onclick = () => {
      document.querySelectorAll(".filter-tab").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeCategory = cat;
      applyFilters();
    };
    tabs.appendChild(btn);
  });
}

function buildTagCloud() {
  const tags = {};
  allPrompts.forEach((p) =>
    (p.usecase || []).forEach((t) => {
      tags[t] = (tags[t] || 0) + 1;
    })
  );
  const cloud = document.getElementById("tagCloud");
  cloud.innerHTML = "";
  Object.keys(tags)
    .sort()
    .forEach((tag) => {
      const btn = document.createElement("button");
      btn.className = "tag-pill";
      btn.innerHTML = `${tag} <span style="font-size:8px;opacity:0.4;margin-left:4px;">${tags[tag]}</span>`;
      btn.onclick = () => {
        if (activeTag === tag) {
          activeTag = null;
          btn.classList.remove("active");
        } else {
          document.querySelectorAll(".filter-tab").forEach((b) => b.classList.remove("active"));
          document.querySelectorAll(".tag-pill").forEach((b) => b.classList.remove("active"));
          activeTag = tag;
          btn.classList.add("active");
        }
        applyFilters();
      };
      cloud.appendChild(btn);
    });
}

function buildDiffCounts() {
  const counts = { beginner: 0, intermediate: 0, advanced: 0 };
  allPrompts.forEach((p) => {
    if (counts[p.difficulty] !== undefined) counts[p.difficulty]++;
  });
  document.getElementById("countAll").textContent = allPrompts.length;
  document.getElementById("countBeginner").textContent = counts.beginner;
  document.getElementById("countIntermediate").textContent = counts.intermediate;
  document.getElementById("countAdvanced").textContent = counts.advanced;

  document.querySelectorAll("[data-diff]").forEach((btn) => {
    btn.onclick = () => {
      document.querySelectorAll("[data-diff]").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeDiff = btn.dataset.diff;
      applyFilters();
    };
  });

  document.querySelectorAll("[data-model]").forEach((btn) => {
    btn.onclick = () => {
      document.querySelectorAll("[data-model]").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeModel = btn.dataset.model;
      applyFilters();
    };
  });
}

function applyFilters() {
  const sort = document.getElementById("sortSelect").value;
  filtered = allPrompts.filter((p) => {
    if (activeCategory !== "all" && p.category !== activeCategory) return false;
    if (activeDiff !== "all" && p.difficulty !== activeDiff) return false;
    if (activeModel !== "all" && !(p.model || []).includes(activeModel)) return false;
    if (activeTag && !(p.usecase || []).includes(activeTag)) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (p.title + p.tag + p.description + (p.usecase || []).join(" ") + p.body).toLowerCase().includes(q);
    }
    return true;
  });

  if (sort === "votes") filtered.sort((a, b) => (b.votes || 0) - (a.votes || 0));
  else if (sort === "alpha") filtered.sort((a, b) => a.title.localeCompare(b.title));

  renderGrid();
}

function renderGrid() {
  const grid = document.getElementById("promptGrid");
  document.getElementById("gridCount").textContent = `${filtered.length} prompt${filtered.length !== 1 ? "s" : ""}`;

  if (!filtered.length) {
    grid.innerHTML = `<div class="empty"><div class="empty-code">404</div>No prompts match your filters.<br>Be the first to submit one.</div>`;
    return;
  }

  grid.innerHTML = "";
  filtered.forEach((p, i) => {
    const card = document.createElement("div");
    card.className = "prompt-card";
    card.style.animationDelay = i * 30 + "ms";

    const voteCount = (p.votes || 0) + (votes[p.id] || 0);
    const isVoted = !!votes[p.id];
    const models = (p.model || []).map((m) => `<span class="model-badge model-${m}">${m}</span>`).join("");
    const diff = p.difficulty || "intermediate";

    card.innerHTML = `
      <div class="card-top">
        <span class="card-tag">${p.tag}</span>
        <span class="card-diff diff-${diff}">${diff}</span>
      </div>
      <div class="card-title">${p.title}</div>
      <div class="card-desc">${p.description}</div>
      <div class="card-body" id="body-${p.id}">${escHtml(p.body)}</div>
      <div style="display:flex;gap:6px;margin-bottom:12px;">
        <button class="expand-btn" id="expand-${p.id}" aria-label="Expand or collapse prompt">expand ↓</button>
        <button class="expand-btn" id="fullview-${p.id}" style="flex:1;text-align:center;" aria-label="View prompt in full screen">view fullscreen</button>
      </div>
      <div class="card-meta">
        <div class="card-models">${models}</div>
        <div class="card-actions">
          <button class="vote-btn ${isVoted ? "voted" : ""}" id="vote-${p.id}" aria-label="Vote for this prompt">▲ ${voteCount}</button>
          <button class="copy-btn" id="copy-${p.id}" aria-label="Copy prompt text">Copy</button>
        </div>
      </div>
      <div class="card-author">
        <div class="author-dot"></div>
        <span>${p.author || "anonymous"}</span>
        ${(p.usecase || [])
          .slice(0, 3)
          .map((t) => `<span style="color:var(--text3);font-size:9px;background:var(--bg3);padding:1px 5px;">${t}</span>`)
          .join("")}
      </div>
    `;

    card.querySelector(`#expand-${p.id}`).onclick = () => {
      const body = document.getElementById(`body-${p.id}`);
      const btn = card.querySelector(`#expand-${p.id}`);
      body.classList.toggle("card-body-full");
      btn.textContent = body.classList.contains("card-body-full") ? "collapse ↑" : "expand ↓";
    };

    card.querySelector(`#fullview-${p.id}`).onclick = () => {
      const modal = document.getElementById("fullViewModal");
      modal.innerHTML = `
        <div class="modal" style="max-width:800px;">
          <div class="modal-header">
            <div>
              <div class="modal-title">${p.title}</div>
              <div style="font-size:10px;color:var(--text3);margin-top:6px;">${p.tag} · ${p.category}</div>
            </div>
            <button class="modal-close" id="closeFullView">×</button>
          </div>
          <div class="modal-body">
            <div style="margin-bottom:1.5rem;padding:12px;background:var(--bg3);border-left:2px solid var(--red);">
              <div style="font-size:11px;color:var(--text2);">${p.description}</div>
            </div>
            <div style="margin-bottom:1.5rem;">
              <div style="font-size:9px;color:var(--text3);text-transform:uppercase;letter-spacing:0.12em;margin-bottom:8px;">Prompt Body</div>
              <div style="background:var(--bg);border:1px solid var(--border);padding:12px;font-size:11px;color:var(--text2);line-height:1.7;white-space:pre-wrap;max-height:400px;overflow-y:auto;">${escHtml(p.body)}</div>
            </div>
            <div style="display:flex;gap:1rem;flex-wrap:wrap;">
              <div style="flex:1;min-width:150px;">
                <div style="font-size:9px;color:var(--text3);text-transform:uppercase;margin-bottom:6px;">Models</div>
                <div style="display:flex;gap:4px;flex-wrap:wrap;">${models}</div>
              </div>
              <div style="flex:1;min-width:150px;">
                <div style="font-size:9px;color:var(--text3);text-transform:uppercase;margin-bottom:6px;">Use Cases</div>
                <div style="display:flex;gap:4px;flex-wrap:wrap;">
                  ${(p.usecase || []).map((t) => `<span style="font-size:10px;padding:2px 8px;background:var(--bg3);color:var(--text2);border:1px solid var(--border);">${t}</span>`).join("")}
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <div class="contribute-hint">Author: <strong>${p.author || "anonymous"}</strong> · Difficulty: <strong>${p.difficulty}</strong> · ID: <code style="color:var(--amber);font-size:10px;">${p.id}</code></div>
            <button class="btn-red" id="fullview-copy">Copy Prompt</button>
          </div>
        </div>
      `;
      modal.classList.add("open");
      
      document.getElementById("closeFullView").onclick = () => modal.classList.remove("open");
      document.getElementById("fullview-copy").onclick = () => {
        navigator.clipboard.writeText(p.body);
        showToast("Copied!");
        const btn = document.getElementById("fullview-copy");
        btn.textContent = "Copied!";
        setTimeout(() => (btn.textContent = "Copy Prompt"), 1500);
      };
    };

    card.querySelector(`#copy-${p.id}`).onclick = () => {
      navigator.clipboard.writeText(p.body);
      const btn = card.querySelector(`#copy-${p.id}`);
      btn.textContent = "Copied!";
      btn.classList.add("copied");
      showToast("Prompt copied to clipboard");
      setTimeout(() => {
        btn.textContent = "Copy";
        btn.classList.remove("copied");
      }, 2000);
    };

    card.querySelector(`#vote-${p.id}`).onclick = () => {
      if (!votes[p.id]) {
        votes[p.id] = 1;
        localStorage.setItem("pb-votes", JSON.stringify(votes));
        card.querySelector(`#vote-${p.id}`).classList.add("voted");
        card.querySelector(`#vote-${p.id}`).textContent = `▲ ${voteCount + 1}`;
        showToast("Vote registered — thanks!");
      }
    };

    grid.appendChild(card);
  });
}

function escHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function showToast(msg) {
  const t = document.getElementById("toast");
  document.getElementById("toastMsg").textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2500);
}

// Event Listeners
document.getElementById("search").addEventListener("input", (e) => {
  searchQuery = e.target.value.trim();
  document.getElementById("clearSearch").style.display = searchQuery ? "block" : "none";
  applyFilters();
});

document.getElementById("clearSearch").addEventListener("click", () => {
  const searchInput = document.getElementById("search");
  searchInput.value = "";
  searchQuery = "";
  document.getElementById("clearSearch").style.display = "none";
  applyFilters();
  searchInput.focus();
});

document.getElementById("sortSelect").addEventListener("change", applyFilters);

const submitOverlay = document.getElementById("submitModal");
const fullViewOverlay = document.getElementById("fullViewModal");

document.getElementById("openModal").onclick = () => submitOverlay.classList.add("open");
document.getElementById("openModal2").onclick = () => submitOverlay.classList.add("open");
document.getElementById("closeSubmitModal").onclick = () => submitOverlay.classList.remove("open");

window.onclick = (e) => {
  if (e.target === submitOverlay) submitOverlay.classList.remove("open");
  if (e.target === fullViewOverlay) fullViewOverlay.classList.remove("open");
};

window.addEventListener("scroll", () => {
  const btn = document.getElementById("backToTop");
  if (window.scrollY > 400) {
    btn.style.display = "flex";
  } else {
    btn.style.display = "none";
  }
});

document.getElementById("backToTop").onclick = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

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
    Other: "other",
  };
  const prefix = catMap[cat] || cat.split(" ")[0].toLowerCase().replace(/[^a-z]/g, "");
  const id = (prefix + "-" + title.toLowerCase().replace(/[^a-z]/g, "-")).replace(/-+/g, "-").slice(0, 40) + "-" + Math.floor(Math.random() * 1000).toString().padStart(3, "0");

  if (!title || !tag || !cat || !diff || !body) {
    showToast("Fill required fields first");
    return;
  }

  const entry = { id, category: cat, tag, title, description: desc, body, author, votes: 0, model: models, usecase: usecases, difficulty: diff };
  document.getElementById("f-output").value = JSON.stringify(entry, null, 2);
}

document.getElementById("generateJson").onclick = generateJSON;
document.getElementById("copyJson").onclick = () => {
  const val = document.getElementById("f-output").value;
  if (!val) {
    generateJSON();
  }
  navigator.clipboard.writeText(document.getElementById("f-output").value);
  showToast("JSON copied — paste it in prompts.json and open a PR");
};

// Start
loadPrompts();
