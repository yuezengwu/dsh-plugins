import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { buildReadmeIndex } from "./build-readme-index.mjs";
import { loadRecords, repositoryRoot } from "./registry-lib.mjs";

const rows = await loadRecords();
const items = rows.map(({ record }) => record).sort((a, b) => a.id.localeCompare(b.id));
const dates = items.map((item) => item.maintenance?.checked_on).filter(Boolean).sort();
const generatedAt = `${dates.at(-1) ?? "1970-01-01"}T00:00:00.000Z`;
const registry = { schema_version: 1, generated_at: generatedAt, count: items.length, items };
const generatedDir = path.join(repositoryRoot, "generated");
await mkdir(generatedDir, { recursive: true });

const pretty = `${JSON.stringify(registry, null, 2)}\n`;
const compact = `${JSON.stringify(registry)}\n`;
const ndjson = `${items.map((item) => JSON.stringify(item)).join("\n")}\n`;
const countBy = (field) => Object.fromEntries(Object.entries(Object.groupBy(items, field)).sort().map(([key, values]) => [key, values.length]));
const stats = {
  schema_version: 1,
  generated_at: generatedAt,
  total: items.length,
  by_category: countBy((item) => item.category),
  by_verification: countBy((item) => item.verification.level),
  by_risk: countBy((item) => item.risk_level),
  with_chinese_tutorial: items.filter((item) => item.links.tutorial_zh).length,
};

const outputs = new Map([
  ["registry.json", pretty],
  ["registry.min.json", compact],
  ["registry.ndjson", ndjson],
  ["stats.json", `${JSON.stringify(stats, null, 2)}\n`],
]);
for (const [name, contents] of outputs) await writeFile(path.join(generatedDir, name), contents);
await buildReadmeIndex(items);
const checksumLines = [...outputs.entries()].map(([name, contents]) => `${createHash("sha256").update(contents).digest("hex")}  ${name}`);
await writeFile(path.join(generatedDir, "checksums.sha256"), `${checksumLines.join("\n")}\n`);
console.log(`生成稳定注册表：${items.length} 条。`);

