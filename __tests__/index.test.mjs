import { describe, it } from 'node:test';

import assert from 'assert';

import { name } from '../lib/index.js';

describe('index', () => {
  it('exports name', () => {
    assert.strictEqual(name, 'cy-ai');
  });
});
