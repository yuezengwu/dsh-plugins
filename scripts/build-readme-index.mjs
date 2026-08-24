import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { escapeTable, loadCategories, loadRecords, repositoryRoot } from "./registry-lib.mjs";

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
  const readme = await readFile(readmePath, "utf8");
  const start = "<!-- REGISTRY_INDEX_START -->";
  const end = "<!-- REGISTRY_INDEX_END -->";
  const pattern = new RegExp(`${start}[\\s\\S]*?${end}`);
  if (!pattern.test(readme)) throw new Error("README 缺少注册表索引标记。");
  await writeFile(readmePath, readme.replace(pattern, `${start}\n\n${index.trim()}\n\n${end}`));
  return index;
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  await buildReadmeIndex();
  console.log("README 分类目录已生成。");
}

