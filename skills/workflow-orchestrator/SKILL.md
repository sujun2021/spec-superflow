---
name: workflow-orchestrator
description: Primary entry point for spec-superflow. Invoke when the user says start, continue, resume, implement, plan, or when the current workflow stage is unclear and the next skill must be chosen safely.
---

# Workflow Orchestrator

This is the primary entry point for `spec-superflow`.

Its job is not to implement anything directly. Its job is to:

1. inspect the current change context
2. determine the current workflow state
3. route to the correct next skill
4. block invalid transitions

## Use This Skill When

Invoke this skill first when the user says things like:

- "continue"
- "resume this change"
- "start a new workflow"
- "help me figure out what to do next"
- "begin implementation"
- "let's write the spec"
- "we already planned this, now build it"

Use it whenever the correct next skill is not obvious from the current artifacts.

## Default States

- `exploring`
- `specifying`
- `bridging`
- `approved-for-build`
- `executing`
- `closing`

Read `docs/state-machine.md` before making a state decision if the transition is ambiguous.

## Required Inspection

Before routing, inspect the current change folder if it exists.

Look for:

- `proposal.md`
- `specs/`
- `design.md`
- `tasks.md`
- `execution-contract.md`

Then answer these questions in order:

1. Is the change still fuzzy?
2. Are planning artifacts missing or unstable?
3. Does a bridge contract exist?
4. Has the user explicitly approved the contract for build work?
5. Is the change already in verification or wrap-up?

## Routing Rules

### Route to `spec-explorer` when:

- the request is still fuzzy
- scope is unclear
- the user is comparing options
- there is no stable change name yet

### Route to `spec-forger` when:

- the user knows what they want
- planning artifacts are missing or incomplete
- proposal, specs, design, or tasks need to be created or revised

### Route to `bridge-contract` when:

- planning artifacts exist
- implementation is requested or about to begin
- the execution contract is missing or stale
- planning artifacts changed after the last contract draft

### Route to `execution-governor` when:

- `execution-contract.md` exists
- the user has explicitly approved it
- implementation is the active task
- the contract still matches the current planning artifacts

### Route to `closure-archivist` when:

- implementation is complete
- verification is complete or nearly complete
- the user wants a final summary, archive, or wrap-up

## Staleness Rules

Treat `execution-contract.md` as stale if:

- `proposal.md` changed scope
- `specs/` changed approved behavior
- `design.md` changed architecture constraints
- `tasks.md` changed execution batches materially

If stale, do not continue implementation. Route back to `bridge-contract`.

## Guardrails

- Do not allow implementation before planning artifacts exist.
- Do not allow implementation before `execution-contract.md` exists.
- Do not treat "continue" as permission to skip state inspection.
- Do not allow continued implementation if scope or core behavior changed without artifact updates.
- If the user is in `executing` but the contract is stale, route backward to `bridge-contract`.

## Output Standard

Your response should always make three things explicit:

1. current detected state
2. why that state was chosen
3. which skill should run next

If transition blocking is required, explain the missing artifact or approval clearly.

## Preferred User Experience

- Keep the user on one visible workflow.
- Avoid making them choose between upstream mental models.
- Treat OpenSpec ideas as planning inputs and Superpowers ideas as execution discipline, but keep `spec-superflow` as the only workflow owner.
