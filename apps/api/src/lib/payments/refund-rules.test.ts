import assert from 'node:assert/strict';
import { test } from 'node:test';

import { evaluateRefundEligibility } from './refund-rules.js';
import { ALL_SUBJECTS_MOCK_PACK_KEY } from './products.js';

test('evaluateRefundEligibility returns null for non-existent order', async () => {
  const result = await evaluateRefundEligibility({
    userId: 'non_existent_user',
    orderId: 'non_existent_order',
  });
  assert.equal(result, null);
});
