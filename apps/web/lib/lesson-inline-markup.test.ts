import assert from 'node:assert/strict';
import test from 'node:test';

import { parseInlineMarkup } from './lesson-inline-markup';

test('parseInlineMarkup renders lesson emphasis instead of exposing markdown markers', () => {
  assert.deepEqual(parseInlineMarkup('**Observation:** Use *Answer:* with `H₂O`.'), [
    {
      children: [{ type: 'text', value: 'Observation:' }],
      type: 'strong',
    },
    { type: 'text', value: ' Use ' },
    {
      children: [{ type: 'text', value: 'Answer:' }],
      type: 'emphasis',
    },
    { type: 'text', value: ' with ' },
    { type: 'code', value: 'H₂O' },
    { type: 'text', value: '.' },
  ]);
});

test('parseInlineMarkup supports code nested inside bold question subparts', () => {
  assert.deepEqual(parseInlineMarkup('**(i) `4Na + O₂ → 2Na₂O`**'), [
    {
      children: [
        { type: 'text', value: '(i) ' },
        { type: 'code', value: '4Na + O₂ → 2Na₂O' },
      ],
      type: 'strong',
    },
  ]);
});

test('parseInlineMarkup supports safe internal lesson links', () => {
  assert.deepEqual(
    parseInlineMarkup(
      'Open the [balancing workbench](/chapters/example/lessons/balancing#workbench).',
    ),
    [
      { type: 'text', value: 'Open the ' },
      {
        children: [{ type: 'text', value: 'balancing workbench' }],
        href: '/chapters/example/lessons/balancing#workbench',
        type: 'link',
      },
      { type: 'text', value: '.' },
    ],
  );
});
