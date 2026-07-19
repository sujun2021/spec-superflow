---

description: 为一个 spec-superflow change 保存兼容 checkpoint
argument-hint: "<change-name-or-path> --task <id> --next <next-step>"
allowed-tools: Bash(npx:*)
---

`$ARGUMENTS` 必须明确提供 change、`--task` 和 `--next`。信息不足时先询问一次；不要编造 verification 或 review 证据。

确认参数后运行 `npx --yes --package spec-superflow@0.10.0 ssf save $ARGUMENTS --json`。只报告 CLI 返回的 checkpoint 结果，并保留现有状态机和存储边界。
