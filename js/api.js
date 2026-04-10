import { state, applyFilters } from "./state.js";
import { renderSkeletons } from "./renderer.js";

const MANIFEST_URL = "data/manifest.json";
const SHARD_BASE = "data/prompts/";

/**
 * Validates a prompt object against the required schema.
 */
function validatePrompt(p) {
  const required = ["id", "title", "category", "body", "difficulty"];
  for (const field of required) {
    if (!p[field]) {
      console.warn(`Malformed prompt skipped: missing ${field}`, p);
      return false;
    }
  }
  return true;
}

export async function loadPrompts() {
  renderSkeletons();
  try {
    // 1. Fetch the manifest
    const manifestResp = await fetch(MANIFEST_URL);
    if (!manifestResp.ok) throw new Error("Could not load manifest");
    const shards = await manifestResp.json();

    // 2. Fetch all shards in parallel with individual error handling
    const results = await Promise.all(
      shards.map(async (filename) => {
        try {
          const resp = await fetch(`${SHARD_BASE}${filename}`);
          if (!resp.ok) {
            console.error(`Failed to load shard: ${filename}`);
            return [];
          }
          const data = await resp.json();
          return Array.isArray(data) ? data : [data];
        } catch (err) {
          console.error(`Syntax error in shard ${filename}:`, err);
          return [];
        }
      }),
    );

    // 3. Flatten and validate
    const combined = results.flat();
    state.allPrompts = combined.filter(validatePrompt);

    // UX delay for skeletons
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("dataLoaded"));
    }, 400);
  } catch (e) {
    console.error("Critical error in data pipeline:", e);
    state.allPrompts = [];
    window.dispatchEvent(new CustomEvent("dataLoaded"));
  }
}
