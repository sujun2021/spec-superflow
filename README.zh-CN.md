# spec-superflow

`spec-superflow` 是一个面向 Claude Code 与 Trae 的自包含工作流插件。

它把两类能力贯通为一个统一流程：

- OpenSpec 风格的规划工件模型：`proposal.md`、`specs/`、`design.md`、`tasks.md`
- Superpowers 风格的工程执行纪律：守门、TDD、评审关卡、受控交接

核心思路很简单：

```text
clarify -> specify -> bridge -> execute -> close
```

它不是把两个上游系统并排安装后再勉强编排，而是把两者中最有价值的部分吸收进一个统一的 workflow owner。

## 为什么要做它

很多 AI 编程会话会在两个地方失控：

1. 需求还没有稳定，AI 就开始写代码。
2. 规划已经写了，但执行阶段仍然因为测试、评审和 handoff 过松而漂移。

`spec-superflow` 用一个贯通式工作流来解决这两个问题：

- `spec-explorer` 先把问题、范围、成功标准说清楚
- `spec-forger` 再把意图沉淀为正式工件
- `bridge-contract` 把规划工件压缩为可执行契约 `execution-contract.md`
- `execution-governor` 只按照已批准契约推进实现
- `closure-archivist` 负责收口、验证与归档准备

## 核心 Skills

- `workflow-orchestrator`
- `spec-explorer`
- `spec-forger`
- `bridge-contract`
- `execution-governor`
- `closure-archivist`

## 第一版定位

- 自包含插件，不要求运行时预装 OpenSpec
- 自包含插件，不要求运行时预装 Superpowers
- 第一版优先支持 Claude Code 与 Trae
- 默认采用 Spec First + Strong Guardrails
- `execution-contract.md` 是从规划进入执行的正式桥接层

## 安装

安装说明已拆分到独立文档：

- [INSTALL.md](file:///Users/magebte/Documents/magebyte/open-source-plugins/spec-superflow/INSTALL.md)

支持：

- Claude Code 本地 skills 安装
- Trae 本地 skills 安装

## 如何使用

### 1. 统一从 `workflow-orchestrator` 进入

适合这些场景：

- 开始一个新 change
- 恢复一个旧 change
- 不确定当前该处于哪个状态
- 用户说“继续”“往下做”“开始实现”“先把需求梳理清楚”

### 2. 使用统一工件目录

对于名为 `<change-name>` 的变更，推荐使用：

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

### 3. 让 `spec-superflow` 成为唯一 workflow owner

不要在同一个会话中混用：

- OpenSpec 的独立工作流入口
- Superpowers 的独立工作流入口
- `spec-superflow` 的统一编排入口

正确做法是让 `spec-superflow` 对外成为唯一可见工作流，把两者的思想内化到自身流程里。

## 包含内容

### 模板

`templates/` 中包含：

- `proposal.md`
- `spec.md`
- `design.md`
- `tasks.md`
- `execution-contract.md`

### 文档

- [Artifact Contract](file:///Users/magebte/Documents/magebyte/open-source-plugins/spec-superflow/docs/artifact-contract.md)
- [State Machine](file:///Users/magebte/Documents/magebyte/open-source-plugins/spec-superflow/docs/state-machine.md)
- [Examples](file:///Users/magebte/Documents/magebyte/open-source-plugins/spec-superflow/docs/examples/README.md)
- [Contributing](file:///Users/magebte/Documents/magebyte/open-source-plugins/spec-superflow/CONTRIBUTING.md)
- [Release Checklist](file:///Users/magebte/Documents/magebyte/open-source-plugins/spec-superflow/docs/release-checklist.md)

### 示例

当前附带两个完整示例，覆盖不同场景：

- `docs/examples/add-dark-mode/` — 新 UI 功能（暗色模式）
- `docs/examples/refactor-auth-boundary/` — brownfield 后端重构（认证边界）

均按工件顺序展示从 `proposal.md` 到 `execution-contract.md` 的完整贯通路径。

## 发布建议

如果你准备把它发布到 GitHub，建议至少保留：

- `README.md`
- `README.zh-CN.md`
- `INSTALL.md`
- `CHANGELOG.md`
- `LICENSE`
- `.claude-plugin/plugin.json`
- `skills/`
- `templates/`
- `docs/`

## 当前状态

当前仓库已经达到可发布的 `v0.1` 形态：

- 插件元数据已就位
- 六个核心 skills 已具备明确职责
- 五类模板已完整
- 工件映射与状态机文档已补齐
- 示例变更已补齐
- 安装、许可证、版本记录已补齐
