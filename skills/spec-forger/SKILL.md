---
name: spec-forger
description: Create or refine spec-superflow planning artifacts. Invoke when the change is understood well enough to write `proposal.md`, `specs/`, `design.md`, and `tasks.md`.
---

# Spec Forger

Use this skill when the change has moved beyond exploration and is ready to become concrete artifacts.

## Use This Skill When

Invoke this skill when the user says things like:

- "write the proposal"
- "turn this into specs"
- "create the design doc"
- "break the work into tasks"
- "formalize the plan"

## Required Artifacts

Create or refine:

- `proposal.md`
- `specs/`
- `design.md`
- `tasks.md`

Use OpenSpec-style artifact roles:

- `proposal.md` defines why and scope
- `specs/` define required behavior
- `design.md` defines how and why at the architecture level
- `tasks.md` defines dependency-aware implementation steps

## Working Rules

### `proposal.md`

Must clearly state:

- the problem
- what changes
- capabilities affected
- impact areas

### `specs/`

Must be testable.

Every requirement should be written so that a later test can prove it.

### `design.md`

Must explain architectural decisions and trade-offs, not line-by-line implementation.

### `tasks.md`

Must be ordered, verifiable, and small enough to become execution batches later.

## Quality Bar

The artifact set must be internally aligned:

- `proposal.md` sets scope
- `specs/` define observable behavior
- `design.md` explains the chosen technical shape
- `tasks.md` converts that shape into execution order

If any artifact cannot support the others, revise before handoff.

## Handoff Rule

Do not start implementation after writing planning artifacts.

Once the artifacts are stable, hand off to `bridge-contract`.

## Self-Review

Before handing off:

- remove placeholders
- resolve contradictions
- ensure tasks align with specs
- ensure design supports the required behavior
