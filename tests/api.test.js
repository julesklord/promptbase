import { loadPrompts } from "../js/api.js";
import { state } from "../js/state.js";
import * as renderer from "../js/renderer.js";

jest.mock("../js/renderer.js", () => ({
  renderSkeletons: jest.fn()
}));

describe("loadPrompts", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(console, "warn").mockImplementation(() => {});
    jest.useFakeTimers();
    state.allPrompts = [];
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  it("should handle manifest fetch network error", async () => {
    global.fetch.mockRejectedValueOnce(new Error("Network Error"));
    await loadPrompts();
    expect(state.allPrompts).toEqual([]);
    expect(console.error).toHaveBeenCalledWith("Critical error in data pipeline:", expect.any(Error));
  });

  it("should handle manifest fetch not ok", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false
    });
    await loadPrompts();
    expect(state.allPrompts).toEqual([]);
    expect(console.error).toHaveBeenCalledWith("Critical error in data pipeline:", expect.any(Error));
  });

  it("should handle shard fetch network error", async () => {
    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ["shard1.json"]
      })
      .mockRejectedValueOnce(new Error("Shard Network Error"));

    await loadPrompts();
    expect(state.allPrompts).toEqual([]);
    expect(console.error).toHaveBeenCalledWith("Syntax error in shard shard1.json:", expect.any(Error));
  });

  it("should handle shard fetch not ok", async () => {
    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ["shard1.json"]
      })
      .mockResolvedValueOnce({
        ok: false
      });

    await loadPrompts();
    expect(state.allPrompts).toEqual([]);
    expect(console.error).toHaveBeenCalledWith("Failed to load shard: shard1.json");
  });

  it("should handle invalid JSON in shard", async () => {
    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ["shard1.json"]
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => { throw new Error("Invalid JSON"); }
      });

    await loadPrompts();
    expect(state.allPrompts).toEqual([]);
    expect(console.error).toHaveBeenCalledWith("Syntax error in shard shard1.json:", expect.any(Error));
  });

  it("should skip malformed prompts during validation", async () => {
    const validPrompt = {
      id: "1",
      title: "Valid",
      category: "Test",
      body: "Test body",
      difficulty: "Beginner"
    };
    const invalidPrompt = {
      id: "2",
      title: "Invalid",
      // missing category, body, difficulty
    };

    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ["shard1.json"]
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [validPrompt, invalidPrompt]
      });

    await loadPrompts();
    expect(state.allPrompts).toEqual([validPrompt]);
    expect(console.warn).toHaveBeenCalledWith("Malformed prompt skipped: missing category", invalidPrompt);
  });
});
