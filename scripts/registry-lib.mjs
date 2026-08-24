import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";

export const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const stableVerificationLevels = new Set(["manifest_checked", "source_reviewed", "runtime_verified"]);
export const riskLevels = new Set(["low", "medium", "high"]);
export const permissionStatuses = new Set(["inferred", "reviewed"]);

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(target));
    else if (entry.isFile() && /\.ya?ml$/i.test(entry.name)) files.push(target);
  }
  return files.sort();
}

export async function loadCategories() {
  const source = YAML.parse(await readFile(path.join(repositoryRoot, "categories", "categories.yaml"), "utf8"));
  if (source?.schema_version !== 1 || !Array.isArray(source.categories)) throw new Error("categories/categories.yaml 结构无效。");
  return source.categories;
}

export async function loadRecords() {
  const files = await walk(path.join(repositoryRoot, "registry"));
  return Promise.all(files.map(async (file) => ({
    file,
    relativeFile: path.relative(repositoryRoot, file),
    record: YAML.parse(await readFile(file, "utf8")),
  })));
}

export function expectedRecordPath(record) {
  const match = record.id?.match(/^github:([^/]+)\/([^#]+)(?:#path:\/(.+))?$/i);
  if (!match) return undefined;
  const [, owner, repository, subpath] = match;
  const suffix = subpath ? `--${subpath.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}` : "";
  return path.join("registry", owner.toLowerCase(), `${repository.toLowerCase()}${suffix}.yaml`);
}

export function validateRecord(record, relativeFile, categoryIds) {
  const errors = [];
  const requireText = (value, field) => { if (typeof value !== "string" || !value.trim()) errors.push(`${field} 缺失`); };
  if (record?.schema_version !== 1) errors.push("schema_version 必须为 1");
  requireText(record?.id, "id");
  requireText(record?.slug, "slug");
  requireText(record?.name, "name");
  if (!/^github:[^/]+\/[^#]+(?:#path:\/.+)?$/i.test(record?.id ?? "")) errors.push("id 格式无效");
  if (expectedRecordPath(record) !== relativeFile) errors.push(`文件路径应为 ${expectedRecordPath(record)}`);
  if (!/^https:\/\/github\.com\/[^/]+\/[^/]+\/?$/i.test(record?.repository?.url ?? "")) errors.push("repository.url 必须是 GitHub 仓库根地址");
  if (!/^[0-9a-f]{40}$/.test(record?.repository?.commit ?? "")) errors.push("repository.commit 必须是 40 位小写 commit");
  if (!categoryIds.has(record?.category)) errors.push(`未知分类 ${record?.category}`);
  if (!stableVerificationLevels.has(record?.verification?.level)) errors.push("verification.level 未达到稳定注册表门槛");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(record?.verification?.verified_on ?? "")) errors.push("verification.verified_on 必须是日期");
  if (!riskLevels.has(record?.risk_level)) errors.push("risk_level 无效");
  if (!permissionStatuses.has(record?.permissions?.status)) errors.push("permissions.status 无效");
  if (!Array.isArray(record?.permissions?.capabilities) || !record.permissions.capabilities.length) errors.push("permissions.capabilities 不能为空");
  requireText(record?.license?.spdx, "license.spdx");
  requireText(record?.summary?.zh, "summary.zh");
  if (!/^https:\/\/52dsh\.com\/(?:plugins|cases)\/.+\/$/.test(record?.links?.detail_zh ?? "")) errors.push("links.detail_zh 无效");
  if (record?.links?.tutorial_zh && !/^https:\/\/52dsh\.com\/tutorials\/.+\/$/.test(record.links.tutorial_zh)) errors.push("links.tutorial_zh 无效");
  if (record?.dsh?.kind !== "plugin") errors.push("dsh.kind 必须是 plugin");
  return errors;
}

export function escapeTable(value) {
  return String(value ?? "").replace(/\|/g, "\\|").replace(/\s+/g, " ").trim();
}
