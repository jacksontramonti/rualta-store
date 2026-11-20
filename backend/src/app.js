const express = require('express');
const cors = require('cors');
const swagger = require('swagger-ui-express');
const routes = require('./routes');
const { corsOrigin, uploadDir } = require('./config/env');
const { errorHandler, missing } = require('./middleware/errors');
const openapi = require('../docs/openapi.json');

const app = express();
app.disable('x-powered-by');
app.set('query parser', 'simple');
app.use(cors({ origin: corsOrigin.split(',').map((origin) => origin.trim()).filter(Boolean) }));
app.use((_req, res, next) => {
  res.set('X-Content-Type-Options', 'nosniff');
  next();
});
app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.get('/openapi.json', (_req, res) => res.json(openapi));
app.use('/docs', swagger.serve, swagger.setup(openapi));
app.use('/media', express.static(uploadDir, { index: false, dotfiles: 'deny' }));
app.use('/v1', express.json({ limit: '12mb' }), routes);
app.use((_req, _res) => missing('Rota não encontrada.'));
app.use(errorHandler);

module.exports = app;
