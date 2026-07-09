Status: DONE
Commits created: 30c8c7e test: add canonical spec path helper
Test summary: `node --test tests/lib/spec-paths.test.mjs` passed (5/5 tests).
Concerns: None for this task; implementation is scoped to the shared path helper only.
Report file path: /Users/magebte/Documents/magebyte/open-source-plugins/spec-superflow/.superpowers/sdd/task-1-report.md

Fix note: tightened canonical spec detection so only `specs/<capability>/spec.md` is accepted. Nested paths like `specs/ui-theme/nested/spec.md` are now excluded from `findCanonicalSpecFiles()` and no longer satisfy `requireSpecs`.
Test command: `node --test tests/lib/spec-paths.test.mjs`
Test result: PASS (6/6 tests).
