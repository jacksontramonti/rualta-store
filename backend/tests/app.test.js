const request = require('supertest');
const app = require('../src/app');
const v = require('../src/services/validation');

test('diagnóstico e documentação OpenAPI estão disponíveis', async () => {
  await request(app).get('/health').expect(200, { status: 'ok' });
  const doc = (await request(app).get('/openapi.json').expect(200)).body;
  expect(doc.paths['/v1/product/{id}'].delete.security).toEqual([{ bearerAuth: [] }]);
  expect(doc.paths['/v1/user'].post.security).toBeUndefined();
  await request(app).get('/docs/').expect(200).expect('Content-Type', /html/);
});

test('códigos para rota inexistente, JSON inválido e token ausente', async () => {
  await request(app).get('/v1/inexistente').expect(404);
  await request(app).post('/v1/user').set('Content-Type', 'application/json').send('{quebrado').expect(400);
  await request(app).post('/v1/product').send({}).expect(401);
  await request(app).delete('/v1/category/1').set('Authorization', 'Bearer inválido').expect(401);
  await request(app).get('/v1/product/abc').expect(400);
});

test('validação de paginação, preço e ID', () => {
  expect(v.pagination({ limit: '-1', page: '0', fields: 'name,id,name' }, ['id', 'name']))
    .toEqual({ limit: -1, page: 1, fields: ['name', 'id'] });
  expect(() => v.pagination({ limit: '0' }, [])).toThrow();
  expect(() => v.pagination({ fields: 'password' }, ['id'])).toThrow();
  expect(v.money('129.90', 'price')).toBe(129.9);
  expect(() => v.money('', 'price')).toThrow();
  expect(() => v.id('1 OR 1=1')).toThrow();
});
