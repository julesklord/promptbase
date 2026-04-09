export const state = {
  allPrompts: [],
  filtered: [],
  activeCategory: "all",
  activeDiff: "all",
  activeModel: "all",
  activeTag: null,
  searchQuery: "",
  votes: JSON.parse(localStorage.getItem("pb-votes") || "{}"),
  favorites: JSON.parse(localStorage.getItem("pb-favs") || "{}")
};

export function applyFilters() {
  const sort = document.getElementById("sortSelect")?.value || "votes";
  
  state.filtered = state.allPrompts.filter((p) => {
    if (state.activeCategory === "favorites" && !state.favorites[p.id]) return false;
    if (state.activeCategory !== "all" && state.activeCategory !== "favorites" && p.category !== state.activeCategory) return false;
    if (state.activeDiff !== "all" && p.difficulty !== state.activeDiff) return false;
    if (state.activeModel !== "all" && !(p.model || []).includes(state.activeModel)) return false;
    if (state.activeTag && !(p.usecase || []).includes(state.activeTag)) return false;
    if (state.searchQuery) {
      const q = state.searchQuery.toLowerCase();
      return (p.title + p.tag + p.description + (p.usecase || []).join(" ") + p.body).toLowerCase().includes(q);
    }
    return true;
  });

  if (sort === "votes") {
    state.filtered.sort((a, b) => (b.votes || 0) - (a.votes || 0));
  } else if (sort === "alpha") {
    state.filtered.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sort === "newest") {
    // Basic newest = end of array for now or by ID/index
    state.filtered.reverse(); 
  }

  // Trigger render event or call renderer
  const event = new CustomEvent("stateChange", { detail: state.filtered });
  window.dispatchEvent(event);
}
