# Install

`spec-superflow` is a self-contained plugin.

You do not need to install OpenSpec or Superpowers at runtime.

What you install is:

- the plugin metadata in `.claude-plugin/plugin.json`
- the six skill directories in `skills/`

## Supported First Release Targets

This repository currently targets:

- Claude Code style local skill loading
- Trae style local skill loading

## Claude Code

### Option A: symlink individual skills

Create the Claude skills directory if it does not exist:

```bash
mkdir -p ~/.claude/skills
```

Symlink each skill from this repository:

```bash
ln -s /absolute/path/to/spec-superflow/skills/workflow-orchestrator ~/.claude/skills/workflow-orchestrator
ln -s /absolute/path/to/spec-superflow/skills/spec-explorer ~/.claude/skills/spec-explorer
ln -s /absolute/path/to/spec-superflow/skills/spec-forger ~/.claude/skills/spec-forger
ln -s /absolute/path/to/spec-superflow/skills/bridge-contract ~/.claude/skills/bridge-contract
ln -s /absolute/path/to/spec-superflow/skills/execution-governor ~/.claude/skills/execution-governor
ln -s /absolute/path/to/spec-superflow/skills/closure-archivist ~/.claude/skills/closure-archivist
```

### Option B: copy the skills

If you do not want symlinks, copy the directories instead:

```bash
mkdir -p ~/.claude/skills
cp -R /absolute/path/to/spec-superflow/skills/workflow-orchestrator ~/.claude/skills/
cp -R /absolute/path/to/spec-superflow/skills/spec-explorer ~/.claude/skills/
cp -R /absolute/path/to/spec-superflow/skills/spec-forger ~/.claude/skills/
cp -R /absolute/path/to/spec-superflow/skills/bridge-contract ~/.claude/skills/
cp -R /absolute/path/to/spec-superflow/skills/execution-governor ~/.claude/skills/
cp -R /absolute/path/to/spec-superflow/skills/closure-archivist ~/.claude/skills/
```

### Claude Code usage pattern

Once installed, start from:

- `workflow-orchestrator` when beginning or resuming a change

Then let the workflow route forward:

- `spec-explorer`
- `spec-forger`
- `bridge-contract`
- `execution-governor`
- `closure-archivist`

Do not mix this with separate OpenSpec commands or separate Superpowers entry points in the same session.

## Trae

### Option A: symlink individual skills

Create the Trae skills directory if it does not exist:

```bash
mkdir -p ~/.trae/skills
```

Symlink each skill:

```bash
ln -s /absolute/path/to/spec-superflow/skills/workflow-orchestrator ~/.trae/skills/workflow-orchestrator
ln -s /absolute/path/to/spec-superflow/skills/spec-explorer ~/.trae/skills/spec-explorer
ln -s /absolute/path/to/spec-superflow/skills/spec-forger ~/.trae/skills/spec-forger
ln -s /absolute/path/to/spec-superflow/skills/bridge-contract ~/.trae/skills/bridge-contract
ln -s /absolute/path/to/spec-superflow/skills/execution-governor ~/.trae/skills/execution-governor
ln -s /absolute/path/to/spec-superflow/skills/closure-archivist ~/.trae/skills/closure-archivist
```

### Option B: copy the skills

```bash
mkdir -p ~/.trae/skills
cp -R /absolute/path/to/spec-superflow/skills/workflow-orchestrator ~/.trae/skills/
cp -R /absolute/path/to/spec-superflow/skills/spec-explorer ~/.trae/skills/
cp -R /absolute/path/to/spec-superflow/skills/spec-forger ~/.trae/skills/
cp -R /absolute/path/to/spec-superflow/skills/bridge-contract ~/.trae/skills/
cp -R /absolute/path/to/spec-superflow/skills/execution-governor ~/.trae/skills/
cp -R /absolute/path/to/spec-superflow/skills/closure-archivist ~/.trae/skills/
```

### Trae usage pattern

Use the same workflow entry:

- invoke `workflow-orchestrator` first
- let it determine whether the change is exploring, specifying, bridging, executing, or closing

## Recommended Workspace Layout

For a change named `<change-name>`, the repository assumes:

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

## Quick Validation

After installation, verify that:

- the six skill directories are visible to your tool
- each `SKILL.md` is readable
- you can explicitly ask for `workflow-orchestrator`

## Troubleshooting

### The agent cannot find the skill

Check:

- the directory name matches the skill name
- the directory contains `SKILL.md`
- your local skill search path is the one you installed into

### The workflow starts implementing too early

Start from `workflow-orchestrator`, not `execution-governor`.

The intended progression is:

```text
exploring -> specifying -> bridging -> approved-for-build -> executing -> closing
```
