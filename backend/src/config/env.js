const path = require('node:path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env'), quiet: true });

const root = path.resolve(__dirname, '../..');
module.exports = {
  port: Number(process.env.PORT || 3000),
  db: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    database: process.env.DB_NAME || 'nova_sport',
    username: process.env.DB_USER || 'nova_sport',
    password: process.env.DB_PASSWORD || '',
    dialect: 'mysql',
    logging: false,
    define: { underscored: true, freezeTableName: true },
    pool: { max: 5, min: 0 }
  },
  jwtSecret: process.env.JWT_SECRET,
  jwtTtl: process.env.JWT_TTL || '1h',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  uploadDir: path.resolve(root, process.env.UPLOAD_DIR || 'uploads')
};
