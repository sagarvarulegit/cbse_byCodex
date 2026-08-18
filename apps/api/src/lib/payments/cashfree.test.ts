import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createHmac } from 'node:crypto';

import {
  createCashfreeOrder,
  createCashfreeRefund,
  fetchCashfreeOrder,
  verifyCashfreeWebhookSignature,
} from './cashfree.js';

test('createCashfreeOrder with simulated credentials creates valid test order', async () => {
  const order = await createCashfreeOrder({
    orderId: 'order_test_123',
    amountPaise: 19900,
    customerId: 'cust_test_123',
    customerName: 'Test Student',
    customerEmail: 'student@example.com',
  });

  assert.equal(order.orderId, 'order_test_123');
  assert.ok(order.paymentSessionId.startsWith('session_sim_'));
  assert.equal(order.amount, 19900);
  assert.equal(order.currency, 'INR');
  assert.equal(order.status, 'ACTIVE');
});

test('fetchCashfreeOrder returns order status', async () => {
  const order = await fetchCashfreeOrder('order_test_123');
  assert.equal(order.orderId, 'order_test_123');
  assert.equal(order.status, 'PAID');
  assert.equal(order.amount, 19900);
});

test('createCashfreeRefund with simulated credentials creates valid refund', async () => {
  const refund = await createCashfreeRefund({
    orderId: 'order_test_123',
    refundId: 'rfd_test_123',
    refundAmountPaise: 19900,
    refundNote: 'Test refund',
  });

  assert.equal(refund.refundId, 'rfd_test_123');
  assert.equal(refund.orderId, 'order_test_123');
  assert.equal(refund.amount, 19900);
  assert.equal(refund.status, 'SUCCESS');
});

test('verifyCashfreeWebhookSignature validates webhook digest', () => {
  const secretKey = 'test_cf_secret_key';
  const timestamp = '1786966229';
  const rawBody = JSON.stringify({ type: 'PAYMENT_SUCCESS_WEBHOOK', data: { order: { order_id: 'order_123' } } });

  const signature = createHmac('sha256', secretKey)
    .update(timestamp + rawBody)
    .digest('base64');

  assert.equal(
    verifyCashfreeWebhookSignature({
      rawBody,
      timestamp,
      signature,
      secretKeyOverride: secretKey,
    }),
    true,
  );

  assert.equal(
    verifyCashfreeWebhookSignature({
      rawBody,
      timestamp,
      signature: 'invalid_sig',
      secretKeyOverride: secretKey,
    }),
    false,
  );
});
