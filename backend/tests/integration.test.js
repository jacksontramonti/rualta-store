const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');

process.env.JWT_SECRET = 'segredo-efemero-apenas-para-testes-automatizados';
process.env.UPLOAD_DIR = require('node:fs').mkdtempSync(path.join(os.tmpdir(), 'nova-sport-test-'));

const request = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../src/app');
const { db, User, Product } = require('../src/models');
const migrator = require('../src/config/migrate');
const enabled = process.env.RUN_DB_TESTS === '1';
const integration = enabled ? describe : describe.skip;
const png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a3+0AAAAASUVORK5CYII=';

async function register(email) {
  const body = { firstname: 'Ana', surname: 'Silva', email, password: 'Senha123!', confirmPassword: 'Senha123!' };
  const signup = await request(app).post('/v1/user').send(body).expect(201);
  expect(signup.headers.location).toBe('/v1/user/' + signup.body.id);
  const { token } = (await request(app).post('/v1/user/token').send({ email, password: body.password }).expect(200)).body;
  return { ...body, id: signup.body.id, auth: { Authorization: 'Bearer ' + token } };
}

afterAll(async () => {
  await db.close();
  await fs.rm(process.env.UPLOAD_DIR, { recursive: true, force: true });
});

integration('API com banco SQL real', () => {
  let prepared = false;
  beforeAll(async () => {
    if (!db.config.database.endsWith('_test')) throw new Error('Use um banco de teste com nome terminado em _test.');
    const tables = await db.getQueryInterface().showAllTables();
    if (tables.length) throw new Error('O banco de teste precisa estar vazio.');
    await migrator.up();
    prepared = true;
  });
  afterAll(async () => {
    if (prepared) {
      await migrator.down();
      await db.getQueryInterface().dropTable('SequelizeMeta');
    }
  });

  test('usuários, senha com hash, login, autorização e exclusão', async () => {
    const user = await register('ana@example.com');
    const other = await register('outra@example.com');
    const read = await request(app).get('/v1/user/' + user.id).expect(200);
    expect(read.body).toEqual({ id: user.id, firstname: 'Ana', surname: 'Silva', email: user.email });
    const stored = await User.findByPk(user.id);
    expect(stored.password).not.toEqual(user.password);
    expect(await bcrypt.compare(user.password, stored.password)).toBe(true);
    await request(app).post('/v1/user').send(user).expect(400);
    await request(app).post('/v1/user/token').send({ email: user.email, password: 'errada' }).expect(400);
    await request(app).post('/v1/user/token').send({ email: 'inexistente@example.com', password: 'errada' }).expect(400);
    await request(app).put('/v1/user/' + user.id).set(other.auth).send(user).expect(403);
    await request(app).put('/v1/user/' + user.id).set(user.auth).send({ ...user, firstname: 'Maria' }).expect(204);
    await request(app).get('/v1/user/' + user.id).expect(200).expect((res) => expect(res.body.firstname).toBe('Maria'));
    await request(app).delete('/v1/user/' + user.id).set(user.auth).expect(204);
    await request(app).get('/v1/user/' + user.id).expect(404);
    await request(app).post('/v1/category').set(user.auth).send({}).expect(401);
  }, 20000);

  test('CRUD de categorias e produtos, filtros, mídia e rollback', async () => {
    const { auth } = await register('catalogo@example.com');
    await request(app).post('/v1/category').send({}).expect(401);
    const menu = { name: 'Tênis', slug: 'tenis', use_in_menu: true };
    const { id: category } = (await request(app).post('/v1/category').set(auth).send(menu).expect(201)).body;
    const { id: extra } = (await request(app).post('/v1/category').set(auth)
      .send({ name: 'Corrida', slug: 'corrida' }).expect(201)).body;
    await request(app).get('/v1/category/' + category).expect(200, { id: category, ...menu });
    await request(app).put('/v1/category/' + extra).set(auth).send({ name: 'Trilha', slug: 'trilha' }).expect(204);
    await request(app).get('/v1/category/search?use_in_menu=true&fields=name&limit=1')
      .expect(200, { data: [{ name: 'Tênis' }], total: 1, limit: 1, page: 1 });

    const payload = {
      enabled: true, name: 'Tênis Urban', slug: 'tenis-urban', description: 'Casual com 10% de desconto',
      stock: 12, price: 250, price_with_discount: 199.9, category_ids: [category, extra],
      images: [{ type: 'image/png', content: png }],
      options: [{ title: 'Tamanho', radius: '4px', value: ['40', '42'] }]
    };
    await request(app).post('/v1/product').set(auth).send({ ...payload, category_ids: [999999] }).expect(400);
    expect(await Product.count()).toBe(0);
    await request(app).post('/v1/product').set(auth).send({ ...payload, options: [{ title: 'inválido' }] }).expect(400);
    expect(await Product.count()).toBe(0);
    expect(await fs.readdir(process.env.UPLOAD_DIR)).toEqual([]);
    const { id } = (await request(app).post('/v1/product').set(auth).send(payload).expect(201)).body;
    const { images, options, category_ids } = (await request(app).get('/v1/product/' + id).expect(200)).body;
    expect(category_ids).toEqual([category, extra]);
    expect(options[0]).toMatchObject({ radius: 4, values: ['40', '42'] });
    await request(app).get(images[0].content).expect(200).expect('Content-Type', /image\/png/);
    const query = new URLSearchParams({ match: '10%', category_ids: String(category), 'price-range': '200-260',
      ['option[' + options[0].id + ']']: '42', fields: 'id,price', limit: '1' });
    await request(app).get('/v1/product/search?' + query)
      .expect(200, { data: [{ id, price: 250 }], total: 1, limit: 1, page: 1 });
    await request(app).get('/v1/product/search?limit=1&page=2').expect((res) => expect(res.body.data).toEqual([]));
    await request(app).get('/v1/product/search?price-range=300-200').expect(400);
    await request(app).put('/v1/product/' + id).set(auth).send({ stock: 15,
      images: [{ id: images[0].id, deleted: true }, { content: 'https://example.com/tenis.png' }],
      options: [{ id: options[0].id, values: ['42', '44'] }] }).expect(204);
    await request(app).get(images[0].content).expect(404);
    await request(app).delete('/v1/category/' + category).set(auth).expect(204);
    await request(app).get('/v1/category/' + category).expect(404);
    const updated = (await request(app).get('/v1/product/' + id).expect(200)).body;
    expect(updated).toMatchObject({ stock: 15, category_ids: [extra],
      images: [{ content: 'https://example.com/tenis.png' }], options: [{ values: ['42', '44'] }] });
    await request(app).delete('/v1/product/' + id).set(auth).expect(204);
    await request(app).get('/v1/product/' + id).expect(404);
    await request(app).delete('/v1/product/' + id).set(auth).expect(404);
  }, 20000);
});
