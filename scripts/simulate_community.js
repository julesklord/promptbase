const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const dir = "./data/prompts";
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));

// 1. SIMULAR VOTOS ORGÁNICOS EN MAIN
console.log("🚀 Simulando interacción orgánica (Votos)...");
files.forEach((file) => {
  const fPath = path.join(dir, file);
  let data = JSON.parse(fs.readFileSync(fPath, "utf8"));
  data.forEach((prompt) => {
    // 40% de probabilidad de recibir entre 1 y 25 votos
    if (Math.random() > 0.6) {
      prompt.votes = (prompt.votes || 0) + Math.floor(Math.random() * 25) + 1;
    }
  });
  fs.writeFileSync(fPath, JSON.stringify(data, null, 2), "utf8");
});

try {
  execSync("git add data/prompts/*.json", { stdio: "inherit" });
  execSync('git commit -m "chore(community): community organic vote increments"', {
    stdio: "inherit",
  });
  execSync("git push origin main", { stdio: "inherit" });
} catch (e) {
  console.log("Error en el commit de votos (puede que no haya cambios):", e.message);
}

// 2. GENERAR 5 NUEVOS PULL REQUESTS
console.log("\n🚀 Generando 5 nuevas ramas para Pull Requests...");

const newPrompts = [
  {
    branch: "community/feat-rust-wasm-059",
    file: "backend-development.json",
    payload: {
      id: "backend-rust-wasm-059",
      category: "Backend Development",
      tag: "rust · wasm",
      title: "Rust - WebAssembly Module Integration",
      description:
        "Compile high-performance Rust logic to WASM and bridge it seamlessly with frontend bundlers.",
      body: "<context>\nTarget: Exporting a CPU-intensive [ALGORITHM] to the browser.\n</context>\n\n<task>\nProvide the following:\n1. The `Cargo.toml` configuration utilizing `wasm-bindgen`.\n2. The Rust library code exposing the exported function.\n3. The exact build commands (`wasm-pack`).\n4. An example of instantiating and calling the WASM memory buffer from a modern Vite/React application.\n</task>",
      author: "ferrisCoder99",
      votes: 1,
      difficulty: "advanced",
    },
  },
  {
    branch: "community/feat-css-container-queries-060",
    file: "frontend-development.json",
    payload: {
      id: "frontend-css-containers-060",
      category: "Frontend Development",
      tag: "css · architecture",
      title: "CSS - Modern Container Queries Architecture",
      description:
        "Implement intrinsic web design replacing strict media queries with semantic container queries.",
      body: "<task>\nRefactor the given legacy CSS utilizing `@media (min-width: ...)` into modern `@container` strategies.\nExplain how to configure the overarching `container-type: inline-size` on the parent node and provide a polyfill strategy if supporting legacy browser variants.\n</task>",
      author: "pixelPusher_x",
      votes: 5,
      difficulty: "intermediate",
    },
  },
  {
    branch: "community/feat-postgres-pgvector-061",
    file: "database-data.json",
    payload: {
      id: "database-postgres-pgvector-061",
      category: "Database & Data",
      tag: "postgres · ai-vectors",
      title: "PostgreSQL - pgvector Similarity Search Strategy",
      description:
        "Store and query AI knowledge vectors natively inside PostgreSQL without external vector databases.",
      body: "<context>\nTarget: RAG Knowledge base utilizing OpenAI 1536-dimensional embeddings.\n</context>\n\n<task>\nGenerate the SQL schema required to:\n1. Enable the `pgvector` extension.\n2. Create the target table utilizing the `vector(1536)` datatype.\n3. Implement a high-performance `HNSW` index optimized for Exact Nearest Neighbor (ENN) distance search.\n4. Write the query to retrieve the top 5 semantically similar rows using the `<->` cosine distance operator.\n</task>",
      author: "dataWhiz",
      votes: 12,
      difficulty: "advanced",
    },
  },
  {
    branch: "community/feat-mobile-offline-realm-062",
    file: "mobile-development.json",
    payload: {
      id: "mobile-realm-offline-062",
      category: "Mobile Development",
      tag: "mobile · realm-db",
      title: "React Native - RealmDB Offline-First Architecture",
      description: "Implement an entirely local-first persistence layer utilizing RealmDB.",
      body: "<task>\nEngineer a React Native architectural snippet utilizing `@realm/react`.\nDesign a Schema for `[ENTITY]` and specifically demonstrate how to observe live queries (Reactive UI) so the React components update instantly upon background write events seamlessly without manual state flushing.\n</task>",
      author: "mobile_ninja_22",
      votes: 3,
      difficulty: "intermediate",
    },
  },
  {
    branch: "community/feat-security-csp-063",
    file: "security-auth.json",
    payload: {
      id: "security-csp-strict-063",
      category: "Security & Auth",
      tag: "security · headers",
      title: "Security - Strict Content Security Policy (CSP)",
      description:
        "Harden web application security by engineering a strict, nonce-based CSP header configuration.",
      body: "<task>\nFormulate a production-grade Content Security Policy (CSP) header string.\nRequirements:\n1. Strictly prohibit generic `unsafe-inline` and `unsafe-eval`.\n2. Design a dynamic `nonce` injection strategy for SSR frameworks (e.g., Next.js or Express) to authorize specific first-party scripts.\n3. Configure `report-uri` to ingest violation payloads for security telemetry.\n</task>",
      author: "secOps_Lead",
      votes: 8,
      difficulty: "advanced",
    },
  },
];

newPrompts.forEach((pr, index) => {
  console.log(`\nCreando PR ${index + 1}/5: ${pr.branch}...`);

  // Switch to branch
  execSync(`git checkout -b ${pr.branch} main`, { stdio: "ignore" });

  // Inject prompt
  const fPath = path.join(dir, pr.file);
  let data = JSON.parse(fs.readFileSync(fPath, "utf8"));
  data.push(pr.payload);
  fs.writeFileSync(fPath, JSON.stringify(data, null, 2), "utf8");

  // Commit and Push
  execSync(`git add ${Math.normalize ? path.normalize(fPath) : fPath}`);
  execSync(`git commit -m "feat: add community prompt '${pr.payload.title}'"`, { stdio: "ignore" });
  execSync(`git push -u origin ${pr.branch}`, { stdio: "inherit" });
});

// Return to main and fetch branches to show locally
console.log("\n🚀 Retornando a main...");
execSync("git checkout main", { stdio: "ignore" });
console.log("✅ Simulación de la comunidad completada exitosamente.");
