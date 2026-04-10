// @ts-check
const { test, expect } = require("@playwright/test");

test.describe("applyFilters Unit Tests via Page Context", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should filter by activeCategory", async ({ page }) => {
    const filteredPrompts = await page.evaluate(async () => {
      const { state, applyFilters } = await import("./js/state.js");
      state.allPrompts = [
        { id: "1", title: "Backend", category: "backend" },
        { id: "2", title: "Frontend", category: "frontend" },
      ];
      state.activeCategory = "backend";
      state.activeDiff = "all";
      state.activeModel = "all";
      state.activeTag = null;
      state.searchQuery = "";
      applyFilters();
      return state.filtered;
    });

    expect(filteredPrompts.length).toBe(1);
    expect(filteredPrompts[0].category).toBe("backend");
  });

  test("should filter by activeDiff (difficulty)", async ({ page }) => {
    const filteredPrompts = await page.evaluate(async () => {
      const { state, applyFilters } = await import("./js/state.js");
      state.allPrompts = [
        { id: "1", title: "Beginner", difficulty: "beginner" },
        { id: "2", title: "Advanced", difficulty: "advanced" },
      ];
      state.activeCategory = "all";
      state.activeDiff = "advanced";
      state.activeModel = "all";
      state.activeTag = null;
      state.searchQuery = "";
      applyFilters();
      return state.filtered;
    });

    expect(filteredPrompts.length).toBe(1);
    expect(filteredPrompts[0].difficulty).toBe("advanced");
  });

  test("should filter by activeModel", async ({ page }) => {
    const filteredPrompts = await page.evaluate(async () => {
      const { state, applyFilters } = await import("./js/state.js");
      state.allPrompts = [
        { id: "1", title: "GPT", model: ["gpt-4"] },
        { id: "2", title: "Claude", model: ["claude-3"] },
        { id: "3", title: "Both", model: ["gpt-4", "claude-3"] },
        { id: "4", title: "None", model: undefined },
      ];
      state.activeCategory = "all";
      state.activeDiff = "all";
      state.activeModel = "gpt-4";
      state.activeTag = null;
      state.searchQuery = "";
      applyFilters();
      return state.filtered;
    });

    expect(filteredPrompts.length).toBe(2);
    expect(filteredPrompts.map((p) => p.id)).toEqual(["1", "3"]);
  });

  test("should filter by activeTag (usecase)", async ({ page }) => {
    const filteredPrompts = await page.evaluate(async () => {
      const { state, applyFilters } = await import("./js/state.js");
      state.allPrompts = [
        { id: "1", title: "API", usecase: ["api", "web"] },
        { id: "2", title: "DB", usecase: ["database"] },
        { id: "3", title: "None", usecase: undefined },
      ];
      state.activeCategory = "all";
      state.activeDiff = "all";
      state.activeModel = "all";
      state.activeTag = "api";
      state.searchQuery = "";
      applyFilters();
      return state.filtered;
    });

    expect(filteredPrompts.length).toBe(1);
    expect(filteredPrompts[0].id).toBe("1");
  });

  test("should filter by search query (case insensitive, multiple fields)", async ({ page }) => {
    const filteredPrompts = await page.evaluate(async () => {
      const { state, applyFilters } = await import("./js/state.js");
      state.allPrompts = [
        {
          id: "1",
          title: "Find Me",
          body: "Some body text",
          tag: "test",
          description: "",
          usecase: [],
        },
        {
          id: "2",
          title: "Hidden",
          body: "Other text with fInd Me inside",
          tag: "test",
          description: "",
          usecase: [],
        },
        { id: "3", title: "Nope", body: "Clean text", tag: "nope", description: "", usecase: [] },
      ];
      state.activeCategory = "all";
      state.activeDiff = "all";
      state.activeModel = "all";
      state.activeTag = null;
      state.searchQuery = "find me";
      applyFilters();
      return state.filtered;
    });

    expect(filteredPrompts.length).toBe(2);
    expect(filteredPrompts.map((p) => p.id)).toEqual(["1", "2"]);
  });

  test("should filter by favorites", async ({ page }) => {
    const filteredPrompts = await page.evaluate(async () => {
      const { state, applyFilters } = await import("./js/state.js");
      state.allPrompts = [
        { id: "1", title: "Fav 1" },
        { id: "2", title: "Not Fav" },
        { id: "3", title: "Fav 2" },
      ];
      state.favorites = { 1: true, 3: true };
      state.activeCategory = "favorites";
      state.activeDiff = "all";
      state.activeModel = "all";
      state.activeTag = null;
      state.searchQuery = "";

      applyFilters();
      return state.filtered;
    });

    expect(filteredPrompts.length).toBe(2);
    expect(filteredPrompts.map((p) => p.id)).toEqual(["1", "3"]);
  });

  test("should sort by votes by default", async ({ page }) => {
    const filteredPrompts = await page.evaluate(async () => {
      const { state, applyFilters } = await import("./js/state.js");
      state.allPrompts = [
        { id: "1", title: "Low", votes: 5 },
        { id: "2", title: "High", votes: 100 },
        { id: "3", title: "Medium", votes: 50 },
        { id: "4", title: "No Votes" }, // implicitly 0
      ];
      state.activeCategory = "all";
      state.activeDiff = "all";
      state.activeModel = "all";
      state.activeTag = null;
      state.searchQuery = "";

      // Mock the DOM for sorting
      document.body.innerHTML =
        '<select id="sortSelect"><option value="votes" selected></option></select>';

      applyFilters();
      return state.filtered;
    });

    expect(filteredPrompts.length).toBe(4);
    expect(filteredPrompts.map((p) => p.id)).toEqual(["2", "3", "1", "4"]);
  });

  test("should sort alphabetically", async ({ page }) => {
    const filteredPrompts = await page.evaluate(async () => {
      const { state, applyFilters } = await import("./js/state.js");
      state.allPrompts = [
        { id: "1", title: "Zebra" },
        { id: "2", title: "Apple" },
        { id: "3", title: "Mango" },
      ];
      state.activeCategory = "all";
      state.activeDiff = "all";
      state.activeModel = "all";
      state.activeTag = null;
      state.searchQuery = "";

      document.body.innerHTML =
        '<select id="sortSelect"><option value="alpha" selected></option></select>';

      applyFilters();
      return state.filtered;
    });

    expect(filteredPrompts.length).toBe(3);
    expect(filteredPrompts.map((p) => p.id)).toEqual(["2", "3", "1"]);
  });

  test("should sort by newest (reverse array)", async ({ page }) => {
    const filteredPrompts = await page.evaluate(async () => {
      const { state, applyFilters } = await import("./js/state.js");
      state.allPrompts = [
        { id: "1", title: "Oldest" },
        { id: "2", title: "Middle" },
        { id: "3", title: "Newest" },
      ];
      state.activeCategory = "all";
      state.activeDiff = "all";
      state.activeModel = "all";
      state.activeTag = null;
      state.searchQuery = "";

      document.body.innerHTML =
        '<select id="sortSelect"><option value="newest" selected></option></select>';

      applyFilters();
      return state.filtered;
    });

    expect(filteredPrompts.length).toBe(3);
    expect(filteredPrompts.map((p) => p.id)).toEqual(["3", "2", "1"]);
  });

  test("should dispatch stateChange event", async ({ page }) => {
    const eventDispatched = await page.evaluate(async () => {
      const { state, applyFilters } = await import("./js/state.js");
      state.allPrompts = [{ id: "1", title: "Test" }];

      return new Promise((resolve) => {
        window.addEventListener(
          "stateChange",
          (e) => {
            // @ts-ignore
            resolve(e.detail.length === 1 && e.detail[0].id === "1");
          },
          { once: true },
        );

        applyFilters();
      });
    });

    expect(eventDispatched).toBe(true);
  });
});
