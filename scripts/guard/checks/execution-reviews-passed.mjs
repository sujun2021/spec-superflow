import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { readPlan, validatePlan } from '../../lib/execution-plan.mjs';
import { getOverlayPaths } from '../../lib/sdd-overlay.mjs';

/**
 * Verifies that every wave in the current execution plan has a passing review
 * receipt. A failed or malformed receipt is a blocking result, never a signal
 * that a later wave may proceed to closing.
 */
export function checkExecutionReviewsPassed(changeDir) {
  const plan = readPlan(changeDir);
  if (!plan) {
    // New full/hotfix executions cannot reach this transition without a plan:
    // execution-plan-ready blocks their entry. Treat a legacy state without a
    // plan as having no planned waves so existing historical changes can close.
    return { pass: true, failures: [] };
  }

  const validation = validatePlan(changeDir, plan);
  if (!validation.valid) {
    return { pass: false, failures: validation.failures };
  }

  const reviewsDir = getOverlayPaths(changeDir).reviews;
  const failures = [];
  for (const wave of plan.waves) {
    const receiptPath = join(reviewsDir, `${safeFileName(wave.id)}.json`);
    if (!existsSync(receiptPath)) {
      failures.push(`review receipt missing for planned wave '${wave.id}'. Record a passing review before closing.`);
      continue;
    }

    let receipt;
    try {
      receipt = JSON.parse(readFileSync(receiptPath, 'utf8'));
    } catch (error) {
      failures.push(`review receipt for planned wave '${wave.id}' cannot be read: ${error.message}`);
      continue;
    }
    if (receipt?.status !== 'pass') {
      failures.push(`review receipt for planned wave '${wave.id}' has status '${receipt?.status ?? 'missing'}'; expected 'pass'.`);
    }
  }

  return { pass: failures.length === 0, failures };
}

function safeFileName(value) {
  return Buffer.from(value, 'utf8').toString('base64url');
}
