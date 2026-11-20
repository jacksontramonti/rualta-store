const db = require('./config/db');
const { port, jwtSecret } = require('./config/env');
const app = require('./app');

async function start() {
  if (!jwtSecret || jwtSecret.length < 32) throw new Error('Configure JWT_SECRET com pelo menos 32 caracteres.');
  await db.authenticate();
  const server = app.listen(port, () => console.log('NOVA SPORT API na porta ' + port));
  server.once('error', (error) => {
    console.error('Não foi possível abrir a porta:', error.code);
    process.exitCode = 1;
    void db.close();
  });
  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.once(signal, () => server.close(() => void db.close()));
  }
}

start().catch(async (error) => {
  console.error('Não foi possível iniciar a API:', error.message);
  process.exitCode = 1;
  await db.close();
});
