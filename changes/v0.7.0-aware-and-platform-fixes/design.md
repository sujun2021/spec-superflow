# 技术设计：v0.7.0 Aware & Multiplatform

**Date:** 2026-06-30  
**Version:** 0.6.0 → 0.7.0  
**Goal:** 修复当前平台安装问题，补齐 v0.6.0 展望的三个 Aware 特性。

---

## 1. 背景

### 1.1 当前状态

v0.6.0 已发布：

- `workflow-orchestrator` 支持显式 `workflow` 字段（full / hotfix / tweak）。
- `ssf inject` 生成 `.claude/always/phase-guard.md`。
- `.spec-superflow.yaml` 记录 14 个 DP 审计字段。
- 支持 7 个平台：Claude Code / Cursor / Codex / OpenCode / Copilot CLI / Gemini CLI / Trae。

### 1.2 已知问题

- **Cursor**：`.cursor-plugin/plugin.json` 中的 `skills` 字段不被 Cursor 识别；Cursor 通过 `.cursor/` 目录（skills/rules/commands/hooks）加载。
- **Copilot CLI**：根 `plugin.json` 的 `"author": "MageByte"` 是字符串，Copilot 要求 `author` 为对象。

### 1.3 约束

- 零外部 npm 依赖。
- 不改动 `src/validation/validator.ts`。
- 不破坏现有 9 个 skill 的核心逻辑。
- 复用 v0.6.0 基础设施（guard.mjs、state-loader.mjs、cmd-inject.mjs、cmd-state.mjs）。

---

## 2. 目标与非目标

### 2.1 目标

1. **修复平台安装 bug**
   - Cursor：提供 `.cursor/` 目录部署或安装脚本。
   - Copilot CLI：修正 `plugin.json` 的 `author` 格式。
2. **自动模式检测**：根据变更内容自动推断 workflow 模式，减少用户显式声明。
3. **多平台 phase-guard 注入**：一次 `ssf inject` 同时更新 `.claude/always/`、Cursor rules、Copilot instructions、Gemini `GEMINI.md`。
4. **决策点审计报告**：新增 `ssf audit`（或 `ssf report`）子命令，生成 markdown 报告。

### 2.2 非目标

- 不新增 skill。
- 不修改 validator.ts。
- 不支持 7 平台以外的客户端。
- 不改动 CI/CD 流程。

---

## 3. 架构决策

### 决策 1: Cursor 采用 `.cursor/` 目录本地部署

- **选择**：提供一个 `scripts/install-cursor.mjs`（或 bash 脚本），将 `skills/` 复制/链接到 `.cursor/skills/`，并生成 `.cursor/rules/phase-guard.mdc` 与 `.cursor/hooks.json`。
- **理由**：Cursor 官方/社区案例（如 thrum）均采用 `.cursor/` 目录部署；`.cursor-plugin/plugin.json` 不被证明能自动加载 skills。
- **替代方案**：继续维护 `.cursor-plugin/plugin.json` 并祈祷 Cursor 未来支持 — 不可接受。

### 决策 2: 自动模式检测放在 workflow-orchestrator

- **选择**：workflow-orchestrator 在路由前读取 proposal/contract 或 git diff，计算文件数、模块、文件类型，自动设置 workflow。
- **理由**：模式检测是路由逻辑的一部分，放在 orchestrator 最自然。
- **替代方案**：新增独立脚本 — 增加命令复杂度。

### 决策 3: 多平台注入扩展 cmd-inject.mjs

- **选择**：`cmd-inject.mjs` 维护一个 `PLATFORM_TEMPLATES` 映射，根据当前状态生成各平台需要的文件内容，分别写入 `.claude/always/phase-guard.md`、`.cursor/rules/phase-guard.mdc`、`.github/copilot-instructions.md`（或 `.copilot/`）、`GEMINI.md` 追加段。
- **理由**：复用现有 PHASE_TEMPLATES，零依赖，集中管理。
- **替代方案**：每个平台单独命令 — 增加 CLI 复杂度。

### 决策 4: DP 审计报告从状态文件生成

- **选择**：新增 `scripts/lib/cmd-audit.mjs`，读取 `.spec-superflow.yaml` 的 `dp_N_*` 字段，生成 `changes/<change>/decision-point-audit.md`。
- **理由**：状态文件已是审计数据的汇总；新增独立审计日志会引入额外文件管理负担。
- **替代方案**：新增 `.spec-superflow-audit.jsonl` — 与 v0.5.0 "状态文件可重建" 原则冲突。

---

## 4. 详细设计

### 4.1 平台安装修复

#### Cursor

- 新增 `scripts/install-cursor.mjs`：
  - 创建 `.cursor/skills/` 并把 `skills/` 下的 9 个 skill 复制/链接过去。
  - 创建 `.cursor/rules/phase-guard.mdc`（Cursor rules 格式，带 `alwaysApply: true`）。
  - 可选：创建 `.cursor/hooks.json` 用于 SessionStart 注入。
- 更新 `INSTALL.md`：Cursor 部分改为先运行 `node scripts/install-cursor.mjs`。
- 保留 `.cursor-plugin/plugin.json` 作为备份/未来兼容，但 INSTALL.md 不再推荐仅依赖它。

#### Copilot CLI

- 修改根 `plugin.json`：
  ```json
  "author": {
    "name": "MageByte",
    "url": "https://github.com/MageByte-Zero"
  }
  ```
- `ssf doctor` 增加对根 `plugin.json` 的 `author` 格式检查。

### 4.2 自动模式检测

v0.6.0 的 README 曾把部分轻微需求场景排除在外，导致用户觉得只有大型变更才值得使用 spec-superflow。v0.7.0 的自动模式检测通过把 `hotfix`/`tweak` 也纳入标准流程，让一次几行代码的修复、配置或文档调整都能自动匹配到合适的轻量模式，从而覆盖各种规模的变更。

workflow-orchestrator 在读取 `.spec-superflow.yaml` 的 `workflow` 字段后：

1. 如果用户显式声明 hotfix/tweak，仍保留显式值。
2. 如果未声明或 full：
   - 读取 `proposal.md` 的 `## Scope` / `## What Changes`。
   - 读取 `tasks.md` 中的任务数量和涉及文件数。
   - 规则：
     - ≤2 文件、无新模块、无 schema/API 变更 → hotfix
     - ≤4 文件、纯配置/文档/markdown → tweak
     - 否则 → full
3. 自动设置后输出推断结果和原因。

### 4.3 多平台 phase-guard 注入

`cmd-inject.mjs` 扩展：

```
export async function run(args)
  ├── parseArgs: <change-dir> [--platforms <list>] [--json]
  ├── readState(changeDir)
  ├── 选择当前状态模板: PHASE_TEMPLATES[state]
  ├── 生成各平台文件:
  │     .claude/always/phase-guard.md
  │     .cursor/rules/phase-guard.mdc
  │     .github/copilot-instructions.md（或 .copilot/instructions.md）
  │     GEMINI.md（追加或更新段）
  └── 输出成功摘要
```

默认注入所有已识别平台；`--platforms cursor,copilot` 可限定。

### 4.4 决策点审计报告

新增 `scripts/lib/cmd-audit.mjs`：

```
ssf audit <change-dir> [--output <file>]
```

- 读取状态文件中的 `dp_1_result` ... `dp_7_timestamp`。
- 生成 `changes/<change>/decision-point-audit.md`，包含：
  - 每个 DP 的结果、时间戳、是否缺失。
  - 一个汇总表和结论。

### 4.5 模板中文化

将 `templates/` 下的静态英文模板翻译成中文，与项目中文优先的约定一致：

- `proposal.md`：标题、章节提示语中文化，保留结构化占位符。
- `design.md`：章节标题和提示语中文化，便于中文用户填写技术设计。
- `tasks.md`：任务列表提示中文化。
- `spec.md`：需求/场景模板中文化，保留 `SHALL`/`MUST` 等英文关键字（平台规范要求）。
- `execution-contract.md`：合同章节提示中文化。

原则：
- 占位符和示例保留中文自然表达。
- 不影响 `spec-forger` 等 skill 对关键字（如 `#### Scenario:`）的解析。
- 仅翻译模板，不强制要求历史 change 的 artifacts 回改。

---

## 5. 数据流

### 5.1 自动模式检测

```
用户请求 → workflow-orchestrator
  → 读取 state.workflow
  → 未声明则读取 proposal/tasks
  → 推断 workflow → ssf state set <dir> workflow <mode>
  → 继续正常路由
```

### 5.2 多平台注入

```
ssf inject <change-dir>
  → 读状态
  → 生成 .claude/always/phase-guard.md
  → 生成 .cursor/rules/phase-guard.mdc
  → 生成 .github/copilot-instructions.md
  → 更新 GEMINI.md 对应段
```

### 5.3 DP 审计报告

```
closure-archivist 完成前
  → ssf audit <change-dir>
  → 生成 decision-point-audit.md
  → 用户确认后归档
```

---

## 6. 风险与缓解

| 风险 | 缓解 |
|------|------|
| Cursor 规则格式变化 | 使用最简 `.mdc` 格式（frontmatter + markdown），便于调整 |
| Copilot 对 author 对象有其他字段要求 | 仅使用 `name` + `url`，与 Claude/Codex 保持一致 |
| 自动模式检测误判 | 输出推断原因，用户可显式覆盖 |
| 多平台注入污染项目目录 | 默认写入平台标准目录，并提供 `--platforms` 限定 |
| DP 审计字段为空 | 报告中标记为 "未记录"，不中断流程 |

---

## 7. 文件清单

### 7.1 新增文件

| 文件 | 用途 | 估计行数 |
|------|------|---------|
| `scripts/lib/cmd-audit.mjs` | `ssf audit` 子命令 | ~120 |
| `scripts/install-cursor.mjs` | Cursor 本地部署脚本 | ~100 |
| `.cursor/rules/phase-guard.mdc` | Cursor 阶段规则（生成） | — |
| `.github/copilot-instructions.md` | Copilot 阶段规则（生成） | — |

### 7.2 修改文件

| 文件 | 改动 | 影响行数 |
|------|------|---------|
| `plugin.json` | `author` 改为对象 | ~5 |
| `scripts/lib/cmd-inject.mjs` | 扩展为多平台注入 | ~80 |
| `skills/workflow-orchestrator/SKILL.md` | 自动模式检测逻辑 | ~40 |
| `skills/closure-archivist/SKILL.md` | 引用 `ssf audit` | ~10 |
| `INSTALL.md` | Cursor/Copilot 安装说明更新 | — |
| `CHANGELOG.md` | v0.7.0 条目 | — |
| `package.json` 等 manifest | 版本 0.7.0 | 5 个文件 |

### 7.3 不变的东西

- 9 个 skill 的核心逻辑不变。
- `src/validation/validator.ts` 不变。
- 现有 CLI 命令不变（`list/validate/doctor/version/sync/config/state/inject`）。

---

## 8. 实现顺序

### Batch 1: 平台安装修复（预计 0.5 天）

- 修复根 `plugin.json` 的 `author`。
- 创建 `scripts/install-cursor.mjs` 并验证 `.cursor/` 部署。
- 更新 `INSTALL.md` 和 `ssf doctor`。

### Batch 2: 自动模式检测（预计 0.5 天）

- workflow-orchestrator 增加推断逻辑。
- 增加测试/示例。

### Batch 3: 多平台 phase-guard 注入（预计 1 天）

- 扩展 `cmd-inject.mjs`。
- 定义 Cursor `.mdc`、Copilot instructions、Gemini `GEMINI.md` 格式。

### Batch 4: 决策点审计报告（预计 0.5 天）

- 新增 `cmd-audit.mjs`。
- closure-archivist 引用。

### Batch 5: 集成 + 发布（预计 0.5 天）

- 版本号 0.7.0、CHANGELOG、README、doctor、发布。

---

## 9. 展望 v0.8.0

- 更细粒度的平台配置（各平台启用/禁用哪些 skill）。
- 插件市场自动刷新/缓存清理。
- 更丰富的决策点审计可视化。
