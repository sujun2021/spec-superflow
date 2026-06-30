## ADDED Requirements

### Requirement: Planning templates are localized to Chinese

All template files under `templates/` SHALL be provided in Chinese to match the project's Chinese-first content convention.

#### Scenario: proposal template is Chinese

- **WHEN** a user reads `templates/proposal.md`
- **THEN** section headings and placeholder prompts are in Chinese

#### Scenario: design template is Chinese

- **WHEN** a user reads `templates/design.md`
- **THEN** section headings and placeholder prompts are in Chinese

#### Scenario: spec template remains parseable

- **GIVEN** `templates/spec.md` is translated to Chinese
- **WHEN** `spec-forger` or `ssf validate` parses a generated spec
- **THEN** required markers such as `#### Scenario:` remain intact

### Requirement: Localization does not break existing artifacts

Translating the templates SHALL NOT require rewriting historical change artifacts or alter the parsing rules for `spec.md`.

#### Scenario: historical specs still validate

- **GIVEN** existing `changes/v0.6.0-*/specs/*/spec.md` files are in English
- **WHEN** `ssf validate` runs against them
- **THEN** they continue to pass validation
