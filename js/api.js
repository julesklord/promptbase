import { state, applyFilters } from "./state.js";
import { renderSkeletons } from "./renderer.js";

const PROMPTS_URL = "prompts.json";

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
    const r = await fetch(PROMPTS_URL);
    if (!r.ok) throw new Error(`HTTP error! status: ${r.status}`);
    const data = await r.json();
    
    // Phase 3: Validation
    state.allPrompts = data.filter(validatePrompt);
    
    // Small delay to let skeletons shimmer (UX)
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("dataLoaded"));
    }, 300);
    
  } catch (e) {
    console.error("Error loading prompts:", e);
    state.allPrompts = [];
    window.dispatchEvent(new CustomEvent("dataLoaded"));
  }
}
