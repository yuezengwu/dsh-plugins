import { loadRecords } from "./registry-lib.mjs";

const rows = await loadRecords();
const errors = [];
for (const { record, relativeFile } of rows) {
  for (const [field, value] of Object.entries({ repository: record.repository?.url, source: record.links?.source, detail_zh: record.links?.detail_zh, tutorial_zh: record.links?.tutorial_zh })) {
    if (!value) continue;
    try {
      const url = new URL(value);
      if (url.protocol !== "https:") errors.push(`${relativeFile}: ${field} 不是 HTTPS`);
    } catch {
      errors.push(`${relativeFile}: ${field} URL 无效`);
    }
  }
}
if (errors.length) throw new Error(errors.join("\n"));
console.log(`静态链接格式检查通过：${rows.length} 条。未向第三方站点发起请求。`);

