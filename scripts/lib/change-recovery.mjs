import fs from 'node:fs';
import { basename, join, resolve } from 'node:path';
import { readState } from './state-loader.mjs';

const RECOGNIZABLE_ARTIFACTS = [
  '.spec-superflow.yaml',
  'proposal.md',
  'tasks.md',
  'execution-contract.md',
];

export class RecoveryError extends Error {
  constructor(code, message, details = {}, exitCode = 1) {
    super(message);
    this.code = code;
    this.details = details;
    this.exitCode = exitCode;
  }
}

export function resolveChangeTarget(input, cwd = process.cwd()) {
  if (hasText(input)) return inspectExplicitTarget(input, cwd);

  const candidates = listRecognizableChanges(join(cwd, 'changes'))
    .filter(change => !['closing', 'abandoned'].includes(change.state));
  if (candidates.length === 1) return { ...candidates[0], selection: 'only-active' };
  if (candidates.length === 0) {
    throw new RecoveryError('NO_ACTIVE_CHANGE', 'No active change found', { candidates: [] });
  }
  throw new RecoveryError('AMBIGUOUS_CHANGE', 'Multiple active changes found', {
    candidates: candidates.map(change => change.name).sort(),
  });
}

function hasText(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function inspectExplicitTarget(input, cwd) {
  const requested = input.trim();
  const directPath = resolve(cwd, requested);
  const changesPath = resolve(cwd, 'changes', requested);
  const targetPath = [directPath, changesPath].find(isRecognizableChange);

  if (!targetPath) {
    throw new RecoveryError('TARGET_NOT_FOUND', 'Change target was not found', {
      input: requested,
    });
  }

  return describeChange(targetPath, 'explicit');
}

function listRecognizableChanges(changesDir) {
  if (!isDirectory(changesDir)) return [];

  return fs.readdirSync(changesDir, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => join(changesDir, entry.name))
    .filter(isRecognizableChange)
    .map(changeDir => describeChange(changeDir));
}

function isRecognizableChange(changeDir) {
  return isDirectory(changeDir) && RECOGNIZABLE_ARTIFACTS
    .some(artifact => fs.existsSync(join(changeDir, artifact)));
}

function isDirectory(candidate) {
  try {
    return fs.statSync(candidate).isDirectory();
  } catch {
    return false;
  }
}

function describeChange(changeDir, selection) {
  return {
    name: basename(changeDir),
    path: changeDir,
    state: readState(changeDir).state,
    ...(selection ? { selection } : {}),
  };
}
