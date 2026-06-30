#!/usr/bin/env node
// scripts/install-cursor.mjs — deploy spec-superflow skills/rules for Cursor Agent
import { existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { cp, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pluginRoot = dirname(__dirname); // repository root
const targetRoot = process.argv[2] || process.cwd();

const sourceSkills = join(pluginRoot, 'skills');
const targetCursor = join(targetRoot, '.cursor');
const targetSkills = join(targetCursor, 'skills');
const targetRules = join(targetCursor, 'rules');

function ensureDir(dir) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

async function copySkills() {
  ensureDir(targetSkills);
  const entries = readdirSync(sourceSkills).filter(name => {
    const full = join(sourceSkills, name);
    try { return statSync(full).isDirectory(); } catch { return false; }
  });

  for (const name of entries) {
    const src = join(sourceSkills, name);
    const dst = join(targetSkills, name);
    await cp(src, dst, { recursive: true, force: true });
  }

  return entries.length;
}

async function writePhaseGuard() {
  ensureDir(targetRules);
  const content = `---
description: spec-superflow phase guard — 防止阶段漂移和未授权实现
alwaysApply: true
---

# Phase Guard

## 入口规则

- 所有工作必须从 "/start-workflow" 入口开始（或当前版本中的 "/workflow-orchestrator"）。
- 在 .spec-superflow.yaml 中确认当前 state 和 workflow 模式之前，不要开始写代码。

## 全局禁止

- 没有 execution-contract.md 或未经用户明确批准，不得进入实现。
- 执行过程中如果发现需求/范围变化，必须回退到 specifying 或 bridging，而不是直接改代码。
- 不要直接调用执行类 skill（如 "/execute-change"），必须通过入口路由。

## 决策点协议

- DP-1：是否开始这个变更？
- DP-2：选择哪种方案？
- DP-3：是否批准 execution contract？
- DP-4：选择执行模式（TDD / SDD）
- DP-5：批次完成检查点
- DP-6：代码审查完成
- DP-7：是否收口归档？

> 本文件由 scripts/install-cursor.mjs 生成；对具体变更的 guard 内容请运行 ssf inject <change-dir> 更新。
`;
  await writeFile(join(targetRules, 'phase-guard.mdc'), content, 'utf-8');
}

async function main() {
  if (!existsSync(sourceSkills)) {
    console.error(`❌ skills/ directory not found at ${pluginRoot}`);
    process.exit(1);
  }

  const count = await copySkills();
  await writePhaseGuard();

  console.log(`✅ Cursor install complete:`);
  console.log(`   - ${count} skills copied to ${targetSkills}`);
  console.log(`   - phase guard written to ${join(targetRules, 'phase-guard.mdc')}`);
  console.log(`\nNext: open Cursor Agent and try "/workflow-orchestrator" or "/start-workflow".`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
