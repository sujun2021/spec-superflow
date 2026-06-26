---
name: spec-explorer
description: Clarify intent, scope, constraints, and success criteria before artifact creation. Invoke when the request is fuzzy, the user is comparing options, or the workflow needs a stable change definition before writing artifacts.
---

# Spec Explorer

Use this skill to turn a rough idea into a stable change definition.

## Use This Skill When

Invoke this skill when the user says things like:

- "I have an idea"
- "help me think this through"
- "compare these approaches"
- "I am not sure about scope yet"
- "let's figure out what we are actually building"

## Primary Goal

Make the user and the agent agree on:

- what problem is being solved
- what is in scope
- what is out of scope
- what success looks like
- whether the work should be split before specification

## Process

1. Inspect the current project context first.
2. Ask clarifying questions one at a time.
3. Prefer multiple-choice questions when they reduce ambiguity.
4. Propose 2-3 approaches with trade-offs.
5. Recommend one approach and explain why.
6. Once the idea is stable, hand off to `spec-forger`.

## Exploration Standard

Do not stop at "I understand the feature."

You should leave exploration with:

- a usable change name
- a crisp problem statement
- scope boundaries
- non-goals
- success criteria
- a sense of whether one change is enough or decomposition is needed

## Strong Rule

Do not produce implementation code.

This skill exists to stabilize intent, not to build.

## Output Standard

At the end of exploration, the following should be clear:

- change name
- problem statement
- scope
- non-goals
- acceptance direction
- whether a single change is enough

If those are not yet clear, stay in exploration.
