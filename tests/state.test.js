import { state, applyFilters } from "../js/state.js";

describe("applyFilters", () => {
  beforeEach(() => {
    state.allPrompts = [
      { id: "1", title: "A", votes: 10, category: "backend", difficulty: "beginner" },
      { id: "2", title: "B", votes: 20, category: "frontend", difficulty: "advanced" },
    ];
    state.activeCategory = "all";
    state.activeDiff = "all";
    state.activeModel = "all";
    state.searchQuery = "";
  });

  it("should filter by category", () => {
    state.activeCategory = "backend";
    applyFilters();
    expect(state.filtered.length).toBe(1);
    expect(state.filtered[0].id).toBe("1");
  });

  it("should sort by votes", () => {
    applyFilters();
    expect(state.filtered[0].id).toBe("2"); // 20 votes > 10 votes
  });

  it("should filter by search query", () => {
    state.searchQuery = "A";
    applyFilters();
    expect(state.filtered.length).toBe(1);
    expect(state.filtered[0].title).toBe("A");
  });
});
