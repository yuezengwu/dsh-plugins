[简体中文](README.md) | **English**

# 52DSH Plugin Registry — DeepSeek Harness (DSH) Plugins

**An open, machine-readable, evidence-graded community registry for DeepSeek Harness (DSH) plugins, Skills and MCP servers.**

[![Registry validation](https://github.com/tuofangzhe/dsh-plugins/actions/workflows/validate.yml/badge.svg)](https://github.com/tuofangzhe/dsh-plugins/actions/workflows/validate.yml)
[![52DSH plugin hub](https://img.shields.io/badge/52DSH-plugin_hub-356ae6)](https://52dsh.com/plugins/)

Each stable record pins a repository commit, records the license, compatibility claim, permission hints and an evidence level, and links to a Chinese detail page and step-by-step installation guide on [52dsh.com](https://52dsh.com/plugins/). The primary documentation of this repository is in Chinese — see [README.md](README.md).

> **Independent community project.** 52DSH is not the official DeepSeek Harness repository. A listing is not a security endorsement, and `manifest_checked` or `source_reviewed` does not mean the plugin has been installed or run by 52DSH.

<!-- REGISTRY_STATS_START -->

Stable records: **281** · source-reviewed: **142** · manifest-checked: **139** · Chinese install guides: **50** · data checked through 2026-08-22

**281** 个稳定收录 · 源码审阅 **142** · 清单核验 **139** · 中文配置教程 **50** 篇 · 数据核验至 2026-08-22

<!-- REGISTRY_STATS_END -->

## Data access

- Full JSON: [`generated/registry.json`](generated/registry.json) ([raw](https://raw.githubusercontent.com/tuofangzhe/dsh-plugins/main/generated/registry.json))
- Compact JSON: [`generated/registry.min.json`](generated/registry.min.json) ([raw](https://raw.githubusercontent.com/tuofangzhe/dsh-plugins/main/generated/registry.min.json))
- NDJSON: [`generated/registry.ndjson`](generated/registry.ndjson) ([raw](https://raw.githubusercontent.com/tuofangzhe/dsh-plugins/main/generated/registry.ndjson))
- Field schema: [`schemas/plugin.schema.json`](schemas/plugin.schema.json)
- Statistics: [`generated/stats.json`](generated/stats.json)

The stable registry only includes records that reached `manifest_checked`, `source_reviewed`, or `runtime_verified`. Discovery leads live in `candidates/` and are not part of the stable output.

## Evidence levels

| Level | Meaning |
|---|---|
| `community_listed` | Discovery source and basic repository facts recorded; not part of the stable registry |
| `manifest_checked` | Manifest, package name and license verified against a pinned commit |
| `source_reviewed` | Key source code and permission boundaries reviewed at a pinned commit |
| `runtime_verified` | Independently run and verified in a recorded environment |
| `deprecated` | Archived, broken, seriously problematic, or unmaintained |

No level equals a security certification. Full definitions: [docs/verification-levels.md](docs/verification-levels.md).

## Catalog by category

<!-- REGISTRY_CATEGORY_STATS_START -->

| Category | 中文分类 | Plugins |
|---|---|---:|
| Plugin management | 插件管理 | 19 |
| UI & interaction | 界面交互 | 84 |
| Knowledge & memory | 知识与记忆 | 24 |
| Agents & workflows | Agent 与工作流 | 26 |
| Coding & development | 编程与代码开发 | 24 |
| Vision & OCR | 图片识别与视觉 | 2 |
| Browser & web access | 浏览器与联网工具 | 6 |
| Tools & utilities | 工具能力 | 37 |
| Security & governance | 安全治理 | 12 |
| Models & infrastructure | 模型与基建 | 19 |
| Notifications & remote | 通知远程 | 16 |
| Product integrations | 产品集成 | 12 |

<!-- REGISTRY_CATEGORY_STATS_END -->

The full per-plugin index (with Chinese summaries and links to detail pages) is embedded in the [Chinese README](README.md) and available as [`generated/index.md`](generated/index.md). Chinese installation and configuration guides live at [52dsh.com/plugins/](https://52dsh.com/plugins/).

## Contributing

Plugin authors can submit a record, claim an existing record, or correct evidence through an Issue or Pull Request. Read [CONTRIBUTING.md](CONTRIBUTING.md) and the [plugin author guide](docs/plugin-author-guide.md) first.

Validation never installs or executes submitted third-party plugins. Review levels and permission terms are defined in [`docs/`](docs/).

## Licenses

- Code, scripts and documentation scaffolding: [MIT](LICENSE-CODE)
- Registry records and generated datasets: [CC BY 4.0](LICENSE-DATA)

When reusing the data, attribute **52DSH Plugin Registry** and link to both this repository and [52dsh.com](https://52dsh.com/).
