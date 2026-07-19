---

description: 恢复一个 spec-superflow change，并按现有状态机继续
argument-hint: "[change-name-or-path]"
allowed-tools: Bash(npx:*)
---

运行 `npx --yes --package spec-superflow@0.10.0 ssf resume $ARGUMENTS --json`。

只使用返回的 `change`、`blockers` 和 `next_action`：存在 blocker 时停止并展示修复命令；否则通过 `workflow-start` 进入 `next_action` 指定的下一 skill。不要直接修改状态文件。
