## ADDED Requirements

### Requirement: ssf inject supports multiple platforms

`ssf inject <change-dir>` SHALL generate phase-guard artifacts for all supported platforms by default, with an optional `--platforms` flag to limit output.

#### Scenario: default inject updates all platforms

- **WHEN** running `ssf inject changes/my-change`
- **THEN** `.claude/always/phase-guard.md`, `.cursor/rules/phase-guard.mdc`, `.github/copilot-instructions.md`（或 `.copilot/instructions.md`）, and `GEMINI.md` 段 are all updated

#### Scenario: limited inject updates only specified platforms

- **WHEN** running `ssf inject changes/my-change --platforms cursor,copilot`
- **THEN** only Cursor and Copilot artifacts are updated

### Requirement: Each platform artifact uses the correct format

Generated files SHALL match the format expected by each platform.

#### Scenario: Cursor rule file is .mdc with alwaysApply

- **WHEN** `.cursor/rules/phase-guard.mdc` is generated
- **THEN** it includes frontmatter with `alwaysApply: true` and markdown body

#### Scenario: Copilot instructions file is markdown

- **WHEN** Copilot instructions are generated
- **THEN** the file is plain markdown with a `# Phase Guard` heading

#### Scenario: Gemini context section is appended

- **WHEN** Gemini context is updated
- **THEN** `GEMINI.md` contains a `# Phase Guard` section with current state

### Requirement: Phase guard content is consistent across platforms

All generated artifacts for the same change SHALL describe the same current state, allowed operations, forbidden operations, and active decision point.

#### Scenario: comparing Claude and Cursor artifacts

- **WHEN** reading `.claude/always/phase-guard.md` and `.cursor/rules/phase-guard.mdc`
- **THEN** both list the same current `state` and `workflow`
