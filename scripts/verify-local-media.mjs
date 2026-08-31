import { existsSync, readdirSync, statSync } from "node:fs";
import { resolve, relative } from "node:path";

const root = resolve("public");
const allowed = new Set([".png", ".jpg", ".jpeg", ".webp", ".svg", ".mp4"]);
const invalid = [];
let files = 0;

function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const file = resolve(dir, entry.name);
    if (entry.isDirectory()) walk(file);
    else {
      files += 1;
      if ([".md", ".html", ".ico", ".ttf", ".woff", ".woff2"].some((suffix) => entry.name.toLowerCase().endsWith(suffix))) continue;
      if (!allowed.has(entry.name.slice(entry.name.lastIndexOf(".")).toLowerCase())) {
        invalid.push(relative(root, file));
      }
    }
  }
}

walk(root);
if (!existsSync(resolve("src/lib/content/local/tireIqArticles.json"))) {
  invalid.push("missing src/lib/content/local/tireIqArticles.json");
}
if (invalid.length) {
  console.error(`Local media validation failed: ${invalid.join(", ")}`);
  process.exit(1);
}
console.log(`Local media validation passed: ${files} public files`);
