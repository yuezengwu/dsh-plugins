# Evidence and verification levels

The registry separates discovery, static checks, source review and runtime verification. Higher levels do not replace normal security review.

| Level | Stable registry | Meaning | Does not mean |
|---|---:|---|---|
| `community_listed` | No | A community source mentioned the project. Stored in `candidates/` only. | Identity, license or compatibility was confirmed. |
| `manifest_checked` | Yes | Package or plugin metadata and the pinned source were checked statically. | The plugin was installed, executed or proven safe. |
| `source_reviewed` | Yes | Relevant source paths and declared behavior were reviewed at a pinned commit. | Complete audit, vulnerability-free code or runtime verification. |
| `runtime_verified` | Yes | A documented isolated run was completed for the stated version and scenario. | Safety in every environment or future version. |

Every record includes a date and fixed commit. When evidence becomes stale, maintainers may downgrade or deprecate the record instead of silently preserving the old claim.

