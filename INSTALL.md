# Install

`spec-superflow` is a self-contained plugin. You do not need to install OpenSpec or Superpowers at runtime.

## Claude Code

### 一键安装（推荐）

在 Claude Code 中直接注册 marketplace 并安装：

```
/plugin marketplace add MageByte-Zero/spec-superflow
/plugin install spec-superflow@spec-superflow
```

### 或者：本地安装

```bash
git clone https://github.com/MageByte-Zero/spec-superflow.git
```

Claude Code 会自动发现 `.claude-plugin/` 目录下的插件，无需手动拷贝。

如果未自动发现，在 Claude Code 中执行：

```
/plugin install file:/absolute/path/to/spec-superflow
```

## Trae

```bash
git clone https://github.com/MageByte-Zero/spec-superflow.git
mkdir -p ~/.trae/skills
cp -R spec-superflow/skills/* ~/.trae/skills/
```

## 使用

安装完成后，告诉 Agent：

- 启动新的变更 → "用 workflow-orchestrator 开始"
- 恢复旧的变更 → "继续上次的工作流"
- 不确定当前状态 → "帮我看看现在该干什么"

Agent 会自动检查当前工件，判断处于探索 / 规格 / 桥接 / 执行 / 收口的哪个阶段。

## 工作流目录约定

对于名为 `<change-name>` 的变更：

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

流程线：`proposal/specs/design/tasks -> execution-contract.md -> 用户批准 -> 开始实现`

规划本身不等于可以实现。如果 `execution-contract.md` 缺失、过时或未被用户批准，工作流会拒绝进入实现阶段。

## 验证

安装后验证：

- `workflow-orchestrator` skill 已可用
- 其余 5 个 skill 全部可见
- 能明确请求 `workflow-orchestrator`

## 故障排查

### Agent 找不到 skill

- 检查 skill 目录名是否与 skill 名一致
- 检查目录下是否存在 `SKILL.md`

### 工作流过早开始实现

从 `workflow-orchestrator` 入口开始，不要直接调用 `execution-governor`。

推荐流程：`exploring -> specifying -> bridging -> approved-for-build -> executing -> closing`
