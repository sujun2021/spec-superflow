import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

function read(path) {
  return readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
}

const AUTO_INTAKE_STEPS = [
  ['explicit workflow', /explicit[^\n]*full[^\n]*hotfix[^\n]*tweak/i],
  ['show receipt', /ssf workflow show/],
  ['only missing facts', /only[^\n]*missing_facts|missing_facts[^\n]*only/i],
  ['recommend', /ssf workflow recommend/],
  ['Observed', /Observed/],
  ['Available', /Available/],
  ['Recommended', /Recommended/],
  ['Why', /Why/],
  ['user choice', /user(?:'s)? explicit path choice/i],
  ['persist selection', /ssf workflow select/],
  ['DP-0 confirmation', /Confirm DP-0/],
  ['confirmed state', /dp_0_confirmed true/],
];

function protocolErrors(source) {
  const errors = [];
  let previousIndex = -1;

  for (const [label, pattern] of AUTO_INTAKE_STEPS) {
    const match = pattern.exec(source);
    if (!match) {
      errors.push(`missing ${label}`);
      continue;
    }
    if (match.index <= previousIndex) errors.push(`${label} is out of order`);
    previousIndex = Math.max(previousIndex, match.index);
  }

  return errors;
}

describe('workflow-start path recommendation protocol', () => {
  it('requires recommendation and user selection before persisting an automatic workflow', () => {
    const skill = read('skills/workflow-start/SKILL.md');

    assert.deepEqual(protocolErrors(skill), []);
    assert.match(skill, /needs-input/);
    assert.match(skill, /acknowledge-recommendation/);
    assert.doesNotMatch(skill, /No artifacts.*safe default to full/i);
  });

  it('rejects a protocol that persists selection before recommendation', () => {
    const wrongOrder = [
      'explicit workflow full hotfix tweak',
      'ssf workflow show',
      'only missing_facts',
      'ssf workflow select',
      'ssf workflow recommend',
      'Observed',
      'Available',
      'Recommended',
      'Why',
      "user's explicit path choice",
      'Confirm DP-0',
      'dp_0_confirmed true',
    ].join('\n');

    assert.ok(protocolErrors(wrongOrder).some((error) => error.includes('out of order')));
  });

  it('rejects a protocol that omits a required recommendation display field', () => {
    const missingWhy = [
      'explicit workflow full hotfix tweak',
      'ssf workflow show',
      'only missing_facts',
      'ssf workflow recommend',
      'Observed',
      'Available',
      'Recommended',
      "user's explicit path choice",
      'ssf workflow select',
      'Confirm DP-0',
      'dp_0_confirmed true',
    ].join('\n');

    assert.ok(protocolErrors(missingWhy).includes('missing Why'));
  });

  it('documents intake selection separately from DP-4 execution mode', () => {
    const decisions = read('docs/decision-points.md');

    assert.match(decisions, /full.*hotfix.*tweak/s);
    assert.match(decisions, /Inline.*Batch Inline.*SDD/s);
    assert.match(decisions, /\.superpowers\/sdd\/workflow-selection\.json/);
    assert.match(decisions, /\.spec-superflow\.yaml[^\n]*dp_0_[^\n]*(?:scope|artifact_language)/);
  });
});
