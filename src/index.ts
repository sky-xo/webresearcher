#!/usr/bin/env bun

const args = process.argv.slice(2);

// Parse --effort flag
let effort: "low" | "medium" | "high" = "medium";
const effortIndex = args.indexOf("--effort");
if (effortIndex !== -1) {
  const value = args[effortIndex + 1];
  if (value === "low" || value === "medium" || value === "high") {
    effort = value;
    args.splice(effortIndex, 2);
  } else {
    console.error("Error: --effort must be low, medium, or high");
    process.exit(1);
  }
}

// Remaining arg is the query
const query = args[0];

if (!query) {
  console.error("Usage: webresearcher [--effort low|medium|high] \"your query\"");
  process.exit(1);
}

console.log(`Query: ${query}`);
console.log(`Effort: ${effort}`);
