const jwt = require('jsonwebtoken');
const config = require('../config/env');
const { User } = require('../models');
const { HttpError } = require('./errors');
const claims = { issuer: 'nova-sport-backend', audience: 'nova-sport-api' };

function issueToken(id) {
  return jwt.sign({}, config.jwtSecret, { ...claims, algorithm: 'HS256', subject: String(id), expiresIn: config.jwtTtl });
}
async function authenticate(req, _res, next) {
  const match = /^Bearer (\S+)$/i.exec(req.get('authorization') || '');
  try {
    if (!match) throw new Error();
    const token = jwt.verify(match[1], config.jwtSecret, { ...claims, algorithms: ['HS256'] });
    if (!/^[1-9]\d*$/.test(token.sub)) throw new Error();
    req.userId = Number(token.sub);
  } catch {
    return next(new HttpError(401, 'Informe um token Bearer válido.'));
  }
  if (!(await User.findByPk(req.userId, { attributes: ['id'] }))) {
    return next(new HttpError(401, 'A conta deste token não existe.'));
  }
  next();
}
module.exports = { issueToken, authenticate };
