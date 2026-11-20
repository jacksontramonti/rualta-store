const { Op, literal } = require('sequelize');
const { db, Product, Category, ProductImage, ProductOption, ProductCategory } = require('../models');
const v = require('./validation');
const media = require('./images');
const { invalid, missing } = require('../middleware/errors');

const columns = ['id', 'enabled', 'name', 'slug', 'use_in_menu', 'stock', 'description', 'price', 'price_with_discount'];
const fields = [...columns, 'category_ids', 'images', 'options'];
const related = [
  { model: ProductImage, as: 'images', separate: true, attributes: ['id', 'product_id', 'path', 'enabled'], order: [['id', 'ASC']] },
  { model: ProductOption, as: 'options', separate: true, attributes: ['id', 'product_id', 'title', 'shape', 'radius', 'type', 'values'], order: [['id', 'ASC']] },
  { model: ProductCategory, as: 'categoryLinks', separate: true, attributes: ['product_id', 'category_id'], order: [['category_id', 'ASC']] }
];
const uniqueIds = (items, field) => [...new Set(items.map((item) => v.id(item, field)))];

function serialize(row) {
  const data = row.get({ plain: true });
  const result = v.project(data, columns);
  return {
    ...result,
    price: Number(result.price),
    price_with_discount: Number(result.price_with_discount),
    category_ids: data.categoryLinks.map((link) => link.category_id),
    images: data.images.map(({ id, path, enabled }) => ({ id, content: path, enabled })),
    options: data.options.map(({ product_id, values, ...option }) => ({ ...option, values: values.split(',') }))
  };
}

// Usa a mesma ordenação de caracteres da migration. O literal contém
// apenas hexadecimais derivados dos bytes UTF-8, nunca texto SQL do usuário.
const sqlUtf8 = (input) => 'CONVERT(0x' + Buffer.from(input, 'utf8').toString('hex') +
  ' USING utf8mb4) COLLATE utf8mb4_unicode_ci';

async function search(query) {
  const { limit, page, fields: projection } = v.pagination(query, fields);
  const clauses = [];
  if (query.match !== undefined) {
    const word = v.text(query.match, 'match', 100);
    // LOCATE procura o texto literalmente, sem tratar % e _ como curingas.
    clauses.push({ [Op.or]: ['name', 'description'].map((field) =>
      db.where(db.fn('LOCATE', literal(sqlUtf8(word)), db.col('Product.' + field)), { [Op.gt]: 0 })) });
  }
  if (query.category_ids !== undefined) {
    const ids = uniqueIds(v.csv(query.category_ids, 'category_ids'), 'category_ids');
    clauses.push(literal('EXISTS (SELECT 1 FROM product_categories pc WHERE pc.product_id = Product.id AND pc.category_id IN (' + ids.join(',') + '))'));
  }
  if (query['price-range'] !== undefined) {
    const range = v.text(query['price-range'], 'price-range', 30).split('-');
    if (range.length !== 2) invalid('price-range deve usar o formato mínimo-máximo.');
    const [low, high] = range.map((value) => v.money(value, 'price-range'));
    if (low > high) invalid('O preço mínimo não pode exceder o máximo.');
    clauses.push({ price: { [Op.between]: [low, high] } });
  }
  // Express lê option[4] como chave única. O ID e cada valor são tratados separadamente.
  for (const [key, value] of Object.entries(query)) {
    if (!key.startsWith('option')) continue;
    const match = /^option\[(\d+)\]$/.exec(key);
    if (!match) invalid('Filtro de opção inválido.');
    const optionId = v.id(match[1], 'option');
    const tests = v.csv(value, 'option', 20).map((item) =>
      'FIND_IN_SET(' + sqlUtf8(item) + ', po.' + db.getQueryInterface().quoteIdentifier('values') + ') > 0');
    clauses.push(literal('EXISTS (SELECT 1 FROM product_options po WHERE po.product_id = Product.id AND po.id = ' +
      optionId + ' AND (' + tests.join(' OR ') + '))'));
  }
  const where = clauses.length ? { [Op.and]: clauses } : {};
  const [total, rows] = await Promise.all([
    Product.count({ where }),
    Product.findAll({ where, attributes: columns, include: related, order: [['id', 'ASC']],
      ...(limit !== -1 && { limit, offset: (page - 1) * limit }) })
  ]);
  return { data: rows.map((row) => v.project(serialize(row), projection)), total, limit, page };
}

async function get(id) {
  const row = await Product.findByPk(id, { attributes: columns, include: related });
  if (!row) missing('Produto não encontrado.');
  return serialize(row);
}

function attributes(body, previous) {
  const result = {};
  if (!previous || body.name !== undefined) result.name = v.text(body.name, 'name', 150);
  if (!previous || body.slug !== undefined) result.slug = v.label(body.slug, 'slug', 180);
  if (body.enabled !== undefined) result.enabled = v.boolean(body.enabled, 'enabled');
  if (body.use_in_menu !== undefined) result.use_in_menu = v.boolean(body.use_in_menu, 'use_in_menu');
  if (body.stock !== undefined) result.stock = v.integer(body.stock, 'stock');
  if (body.description !== undefined) result.description = body.description === null ? null : v.text(body.description, 'description', 255);
  for (const key of ['price', 'price_with_discount']) {
    if (!previous || body[key] !== undefined) result[key] = v.money(body[key], key);
  }
  if (Number(result.price_with_discount ?? previous?.price_with_discount) > Number(result.price ?? previous?.price)) {
    invalid('price_with_discount não pode exceder price.');
  }
  return result;
}

function optionAttrs(entry, existing) {
  const result = {};
  if (!existing || entry.title !== undefined) result.title = v.text(entry.title, 'options.title', 120);
  if (entry.shape !== undefined) {
    if (!['square', 'circle'].includes(entry.shape)) invalid('options.shape inválido.');
    result.shape = entry.shape;
  }
  if (entry.type !== undefined) {
    if (!['text', 'color'].includes(entry.type)) invalid('options.type inválido.');
    result.type = entry.type;
  }
  if (entry.radius !== undefined) {
    const radius = typeof entry.radius === 'string' ? entry.radius.replace(/px$/, '') : entry.radius;
    result.radius = v.integer(radius, 'options.radius');
  }
  if (!existing || entry.values !== undefined || entry.value !== undefined) {
    const values = v.list(entry.values ?? entry.value, 'options.values').map((item) => v.text(item, 'options.values', 100));
    if (!values.length || values.some((item) => item.includes(',')) || values.join(',').length > 255) {
      invalid('options.values deve ter valores sem vírgula e até 255 caracteres no total.');
    }
    result.values = values.join(',');
  }
  return result;
}

async function updateRelated(model, payload, field, productId, transaction, isUpdate, values, onRemove) {
  if (payload === undefined) return;
  const seen = new Set();
  for (const raw of v.list(payload, field, 30)) {
    const entry = v.object(raw, field);
    const childId = entry.id === undefined ? null : v.id(entry.id, field + '.id');
    const deleted = entry.deleted === undefined ? false : v.boolean(entry.deleted, field + '.deleted');
    if ((!isUpdate && childId) || (deleted && !childId) || seen.has(childId) && childId !== null) invalid(field + ' contém operação inválida.');
    if (childId) seen.add(childId);
    const row = childId ? await model.findOne({ where: { product_id: productId, id: childId }, transaction }) : null;
    if (childId && !row) invalid(field + ' contém um id que não pertence ao produto.');
    if (deleted) {
      onRemove?.(row);
      await row.destroy({ transaction });
    } else {
      const changes = await values(entry, row);
      if (row) await row.update(changes, { transaction });
      else await model.create({ ...changes, product_id: productId }, { transaction });
    }
  }
}

async function write(body, id) {
  body = v.object(body);
  const created = [];
  const obsolete = [];
  try {
    const productId = await db.transaction(async (transaction) => {
      let row = id ? await Product.findByPk(id, { transaction, lock: transaction.LOCK.UPDATE }) : null;
      if (id && !row) missing('Produto não encontrado.');
      const values = attributes(body, row);
      if (row) await row.update(values, { transaction });
      else row = await Product.create(values, { transaction });
      if (body.category_ids !== undefined) {
        const ids = uniqueIds(v.list(body.category_ids, 'category_ids'), 'category_ids');
        if (ids.length && await Category.count({ where: { id: ids }, transaction }) !== ids.length) invalid('category_ids contém uma categoria inexistente.');
        await ProductCategory.destroy({ where: { product_id: row.id }, transaction });
        if (ids.length) await ProductCategory.bulkCreate(ids.map((category_id) => ({ product_id: row.id, category_id })), { transaction });
      }
      await updateRelated(ProductImage, body.images, 'images', row.id, transaction, Boolean(id), async (entry, current) => {
        const data = {};
        if (!current || entry.content !== undefined) {
          const type = entry.type === undefined ? undefined : v.text(entry.type, 'images.type', 50);
          data.path = await media.store(entry.content, type, created);
          if (current && current.path !== data.path) obsolete.push(current.path);
        }
        if (entry.enabled !== undefined) data.enabled = v.boolean(entry.enabled, 'images.enabled');
        return data;
      }, (image) => obsolete.push(image.path));
      await updateRelated(ProductOption, body.options, 'options', row.id, transaction, Boolean(id), optionAttrs);
      return row.id;
    });
    await media.clean(obsolete);
    return productId;
  } catch (error) {
    await media.clean(created);
    throw error;
  }
}

async function remove(id) {
  const paths = await db.transaction(async (transaction) => {
    const row = await Product.findByPk(id, { transaction, lock: transaction.LOCK.UPDATE });
    if (!row) missing('Produto não encontrado.');
    const images = await ProductImage.findAll({ where: { product_id: id }, attributes: ['path'], transaction });
    await row.destroy({ transaction });
    return images.map((image) => image.path);
  });
  await media.clean(paths);
}

module.exports = { search, get, create: (body) => write(body), update: (id, body) => write(body, id), remove };
