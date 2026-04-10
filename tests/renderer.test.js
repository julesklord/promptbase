/**
 * @jest-environment jsdom
 */

import {
  renderSkeletons,
  buildStats,
  buildCategories,
  buildTagCloud,
  buildDiffCounts,
  renderGrid
} from "../js/renderer.js";
import { state, applyFilters } from "../js/state.js";
import * as utils from "../js/utils.js";

jest.mock("../js/utils.js", () => ({
  escapeHtml: jest.fn(str => str),
  formatPromptBody: jest.fn(str => str),
  showToast: jest.fn(),
  animateNum: jest.fn(),
}));

jest.mock("../js/state.js", () => ({
  state: {
    allPrompts: [],
    filtered: [],
    activeCategory: "all",
    activeDiff: "all",
    activeModel: "all",
    activeTag: null,
    searchQuery: "",
    votes: {},
    favorites: {},
  },
  applyFilters: jest.fn(),
}));

describe("renderer.js", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="promptGrid"></div>
      <div id="gridCount"></div>
      <div id="filterTabs"></div>
      <div id="tagCloud"></div>
      <div id="diffCounts">
        <button data-diff="all" id="countAll"></button>
        <button data-diff="beginner" id="countBeginner"></button>
        <button data-diff="intermediate" id="countIntermediate"></button>
        <button data-diff="advanced" id="countAdvanced"></button>
      </div>
      <div id="statPrompts"></div>
      <div id="statCats"></div>
      <div id="statAuthors"></div>
      <div id="statVotes"></div>
      <div id="fullViewModal"></div>
    `;

    // Reset state before each test
    state.allPrompts = [
      { id: "1", title: "A", body: "body A", author: "Bob", category: "frontend", tag: "react", difficulty: "beginner", votes: 5, model: ["gpt-4"], usecase: ["coding"] },
      { id: "2", title: "B", body: "body B", author: "Alice", category: "backend", tag: "node", difficulty: "advanced", votes: 15, model: ["claude"], usecase: ["api"] }
    ];
    state.filtered = [...state.allPrompts];
    state.activeCategory = "all";
    state.activeDiff = "all";
    state.activeModel = "all";
    state.activeTag = null;
    state.searchQuery = "";
    state.votes = {};
    state.favorites = {};

    jest.clearAllMocks();
  });

  describe("renderSkeletons", () => {
    it("should append 6 skeleton cards to promptGrid", () => {
      renderSkeletons();
      const grid = document.getElementById("promptGrid");
      expect(grid.children.length).toBe(6);
      expect(grid.children[0].className).toContain("skeleton-card");
    });

    it("should return early if promptGrid doesn't exist", () => {
      document.body.innerHTML = "";
      expect(() => renderSkeletons()).not.toThrow();
    });
  });

  describe("buildStats", () => {
    it("should call animateNum with correct calculated stats", () => {
      buildStats();
      expect(utils.animateNum).toHaveBeenCalledWith("statPrompts", 2);
      expect(utils.animateNum).toHaveBeenCalledWith("statCats", 2); // frontend, backend
      expect(utils.animateNum).toHaveBeenCalledWith("statAuthors", 2); // Bob, Alice
      expect(utils.animateNum).toHaveBeenCalledWith("statVotes", 20); // 5 + 15
    });
  });

  describe("buildCategories", () => {
    it("should create category tabs based on state.allPrompts", () => {
      buildCategories();
      const tabs = document.getElementById("filterTabs");
      const buttons = tabs.querySelectorAll("button");

      expect(buttons.length).toBe(4); // "all", "favorites", "frontend", "backend"
      expect(buttons[0].dataset.cat).toBe("all");
      expect(buttons[1].dataset.cat).toBe("favorites");
      expect(buttons[2].dataset.cat).toBe("frontend");
      expect(buttons[3].dataset.cat).toBe("backend");
    });

    it("should apply active class and call applyFilters when clicked", () => {
      buildCategories();
      const tabs = document.getElementById("filterTabs");
      const frontendBtn = tabs.querySelector("[data-cat='frontend']");

      frontendBtn.click();

      expect(frontendBtn.className).toContain("active");
      expect(state.activeCategory).toBe("frontend");
      expect(applyFilters).toHaveBeenCalled();
    });
  });

  describe("buildTagCloud", () => {
    it("should create tags based on state.allPrompts usecases", () => {
      buildTagCloud();
      const tagCloud = document.getElementById("tagCloud");
      const tags = tagCloud.querySelectorAll("button");

      expect(tags.length).toBe(2); // "api", "coding"
      // the renderer sorts tags, so api is first, coding is second
      expect(tags[0].innerHTML).toContain("api");
      expect(tags[1].innerHTML).toContain("coding");
    });

    it("should call applyFilters and set state when a tag is clicked", () => {
      buildTagCloud();
      const tagCloud = document.getElementById("tagCloud");
      const apiBtn = tagCloud.querySelectorAll("button")[0];

      apiBtn.click();

      expect(state.activeTag).toBe("api");
      expect(applyFilters).toHaveBeenCalled();

      // clicking again toggles it off
      apiBtn.click();
      expect(state.activeTag).toBeNull();
    });
  });

  describe("buildDiffCounts", () => {
    it("should populate diffCounts with correct counts", () => {
      buildDiffCounts();
      expect(document.getElementById("countAll").textContent).toBe("2");
      expect(document.getElementById("countBeginner").textContent).toBe("1");
      expect(document.getElementById("countIntermediate").textContent).toBe("0");
      expect(document.getElementById("countAdvanced").textContent).toBe("1");
    });

    it("should call applyFilters and set activeDiff when clicked", () => {
      buildDiffCounts();
      const beginnerBtn = document.querySelector("[data-diff='beginner']");
      beginnerBtn.click();

      expect(state.activeDiff).toBe("beginner");
      expect(applyFilters).toHaveBeenCalled();
    });
  });

  describe("renderGrid", () => {
    it("should update grid count", () => {
      renderGrid();
      expect(document.getElementById("gridCount").textContent).toBe("2 prompts");
    });

    it("should render an empty state message if filtered is empty", () => {
      state.filtered = [];
      renderGrid();
      const grid = document.getElementById("promptGrid");
      expect(grid.innerHTML).toContain("No prompts match your filters");
    });

    it("should render prompt cards", () => {
      renderGrid();
      const grid = document.getElementById("promptGrid");
      const cards = grid.querySelectorAll(".prompt-card");
      expect(cards.length).toBe(2);
      expect(cards[0].innerHTML).toContain("A");
      expect(cards[1].innerHTML).toContain("B");
    });

    it("should handle vote button click", () => {
      renderGrid();
      const voteBtn = document.getElementById("vote-1");
      voteBtn.click();

      expect(state.votes["1"]).toBe(1);
      expect(voteBtn.className).toContain("voted");
      expect(utils.showToast).toHaveBeenCalledWith("Vote registered — thanks!");
    });

    it("should handle copy button click", () => {
      // Mock clipboard API
      Object.assign(navigator, {
        clipboard: { writeText: jest.fn().mockResolvedValue() }
      });
      jest.useFakeTimers();

      renderGrid();
      const copyBtn = document.getElementById("copy-1");
      copyBtn.click();

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith("body A");
      expect(utils.showToast).toHaveBeenCalledWith("Prompt copied to clipboard");
      expect(copyBtn.textContent).toBe("Copied!");

      jest.runAllTimers();
      expect(copyBtn.textContent).toBe("Copy");

      jest.useRealTimers();
    });

    it("should handle fav button click", () => {
      renderGrid();
      const favBtn = document.getElementById("fav-1");

      // Add to favorites
      favBtn.click();
      expect(state.favorites["1"]).toBe(true);
      expect(favBtn.className).toContain("faved");
      expect(utils.showToast).toHaveBeenCalledWith("Saved to favorites!");

      // Remove from favorites
      favBtn.click();
      expect(state.favorites["1"]).toBeUndefined();
      expect(favBtn.className).not.toContain("faved");
      expect(utils.showToast).toHaveBeenCalledWith("Removed from favorites");
    });
  });
});
