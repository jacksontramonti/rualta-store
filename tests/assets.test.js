import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { products } from '../src/data/products.js';

test('todas as fotografias JPEG usadas pelo catálogo existem', () => {
  for (const product of products) {
    for (const image of [product.image, ...product.images.map(item => item.src)]) {
      const path = `public${image}`;
      assert.ok(existsSync(path), `faltou ${path}`);
      const bytes = readFileSync(path);
      assert.ok(bytes.length > 3, `imagem vazia: ${path}`);
      assert.equal(bytes[0], 0xff, `não é JPEG: ${path}`);
      assert.equal(bytes[1], 0xd8, `não é JPEG: ${path}`);
      assert.equal(bytes[2], 0xff, `não é JPEG: ${path}`);
    }
  }
});

test('as três imagens de coleções e os oito banners estão presentes', () => {
  for (const name of [
    ...Array.from({length: 3}, (_, i) => `collection-${i + 1}.png`),
    ...Array.from({length: 8}, (_, i) => `home-slide-${i + 1}.jpeg`)
  ]) {
    assert.ok(existsSync(`public/course-images/${name}`), `faltou ${name}`);
  }
});
