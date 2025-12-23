#!/usr/bin/env bun

import OpenAI from "openai";

const args = process.argv.slice(2);

// Handle --install-skill
if (args.includes("--install-skill")) {
  const homeDir = process.env.HOME || process.env.USERPROFILE;
  if (!homeDir) {
    console.error("Error: Could not determine home directory");
    process.exit(1);
  }

  const targetDir = `${homeDir}/.claude/skills/webresearcher`;
  const targetPath = `${targetDir}/SKILL.md`;

  const scriptDir = import.meta.dir;
  const sourcePath = `${scriptDir}/../.claude/skills/webresearcher/SKILL.md`;

  // Verify source exists
  const sourceFile = Bun.file(sourcePath);
  if (!(await sourceFile.exists())) {
    console.error("Error: Could not find SKILL.md source file");
    process.exit(1);
  }

  try {
    await Bun.spawn(["mkdir", "-p", targetDir]).exited;
    const content = await sourceFile.text();
    await Bun.write(targetPath, content);
    console.log(`Installed skill to ${targetPath}`);
    process.exit(0);
  } catch (error) {
    console.error("Error installing skill:", error instanceof Error ? error.message : "Unknown error");
    process.exit(1);
  }
}

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

// Validate API key
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error("Error: OPENAI_API_KEY environment variable is required");
  process.exit(1);
}

// Create client and make request
const client = new OpenAI({ apiKey });

try {
  const response = await client.responses.create({
    model: "gpt-5.2",
    reasoning: { effort },
    tools: [{ type: "web_search" }],
    input: query,
  });

  if (!response.output_text) {
    console.error("Error: No response received from API");
    process.exit(1);
  }

  console.log(response.output_text);
} catch (error) {
  console.error("Error:", error instanceof Error ? error.message : "Unknown error occurred");
  process.exit(1);
}
