const { DataTypes: D } = require('sequelize');
const schema = require('./schema-v1.cjs');
const timestamps = () => ({
  created_at: { type: D.DATE, allowNull: false },
  updated_at: { type: D.DATE, allowNull: false }
});

exports.up = async ({ context: q }) => {
  for (const [table, attributes] of Object.entries(schema)) {
    const dated = ['users', 'categories', 'products'].includes(table);
    await q.createTable(table, { ...attributes, ...(dated && timestamps()) }, {
      charset: 'utf8mb4', collate: 'utf8mb4_unicode_ci', engine: 'InnoDB'
    });
  }
  await q.addIndex('product_categories', ['category_id', 'product_id'], { name: 'category_products_lookup' });
  await q.addIndex('products', ['price'], { name: 'products_price_lookup' });
  await q.addIndex('categories', ['use_in_menu'], { name: 'categories_menu_lookup' });
};

exports.down = async ({ context: q }) => {
  for (const table of Object.keys(schema).reverse()) await q.dropTable(table);
};
