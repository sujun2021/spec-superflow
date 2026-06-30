# Execution Contract: v0.7.0 Aware & Multiplatform

## Intent Lock

- **Change name**: `v0.7.0-aware-and-platform-fixes`
- **Problem being solved**: v0.6.0 shipped with broken or incomplete platform installation on Cursor and GitHub Copilot CLI, left three planned Aware features (auto workflow-mode detection, multi-platform phase-guard injection, decision-point audit report) unimplemented, and the README still excluded minor changes from the workflow. v0.7.0 fixes the platform issues and makes the workflow usable for changes of any size by automatically selecting `hotfix`/`tweak`/`full` mode.
- **In scope**:
  - Fix Cursor installation by providing a `.cursor/` local deploy path (`scripts/install-cursor.mjs`) and updating `INSTALL.md`.
  - Fix root `plugin.json` `author` field to be an object so Copilot CLI validation passes; extend `ssf doctor` to check it.
  - Add automatic workflow-mode inference (`hotfix`/`tweak`/`full`) to `workflow-orchestrator`.
  - Extend `ssf inject` to generate phase-guard artifacts for Claude, Cursor, Copilot, and Gemini with an optional `--platforms` flag.
  - Add `ssf audit` to generate `decision-point-audit.md` from `.spec-superflow.yaml` DP fields.
  - Update affected skill files (`workflow-orchestrator`, `closure-archivist`), `CHANGELOG.md`, `README.md`.
  - Translate all `templates/` planning templates (`proposal.md`, `design.md`, `tasks.md`, `spec.md`, `execution-contract.md`) to Chinese.
  - Bump version to `0.7.0`.
- **Out of scope**:
  - No new skills (keep the existing 9 skills).
  - No skill renaming — deferred to a dedicated v0.8.0 change.
  - No changes to `src/validation/validator.ts`.
  - No CI/CD pipeline changes.
  - No clients beyond the 7 target platforms.

## Approved Behavior

- **Approved requirements summary**:
  1. Cursor installation works out of the box via a documented local deploy script or `.cursor/` directory copy.
  2. `ssf inject` creates/updates `.cursor/rules/phase-guard.mdc`.
  3. Root `plugin.json` uses an object for `author` and passes `ssf doctor` validation.
  4. `INSTALL.md` accurately describes Cursor and Copilot CLI installation.
  5. `workflow-orchestrator` infers `hotfix`/`tweak`/`full` from artifact content when `workflow` is not explicitly set, so changes of any size can use spec-superflow.
  6. Explicit `workflow` values are never overwritten without user request.
  7. `ssf inject` generates consistent phase-guard artifacts for all supported platforms by default and supports `--platforms cursor,copilot` style filtering.
  8. Each platform artifact uses the correct format (`.mdc` with `alwaysApply: true` for Cursor, markdown instructions for Copilot, appended section for Gemini).
  9. `ssf audit <change-dir>` generates `decision-point-audit.md` listing DP-1 through DP-7 with result, timestamp, and interpretation.
  10. Missing decision points are flagged as `not recorded` rather than failing.
  11. `closure-archivist` prompts the user to run `ssf audit` before final closure.
  12. `ssf audit` is read-only and idempotent.
  13. All `templates/` planning templates are translated to Chinese while preserving required parsing markers such as `#### Scenario:`.
  14. Translating templates does not break validation of existing English specs.

- **Key scenarios**:
  - Cursor install script makes the 9 skills available under `.cursor/skills/`.
  - `ssf doctor` reports the root `plugin.json` `author` field as valid.
  - A ≤2-file bug fix with no schema changes is inferred as `hotfix`.
  - A ≤4-file config/docs change is inferred as `tweak`.
  - A ≥5-file or new-module change stays/sets `full`.
  - `ssf inject changes/foo` updates `.claude/always/phase-guard.md`, `.cursor/rules/phase-guard.mdc`, Copilot instructions, and `GEMINI.md`.
  - `ssf inject changes/foo --platforms cursor,copilot` only updates Cursor and Copilot artifacts.
  - `ssf audit changes/foo` produces a human-readable report and leaves `.spec-superflow.yaml` unchanged.
  - `templates/design.md` and `templates/proposal.md` use Chinese section headings and placeholders.
  - Existing English specs in `changes/v0.6.0-*/specs/` still pass `ssf validate` after template translation.

- **Acceptance checks**:
  - Root `plugin.json` parses as JSON and `author.name` exists.
  - `node scripts/spec-superflow.mjs doctor` passes with no `author`-format error.
  - `node scripts/install-cursor.mjs` completes and creates `.cursor/skills/` plus `.cursor/rules/phase-guard.mdc`.
  - `workflow-orchestrator/SKILL.md` contains the auto-detection rules and preserves explicit overrides.
  - `ssf inject` with `--platforms` writes only the requested artifacts.
  - Generated Cursor `.mdc` includes `alwaysApply: true` frontmatter.
  - Generated Copilot instructions include `# Phase Guard`.
  - `GEMINI.md` contains a `# Phase Guard` section after injection.
  - `ssf audit` creates `decision-point-audit.md` with a summary table and per-DP sections.
  - `closure-archivist/SKILL.md` references `ssf audit` at DP-7.
  - `templates/*.md` are in Chinese and still produce valid artifacts when used by `spec-forger`.
  - Existing English change specs continue to validate.
  - `npm run build` and `npm test` pass after all changes.
  - All manifest versions (`package.json`, `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json`, `.cursor-plugin/plugin.json`, `gemini-extension.json`) read `0.7.0`.

## Design Constraints

- **Architecture constraints**:
  - Zero external runtime npm dependencies; all new code is plain Node.js ES modules.
  - Reuse existing scripts (`guard.mjs`, `state-loader.mjs`, `cmd-inject.mjs`, `cmd-state.mjs`) instead of adding new command infrastructure.
  - Keep the 9 skill boundaries unchanged; only add logic to existing skill files.
- **Interface constraints**:
  - New `ssf inject` behavior must remain backward compatible: default behavior now produces more artifacts, but existing flags and output shape (JSON/stdout) must not break.
  - New `ssf audit` subcommand must be read-only with respect to `.spec-superflow.yaml` and planning artifacts.
- **Dependency constraints**:
  - Node >= 22.
  - Cursor, Copilot CLI, and Gemini CLI platform conventions must be followed for generated artifacts.
- **Data constraints**:
  - Decision-point audit report must derive from `dp_1_*` ... `dp_7_*` fields in `.spec-superflow.yaml` only.
  - Phase-guard content must be identical across platforms for the same change state.

## Task Batches

### Batch 1: Platform Installation Fixes

- **Objective**: Make Cursor and Copilot CLI installations work and validate them.
- **Inputs**: `plugin.json`, `.cursor-plugin/plugin.json`, `INSTALL.md`, `scripts/lib/cmd-doctor.mjs`.
- **Outputs**:
  - Updated root `plugin.json` with object `author`.
  - New `scripts/install-cursor.mjs` that deploys skills and rules to `.cursor/`.
  - Updated `INSTALL.md` Cursor and Copilot CLI sections.
  - Extended `ssf doctor` author-format check.
- **Done when**:
  - `ssf doctor` reports root `plugin.json` author valid.
  - `node scripts/install-cursor.mjs` runs without error and produces the expected `.cursor/` tree.
  - `INSTALL.md` instructions match the actual mechanisms.
  - `npm run build && npm test` still pass.

### Batch 2: Auto Mode Detection

- **Objective**: Let `workflow-orchestrator` infer workflow mode from artifact content.
- **Inputs**: `skills/workflow-orchestrator/SKILL.md`, `proposal.md`, `tasks.md`.
- **Outputs**: Updated `workflow-orchestrator/SKILL.md` with inference rules and examples.
- **Done when**:
  - Skill text describes the hotfix/tweak/full inference rules.
  - Skill explicitly preserves an explicit `workflow` value.
  - At least one example/test case is included.

### Batch 3: Multi-Platform Phase-Guard Injection

- **Objective**: Extend `ssf inject` to generate phase-guard artifacts for Claude, Cursor, Copilot, and Gemini.
- **Inputs**: `scripts/lib/cmd-inject.mjs`, `GEMINI.md`, platform conventions.
- **Outputs**:
  - Updated `cmd-inject.mjs` with `PLATFORM_TEMPLATES` and `--platforms` flag.
  - Generated `.cursor/rules/phase-guard.mdc`, `.github/copilot-instructions.md`, and updated `GEMINI.md` section.
- **Done when**:
  - Default `ssf inject` updates all platform artifacts.
  - `--platforms` restricts output correctly.
  - Each artifact matches its platform format and shares the same current state.

### Batch 4: Decision-Point Audit Report

- **Objective**: Add `ssf audit` and wire it into closure.
- **Inputs**: `scripts/lib/state-loader.mjs`, `.spec-superflow.yaml`, `skills/closure-archivist/SKILL.md`.
- **Outputs**:
  - New `scripts/lib/cmd-audit.mjs`.
  - `decision-point-audit.md` template.
  - Updated `closure-archivist/SKILL.md` referencing `ssf audit`.
- **Done when**:
  - `ssf audit <change-dir>` produces the report.
  - Missing DPs are marked `not recorded`.
  - The command leaves state and artifacts unchanged.

### Batch 5: Release

- **Objective**: Bump version, translate templates to Chinese, update docs, run final validation, and prepare release.
- **Inputs**: `package.json`, plugin manifests, `templates/*.md`, `CHANGELOG.md`, `README.md`.
- **Outputs**:
  - Version `0.7.0` synchronized across all manifests.
  - Chinese `templates/proposal.md`, `templates/design.md`, `templates/tasks.md`, `templates/spec.md`, `templates/execution-contract.md`.
  - `CHANGELOG.md` v0.7.0 entries.
  - Updated `README.md` with new commands and install notes.
- **Done when**:
  - `ssf doctor` and `ssf validate` pass.
  - `npm run build && npm test` pass.
  - All manifests show `0.7.0`.
  - Templates are in Chinese and existing English specs still validate.

## Test Obligations

- **Behavior that must start with failing tests**:
  - Root `plugin.json` author as string must fail `ssf doctor` before the fix, then pass after.
  - `ssf inject --platforms invalid` must fail or be rejected.
  - `ssf audit` on a change with no DP results must still produce a report marking DPs as `not recorded`.
- **Required edge cases**:
  - Explicit `workflow` in state is preserved when auto-detection runs.
  - `ssf inject` default writes all platforms; filtered writes only requested platforms.
  - `GEMINI.md` injection appends or replaces the `# Phase Guard` section without duplicating it.
- **Regression-sensitive areas**:
  - Existing `.claude/always/phase-guard.md` generation must not change format unexpectedly.
  - Existing `ssf validate` and `ssf doctor` checks must continue to pass.
  - Existing skill loading on Claude Code must remain unaffected.
  - Existing English specs and change artifacts must still validate after templates are translated.

## Execution Mode

- **Mode**: `SDD` (Spec-Driven Development)
- **Selection rationale**: The change spans five batches with cross-batch dependencies (platform fix → inject → audit), explicit acceptance checks, and requires test-first validation of the `author` fix. SDD ensures each batch is verified before the next.

## Verification Dimensions

| Dimension | Status | Findings |
|-----------|--------|----------|
| Completeness | Pending | All 14 approved requirements mapped to batches; no unmapped requirements. |
| Correctness | Pending | Requires test evidence for `author` fix, Cursor install, inject platform filtering, and audit idempotency. |
| Coherence | Pending | Multi-platform artifacts must share identical state; workflow inference must not conflict with explicit overrides. |

**Overall verdict**: Pending

## Review Gates

- **Mandatory review points**:
  - End of Batch 1: confirm `ssf doctor` passes and Cursor install script output is correct.
  - End of Batch 3: inspect generated artifacts for each platform side-by-side for state consistency.
  - End of Batch 4: verify `ssf audit` report by running it and diffing against `.spec-superflow.yaml`.
  - End of Batch 5: final `ssf validate`, `ssf doctor`, `npm run build`, `npm test`, and version-manifest sync check.
- **Blocker categories**:
  - Any platform manifest becomes invalid JSON or fails its own platform validation.
  - Existing tests break.
  - Auto-detection overwrites an explicit `workflow` value.
  - `ssf audit` mutates state or artifacts.

## Escalation Rules

- **Return to `specifying`** when:
  - A new capability or platform is added after contract approval.
  - The scope of auto-detection or multi-platform inject changes materially (e.g., new platform, new workflow mode).
- **Return to `bridging`** when:
  - `proposal.md`, `design.md`, `specs/`, or `tasks.md` are updated in a way that changes intent, constraints, or batches.
  - The generated contract is detected as stale by `ssf state`.
- **Do not continue implementation if**:
  - `execution-contract.md` is not approved by the user (DP-3).
  - Major ambiguity remains about platform artifact formats.
  - Tests fail at any review gate.

## Coverage Cross-Check

All 14 approved requirements from the five delta specs are reflected in the Approved Behavior section and mapped to at least one execution batch or acceptance check. No requirements were dropped.
