const { DataTypes: D } = require('sequelize');
const str = (length, extra = {}) => ({ type: D.STRING(length), allowNull: false, ...extra });
const bool = (defaultValue = false) => ({ type: D.BOOLEAN, allowNull: false, defaultValue });
const int = (defaultValue) => ({ type: D.INTEGER.UNSIGNED, allowNull: false, defaultValue });
const id = () => ({ type: D.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true });
const fk = (table, primaryKey = false) => ({
  type: D.INTEGER.UNSIGNED, allowNull: false, primaryKey,
  references: { model: table, key: 'id' },
  onDelete: 'CASCADE', onUpdate: 'CASCADE'
});
const money = () => ({ type: D.DECIMAL(10, 2), allowNull: false });

module.exports = {
  users: {
    id: id(), firstname: str(100), surname: str(100),
    email: str(254, { unique: true }), password: str(100)
  },
  categories: {
    id: id(), name: str(120), slug: str(150, { unique: true }), use_in_menu: bool()
  },
  products: {
    id: id(), enabled: bool(), name: str(150), slug: str(180, { unique: true }),
    use_in_menu: bool(), stock: int(0), description: { type: D.STRING(255), allowNull: true },
    price: money(), price_with_discount: money()
  },
  product_images: {
    id: id(), product_id: fk('products'), enabled: bool(), path: str(2048)
  },
  product_options: {
    id: id(), product_id: fk('products'), title: str(120),
    shape: { type: D.ENUM('square', 'circle'), allowNull: false, defaultValue: 'square' },
    radius: int(0),
    type: { type: D.ENUM('text', 'color'), allowNull: false, defaultValue: 'text' },
    values: str(255)
  },
  product_categories: {
    product_id: fk('products', true), category_id: fk('categories', true)
  }
};
