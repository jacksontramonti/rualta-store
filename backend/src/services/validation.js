const { invalid } = require('../middleware/errors');

function object(value, field = 'body') {
  if (!value || Object.getPrototypeOf(value) !== Object.prototype) invalid(field + ' deve ser um objeto.');
  return value;
}
function text(value, field, max) {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > max) {
    invalid(field + ' deve ser um texto de 1 a ' + max + ' caracteres.');
  }
  return value.trim();
}
function label(value, field, max) {
  const result = text(value, field, max);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(result)) invalid(field + ' deve usar letras minúsculas, números e hífens.');
  return result;
}
function integer(value, field, min = 0, max = 2147483647) {
  if (typeof value !== 'number' && !(typeof value === 'string' && /^-?\d+$/.test(value))) {
    invalid(field + ' deve ser um inteiro.');
  }
  const number = Number(value);
  if (!Number.isSafeInteger(number) || number < min || number > max) invalid(field + ' fora do intervalo permitido.');
  return number;
}
const id = (value, field = 'id') => integer(value, field, 1);
function boolean(value, field) {
  if (value === true || value === 'true' || value === 1 || value === '1') return true;
  if (value === false || value === 'false' || value === 0 || value === '0') return false;
  invalid(field + ' deve ser booleano.');
}
function list(value, field, max = 50) {
  if (!Array.isArray(value) || value.length > max) invalid(field + ' deve ser uma lista com até ' + max + ' itens.');
  return value;
}
function csv(value, field, max = 50) {
  if (typeof value !== 'string') invalid(field + ' deve ser separado por vírgulas.');
  return list(value.split(','), field, max).map((item) => text(item, field, 255));
}
function email(value) {
  const address = text(value, 'email', 254).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) invalid('E-mail inválido.');
  return address;
}
function password(value, minimum = 1) {
  if (typeof value !== 'string' || value.length < minimum || Buffer.byteLength(value) > 72) {
    invalid('Senha inválida. Use de ' + minimum + ' caracteres a 72 bytes.');
  }
  return value;
}
function money(value, field) {
  if (!['number', 'string'].includes(typeof value) || !/^\d{1,8}(?:\.\d{1,2})?$/.test(String(value))) {
    invalid(field + ' deve ser um valor não negativo com até duas casas decimais.');
  }
  return Number(value);
}
function pagination(query, allowed) {
  const limit = query.limit === undefined ? 12 : integer(query.limit, 'limit', -1, 100);
  if (limit === 0) invalid('limit deve ser -1 ou maior que zero.');
  const page = limit === -1 || query.page === undefined ? 1 : integer(query.page, 'page', 1, 1000000);
  const fields = query.fields === undefined ? null : [...new Set(csv(query.fields, 'fields'))];
  if (fields && fields.some((field) => !allowed.includes(field))) invalid('fields contém um campo desconhecido.');
  return { limit, page, fields };
}
function project(row, fields) {
  return fields ? Object.fromEntries(fields.map((field) => [field, row[field]])) : row;
}
module.exports = { object, text, label, integer, id, boolean, list, csv, email, password, money, pagination, project };
