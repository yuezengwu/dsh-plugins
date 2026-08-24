import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { loadCategories, loadRecords, repositoryRoot } from "../scripts/registry-lib.mjs";

test("首发稳定数据保持 281 条且 ID 唯一", async () => {
  const rows = await loadRecords();
  assert.equal(rows.length, 281);
  assert.equal(new Set(rows.map(({ record }) => record.id)).size, 281);
});

test("每条记录都使用固定 commit 并链接 52DSH 详情页", async () => {
  const rows = await loadRecords();
  for (const { record } of rows) {
    assert.match(record.repository.commit, /^[0-9a-f]{40}$/);
    assert.match(record.links.detail_zh, /^https:\/\/52dsh\.com\/(?:plugins|cases)\/.+\/$/);
  }
});

test("生成数据与分类索引可供机器和人阅读", async () => {
  const categories = await loadCategories();
  const registry = JSON.parse(await readFile(path.join(repositoryRoot, "generated", "registry.json"), "utf8"));
  const index = await readFile(path.join(repositoryRoot, "generated", "index.md"), "utf8");
  assert.equal(registry.count, 281);
  assert.equal(categories.length, 12);
  for (const category of categories) assert.match(index, new RegExp(category.label_zh));
});
