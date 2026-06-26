---
name: bridge-contract
description: Convert approved planning artifacts into an execution contract. Invoke when the user wants to start building, asks to move from planning to implementation, or when `execution-contract.md` is missing or stale.
---

# Bridge Contract

This skill is the defining layer of `spec-superflow`.

It converts planning artifacts into a single execution handshake:

- `execution-contract.md`

Use `templates/execution-contract.md` as the baseline structure.

## Use This Skill When

Invoke this skill when the user says things like:

- "now implement it"
- "we are ready to build"
- "turn this plan into execution rules"
- "prepare the handoff"
- "refresh the contract"
- "the spec changed, update the execution contract"

## Input Artifacts

Read:

- `proposal.md`
- `specs/`
- `design.md`
- `tasks.md`
- `docs/artifact-contract.md`

Do not rely on chat memory as a substitute for these files.

## Mapping Rules

### From `proposal.md`

Extract:

- intent lock
- scope fence
- non-goals

### From `specs/`

Extract:

- approved behavior summary
- required scenarios
- test obligations

### From `design.md`

Extract:

- implementation constraints
- interface constraints
- dependency constraints

### From `tasks.md`

Extract:

- execution batches
- completion definitions
- review timing

## Purpose

The execution contract is not a duplicate planning document.

It must compress planning into execution-ready rules:

- what cannot drift
- what must be tested first
- where review is mandatory
- when implementation must stop and return to planning

## Contract Writing Standard

The resulting `execution-contract.md` must make it obvious:

- what behavior is approved
- what is explicitly out of scope
- which constraints implementation must obey
- how work is grouped into execution batches
- which tests must fail first before code is written
- which conditions force a rewind to planning

Prefer compression and operational clarity over repeating every planning detail.

## Approval Model

This skill prepares implementation readiness. It does not silently authorize implementation.

After drafting or refreshing the contract:

1. summarize the important handoff rules
2. identify anything still ambiguous
3. ask the user to approve the contract explicitly

Only after explicit approval may the workflow move to `execution-governor`.

## Stale Contract Detection

Refresh the contract if any of the following are true:

- scope changed in `proposal.md`
- approved requirements changed in `specs/`
- architecture or interface constraints changed in `design.md`
- execution batches changed materially in `tasks.md`
- the current contract no longer matches what the team intends to build

## Guardrails

- Do not continue to implementation if major ambiguity remains.
- Do not approve the execution contract on the user's behalf.
- After generating the contract, ask the user to review it.
- Implementation begins only after explicit approval.
- Do not skip `execution-contract.md` just because the planning docs look complete.
- Do not write production code inside this skill.

## Output Standard

Your response should include:

1. a brief statement that the bridge is being created or refreshed
2. the key intent lock and scope fence
3. the most important test obligations
4. the main review or rewind triggers
5. a direct request for user approval
