import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { resolveChangeTarget } from '../../scripts/lib/change-recovery.mjs';

describe('change-recovery: resolveChangeTarget()', () => {
  let root;

  before(() => {
    root = mkdtempSync(join(tmpdir(), 'ssf-change-recovery-test-'));
    mkdirSync(join(root, 'changes'));
  });

  after(() => {
    if (root) rmSync(root, { recursive: true, force: true });
  });

  function makeChange(name, state) {
    const changeDir = join(root, 'changes', name);
    mkdirSync(changeDir);
    writeFileSync(join(changeDir, '.spec-superflow.yaml'), `state: ${state}\n`);
    return changeDir;
  }

  it('selects the only active change and rejects ambiguous recovery', () => {
    makeChange('alpha', 'executing');
    assert.equal(resolveChangeTarget(undefined, root).name, 'alpha');
    makeChange('beta', 'specifying');
    assert.throws(
      () => resolveChangeTarget(undefined, root),
      error => {
        assert.equal(error.code, 'AMBIGUOUS_CHANGE');
        assert.deepEqual(error.details.candidates, ['alpha', 'beta']);
        return true;
      },
    );
  });

  it('requires switch targets to resolve to recognizable changes', () => {
    assert.throws(
      () => resolveChangeTarget('missing', root),
      error => error.code === 'TARGET_NOT_FOUND',
    );
  });
});
