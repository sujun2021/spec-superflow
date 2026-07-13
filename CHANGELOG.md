# Changelog

All notable changes to `spec-superflow` will be documented in this file.

The format loosely follows Keep a Changelog.

## [Unreleased]

### Fixed

- **#45 — Guarded execution control plane**: full/hotfix now default to SDD through a persisted execution plan; inline and Batch Inline require an explicit override, named waves record dependencies and write-conflict checks, and closing requires current `pass` review receipts for every wave.

## [0.9.0] - 2026-07-11

### Added

- **#37 — Model profiles**：可在 `spec-superflow.config.json` 中为 `mechanical`、`standard`、`strong`、`review` 配置平台模型 ID，并用 `ssf config --resolve-model <profile>` 只读解析；不执行跨平台自动模型切换，也不新增 runtime dependency。
- **#38 — Minimality discipline**：code-reviewer 现要求用任务依据审查无请求的依赖、配置、抽象与无关重构；保留 TDD、验证、安全和错误处理，不引入 Ponytail 或任何 runtime dependency。

## [0.8.17] - 2026-07-10

### Fixed

- Fixed canonical delta spec paths: validation, guard checks, hashing, sync, examples, and docs now use `specs/<capability>/spec.md`.
- Fixed `ssf inject` default behavior so ambiguous projects require `--platforms` instead of writing every platform file.
- Fixed hotfix fast-path guards so hotfix can skip full planning artifacts while still requiring a fresh minimal contract and DP-3 approval.

## [0.8.16] - 2026-07-07

### Fixed

- **Plugin Scanner 门禁**：回归测试 `guard-tests-passing.test.mjs` / `guard-specs-merged.test.mjs` 此前用字符串形式 `execSync(\`node ${...}\`)` 触发 `SHELL_INJECTION_PATTERN`（8 high），改为参数数组 `execFileSync('node', [...])`。扫描分数 85/high:8 → 99/high:0 (A)。
- **产线 .mjs 硬化**：`ensure-branch.mjs` 去掉变量参数包装、改字面参数数组；`cmd-isolate.mjs` 去掉 `...extra` 展开；`config-loader.mjs` `execSync(字符串)` → `execFileSync(数组)`。均为去 shell 注入面的质量提升，运行时行为不变。
- **CI 稳定性**：`.github/workflows/hol-plugin-scanner.yml` 把 `ai-plugin-scanner-action@v1`（移动 tag，07-06→07-07 静默从 2.0.992 升到 2.0.997 导致门禁忽然挂掉）锁到 SHA `c4737ed2f724`（= 2.0.992），顺带修掉「Third-party Actions 未锁 SHA」中危项。

## [0.8.15] - 2026-07-07

### Fixed

- **BUG-A（致命）— `executing→closing` 收口跳转永久失败**：`release-archivist` 从不写 `test_result: pass`，而 `tests-passing` 守卫强制要求它，导致 `ssf state transition closing` 永远 `exit(1)`。现守卫同时接受 `dp_6_result` 以 `pass` 开头，且 `release-archivist` 在 DP-6 后显式执行 `ssf state set <change-dir> test_result pass`。
- **BUG-B — 状态漂移**：`cmd-state` 非 init 子命令在 `.spec-superflow.yaml` 缺失时静默返回默认态、会幽灵式创建状态文件。现缺失即报错退出；`state-loader` 增加 `spec_merged: false` 默认值并持久化。
- **#28 — `executing→closing` 缺「spec 已合并」闸门**：新增 `specs-merged` 守卫，残留未合并的 delta spec 会阻断收口；`spec-merger` 同步后置 `spec_merged: true`。
- **#15 — git 隔离仅为建议性、无强制**：新增 `ensure-branch.mjs` + `cmd-isolate.mjs`，拒绝在 `main`/`master` 上直接提交（除非 `--force`）；`build-executor` 的 `ssf isolate` 改为强制 pre-flight。
- **#26 / #27.2 — skill 依赖 PATH 解析的裸 `ssf`**：所有 `skills/**/SKILL.md` 改为安装时重写的绝对路径 `node "${CLAUDE_PLUGIN_ROOT}/scripts/spec-superflow.mjs"`，修复 cursor / marketplace 用户必失败的问题。

### Added

- **#29 — ZCODE（gemini-cli）安装器**：新增 `install-zcode.mjs` + `cmd-install-zcode.mjs`，注册进 CLI；`INSTALL.md` 平台表补充 ZCODE 行。

## [0.8.14] - 2026-07-06

### Fixed

- **WorkBuddy 安装器重构** — `ssf install-workbuddy` 现在部署为标准 marketplace 插件，修复了 v0.8.13 中存在的三个缺陷：
  - **运行时依赖缺失** — 旧安装器不复制 `scripts/`、`docs/`、`templates/`、`dist/`、`hooks/`，导致 skill 中引用的脚本和模板无法解析。现在全部复制到插件根目录。
  - **`${CLAUDE_PLUGIN_ROOT}` 未重写** — 旧安装器直接复制 SKILL.md 而不重写路径变量，导致所有脚本引用断裂。现在重写为 marketplace 插件绝对路径。
  - **插件结构错误** — 旧安装器为每个 skill 创建独立的 marketplace 插件目录（9 个插件 × 9 个 enabledPlugins 键）。现在部署为单个 `spec-superflow` 插件，包含 `skills/` 子目录、`.codebuddy-plugin/plugin.json` 清单、`rules/phase-guard.md` 规则，settings.json 中仅需 `spec-superflow@cb_teams_marketplace` 单个启用键。旧安装产生的 per-skill 键会在升级时自动清理。

### Added

- WorkBuddy 安装器新增 `--dry-run` 预览模式和 `--tag` 指定版本安装。
- WorkBuddy 平台现在有 phase-guard 规则（`rules/phase-guard.md`，WorkBuddy 自动加载为常驻上下文）。

## [0.8.13] - 2026-07-06

### Added

- **跨平台安装支持扩展至 17 个平台** — 新增 8 个 AI 编程平台的一键安装器，平台覆盖面对齐 comet：
  - `ssf install-cline` — Cline（`.cline/skills/` + `.clinerules/phase-guard.md`）
  - `ssf install-kiro` — Kiro（`.kiro/skills/` + `.kiro/steering/phase-guard.md`）
  - `ssf install-windsurf` — Windsurf（`.windsurf/skills/` + `.windsurf/rules/phase-guard.md`）
  - `ssf install-qwen` — Qwen Code（`.qwen/skills/` + `.qwen/rules/phase-guard.md`）
  - `ssf install-amazon-q` — Amazon Q Developer（`.amazonq/skills/` + `.amazonq/rules/phase-guard.md`）
  - `ssf install-roocode` — Roo Code（`.roo/skills/` + `.roo/rules/phase-guard.md`）
  - `ssf install-continue` — Continue（`.continue/skills/` + `.continue/rules/phase-guard.md`）
  - `ssf install-pi` — Pi（`.pi/skills/`，无规则目录，手动 `/workflow-start`）
- **共享安装器架构** — 新增 `scripts/lib/platforms.mjs`（平台注册表）与 `scripts/lib/install.mjs`（共享安装器），8 个 `install-<id>.mjs` 为薄壳调用，路径全部与 comet `src/core/platforms.ts` 交叉核实。`install-cursor.mjs` / `install-workbuddy` 保持原样。
- **平台支持矩阵文档** — 新增 `docs/platform-matrix.md`，17 平台 × Skills/Rules/Hooks 三层接入透明化。
- **CLI 命令** — `ssf` 注册 8 个 `install-<id>` 子命令，`npx spec-superflow@latest install-<id>` 一键部署。

### Changed

- INSTALL.md 平台总览表从 9 行扩至 17 行，新增 8 个平台完整安装/升级/卸载/验证章节。
- README.md 安装区表格与 CLI 命令表同步扩充。

### Notes

- Kiro / Windsurf / Qwen / Amazon Q 原生支持 hooks，但 spec-superflow 的 SessionStart 钩子在这些平台的可用性未逐一验证，v0.8.13 暂不写入 hook 配置；上下文注入由 phase-guard 规则（平台自动加载）承担，后续版本验证后补齐。
- 剩余 14 个 comet 平台（Junie / Bob / ForgeCode / Crush / iFlow / CoStrict / Factory / KiloCode / Auggie / Lingma / KimiCode / Antigravity ×2 等）留待 v0.8.14+ 分批跟进。

## [0.8.12] - 2026-07-06

### Fixed

- **Workflow mode inference** — hotfix/tweak auto-detection now recognizes common non-JavaScript source files, including Java, Go, Python, Rust, Kotlin, Swift, C/C++, C#, Ruby, PHP, and shell scripts, so multi-task code changes are no longer misclassified as config/doc-only tweaks.

## [0.8.11] - 2026-07-06

### Fixed

- **DP-0 audit consistency** — `ssf audit` now treats existing `dp_0_confirmed: true` state as a recorded DP-0 confirmation, and `dp_0_result` is now persisted by the state loader instead of being dropped after `ssf state set`.

## [0.8.10] - 2026-07-06

### Fixed

- **Guard fast-path gating** — `exploring -> bridging` now requires `hotfix` or `tweak`, and `exploring -> approved-for-build` now requires `tweak`; `full`/`auto` workflows no longer skip `contract-builder` and approval gates.
- **State transition safety** — `ssf state transition` now fails closed when guard execution fails, returns malformed output, reports non-boolean `pass`, or exits unsuccessfully, preventing state writes after unreliable guard checks.
- **Execution branch isolation** — `build-executor` now requires branch/worktree preflight before implementation and stops for explicit approval before editing `main` or `master`.

## [0.8.9] - 2026-07-04

### Added

- **WorkBuddy installer** — New `ssf install-workbuddy` command deploys all 9 skills into WorkBuddy's marketplace plugin directory and enables them in `~/.workbuddy/settings.json`.
- **WorkBuddy installer tests** — Covers target path planning, skill copy behavior, settings preservation, and package-root resolution for `npx` usage.

### Changed

- **Installation docs** — Updated README, English README, INSTALL.md, OpenCode notes, AGENTS.md, and llms.txt to reflect current mainstream installation paths for Claude Code, Cursor, OpenAI Codex CLI/App, GitHub Copilot CLI, Gemini CLI, OpenCode, WorkBuddy, and Trae.
- **Update guidance** — Added WorkBuddy upgrade command to the version reminder output.

### Fixed

- **Doctor manifest coverage** — `ssf doctor` now checks `.cursor-plugin/marketplace.json` and `.github/plugin/marketplace.json`, and correctly handles multiple version fields in the same manifest file.

## [0.8.8] - 2026-07-03

### Changed

- **Token efficiency optimization**: Compressed all prompt injection surfaces by 60.3% (from ~24,387 estimated tokens to ~9,669).
  - `hooks/session-start`: 23→15 lines, comments compressed, platform branches share message variable.
  - 9 skill SKILL.md files: 2,461→750 lines total (−69.5%). Each skill ≤250 lines, 0 token lint issues.
  - Phase guard files (`.claude/always/phase-guard.md`, `GEMINI.md`): 14→3 lines each, reference state machine instead of enumerating operations.
  - `workflow-start` initialization simplified: deferred non-critical checks to target skills.

### Added

- **Token baseline tool** (`scripts/token-baseline.mjs`): Measures lines, characters, and estimated tokens for all injection components. Supports `--compare` for pre/post compression analysis.
- **Token lint rules** (`scripts/lint/rules/token-rules.mjs`): 4 rules — max lines, max chars, emphasis marker limits, code block length limits. Banned markers: `EXTREMELY_IMPORTANT`, `CRITICAL`.
- **`--include token`** support in `lint-skills.mjs` for token-specific linting.
- **CI token lint step**: Warning-only check in both build-and-test and release jobs.
- **Phase guard files** now included in version consistency checks.

## [0.8.7] - 2026-07-03

### Added

- **Skill lint framework**: `scripts/lint/lint-skills.mjs` with 5 rules for static analysis of skill instruction quality.
- **Guard transition tests**: 43 regression tests covering all 21 legal transitions and 8 illegal rejections.
- **Exception handling**: All 9 skills now include guidance for parse failures, missing files, and user interruption recovery.

### Fixed (Bug)

- **Parser bilingual support**: `parseChangeMarkdown` now correctly extracts sections from bilingual headings (e.g., `## 背景（Why）`). Previously it used English-only exact matching, silently returning empty strings.
- **Guard workflow normalization**: `ssf state transition` no longer silently skips guard checks when workflow is `auto`. The `auto` mode is now normalized to `full` before guard invocation.
- **Guard error handling**: Terminal states (`abandoned`, `closing`) now correctly reject further transitions instead of allowing them through.

### Changed

- **build-executor**: Added DP-4 and DP-5 record commands.
- **contract-builder**: Added DP-3 record command and exception handling guidance.
- **release-archivist**: Added DP-6/DP-7 record commands and DP gap detection.
- **workflow-start**: Fixed "Route to abandonment" → "Route to abandoned state".
- All 9 skills: Added standardized exception handling sections.

## [0.8.6] - 2026-07-03

### Fixed (Bug)

- **CI**: Correct `actions/setup-node` SHA — the previously pinned `v4.5.0` release didn't exist. Changed to `v4.4.0` (latest actual v4). This was silently breaking all CI runs on main.

### Changed

- **Deps**: Bump `actions/checkout` from 4.2.2 to 7.0.0 (SHA-pinned, `tsc` verified).
- **Deps**: Bump `typescript` from 5.9.3 to 6.0.3 (devDependency, `tsc --noEmit` zero errors).
- **Branch protection**: Main branch now requires PR + CI checks (`Build & Test (22)`, `scan`) before merge.

## [0.8.5] - 2026-07-03

### Fixed (Bug)

- **Issue #9**: Cursor installation (`install-cursor.mjs`) now copies the full runtime tree (`scripts/`, `docs/`, `templates/`, `dist/`, `hooks/`) instead of just `skills/`. Fixes 24 broken `${CLAUDE_PLUGIN_ROOT}` references in skills.

### Added

- **`ssf install-cursor` CLI command**: Deploys spec-superflow to `.cursor/` directory.
- **Multi-platform marketplace support**:
  - `.cursor-plugin/marketplace.json` — Cursor marketplace submission
  - `.opencode/plugins/spec-superflow.js` — OpenCode plugin entry
  - `.codex-plugin/plugin.json` — `composerIcon` for Codex
  - `gemini-extension.json` — Gemini CLI verified install
- **Codex scanner**: `SECURITY.md`, `assets/icon.svg`, `.codexignore`, `.github/dependabot.yml`, `hol-plugin-scanner.yml` CI workflow. Scanner score: 92/130.
- **Branch protection setup** for main branch.

### Changed

- **README**: Restructured with quick start first. English README fully synced with Chinese version.

## [0.8.4] - 2026-07-03

### Fixed (Bug)

- **Critical: C-1** — Validator bilingual heading support: `extractSection` regex now matches both `## Why` and `## 背景（Why）` style headings. Chinese templates no longer fail schema validation.
- **Critical: C-2** — Guard dead transition `bridging:approved` fixed to `bridging:approved-for-build` (matching canonical state name).
- **Critical: C-3** — Cursor workflow-orchestrator guard call fixed to use `approved-for-build` instead of `approved`, preventing "Unknown transition" errors.
- **High: H-1** — Guard transition matrix extended with 6 missing rewind transitions (`specifying:exploring`, `bridging:specifying`, `approved-for-build:bridging`, `executing:specifying`, `executing:bridging`, `closing:specifying`).
- **High: H-2** — `ssf state transition` now runs guard checks before writing state. Guard is no longer bypassable via direct CLI.
- **High: H-3** — `tasks-complete.mjs` now matches both `[x]` and `[X]` (case-insensitive) and supports indented/nested tasks (`[ \t]*` prefix).
- **High: H-4** — `build-executor` SKILL.md: 3 script paths fixed to use `${CLAUDE_PLUGIN_ROOT}` prefix, preventing breakage after worktree `cd`.
- **High: H-5** — `spec-merger` SKILL.md: removed non-existent `workflow/` path prefix from 7 spec locations.
- **High: H-6** — `infer-workflow.mjs`: fixed `import.meta.url` comparison for relative-path invocation (added `import.meta.filename` fallback for Node 22+).
- **High: H-7** — `cmd-state.mjs` transition now validates state names against `VALID_STATES` whitelist, rejecting typos that corrupt the state machine.
- **Medium: M-1** — 6 skill H1 titles updated from v0.7 old names to v0.8.x current names (e.g., "Spec Explorer" → "Need Explorer").
- **Medium: M-2** — `state-loader.mjs`: `||` replaced with `??` across 10 fields, preventing empty string → null data loss.
- **Medium: M-3** — `hash.mjs`: specs hash now only includes `spec.md` files (not all `.md` files), preventing false hash mismatch from README.md changes.
- **Medium: M-4** — `schema-valid.mjs`: WARNING-level issues now captured and returned alongside ERRORs instead of being silently discarded.
- **Medium: M-6** — `schema-valid.mjs`: dynamic `import()` now wrapped in try/catch with helpful "Run 'npm run build'" error message.
- **Medium: M-7** — `infer-workflow.mjs`: explicit `workflow: full` no longer overridden by auto-detection heuristic.
- **Medium: M-8** — `workflow-start` SKILL.md: 8 relative script paths fixed to use `${CLAUDE_PLUGIN_ROOT}` prefix.
- **Medium: M-9** — `cmd-state.mjs` SETTABLE_FIELDS extended with 25 missing fields (`batches_completed`, `dp_0_result`, `dp_N_decisions`, `dp_N_confirmed` for DP-1 through DP-7).
- **Medium: M-10** — `bug-investigator` SKILL.md: added DP-5 (调试升级) reference near 3+ failure escalation rule.
- **Low: L-1** — `CLAUDE.md` ASCII state diagram: `approved` → `approved-for-build`.
- **Low: L-2** — `spec-superflow.mjs` CLI help: example uses `approved-for-build` instead of `approved`.
- **Low: L-3** — `cmd-state.mjs` get: blocks prototype property reads (`__proto__`, `constructor`, etc.).
- **Low: L-4** — `cmd-state.mjs` init: auto-creates change directory if missing.
- **Low: L-7** — `docs/state-machine.md`: added fast-path transitions (`exploring→bridging`, `exploring→approved-for-build`).

### Changed (Token Optimization)

- **T-1** — `session-start` hook injection reduced from ~100 tokens to ~40 tokens (~60% reduction). Removed `set -euo pipefail` and no-op `| cat` pipes.
- **T-2** — `install-cursor.mjs`: now cleans old skill directories before copying, preventing stale v0.7 names from accumulating.
- **T-3** — `cmd-inject.mjs`: `claude` platform writer no longer writes duplicate `rules/phase-guard.md` (`.claude/always/phase-guard.md` suffices).
- **T-4** — `.cursor/skills/`: removed 8 stale v0.7 skill directories (spec-explorer, spec-forger, spec-syncer, bridge-contract, execution-governor, systematic-debugger, closure-archivist, workflow-orchestrator). Now has only 9 current skills.
- **T-5** — Deleted stale `rules/phase-guard.md` file.

### Changed (Internal)

- `package.json` test script now runs all 152 tests (e2e + lib), not just e2e.
- Guard test updated for `bridging→approved-for-build` transition name.

## [0.8.3] - 2026-07-01

### Added

- **130 new tests** — CLI scripts (`cmd-list`, `cmd-state`, `cmd-audit`, `cmd-doctor`, `cmd-inject`) and guard system now have comprehensive test coverage. 152 total tests (up from 22), covering config loading, state management, hash computation, guard transitions, workflow inference, and phase guard generation.

### Fixed

- **`infer-workflow` empty directory** — previously returned `hotfix` for empty change directories (0 tasks, 0 files); now correctly returns `full` as the safe default.

### Changed

- **Refactored guard run loop** — switch-case replaced with `CHECK_RUNNERS` lookup map for cleaner dimension dispatch.
- **Deduplicated `cmd-validate`** — `design.md` and `tasks.md` structural validation merged into a single config-driven loop.
- **Exported internal functions** — `detectChangeStatus` (cmd-list), `generateReport`/`DP_NAMES` (cmd-audit), 7 doctor check functions (cmd-doctor), `generatePhaseGuard`/`toCursorMdc`/`toCopilotInstructions` (cmd-inject) now exported for direct unit testing.

## [0.8.2] - 2026-07-01

### Added

- **DP-1 and DP-2 implementation** — `need-explorer` now records DP-1 (requirement confirmation) before handing off to `spec-writer`; `spec-writer` now records DP-2 (artifact review) before handing off to `contract-builder`.

### Fixed

- **SessionStart token overhead (issue #5)** — `hooks/session-start` now injects a ~50 token lightweight pointer instead of the full 360-line `workflow-start` SKILL.md, reducing per-session context-window usage by ~2,200 words.
- **tweak fast-path deadlock** — `guard.mjs` now skips `artifacts-exist` checks for tweak workflow, and `build-executor` accepts tweak mode without requiring `execution-contract.md`. The advertised tweak path now actually works.
- **State name inconsistency** — `approved` and `approved-for-build` standardized to `approved-for-build` across `guard.mjs`, `cmd-inject.mjs`, `workflow-start`, and `state-machine.md`. Removed duplicate `approved` phase-guard template.
- **`ssf list` false CLOSED** — `detectChangeStatus` now reads `.spec-superflow.yaml` state instead of inferring closure from file existence. Previously reported BRIDGED changes as CLOSED.
- **`ssf audit` missing DP-0** — DP-0 (user confirmation gate) now included in audit reports alongside DP-1–DP-7.
- **Guard `artifacts-exist` config-aware** — now respects `artifacts.skip` from `spec-superflow.config.json`, allowing projects to exclude optional planning artifacts.
- **Old skill names in guard scripts** — `contract-fresh.mjs` and `tests-passing.mjs` error messages updated to reference `contract-builder` and `release-archivist`.
- **Sub-prompt path resolution** — `build-executor` and `code-reviewer` now use `${CLAUDE_PLUGIN_ROOT}/skills/<name>/` paths for sub-prompt templates instead of bare filenames.
- **`ssf validate` coverage** — now validates all 4 planning artifacts (`design.md` and `tasks.md` basic structural checks added).
- **Config default artifact order** — `execution-contract` removed from `artifacts.order` default (it's `contract-builder`'s output, not `spec-writer`'s).
- **README state count** — corrected from 7 to 8 states (includes `abandoned`).

### Changed

- **README "不推荐使用" refreshed** — v0.8.x improvements (hotfix, tweak, Batch Inline, reduced token overhead) now cover many previously-excluded scenarios. The "not recommended" section now only lists truly unsuitable cases (throwaway scripts, pure Q&A).

## [0.8.1] - 2026-07-01

### Added

- **Auto-latest Cursor install** — `scripts/install-cursor.mjs` now downloads and deploys the latest GitHub release by default. Use `--local <path>` to deploy from a local repo.
- **Update check reminder** — New `scripts/check-update.mjs` compares the installed version with npm latest. `workflow-start` runs it on startup and surfaces a non-blocking upgrade reminder when behind.

### Changed

- **INSTALL.md** now documents `/plugin update spec-superflow@spec-superflow` as the Claude Code upgrade path and provides a curl one-liner for Cursor auto-deployment.

## [0.8.0] - 2026-07-01

### Added

- **Intuitive skill names** — All 9 skills renamed to action-object style: `workflow-start`, `need-explorer`, `spec-writer`, `contract-builder`, `build-executor`, `bug-investigator`, `code-reviewer`, `release-archivist`, `spec-merger`.
- **Batch Inline execution mode** — `build-executor` now supports `Batch Inline` for low-risk, same-module tasks, reducing subagent dispatch overhead for small changes like issue #5.
- **User confirmation gate (DP-0)** — `workflow-start` confirms key decisions with the user before routing to `spec-writer`; `spec-writer` honors confirmed constraints and pauses on unconfirmed decisions.
- **Migration guide** — Added `docs/skill-rename-v0.8.0.md` with old→new mapping and per-platform refresh instructions.

### Changed

- **Documentation sync** — `README.md`, `INSTALL.md`, `CLAUDE.md`, `docs/state-machine.md`, `docs/decision-points.md`, `GEMINI.md`, main `specs/`, `templates/`, and plugin manifests updated to use the new skill names and v0.8.0 install instructions.
- **Version sync** — `ssf version` now also updates `.codex-plugin/plugin.json`; `ssf doctor` checks all 7 manifests.

## [0.7.1] - 2026-06-30

### Fixed

- **README consistency** — 移除架构图中不存在的 `schemas/` 目录，补充 `scripts/guard/`、`install-cursor.mjs`、`infer-workflow.mjs`；明确 Cursor 的 session-start hook 需要手动复制到 `.cursor/hooks.json`。

## [0.7.0] - 2026-06-30

### Added

- **Multi-platform phase-guard injection** — `ssf inject` now generates phase-guard artifacts for Claude Code (`.claude/always/phase-guard.md`), Cursor (`.cursor/rules/phase-guard.mdc`), Copilot (`.github/copilot-instructions.md`), and Gemini (`GEMINI.md`). New `--platforms` flag limits output to a subset.
- **Auto workflow-mode detection** — `workflow-orchestrator` infers `hotfix`/`tweak`/`full` from artifact content when `.spec-superflow.yaml` workflow is `auto`. Added `scripts/infer-workflow.mjs` helper. Explicit workflow values are preserved.
- **Decision-point audit report** — New `ssf audit <change-dir>` command reads `.spec-superflow.yaml` DP fields and generates `decision-point-audit.md` with a summary table and per-DP interpretation.
- **Cursor local deploy** — New `scripts/install-cursor.mjs` copies skills to `.cursor/skills/` and creates `.cursor/rules/phase-guard.mdc` for Cursor Agent.
- **Template localization** — All planning templates under `templates/` are now in Chinese while keeping required parsing markers intact.

### Fixed

- **Copilot CLI plugin manifest** — Root `plugin.json` `author` is now an object (`{ "name": "..." }`) to satisfy Copilot CLI strict validation.
- **`ssf doctor` author check** — Added validation for root `plugin.json` `author` format.
- **INSTALL.md accuracy** — Cursor and Copilot CLI install instructions now describe the actual working mechanisms.

## [0.6.0] - 2026-06-29

### Added

- **Fast-path workflow modes** — hotfix and tweak modes skip full planning for small changes. Hotfix: ≤2 files, no new modules, minimal contract. Tweak: ≤4 files, config/doc only, direct edit. Auto-upgrade to full when thresholds exceeded.
- **Phase-drift prevention** — `ssf inject` command generates `rules/phase-guard.md` and installs to `.claude/always/` for per-turn Agent context injection. 9 state templates with allowed/forbidden operations. Forms a soft+hard dual defense with guard.mjs.
- **Decision point protocol** — `docs/decision-points.md` defines 7 standard decision points (DP-1 through DP-7) with triggers, inputs, outputs, and associated skills. All 4 affected skills reference DP numbers.
- **Guard mode awareness** — `guard.mjs` accepts `--workflow` parameter (full/hotfix/tweak) for mode-specific check skipping. 2 new transitions: `exploring→bridging`, `exploring→approved`.
- **State set command** — `ssf state set <dir> <field> <value>` with SETTABLE_FIELDS whitelist. 14 new decision point audit fields (dp_N_result + dp_N_timestamp).

### Changed

- **Guard schema-valid** — Uses `validateDeltaSpec` for change specs, fixing a format mismatch between delta spec and main spec validators.
- **4 skill files** — workflow-orchestrator (mode detection + fast-path routing + DP refs), bridge-contract (hotfix minimal contract), execution-governor (tweak direct edit), closure-archivist (lightweight closure).

## [0.5.0] - 2026-06-29

### Added

- **Guard script system** — `scripts/guard/guard.mjs` provides dimension-based phase transition validation with 5 check dimensions. Exit code ≠ 0 blocks transitions. Reuses existing Validator engine for schema validation.
  - `artifacts-exist` — checks all 4 planning artifacts + specs/ are present and non-empty
  - `schema-valid` — validates proposal.md and all specs/*/spec.md using the Validator engine
  - `contract-fresh` — compares stored artifacts hash against current artifacts for staleness detection
  - `tasks-complete` — verifies all tasks.md items are checked off
  - `tests-passing` — confirms test_result: pass is recorded in state file
- **Lightweight state file** — `.spec-superflow.yaml` as a derived cache (12 fields) for fast context recovery. Always rebuildable from artifacts via `ssf state rebuild`. Artifacts are the source of truth; state file is a performance optimization.
- **SHA256 hash acceleration** — `scripts/lib/hash.mjs` computes artifact hashes for O(1) staleness detection. Reduces staleness detection from ~3500 tokens (full content read) to ~50 tokens (single script call).
- **ssf state CLI** — New `state` subcommand with 5 operations: `init`, `check`, `transition`, `get`, `rebuild`.

### Changed

- **workflow-orchestrator** — Each routing rule now includes a guard script invocation step before allowing transitions.
- **bridge-contract** — Automatically runs `ssf state init` after contract generation.
- **closure-archivist** — Runs `ssf state transition` after verification completes.
- **execution-governor** — Updates `batches_completed` in state file after each batch.

## [0.4.0] - 2026-06-29

### Added

- **CLI toolchain** — `ssf` command with 6 subcommands: `list` (scan changes and report status), `validate` (artifact validation via Validator), `doctor` (health check: version sync, hooks, skills, dist, node, docs, config), `version` (one-command version sync to all manifests), `sync` (delta spec merge with conflict detection), `config` (display/modify configuration). Zero dependencies via `node:util.parseArgs`.
- **Configuration system** — Optional `spec-superflow.config.json` for customizing artifact order, skip list, execution thresholds, and verification language. Absence = v0.3.0 defaults. Deep-merge with built-in defaults. Skills query config at runtime via `scripts/get-config` bash helper.
- **Multi-language tokenizer** — `src/validation/tokenizer.ts` with English stemmer (extracted from validator) + Chinese CJK tokenizer (Unicode ranges + 2-5 char sliding window + stop words). Auto-detection based on CJK character ratio. Mixed mode runs both tokenizers and unions results.
- **Conflict detection** — `Validator.detectSyncConflicts()` detects when multiple changes modify the same requirement across unsynced delta specs. Integrated into `ssf sync` command and `spec-syncer` skill pre-flight check.
- **git worktree isolation** — execution-governor now recommends worktree creation when executing on main/master branch. Pure SKILL.md guidance, no code changes.

### Changed

- **package.json** — Added `bin` field exposing `ssf` and `spec-superflow` commands.
- **validateImplementation()** — Refactored to use `tokenize()` instead of inline `stem()`. Added optional `config` parameter for language override (`'auto' | 'en' | 'zh'`). Backward compatible — existing callers work unchanged.
- **Tokenizer refinements** — CJK sliding window extended to 2-5 chars (covers compound words like "令牌桶算法"). English min token length lowered to 3 (preserves short tokens like "jwt"). Added "based"/"using"/"used" to English stop words.
- **Version manifests** — `.cursor-plugin/plugin.json` and `gemini-extension.json` now tracked in version sync (previously lagging at 0.2.0 and 0.1.0).

### Fixed

- **Version consistency** — `ssf version` command ensures all 5 manifest files stay in sync. `ssf doctor` reports inconsistencies as warnings.

## [0.3.0] - 2026-06-27

### Added

- **Inline execution mode** — Lightweight single-session execution for small changes (≤ 3 tasks, no cross-module dependencies). Parallel to SDD subagent mode. Preserves TDD Iron Law with checkpoint review per task. Automatic mode selection with user override.
- **Abandoned terminal state** — 8th workflow state allowing graceful change abandonment from any non-terminal state. Generates `abandonment-summary.md` with reason, lessons learned, and recommendations. Blocks delta spec merge for abandoned changes. Partial code preservation supported.
- **Three-dimensional verification** — closure-archivist now verifies Completeness (all tasks/requirements implemented), Correctness (tests pass, no placeholders), and Coherence (design decisions reflected in code). New `Validator.validateImplementation()` API with word-stemming and keyword matching.
- **abandonment-summary.md template** — Structured template for documenting abandoned changes.
- **Verification types** — New exports: `VerificationDimension`, `VerificationStatus`, `VerificationFinding`, `VerificationReport`.

### Changed

- **spec-forger task planning** — Rewritten with writing-plans methodology: File Structure section, Interfaces block (Consumes/Produces), per-task TDD expansion (5 phases), exact file paths with line ranges, zero placeholder enforcement, 2-5 minute granularity per step.
- **execution-contract.md template** — Added Execution Mode (SDD | Inline) selection field and Verification Dimensions table.
- **tasks.md template** — Added File Structure and Interfaces sections for cross-batch dependency tracking.
- **State machine** — Extended from 7 to 8 states (+abandoned terminal state). Universal abandoned transition from any non-terminal state.
- **Validator engine** — New `validateImplementation(diffSummary, specContent, designContent)` method with three-dimensional `VerificationReport` return type. Word-stemming for Completeness matching, keyword-based Coherence checking.
- **closure-archivist** — Verification steps expanded from 3 to 5 (Correctness, Completeness, Coherence, Unintended Scope Detection, Verification Report). Structured output with PASS/CONDITIONAL/FAIL verdict.
- **spec-syncer** — Pre-flight guard blocks sync for abandoned changes.

## [0.2.1] - 2026-06-27

### Fixed

- **hooks.json format** — Changed from incorrect array format to Claude Code plugin record format. Event name corrected from `Startup|Clear|Compact` to standard `SessionStart`. Command path now uses `${CLAUDE_PLUGIN_ROOT}` environment variable for cross-platform compatibility.

## [0.2.0] - 2026-06-26

### Added

- **Engine layer (`src/`)** — embedded OpenSpec schema/validation/parsing engine in TypeScript
  - `src/schema/` — Requirement, Delta (ADDED/MODIFIED/REMOVED/RENAMED), Spec, Change type definitions
  - `src/validation/` — Validator class with validateSpecContent, validateChangeContent, validateDeltaSpec
  - `src/parsing/` — Requirement block parser + Delta spec parser (self-contained, no external deps)
- **3 new skills** (6 → 9 total):
  - `systematic-debugger` — 4-phase root cause debugging (Root Cause → Pattern → Hypothesis → Implementation)
  - `code-reviewer` — Unified code review (request + receive), 3 severity levels (Critical/Important/Minor)
  - `spec-syncer` — Delta Spec → Main Spec intelligent merge with conflict detection
- **SDD (Subagent-Driven Development)** — Full implementation discipline embedded in `execution-governor`:
  - `implementer-prompt.md` — Subagent implementation template with TDD evidence + self-review
  - `task-reviewer-prompt.md` — Dual-verdict review (spec compliance + code quality)
  - `code-reviewer-prompt.md` — Structured code review template
- **Helper scripts (`scripts/`)** — `task-brief`, `review-package`, `validate-artifacts`
- **Session-start hooks (`hooks/`)** — Multi-platform bootstrap (Claude Code / Cursor / Copilot CLI)
- **Content-level stale detection** — `workflow-orchestrator` now compares proposal scope vs contract intent lock

### Changed

- State machine extended from 6 to 7 states (+`debugging`)
- All 6 existing skills enhanced with embedded engine capabilities:
  - `spec-explorer` — embedded brainstorming's "one question at a time + 2-3 approach comparison"
  - `spec-forger` — Schema engine validation on every artifact + writing-plans task granularity
  - `bridge-contract` — parsing engine auto-extraction of contract fields
  - `execution-governor` — Full TDD Iron Law + SDD workflow + Review Gates
  - `closure-archivist` — verification-before-completion Iron Law
  - `workflow-orchestrator` — content-level inspection + 3 new routing targets
- Plugin metadata updated to v0.2.0 with expanded keywords across all manifest files

### Release Quality

- **TypeScript compilation** — Added `tsconfig.json` (ES2022, NodeNext, strict mode), `npm run build` produces `dist/` with declarations
- **Integration tests** — 8 test cases using real example artifacts (`docs/examples/`), `npm test` passes
- **package.json** — `main` points to `dist/index.js`, `types` to `dist/index.d.ts`
- **Documentation** — Updated English README Current Status to v0.2.0

## [0.1.0] - 2026-06-25

### Added

- Initial self-contained `spec-superflow` plugin structure
- Plugin metadata in `.claude-plugin/plugin.json`
- Six workflow skills:
  - `workflow-orchestrator`
  - `spec-explorer`
  - `spec-forger`
  - `bridge-contract`
  - `execution-governor`
  - `closure-archivist`
- Planning templates:
  - `proposal.md`
  - `spec.md`
  - `design.md`
  - `tasks.md`
  - `execution-contract.md`
- Workflow docs:
  - `docs/artifact-contract.md`
  - `docs/state-machine.md`
- Example change sets:
  - `docs/examples/add-dark-mode/` (net-new UI capability)
  - `docs/examples/refactor-auth-boundary/` (brownfield backend refactor)
- Installation guide in `INSTALL.md`
- Chinese publishing README in `README.zh-CN.md`
- Repository governance files: `.gitignore`, `CONTRIBUTING.md`, `docs/release-checklist.md`

### Notes

- First release targets Claude Code and Trae style local skill loading
- Runtime ownership remains inside `spec-superflow`
- OpenSpec and Superpowers are reference influences, not runtime dependencies
