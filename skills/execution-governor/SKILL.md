---
name: execution-governor
description: Govern implementation from an approved execution contract. Invoke when `execution-contract.md` is approved and the user wants disciplined build work, TDD execution, or guarded batch-by-batch implementation.
---

# Execution Governor

This skill controls the implementation phase of `spec-superflow`.

It borrows the spirit of Superpowers execution discipline, but uses `execution-contract.md` as the workflow authority.

## Use This Skill When

Invoke this skill when the user says things like:

- "implement this now"
- "start coding"
- "execute batch 1"
- "continue implementation"
- "finish the build work"

Only use it after the contract exists and the user has approved it.

## Required Inputs

Read before implementation:

- `execution-contract.md`
- `tasks.md`
- relevant `specs/`
- relevant `design.md`

## Core Laws

### Law 1: Contract First

Do not treat chat history as the source of truth once implementation begins.

The execution contract is the approved handoff artifact.

### Law 2: No Production Code Without a Failing Test First

Follow TDD unless the work is clearly configuration-only and the user agrees to skip it.

For behavior changes:

- write the failing test
- verify it fails for the right reason
- write minimal code
- verify it passes

### Law 3: Review Before Drift

Use review gates between meaningful execution batches.

Block progress on:

- logic defects
- spec violations
- missing required tests
- unintended scope expansion

### Law 4: Rewind on Contract Break

Return to `specifying` or `bridging` if:

- new behavior appears
- interfaces change materially
- design assumptions fail
- the current artifacts no longer define the intended implementation

## Execution Modes

### Small changes

Execute in a focused serial path with explicit batch completion checks.

### Larger changes

Split work by execution batch and use fresh-task execution when possible.

## Progress Reporting

During implementation, keep reporting against the contract:

- which batch is active
- which test or verification step is next
- whether scope drift has appeared

If drift appears, stop and route backward instead of improvising new behavior.

## Completion Standard

Do not report completion until:

- required tests pass
- contract obligations are satisfied
- review blockers are resolved
- the workflow is ready for `closure-archivist`
