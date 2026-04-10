import { state, applyFilters } from "./state.js";
import { escapeHtml, formatPromptBody, showToast, animateNum } from "./utils.js";

export function renderSkeletons() {
  const grid = document.getElementById("promptGrid");
  if (!grid) return;
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

export function buildStats() {
  const authors = new Set(state.allPrompts.map((p) => p.author)).size;
  const totalVotes = state.allPrompts.reduce((a, p) => a + (p.votes || 0), 0);
  const cats = new Set(state.allPrompts.map((p) => p.category)).size;
  animateNum("statPrompts", state.allPrompts.length);
  animateNum("statCats", cats);
  animateNum("statAuthors", authors);
  animateNum("statVotes", totalVotes);
}

export function buildCategories() {
  const tabs = document.getElementById("filterTabs");
  if (!tabs) return;
  const cats = ["all", "favorites", ...new Set(state.allPrompts.map((p) => p.category))];
  tabs.innerHTML = "";
  cats.forEach((cat) => {
    const btn = document.createElement("button");
    btn.className = "filter-tab" + (cat === "all" ? " active" : "");
    btn.dataset.cat = cat;
    if (cat === "all") btn.textContent = "All";
    else if (cat === "favorites") {
      btn.textContent = "★ Favorites";
      btn.style.color = "var(--amber)";
    } else btn.textContent = cat;

    btn.onclick = () => {
      document.querySelectorAll(".filter-tab").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      state.activeCategory = cat;
      applyFilters();
    };
    tabs.appendChild(btn);
  });
}

export function buildTagCloud() {
  const tags = {};
  state.allPrompts.forEach((p) =>
    (p.usecase || []).forEach((t) => {
      tags[t] = (tags[t] || 0) + 1;
    }),
  );
  const cloud = document.getElementById("tagCloud");
  if (!cloud) return;
  cloud.innerHTML = "";
  Object.keys(tags)
    .sort()
    .forEach((tag) => {
      const btn = document.createElement("button");
      btn.className = "tag-pill";
      btn.innerHTML = `${escapeHtml(tag)} <span style="font-size:8px;opacity:0.4;margin-left:4px;">${tags[tag]}</span>`;
      btn.onclick = () => {
        if (state.activeTag === tag) {
          state.activeTag = null;
          btn.classList.remove("active");
        } else {
          document.querySelectorAll(".filter-tab").forEach((b) => b.classList.remove("active"));
          document.querySelectorAll(".tag-pill").forEach((b) => b.classList.remove("active"));
          state.activeTag = tag;
          btn.classList.add("active");
        }
        applyFilters();
      };
      cloud.appendChild(btn);
    });
}

export function buildDiffCounts() {
  const counts = { beginner: 0, intermediate: 0, advanced: 0 };
  state.allPrompts.forEach((p) => {
    if (counts[p.difficulty] !== undefined) counts[p.difficulty]++;
  });

  const elAll = document.getElementById("countAll");
  if (elAll) elAll.textContent = state.allPrompts.length;
  if (document.getElementById("countBeginner"))
    document.getElementById("countBeginner").textContent = counts.beginner;
  if (document.getElementById("countIntermediate"))
    document.getElementById("countIntermediate").textContent = counts.intermediate;
  if (document.getElementById("countAdvanced"))
    document.getElementById("countAdvanced").textContent = counts.advanced;

  document.querySelectorAll("[data-diff]").forEach((btn) => {
    btn.onclick = () => {
      document.querySelectorAll("[data-diff]").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      state.activeDiff = btn instanceof HTMLElement ? btn.dataset.diff : "all";
      applyFilters();
    };
  });

  document.querySelectorAll("[data-model]").forEach((btn) => {
    btn.onclick = () => {
      document.querySelectorAll("[data-model]").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      state.activeModel = btn instanceof HTMLElement ? btn.dataset.model : "all";
      applyFilters();
    };
  });
}

export function renderGrid() {
  const grid = document.getElementById("promptGrid");
  const countEl = document.getElementById("gridCount");
  if (!grid || !countEl) return;

  countEl.textContent = `${state.filtered.length} prompt${state.filtered.length !== 1 ? "s" : ""}`;

  if (!state.filtered.length) {
    grid.innerHTML = `<div class="empty"><div class="empty-code">404</div>No prompts match your filters.<br>Be the first to submit one.</div>`;
    return;
  }

  grid.innerHTML = "";
  const fragment = document.createDocumentFragment();
  state.filtered.forEach((p, i) => {
    const card = document.createElement("div");
    card.className = "prompt-card";
    card.style.animationDelay = i * 30 + "ms";

    const voteCount = (p.votes || 0) + (state.votes[p.id] || 0);
    const isVoted = !!state.votes[p.id];
    const models = (p.model || [])
      .map((m) => `<span class="model-badge model-${m}">${m}</span>`)
      .join("");
    const diff = p.difficulty || "intermediate";

    const isFav = !!state.favorites[p.id];
    const favText = isFav ? "★" : "☆";

    card.innerHTML = `
      <div class="card-top">
        <span class="card-tag">${escapeHtml(p.tag)}</span>
        <span class="card-diff diff-${diff}">${escapeHtml(diff)}</span>
      </div>
      <div class="card-title">${escapeHtml(p.title)}</div>
      <div class="card-desc">${escapeHtml(p.description)}</div>
      <div class="card-body" id="body-${p.id}">${formatPromptBody(p.body)}</div>
      <div style="display:flex;gap:6px;margin-bottom:12px;">
        <button class="expand-btn" id="expand-${p.id}" aria-label="Expand or collapse prompt">expand ↓</button>
        <button class="expand-btn" id="fullview-${p.id}" style="flex:1;text-align:center;" aria-label="View prompt in full screen">view fullscreen</button>
      </div>
      <div class="card-meta">
        <div class="card-models">${models}</div>
        <div class="card-actions">
          <button class="fav-btn ${isFav ? "faved" : ""}" id="fav-${p.id}" aria-label="Favorite this prompt">${favText}</button>
          <button class="vote-btn ${isVoted ? "voted" : ""}" id="vote-${p.id}" aria-label="Vote for this prompt">▲ ${voteCount}</button>
          <button class="copy-btn" id="copy-${p.id}" aria-label="Copy prompt text">Copy</button>
        </div>
      </div>
      <div class="card-author">
        <div class="author-dot"></div>
        <span>${escapeHtml(p.author || "anonymous")}</span>
        ${(p.usecase || [])
          .slice(0, 3)
          .map((t) => `<span style="color:var(--text3);font-size:9px;background:var(--bg3);padding:1px 5px;">${escapeHtml(t)}</span>`)
          .join("")}
      </div>
    `;

    card.querySelector(`#expand-${p.id}`).onclick = () => {
      const body = document.getElementById(`body-${p.id}`);
      const btn = card.querySelector(`#expand-${p.id}`);
      body.classList.toggle("card-body-full");
      btn.textContent = body.classList.contains("card-body-full") ? "collapse ↑" : "expand ↓";
    };

    const openModalFn = () => {
      const modal = document.getElementById("fullViewModal");
      const currentFav = !!state.favorites[p.id];
      modal.innerHTML = `
        <div class="modal" style="max-width:800px;">
          <div class="modal-header">
            <div>
              <div class="modal-title">${escapeHtml(p.title)}</div>
              <div style="font-size:10px;color:var(--text3);margin-top:6px;">${escapeHtml(p.tag)} · ${escapeHtml(p.category)}</div>
            </div>
            <button class="modal-close" id="closeFullView">×</button>
          </div>
          <div class="modal-body">
            <div style="margin-bottom:1.5rem;padding:12px;background:var(--bg3);border-left:2px solid var(--red);">
              <div style="font-size:11px;color:var(--text2);">${escapeHtml(p.description)}</div>
            </div>
            <div style="margin-bottom:1.5rem;">
              <div style="font-size:9px;color:var(--text3);text-transform:uppercase;letter-spacing:0.12em;margin-bottom:8px;">Prompt Body</div>
              <div style="background:var(--bg);border:1px solid var(--border);padding:12px;font-size:11px;color:var(--text2);line-height:1.7;white-space:pre-wrap;max-height:400px;overflow-y:auto;">${formatPromptBody(p.body)}</div>
            </div>
            <div style="display:flex;gap:1rem;flex-wrap:wrap;">
              <div style="flex:1;min-width:150px;">
                <div style="font-size:9px;color:var(--text3);text-transform:uppercase;margin-bottom:6px;">Models</div>
                <div style="display:flex;gap:4px;flex-wrap:wrap;">${models}</div>
              </div>
              <div style="flex:1;min-width:150px;">
                <div style="font-size:9px;color:var(--text3);text-transform:uppercase;margin-bottom:6px;">Use Cases</div>
                <div style="display:flex;gap:4px;flex-wrap:wrap;">
                  ${(p.usecase || []).map((t) => `<span style="font-size:10px;padding:2px 8px;background:var(--bg3);color:var(--text2);border:1px solid var(--border);">${escapeHtml(t)}</span>`).join("")}
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <div class="contribute-hint">Author: <strong>${escapeHtml(p.author || "anonymous")}</strong> · Difficulty: <strong>${escapeHtml(p.difficulty)}</strong> · ID: <code style="color:var(--amber);font-size:10px;">${p.id}</code></div>
            <div style="display:flex;gap:8px;">
              <button class="btn-ghost fav-btn ${currentFav ? "faved" : ""}" id="fullview-fav" style="border: 1px solid var(--amber) !important; color: var(--amber);">${currentFav ? "★ Saved" : "☆ Save"}</button>
              <button class="btn-ghost" id="fullview-share">🔗 Share Link</button>
              <button class="btn-red" id="fullview-copy">Copy Prompt</button>
            </div>
          </div>
        </div>
      `;
      modal.classList.add("open");

      document.getElementById("closeFullView").onclick = () => modal.classList.remove("open");

      document.getElementById("fullview-share").onclick = () => {
        const url = window.location.origin + window.location.pathname + "?id=" + p.id;
        navigator.clipboard.writeText(url);
        showToast("Link Copied!");
      };

      document.getElementById("fullview-copy").onclick = () => {
        navigator.clipboard.writeText(p.body);
        showToast("Copied!");
        const btn = document.getElementById("fullview-copy");
        btn.textContent = "Copied!";
        setTimeout(() => (btn.textContent = "Copy Prompt"), 1500);
      };

      document.getElementById("fullview-fav").onclick = () => {
        const modalFavBtn = document.getElementById("fullview-fav");
        const cardFavBtn = document.getElementById(`fav-${p.id}`);
        if (state.favorites[p.id]) {
          delete state.favorites[p.id];
          if (modalFavBtn) modalFavBtn.innerHTML = "☆ Save";
          if (modalFavBtn) modalFavBtn.classList.remove("faved");
          if (cardFavBtn) cardFavBtn.innerHTML = "☆";
          if (cardFavBtn) cardFavBtn.classList.remove("faved");
          showToast("Removed from favorites");
        } else {
          state.favorites[p.id] = true;
          if (modalFavBtn) modalFavBtn.innerHTML = "★ Saved";
          if (modalFavBtn) modalFavBtn.classList.add("faved");
          if (cardFavBtn) cardFavBtn.innerHTML = "★";
          if (cardFavBtn) cardFavBtn.classList.add("faved");
          showToast("Saved to favorites!");
        }
        localStorage.setItem("pb-favs", JSON.stringify(state.favorites));
        if (state.activeCategory === "favorites") applyFilters();
      };
    };

    card.querySelector(`#fullview-${p.id}`).onclick = (e) => {
      e.stopPropagation();
      openModalFn();
    };

    card.style.cursor = "pointer";
    card.onclick = (e) => {
      // Do not open if clicking a button (expand, copy, vote, etc.)
      if (e.target.closest("button") || e.target.closest("a")) return;
      openModalFn();
    };

    card.querySelector(`#fav-${p.id}`).onclick = () => {
      const btn = card.querySelector(`#fav-${p.id}`);
      if (state.favorites[p.id]) {
        delete state.favorites[p.id];
        btn.innerHTML = "☆";
        btn.classList.remove("faved");
        showToast("Removed from favorites");
      } else {
        state.favorites[p.id] = true;
        btn.innerHTML = "★";
        btn.classList.add("faved");
        showToast("Saved to favorites!");
      }
      localStorage.setItem("pb-favs", JSON.stringify(state.favorites));
      if (state.activeCategory === "favorites") applyFilters();
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
      if (!state.votes[p.id]) {
        state.votes[p.id] = 1;
        localStorage.setItem("pb-votes", JSON.stringify(state.votes));
        const btn = card.querySelector(`#vote-${p.id}`);
        btn.classList.add("voted");
        btn.textContent = `▲ ${voteCount + 1}`;
        showToast("Vote registered — thanks!");
      }
    };

    fragment.appendChild(card);
  });
  grid.appendChild(fragment);
}
