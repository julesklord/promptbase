const fs = require("fs");
const path = require("path");

// Basic polyfill for utils functions
function escHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function formatPromptBody(str) {
  let esc = escHtml(str);
  esc = esc.replace(/(&lt;\/?\w+&gt;)/gi, '<span class="xml-tag">$1</span>');
  esc = esc.replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--text)">$1</strong>');
  esc = esc.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
  return esc;
}

const promptsDir = path.join(__dirname, "../data/prompts");
const files = fs.readdirSync(promptsDir);
const allPrompts = [];

files.forEach((file) => {
  if (file.endsWith(".json")) {
    const content = JSON.parse(fs.readFileSync(path.join(promptsDir, file), "utf8"));
    if (Array.isArray(content)) {
      allPrompts.push(...content);
    } else {
      allPrompts.push(content);
    }
  }
});

// Pre-format prompts for the "optimized" run
const optimizedPrompts = allPrompts.map((p) => ({
  ...p,
  formattedBody: formatPromptBody(p.body),
}));

console.log(`Loaded ${allPrompts.length} prompts.`);

function benchmarkOriginal(iterations) {
  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    allPrompts.forEach((p) => {
      const body = formatPromptBody(p.body);
      // Simulate use
      const x = body.length;
    });
  }
  const end = performance.now();
  return end - start;
}

function benchmarkOptimized(iterations) {
  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    optimizedPrompts.forEach((p) => {
      const body = p.formattedBody;
      // Simulate use
      const x = body.length;
    });
  }
  const end = performance.now();
  return end - start;
}

const iterations = 10000;
console.log(`Running benchmark with ${iterations} iterations...`);

const originalDuration = benchmarkOriginal(iterations);
console.log(`Original total duration: ${originalDuration.toFixed(2)}ms`);
console.log(
  `Original average duration per render cycle: ${(originalDuration / iterations).toFixed(2)}ms`,
);

const optimizedDuration = benchmarkOptimized(iterations);
console.log(`Optimized total duration: ${optimizedDuration.toFixed(2)}ms`);
console.log(
  `Optimized average duration per render cycle: ${(optimizedDuration / iterations).toFixed(2)}ms`,
);

const improvement = ((originalDuration - optimizedDuration) / originalDuration) * 100;
console.log(`Performance improvement: ${improvement.toFixed(2)}%`);
