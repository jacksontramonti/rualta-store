const users = require('../services/users');
const categories = require('../services/categories');
const products = require('../services/products');
const v = require('../services/validation');

const id = (req) => v.id(req.params.id);
const created = (res, path, id) => res.location(path + '/' + id).status(201).json({ id });

const user = {
  get: async (req, res) => res.json(await users.get(id(req))),
  create: async (req, res) => created(res, '/v1/user', (await users.create(req.body)).id),
  login: async (req, res) => res.json({ token: await users.login(req.body) }),
  update: async (req, res) => {
    users.requireOwner(id(req), req.userId);
    await users.update(id(req), req.body);
    res.status(204).end();
  },
  remove: async (req, res) => {
    users.requireOwner(id(req), req.userId);
    await users.remove(id(req));
    res.status(204).end();
  }
};

const catalog = (service, name) => ({
  search: async (req, res) => res.json(await service.search(req.query)),
  get: async (req, res) => res.json(await service.get(id(req))),
  create: async (req, res) => {
    const item = await service.create(req.body);
    created(res, '/v1/' + name, item.id ?? item);
  },
  update: async (req, res) => {
    await service.update(id(req), req.body);
    res.status(204).end();
  },
  remove: async (req, res) => {
    await service.remove(id(req));
    res.status(204).end();
  }
});

module.exports = { user, category: catalog(categories, 'category'), product: catalog(products, 'product') };
