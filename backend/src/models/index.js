const db = require('../config/db');
const schema = require('./schema');
const define = (name, tableName, timestamps = false) =>
  db.define(name, schema[tableName], { tableName, timestamps });

const User = define('User', 'users', true);
const Category = define('Category', 'categories', true);
const Product = define('Product', 'products', true);
const ProductImage = define('ProductImage', 'product_images');
const ProductOption = define('ProductOption', 'product_options');
const ProductCategory = define('ProductCategory', 'product_categories');

Product.hasMany(ProductImage, { as: 'images', foreignKey: 'product_id' });
Product.hasMany(ProductOption, { as: 'options', foreignKey: 'product_id' });
Product.hasMany(ProductCategory, { as: 'categoryLinks', foreignKey: 'product_id' });
Category.hasMany(ProductCategory, { as: 'productLinks', foreignKey: 'category_id' });

module.exports = { db, User, Category, Product, ProductImage, ProductOption, ProductCategory };
