/**
 * Fails (exit 1) when any messages/<locale>.json is missing a key that exists in en.json,
 * has a different array length, a different value type, or drops an ICU argument / rich tag.
 * Extra keys only warn. Run: pnpm i18n:check
 */
import fs from "node:fs";
import path from "node:path";

type Json = string | number | boolean | null | Json[] | { [k: string]: Json };

const dir = path.join(process.cwd(), "messages");
const base = JSON.parse(fs.readFileSync(path.join(dir, "en.json"), "utf8")) as Json;

function flatten(obj: Json, prefix = "", out = new Map<string, Json>()) {
  if (obj !== null && typeof obj === "object") {
    out.set(prefix || "(root)", Array.isArray(obj) ? `array:${obj.length}` : "object");
    for (const [k, v] of Object.entries(obj)) flatten(v as Json, prefix ? `${prefix}.${k}` : k, out);
  } else out.set(prefix, obj);
  return out;
}

const tokens = (s: string) => {
  const args = [...s.matchAll(/\{(\w+)(?:,|\})/g)].map((m) => `{${m[1]}}`);
  const tags = [...s.matchAll(/<(\w+)>/g)].map((m) => `<${m[1]}>`);
  const legal = [...s.matchAll(/\{\{([A-Z_]+)\}\}/g)].map((m) => `{{${m[1]}}}`);
  return [...new Set([...args, ...tags, ...legal])].sort();
};

const baseFlat = flatten(base);
let failed = false;

for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".json") && f !== "en.json")) {
  const flat = flatten(JSON.parse(fs.readFileSync(path.join(dir, file), "utf8")) as Json);
  const errors: string[] = [];
  for (const [key, value] of baseFlat) {
    if (!flat.has(key)) {
      errors.push(`missing: ${key}`);
      continue;
    }
    const other = flat.get(key)!;
    if (typeof value !== typeof other) errors.push(`type differs: ${key}`);
    else if (typeof value === "string" && typeof other === "string") {
      if (value.startsWith("array:") || value === "object") {
        if (value !== other) errors.push(`shape differs: ${key} (${value} vs ${other})`);
      } else if (tokens(value).join() !== tokens(other).join()) {
        errors.push(`placeholders differ: ${key} (${tokens(value).join(" ")} vs ${tokens(other).join(" ")})`);
      } else if (!other.trim()) errors.push(`empty: ${key}`);
    }
  }
  const extra = [...flat.keys()].filter((k) => !baseFlat.has(k));
  if (extra.length) console.warn(`⚠ ${file}: ${extra.length} extra key(s): ${extra.slice(0, 10).join(", ")}`);
  if (errors.length) {
    failed = true;
    console.error(`✗ ${file}: ${errors.length} problem(s)\n  ${errors.join("\n  ")}`);
  } else console.log(`✓ ${file}: all ${baseFlat.size} keys present`);
}

process.exit(failed ? 1 : 0);
