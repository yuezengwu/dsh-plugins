import { readFile } from "node:fs/promises";
import path from "node:path";
import { loadCategories, loadRecords, repositoryRoot, validateRecord } from "./registry-lib.mjs";

const categories = await loadCategories();
const categoryIds = new Set(categories.map((category) => category.id));
const rows = await loadRecords();
const failures = [];
const ids = new Set();
const slugs = new Set();

for (const { record, relativeFile } of rows) {
  for (const error of validateRecord(record, relativeFile, categoryIds)) failures.push(`${relativeFile}: ${error}`);
  if (ids.has(record.id)) failures.push(`${relativeFile}: 重复 ID ${record.id}`);
  if (slugs.has(record.slug)) failures.push(`${relativeFile}: 重复 slug ${record.slug}`);
  ids.add(record.id);
  slugs.add(record.slug);
  const source = await readFile(path.join(repositoryRoot, relativeFile), "utf8");
  const secretPatterns = [
    /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
    /\bgh[pousr]_[A-Za-z0-9]{30,}\b/,
    /\b(?:api[_-]?key|secret|token)\s*[:=]\s*["']?[A-Za-z0-9_-]{24,}/i,
  ];
  if (secretPatterns.some((pattern) => pattern.test(source))) failures.push(`${relativeFile}: 疑似包含凭据或私钥`);
}

if (rows.length < 281) failures.push(`稳定记录不应低于既有基线 281，实际 ${rows.length}`);
const generated = JSON.parse(await readFile(path.join(repositoryRoot, "generated", "registry.json"), "utf8"));
if (generated.count !== rows.length || generated.items?.length !== rows.length) failures.push("generated/registry.json 数量与 YAML 不一致");
if (new Set(generated.items?.map((item) => item.id)).size !== rows.length) failures.push("generated/registry.json 包含重复 ID");
if (failures.length) throw new Error(`注册表验证失败：\n${failures.slice(0, 30).join("\n")}${failures.length > 30 ? `\n...另有 ${failures.length - 30} 项` : ""}`);
console.log(`注册表验证通过：${rows.length} 条稳定记录、${categoryIds.size} 个分类；未安装或执行任何第三方插件。`);
