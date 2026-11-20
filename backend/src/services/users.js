const bcrypt = require('bcrypt');
const { User } = require('../models');
const v = require('./validation');
const { HttpError, invalid, missing } = require('../middleware/errors');
const { issueToken } = require('../middleware/auth');

const fields = ['id', 'firstname', 'surname', 'email'];
const names = (body) => ({
  firstname: v.text(body.firstname, 'firstname', 100),
  surname: v.text(body.surname, 'surname', 100),
  email: v.email(body.email)
});

async function get(id) {
  const row = await User.findByPk(id, { attributes: fields });
  if (!row) missing('Usuário não encontrado.');
  return row;
}
async function create(body) {
  body = v.object(body);
  const data = names(body);
  const password = v.password(body.password, 6);
  if (password !== body.confirmPassword) invalid('As senhas não coincidem.');
  return User.create({ ...data, password: await bcrypt.hash(password, 12) });
}
async function update(id, body) {
  const row = await get(id);
  await row.update(names(v.object(body)));
}
async function remove(id) {
  const row = await get(id);
  await row.destroy();
}
async function login(body) {
  body = v.object(body);
  const email = v.email(body.email);
  const password = v.password(body.password);
  const row = await User.findOne({ where: { email } });
  // Mantém uma comparação bcrypt mesmo se o e-mail não existir.
  const hash = row?.password || '$2b$12$ZyCO0u3guo12EeyPoetapetfcSUiRvhD6whqnfIMETFiAyJ5t7SaK';
  if (!(await bcrypt.compare(password, hash)) || !row) invalid('E-mail ou senha incorretos.');
  return issueToken(row.id);
}
function requireOwner(id, userId) {
  if (id !== userId) throw new HttpError(403, 'Só é permitido alterar ou remover a própria conta.');
}

module.exports = { get, create, update, remove, login, requireOwner };
