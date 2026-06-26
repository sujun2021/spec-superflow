---
name: closure-archivist
description: Close out a spec-superflow change with verification, summary, and archive readiness. Invoke when implementation is complete, verification is underway, or the user asks for a final wrap-up.
---

# Closure Archivist

Use this skill to finish a `spec-superflow` change cleanly.

## Use This Skill When

Invoke this skill when the user says things like:

- "wrap this up"
- "give me the final summary"
- "is this ready to close"
- "what remains before we ship"
- "prepare the handoff"

## Responsibilities

1. verify that the approved behavior was actually implemented
2. summarize what changed
3. identify remaining risks or follow-up work
4. prepare the change for archive or handoff

## Required Inputs

Read:

- `execution-contract.md`
- `tasks.md`
- relevant `specs/`
- change summary notes, if any

## Final Checks

- Are required tests passing?
- Are execution batches complete?
- Was any scope added without artifact updates?
- Are there unresolved blockers or known risks?
- Is the change ready to archive, or should it remain active?

## Output

Produce a concise wrap-up with:

- delivered behavior
- notable implementation constraints
- residual risks
- recommended next action

Also make clear whether the change is:

- ready to archive
- ready for user review
- blocked on follow-up work

## Archive Rule

Do not archive blindly.

If implementation diverged from the contract, return to `bridging` before closure.
