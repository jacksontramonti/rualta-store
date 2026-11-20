const { UniqueConstraintError, ValidationError, ForeignKeyConstraintError } = require('sequelize');

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
const invalid = (message) => { throw new HttpError(400, message); };
const missing = (message = 'Recurso não encontrado.') => { throw new HttpError(404, message); };

function errorHandler(err, _req, res, next) {
  if (res.headersSent) return next(err);
  if (err instanceof HttpError) return res.status(err.status).json({ message: err.message });
  if (err instanceof UniqueConstraintError) {
    return res.status(400).json({ message: 'Já existe um registro com esse e-mail ou slug.' });
  }
  if (err instanceof ValidationError || err instanceof ForeignKeyConstraintError) {
    return res.status(400).json({ message: 'Os dados informados são inválidos.' });
  }
  if (err.type === 'entity.parse.failed') return res.status(400).json({ message: 'JSON inválido.' });
  if (err.type === 'entity.too.large') return res.status(413).json({ message: 'Corpo da requisição muito grande.' });
  if (err.status === 404) return res.status(404).json({ message: 'Recurso não encontrado.' });
  console.error(err.name, err.original?.code || err.code || '');
  return res.status(500).json({ message: 'Erro interno do servidor.' });
}

module.exports = { HttpError, invalid, missing, errorHandler };
