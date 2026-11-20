const { randomUUID } = require('node:crypto');
const fs = require('node:fs/promises');
const path = require('node:path');
const { uploadDir } = require('../config/env');
const { invalid } = require('../middleware/errors');
const { text } = require('./validation');

const localPath = /^\/media\/([0-9a-f-]{36}\.(?:png|jpg|webp|gif))$/;
const formats = {
  'image/png': ['png', (b) => b.subarray(0, 8).equals(Buffer.from('89504e470d0a1a0a', 'hex'))],
  'image/jpeg': ['jpg', (b) => b.subarray(0, 3).equals(Buffer.from('ffd8ff', 'hex'))],
  'image/webp': ['webp', (b) => b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP'],
  'image/gif': ['gif', (b) => /^GIF8[79]a$/.test(b.toString('ascii', 0, 6))]
};

async function store(content, type, created) {
  if (typeof content !== 'string') invalid('images.content deve ser uma URL ou uma imagem base64.');
  if (/^https?:\/\//i.test(content)) {
    try {
      const url = new URL(text(content, 'images.content', 2048));
      if (url.username || url.password) throw new Error();
      return url.href;
    } catch {
      invalid('URL da imagem inválida.');
    }
  }
  const uri = /^data:(image\/[a-z]+);base64,(.+)$/i.exec(content);
  const raw = uri ? uri[2] : content;
  const mime = (type || uri?.[1] || '').toLowerCase().replace(/^image\/jpg$/, 'image/jpeg');
  if (raw.length > 2800000 || !/^[A-Za-z0-9+/]+={0,2}$/.test(raw) || raw.length % 4 === 1) {
    invalid('A imagem deve ser base64 válida de até 2 MiB.');
  }
  const data = Buffer.from(raw, 'base64');
  const format = mime ? formats[mime] : Object.values(formats).find((item) => item[1](data));
  if (!format || data.length > 2 * 1024 * 1024 || !format[1](data)) invalid('Tipo de imagem inválido.');
  const file = randomUUID() + '.' + format[0];
  await fs.mkdir(uploadDir, { recursive: true });
  await fs.writeFile(path.join(uploadDir, file), data, { flag: 'wx' });
  const storedPath = '/media/' + file;
  created.push(storedPath);
  return storedPath;
}

async function clean(paths) {
  await Promise.all(paths.map(async (storedPath) => {
    const match = localPath.exec(storedPath);
    if (!match) return;
    try {
      await fs.unlink(path.join(uploadDir, match[1]));
    } catch (error) {
      if (error.code !== 'ENOENT') console.warn('Não foi possível limpar uma imagem:', error.code);
    }
  }));
}

module.exports = { store, clean };
