# Change Proposal: v0.7.0 Aware & Multiplatform

## Why

v0.6.0 发布了 Fast & Aware 的三个特性（快速路径、阶段防漂移、决策点协议），但发布后发现 **部分平台的安装没有生效**：

1. **Cursor**：`.cursor-plugin/plugin.json` 中的 `skills` 字段不被 Cursor 识别。Cursor 实际通过 `.cursor/skills/`、`.cursor/rules/`、`.cursor/commands/` 等目录或专用安装脚本加载技能，导致用户按 INSTALL.md 操作后看不到 skill。
2. **GitHub Copilot CLI**：根目录 `plugin.json` 中 `"author": "MageByte"` 是字符串，而 Copilot 插件清单要求 `author` 为对象（`{ "name": "..." }`），严格校验下可能导致安装失败。

同时，v0.6.0 design.md 的展望列出了三个方向：

- 自动模式检测（从显式声明改为自动推断 hotfix/tweak/full）
- 多平台 phase-guard 注入（Cursor rules / Copilot instructions / Gemini GEMINI.md）
- 决策点审计报告（从 `.spec-superflow.yaml` 的 `dp_N_*` 字段生成摘要）

v0.7.0 的目标是先修 bug，再把这三个 Aware 特性补齐，让 spec-superflow 在 7 个目标平台（Claude Code / Cursor / Codex / OpenCode / Copilot CLI / Gemini CLI / Trae）上都能一致安装和运行。

另外，v0.6.0 的 README 曾把部分轻微需求场景排除在外；v0.7.0 的自动模式检测正是为了让各种规模的需求都能使用 spec-superflow，无论是一次几行代码的热修复，还是跨模块的完整功能，都能自动匹配到合适的流程模式。

## What Changes

- 修复 Cursor 安装：提供 Cursor 专用部署方式（`.cursor/` 目录结构或安装脚本），更新 INSTALL.md。
- 修复 Copilot CLI 安装：把根目录 `plugin.json` 的 `author` 字段改为对象格式。
- workflow-orchestrator 实现自动模式检测，根据变更文件数和类型推断 workflow 模式。
- `ssf inject` 扩展为多平台注入：同时生成/更新 `.cursor/rules/`、Copilot instructions、Gemini `GEMINI.md` 等平台的阶段规则。
- 新增 `ssf audit`（或 `ssf report`）子命令，从状态文件生成决策点审计报告。
- 相关 skill 文件更新（workflow-orchestrator、closure-archivist 等引用新命令）。
- 将 `templates/` 下的规划模板中文化，使设计文档与项目中文优先的约定一致。
- 版本号 → 0.7.0 + CHANGELOG + README 更新。

## Capabilities

### New Capabilities

- `auto-mode-detection` — 自动推断 hotfix / tweak / full 模式
- `multi-platform-phase-guard` — 一次注入，多平台阶段规则同步
- `decision-point-audit-report` — 决策点审计报告生成

### Modified Capabilities

- `platform-installation` — 修复 Cursor 和 Copilot CLI 的安装问题
- `workflow-orchestrator` — 新增自动模式检测逻辑
- `closure-archivist` — 支持输出/归档决策点审计报告

## Scope

### In Scope

- Cursor：`.cursor/` 目录部署或安装脚本，使 skill/rules 可被 Cursor 加载
- Copilot CLI：根 `plugin.json` 的 `author` 格式修复
- 自动模式检测：基于文件数、文件类型、模块变更推断 workflow
- 多平台注入：`ssf inject` 扩展生成 Cursor rules / Copilot instructions / Gemini GEMINI.md
- 决策点审计报告：读取 `dp_N_result` + `dp_N_timestamp` 生成 markdown 报告
- 模板中文化：`templates/` 下的 `proposal.md`、`design.md`、`tasks.md`、`spec.md`、`execution-contract.md` 模板翻译成中文
- 版本号同步到 0.7.0

### Out of Scope

- 新增 skill（保持 9 个 skill 不变）
- 修改 `src/validation/validator.ts`
- CI/CD 流程变更
- 支持 7 平台以外的客户端

## Impact

- **Affected code areas**: `plugin.json`、`.cursor-plugin/`、`scripts/lib/cmd-inject.mjs`、`scripts/lib/cmd-state.mjs`（或新增 `cmd-audit.mjs`）、`skills/workflow-orchestrator/SKILL.md`、`skills/closure-archivist/SKILL.md`。
- **Affected APIs or interfaces**: 新增/扩展 `ssf inject` 行为；可能新增 `ssf audit` 子命令；INSTALL.md 更新。
- **Dependencies or systems touched**: Cursor 本地 `.cursor/` 目录、Copilot CLI 插件缓存、Gemini CLI 扩展上下文。
