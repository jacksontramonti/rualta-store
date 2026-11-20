const { Category } = require('../models');
const v = require('./validation');
const { missing } = require('../middleware/errors');

const fields = ['id', 'name', 'slug', 'use_in_menu'];
function values(body) {
  body = v.object(body);
  return {
    name: v.text(body.name, 'name', 120),
    slug: v.label(body.slug, 'slug', 150),
    ...(body.use_in_menu !== undefined && { use_in_menu: v.boolean(body.use_in_menu, 'use_in_menu') })
  };
}
async function search(query) {
  const { limit, page, fields: projection } = v.pagination(query, fields);
  const where = {};
  if (query.use_in_menu !== undefined) where.use_in_menu = v.boolean(query.use_in_menu, 'use_in_menu');
  const { count, rows } = await Category.findAndCountAll({
    where, attributes: fields, order: [['id', 'ASC']],
    ...(limit !== -1 && { limit, offset: (page - 1) * limit })
  });
  return { data: rows.map((row) => v.project(row.toJSON(), projection)), total: count, limit, page };
}
async function get(id) {
  const row = await Category.findByPk(id, { attributes: fields });
  if (!row) missing('Categoria não encontrada.');
  return row;
}
const create = (body) => Category.create(values(body));
const update = async (id, body) => (await get(id)).update(values(body));
const remove = async (id) => (await get(id)).destroy();
module.exports = { search, get, create, update, remove };
