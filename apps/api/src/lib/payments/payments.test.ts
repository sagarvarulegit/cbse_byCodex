import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createHmac } from 'node:crypto';

import {
  ALL_SUBJECTS_MOCK_PACK,
  ALL_SUBJECTS_MOCK_PACK_KEY,
  buildSingleSubjectProduct,
  findProductByKey,
  getAllAvailableProducts,
} from './products.js';
import {
  createRazorpayOrder,
  createRazorpayRefund,
  verifyRazorpaySignature,
  verifyRazorpayWebhookSignature,
} from './razorpay.js';

test('payment products catalog defines valid prices and subjects', () => {
  const allPack = ALL_SUBJECTS_MOCK_PACK;
  assert.equal(allPack.pricePaise, 19900); // ₹199
  assert.equal(allPack.currency, 'INR');
  assert.equal(allPack.includedSubjects.length, 4);
  assert.equal(allPack.paperCount, 20);

  const mathsSingle = buildSingleSubjectProduct('mathematics-standard');
  assert.equal(mathsSingle.pricePaise, 9900); // ₹99
  assert.equal(mathsSingle.paperCount, 5);
  assert.deepEqual(mathsSingle.includedSubjects, ['mathematics-standard']);

  const all = getAllAvailableProducts();
  assert.equal(all.length, 5); // 1 all-pack + 4 single subjects

  const foundAll = findProductByKey(ALL_SUBJECTS_MOCK_PACK_KEY);
  assert.equal(foundAll?.key, ALL_SUBJECTS_MOCK_PACK_KEY);

  const foundScience = findProductByKey('cbse10-mock-pass-science');
  assert.equal(foundScience?.pricePaise, 9900);
});

test('verifyRazorpaySignature correctly validates HMAC SHA-256 signatures', () => {
  const secret = 'test_secret_key_12345';
  const orderId = 'order_DEF456';
  const paymentId = 'pay_GHI789';

  const validSignature = createHmac('sha256', secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  const isValid = verifyRazorpaySignature({
    orderId,
    paymentId,
    signature: validSignature,
    secretOverride: secret,
  });
  assert.equal(isValid, true);

  const isInvalid = verifyRazorpaySignature({
    orderId,
    paymentId,
    signature: 'tampered_signature_hex',
    secretOverride: secret,
  });
  assert.equal(isInvalid, false);
});

test('verifyRazorpayWebhookSignature validates webhook body digest', () => {
  const webhookSecret = 'whsec_test_secret_abc';
  const rawBody = JSON.stringify({ event: 'payment.captured', payload: { payment: { entity: { id: 'pay_123' } } } });

  const validWebhookSig = createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex');

  assert.equal(
    verifyRazorpayWebhookSignature({ rawBody, signature: validWebhookSig, webhookSecret }),
    true,
  );
  assert.equal(
    verifyRazorpayWebhookSignature({ rawBody, signature: 'wrong_sig', webhookSecret }),
    false,
  );
});

test('createRazorpayOrder with simulated credentials creates valid test order', async () => {
  const order = await createRazorpayOrder({
    amount: 19900,
    currency: 'INR',
    receipt: 'rcpt_test_1',
  });

  assert.ok(order.id.startsWith('order_sim_'));
  assert.equal(order.amount, 19900);
  assert.equal(order.currency, 'INR');
  assert.equal(order.status, 'created');
});

test('createRazorpayRefund with simulated credentials creates valid test refund', async () => {
  const refund = await createRazorpayRefund({
    paymentId: 'pay_sim_123',
    amount: 19900,
  });

  assert.ok(refund.id.startsWith('rfd_sim_'));
  assert.equal(refund.paymentId, 'pay_sim_123');
  assert.equal(refund.amount, 19900);
  assert.equal(refund.status, 'processed');
});

