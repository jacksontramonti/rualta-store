const { Sequelize } = require('sequelize');
const { db } = require('./env');
module.exports = new Sequelize(db);
