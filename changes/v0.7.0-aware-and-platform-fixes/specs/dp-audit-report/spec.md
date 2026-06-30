## ADDED Requirements

### Requirement: ssf audit generates a decision-point audit report

A new CLI subcommand `ssf audit <change-dir>` SHALL read `.spec-superflow.yaml` and produce `changes/<change-dir>/decision-point-audit.md`.

#### Scenario: audit report contains all 7 DPs

- **WHEN** running `ssf audit changes/my-change`
- **THEN** the generated report lists DP-1 through DP-7 with result and timestamp

#### Scenario: missing decision points are flagged

- **GIVEN** a decision point has no recorded result
- **WHEN** generating the audit report
- **THEN** the report marks it as `not recorded` instead of failing

### Requirement: Audit report format is human-readable

The report SHALL include a summary table and a per-DP section with result, timestamp, and a brief interpretation.

#### Scenario: report has summary table

- **WHEN** reading `decision-point-audit.md`
- **THEN** the top of the file contains a Markdown table with DP number, name, result, timestamp

### Requirement: closure-archivist references the audit command

`closure-archivist` SHALL run or recommend running `ssf audit` before final closure, so the audit report is part of the archive.

#### Scenario: closure prompts for audit

- **WHEN** closure-archivist reaches DP-7
- **THEN** it outputs a reminder to run `ssf audit <change-dir>` and include the report in the archive

### Requirement: Audit does not mutate state

`ssf audit` SHALL be read-only with respect to `.spec-superflow.yaml` and planning artifacts.

#### Scenario: audit command is safe

- **WHEN** running `ssf audit`
- **THEN** `.spec-superflow.yaml` and all planning artifacts remain unchanged
