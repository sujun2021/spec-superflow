# spec-superflow

`spec-superflow` is a self-contained workflow integration plugin for Claude Code and Trae.

It combines:

- OpenSpec-style artifact thinking: `proposal.md`, `specs/`, `design.md`, `tasks.md`
- Superpowers-style execution discipline: guardrails, TDD, review gates, controlled handoff

The key idea is simple:

```text
clarify -> specify -> bridge -> execute -> close
```

Instead of requiring users to install both upstream systems and manually stitch them together, `spec-superflow` absorbs the useful parts of each and exposes one coherent workflow.

## Language

- English: `README.md`
- Chinese: [README.zh-CN.md](file:///Users/magebte/Documents/magebyte/open-source-plugins/spec-superflow/README.zh-CN.md)

## Why It Exists

Most AI coding sessions fail in one of two ways:

1. The AI starts writing code before "what we are building" is stable.
2. The team does define the change, but implementation still drifts because testing, review, and handoff are too loose.

`spec-superflow` addresses both:

- `spec-explorer` and `spec-forger` make the change explicit.
- `bridge-contract` turns planning artifacts into an `execution-contract.md`.
- `execution-governor` treats that contract as the approved source for implementation behavior.

## Core Skills

- `workflow-orchestrator`
- `spec-explorer`
- `spec-forger`
- `bridge-contract`
- `execution-governor`
- `closure-archivist`

## First Release Scope

- Self-contained plugin, not a dual-install runtime wrapper
- Spec-first workflow with a guarded bridge into execution
- First release targets Claude Code and Trae style local skill loading
- `execution-contract.md` is the formal handoff layer between planning and implementation

## Installation Philosophy

This plugin is designed to be self-contained.

- It does **not** require runtime installation of OpenSpec.
- It does **not** require runtime installation of Superpowers.
- It may borrow their ideas, structures, and proven workflow patterns.
- It keeps runtime control inside one plugin so there is one workflow owner.

## Install

- Full guide: [INSTALL.md](file:///Users/magebte/Documents/magebyte/open-source-plugins/spec-superflow/INSTALL.md)
- Claude Code: install the six skill directories into `~/.claude/skills`
- Trae: install the six skill directories into `~/.trae/skills`
- Important runtime pieces:
  - `.claude-plugin/plugin.json`
  - `skills/`

## Quick Start

1. Install the six skills into your local skill path.
2. Create or choose a change workspace under `workflow/changes/<change-name>/`.
3. Start from `workflow-orchestrator`.
4. Let the workflow move through exploration, specification, bridging, execution, and closure.

## How To Use

### 1. Start from the orchestrator

Ask the agent to use `workflow-orchestrator` when:

- starting a new change
- resuming an old change
- deciding what stage the work is in

### 2. Let the workflow move through five artifact steps

For a change named `<change-name>`, the plugin expects:

```text
workflow/
└── changes/<change-name>/
    ├── proposal.md
    ├── design.md
    ├── tasks.md
    ├── specs/
    │   └── <capability>.md
    └── execution-contract.md
```

### 3. Use one workflow owner

Do not ask the same session to separately run:

- OpenSpec workflow commands
- Superpowers workflow entry points
- `spec-superflow` orchestration

Pick `spec-superflow` as the visible workflow owner and let it absorb the rest.

### 4. Let the contract gate execution

Planning alone does not authorize implementation.

The intended handoff is:

```text
proposal/specs/design/tasks -> execution-contract.md -> approved build work
```

If the contract is missing, stale, or unapproved, route back instead of coding forward.

## Included Templates

Templates live in `templates/`:

- `proposal.md`
- `spec.md`
- `design.md`
- `tasks.md`
- `execution-contract.md`

## Docs

- [Artifact Contract](file:///Users/magebte/Documents/magebyte/open-source-plugins/spec-superflow/docs/artifact-contract.md)
- [State Machine](file:///Users/magebte/Documents/magebyte/open-source-plugins/spec-superflow/docs/state-machine.md)
- [Examples](file:///Users/magebte/Documents/magebyte/open-source-plugins/spec-superflow/docs/examples/README.md)
- [Install Guide](file:///Users/magebte/Documents/magebyte/open-source-plugins/spec-superflow/INSTALL.md)
- [Changelog](file:///Users/magebte/Documents/magebyte/open-source-plugins/spec-superflow/CHANGELOG.md)
- [Contributing](file:///Users/magebte/Documents/magebyte/open-source-plugins/spec-superflow/CONTRIBUTING.md)
- [Release Checklist](file:///Users/magebte/Documents/magebyte/open-source-plugins/spec-superflow/docs/release-checklist.md)

## Example Workflow

Two complete change sets demonstrate the full progression from proposal to execution contract:

- `docs/examples/add-dark-mode/` — net-new UI capability (dark mode)
- `docs/examples/refactor-auth-boundary/` — brownfield backend refactor (auth layer)

Read each in artifact order: `proposal.md` → `specs/` → `design.md` → `tasks.md` → `execution-contract.md`.

## Current Status

This repository currently contains a usable `v0.1` plugin scaffold:

- plugin metadata
- skill boundaries
- full planning and execution-contract templates
- supporting docs for artifact mapping and state transitions
- one complete example change set
- install guide, license, and changelog
