## ADDED Requirements

### Requirement: Cursor installation works out of the box

The repository SHALL provide a Cursor-specific installation mechanism that makes the 9 skills available to Cursor Agent without relying on `.cursor-plugin/plugin.json` to auto-load skills.

#### Scenario: user installs for Cursor

- **WHEN** a user runs the documented Cursor install command
- **THEN** Cursor Agent can invoke `workflow-orchestrator` and the other 8 skills

#### Scenario: Cursor rules include phase guard

- **WHEN** `ssf inject` runs for a change
- **THEN** `.cursor/rules/phase-guard.mdc` is created/updated with the current state

### Requirement: Copilot CLI plugin manifest is valid

The root `plugin.json` SHALL use an object for the `author` field so that Copilot CLI strict validation does not reject the plugin.

#### Scenario: doctor validates author field

- **WHEN** `ssf doctor` runs
- **THEN** it reports the root `plugin.json` `author` field as valid

#### Scenario: plugin.json author is an object

- **WHEN** reading root `plugin.json`
- **THEN** `author.name` is present and `author` is not a string

### Requirement: Installation docs match actual mechanism

`INSTALL.md` SHALL describe the working installation steps for Cursor and Copilot CLI and SHALL NOT claim that unsupported auto-discovery works.

#### Scenario: Cursor install docs mention local deploy

- **WHEN** reading `INSTALL.md` Cursor section
- **THEN** it includes the local deploy script or manual `.cursor/` copy steps

#### Scenario: Copilot install docs use correct marketplace path

- **WHEN** reading `INSTALL.md` Copilot CLI section
- **THEN** it references the existing `.claude-plugin/marketplace.json` location recognized by Copilot CLI
