## ADDED Requirements

### Requirement: workflow-orchestrator auto-detects workflow mode

`workflow-orchestrator` SHALL infer `hotfix`, `tweak`, or `full` mode when the user does not explicitly set `.spec-superflow.yaml` `workflow`.

#### Scenario: small bug fix is detected as hotfix

- **GIVEN** a change touches ≤2 files, does not add new modules, and does not change schemas/APIs
- **WHEN** `workflow-orchestrator` inspects the change
- **THEN** it sets `workflow: hotfix` and outputs the reason

#### Scenario: config/doc update is detected as tweak

- **GIVEN** a change touches ≤4 files, stays within a single module, and only modifies config, documentation, or prompts
- **WHEN** `workflow-orchestrator` inspects the change
- **THEN** it sets `workflow: tweak` and outputs the reason

#### Scenario: larger change falls back to full

- **GIVEN** a change touches ≥5 files or adds a new module or changes schemas/APIs
- **WHEN** `workflow-orchestrator` inspects the change
- **THEN** it keeps or sets `workflow: full` and outputs the reason

### Requirement: explicit workflow override is preserved

If `.spec-superflow.yaml` already has `workflow` set to a valid value, auto-detection SHALL NOT overwrite it unless the user explicitly asks to re-detect.

#### Scenario: user sets hotfix manually

- **GIVEN** `workflow: hotfix` is already set in state
- **WHEN** `workflow-orchestrator` runs
- **THEN** it keeps `workflow: hotfix` and skips auto-detection

### Requirement: auto-detection inputs are content-level

Detection SHALL use artifact content (proposal scope, task list, file paths) rather than timestamps or git status alone.

#### Scenario: detection reads task file paths

- **WHEN** inferring mode
- **THEN** `workflow-orchestrator` reads `tasks.md` and `proposal.md` to count scoped files
