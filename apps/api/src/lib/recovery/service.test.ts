import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  maskEmail,
  maskPhone,
  validatePassword,
} from './service.js';

test('maskEmail obfuscates email addresses for privacy', () => {
  assert.equal(maskEmail('sagar.varule@gmail.com'), 'sa***le@gmail.com');
  assert.equal(maskEmail('student@chapterready.in'), 'st***nt@chapterready.in');
  assert.equal(maskEmail('ab@gmail.com'), 'a*@gmail.com');
  assert.equal(maskEmail('invalid-email'), '***@***.com');
});

test('maskPhone obfuscates phone numbers for privacy', () => {
  assert.equal(maskPhone('+919876543210'), '+919****10');
  assert.equal(maskPhone('9876543210'), '9876****10');
  assert.equal(maskPhone('123'), '******23');
});

test('validatePassword enforces strong student password rules', () => {
  assert.equal(validatePassword('short1'), 'Password must be at least 8 characters.');
  assert.equal(validatePassword('allletters'), 'Password must contain at least one letter and one number.');
  assert.equal(validatePassword('1234567890'), 'Password must contain at least one letter and one number.');
  assert.equal(validatePassword('ValidPass123'), null);
});
