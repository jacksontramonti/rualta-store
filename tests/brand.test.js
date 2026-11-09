import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { products } from '../src/data/products.js';

test('a marca NOVA SPORT está presente em todos os produtos', () => {
  assert.equal(products.length, 12);
  assert.ok(products.every(product => product.brand === 'NOVA SPORT' && product.name.startsWith('Nova Sport ')));
});
test('título e logo apresentam NOVA SPORT', () => {
  assert.match(readFileSync('index.html', 'utf8'), /NOVA SPORT/);
  assert.match(readFileSync('src/assets/logo.svg', 'utf8'), /NOVA SPORT/);
});
