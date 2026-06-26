# State Machine

`spec-superflow` treats workflow progression as explicit state transitions.

## States

### `exploring`

- intent is still fuzzy
- options are still being compared
- no implementation is allowed

### `specifying`

- planning artifacts are being written or revised
- proposal, specs, design, and tasks are refined

### `bridging`

- planning artifacts are translated into `execution-contract.md`
- ambiguity is compressed into explicit approved decisions

### `approved-for-build`

- the execution contract exists
- the user has approved it
- implementation can now begin

### `executing`

- implementation follows the execution contract
- TDD, review gates, and escalation rules apply

### `closing`

- verification is complete
- the change can be summarized, archived, or handed off

## Transitions

```text
exploring -> specifying -> bridging -> approved-for-build -> executing -> closing
                        ^                                  |
                        |                                  v
                        +----------------------------------+
```

## Mandatory Rewind

The workflow must move back to `specifying` or `bridging` when:

- new scope appears
- a critical interface changes
- a key design assumption is wrong
- current artifacts no longer define the intended behavior

## Anti-Pattern

Do not stay in `executing` and "just adjust things in chat" when scope or behavior changes.

If the contract changed, the artifacts changed.
