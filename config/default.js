const path = require('path');

module.exports = {
  server: {
    port: 53290
  },
  db2: {
    database: 'challenge',
    user: 'challenge',
    password: 'toor',
    host: '127.0.0.1'
  },
  db: {
    database: 'challenge',
    username: 'challenge',
    password: 'toor',
    options: {
      host: '127.0.0.1',
      dialect: 'postgres',
      // 'operatorsAliases': false
    }
  },
  root: path.join(__dirname, '..')
};
