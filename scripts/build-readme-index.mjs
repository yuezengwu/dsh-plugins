import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { escapeTable, loadCategories, loadRecords, repositoryRoot } from "./registry-lib.mjs";

async function replaceSection(filePath, start, end, body) {
  const source = await readFile(filePath, "utf8");
  const pattern = new RegExp(`${start}[\\s\\S]*?${end}`);
  if (!pattern.test(source)) throw new Error(`${path.basename(filePath)} 缺少 ${start} 标记。`);
  await writeFile(filePath, source.replace(pattern, `${start}\n\n${body.trim()}\n\n${end}`));
}

function buildStats(records) {
  const total = records.length;
  const byLevel = (level) => records.filter((record) => record.verification?.level === level).length;
  const tutorials = records.filter((record) => record.links?.tutorial_zh).length;
  const updated = records.map((record) => record.maintenance?.checked_on).filter(Boolean).sort().at(-1);
  return { total, sourceReviewed: byLevel("source_reviewed"), manifestChecked: byLevel("manifest_checked"), runtimeVerified: byLevel("runtime_verified"), tutorials, updated };
}

export async function buildReadmeIndex(recordsInput) {
  const categories = await loadCategories();
  const records = recordsInput ?? (await loadRecords()).map(({ record }) => record);
  const sections = [];
  for (const category of categories) {
    const items = records.filter((record) => record.category === category.id).sort((a, b) => a.name.localeCompare(b.name, "zh-CN"));
    if (!items.length) continue;
    sections.push(`### ${category.label_zh} (${items.length})`);
    sections.push("");
    sections.push("| 插件 | 中文功能摘要 | 证据等级 | 中文详情 |");
    sections.push("|---|---|---|---|");
    for (const item of items) {
      sections.push(`| ${escapeTable(item.name)} | ${escapeTable(item.summary.zh)} | \`${item.verification.level}\` | [功能、权限与配置](${item.links.detail_zh}) |`);
    }
    sections.push("");
  }
  const index = `${sections.join("\n").trim()}\n`;
  await writeFile(path.join(repositoryRoot, "generated", "index.md"), index);

  const readmePath = path.join(repositoryRoot, "README.md");
  await replaceSection(readmePath, "<!-- REGISTRY_INDEX_START -->", "<!-- REGISTRY_INDEX_END -->", index);

  const stats = buildStats(records);
  const statsZh = `**${stats.total}** 个稳定收录 · 源码审阅 **${stats.sourceReviewed}** · 清单核验 **${stats.manifestChecked}** · 中文配置教程 **${stats.tutorials}** 篇 · 数据核验至 ${stats.updated}`;
  const statsEn = `Stable records: **${stats.total}** · source-reviewed: **${stats.sourceReviewed}** · manifest-checked: **${stats.manifestChecked}** · Chinese install guides: **${stats.tutorials}** · data checked through ${stats.updated}`;
  await replaceSection(readmePath, "<!-- REGISTRY_STATS_START -->", "<!-- REGISTRY_STATS_END -->", `${statsZh}\n\n${statsEn}`);

  const englishReadmePath = path.join(repositoryRoot, "README.en.md");
  await replaceSection(englishReadmePath, "<!-- REGISTRY_STATS_START -->", "<!-- REGISTRY_STATS_END -->", `${statsEn}\n\n${statsZh}`);
  const categoryRows = categories
    .map((category) => ({ category, count: records.filter((record) => record.category === category.id).length }))
    .filter(({ count }) => count > 0)
    .map(({ category, count }) => `| ${category.label_en ?? category.id} | ${category.label_zh} | ${count} |`);
  const categoryTable = ["| Category | 中文分类 | Plugins |", "|---|---|---:|", ...categoryRows].join("\n");
  await replaceSection(englishReadmePath, "<!-- REGISTRY_CATEGORY_STATS_START -->", "<!-- REGISTRY_CATEGORY_STATS_END -->", categoryTable);
  return index;
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  await buildReadmeIndex();
  console.log("README 分类目录与统计已生成。");
}
