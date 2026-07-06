#!/usr/bin/env node
// Bumps the app's cache-busting version number everywhere it is hand-duplicated:
//   - index.html: `?v=N` on the manifest, styles.css, firebase-config.js, and app.js links
//   - sw.js: CACHE_NAME ("family-food-planner-vN") and `?v=N` inside APP_SHELL
//   - app.js: APP_CACHE_VERSION = "N"
//
// Usage: node scripts/bump-version.mjs <new-version-number>
//
// Fails loudly (non-zero exit, clear message) if any expected spot is not
// found, so a refactor can never silently orphan one of these locations on an
// old version. Validates every pattern in every file before writing anything,
// so a failure never leaves the files partially bumped.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

function fail(message) {
  console.error(`bump-version: ${message}`);
  process.exit(1);
}

const newVersion = process.argv[2];
if (!newVersion || !/^\d+$/.test(newVersion)) {
  fail("expected a new version number as the first argument, e.g. `node scripts/bump-version.mjs 11`");
}

// Replace every occurrence of `pattern` in `text`, requiring at least
// `minCount` matches. Returns the updated text.
function replaceRequired(text, pattern, replacement, minCount, label) {
  const matches = text.match(pattern);
  const count = matches ? matches.length : 0;
  if (count < minCount) {
    fail(`could not find expected pattern (${label}) - found ${count}, need at least ${minCount}`);
  }
  return text.replace(pattern, replacement);
}

function readSource(path) {
  const fullPath = join(ROOT, path);
  try {
    return readFileSync(fullPath, "utf8");
  } catch (error) {
    fail(`could not read ${path}: ${error.message}`);
    return "";
  }
}

const queryStringPattern = (file) => new RegExp(`(${file.replace(/\./g, "\\.")}\\?v=)\\d+`, "g");

// --- index.html: four `?v=N` query strings ---
let indexHtml = readSource("index.html");
["manifest.webmanifest", "styles.css", "firebase-config.js", "app.js"].forEach((file) => {
  indexHtml = replaceRequired(indexHtml, queryStringPattern(file), `$1${newVersion}`, 1, `index.html ${file}?v=N`);
});

// --- sw.js: CACHE_NAME + four `?v=N` query strings inside APP_SHELL ---
let swJs = readSource("sw.js");
swJs = replaceRequired(
  swJs,
  /(const CACHE_NAME = "family-food-planner-v)\d+(")/,
  `$1${newVersion}$2`,
  1,
  "sw.js CACHE_NAME",
);
["styles.css", "app.js", "firebase-config.js", "manifest.webmanifest"].forEach((file) => {
  swJs = replaceRequired(swJs, queryStringPattern(file), `$1${newVersion}`, 1, `sw.js APP_SHELL ${file}?v=N`);
});

// --- app.js: APP_CACHE_VERSION ---
let appJs = readSource("app.js");
appJs = replaceRequired(
  appJs,
  /(const APP_CACHE_VERSION = ")\d+(")/,
  `$1${newVersion}$2`,
  1,
  "app.js APP_CACHE_VERSION",
);

// Every pattern was found and replaced above (any miss called fail() and
// exited already), so it is now safe to write all three files.
writeFileSync(join(ROOT, "index.html"), indexHtml);
writeFileSync(join(ROOT, "sw.js"), swJs);
writeFileSync(join(ROOT, "app.js"), appJs);

console.log(`Bumped cache version to ${newVersion} in index.html, sw.js, and app.js.`);
