# Permission taxonomy

Permission labels are review prompts, not sandbox guarantees.

| Capability | Review focus |
|---|---|
| `filesystem_read` | Files and directories that may be read |
| `filesystem_write` | Files that may be created, modified or deleted |
| `command_execution` | Shell commands, subprocesses and inherited environment |
| `network_access` | Remote endpoints, request payloads and telemetry |
| `credentials` | Tokens, keys, cookies and storage locations |
| `browser_control` | Browser profiles, pages and authenticated sessions |
| `remote_control` | Remote message or device entry points |
| `session_data` | Conversation, context and persistent memory |
| `ui_injection` | Client, sidebar or other user-interface extensions |
| `agent_orchestration` | Delegation, sub-agents and result aggregation |
| `plugin_management` | Installing, removing or changing other plugins |
| `unspecified` | Evidence is not detailed enough to classify yet |

`permissions.status: inferred` means the warning was inferred from category or public description. `reviewed` means relevant pinned source was inspected; it still does not prove runtime behavior.

