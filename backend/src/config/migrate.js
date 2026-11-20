const { Umzug, SequelizeStorage } = require('umzug');
const db = require('./db');
const migrator = new Umzug({
  migrations: { glob: ['*.js', { cwd: require('node:path').resolve(__dirname, '../../migrations') }] },
  context: db.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize: db }),
  logger: process.env.NODE_ENV === 'test' ? undefined : console
});

if (require.main === module) {
  const direction = process.argv[2];
  (async () => {
    if (direction === 'up') await migrator.up();
    else if (direction === 'down') await migrator.down();
    else throw new Error('Use up ou down.');
  })().catch((error) => {
    console.error('Falha na migration:', error.message);
    process.exitCode = 1;
  }).finally(() => db.close());
}
module.exports = migrator;
