module.exports = {
  server: {
    port: 53250
  },
  db: {
    database: 'challenge_test',
    username: 'challenge',
    password: 'toor',
    options: {
      host: '127.0.0.1',
      dialect: 'postgres',
      logging: false
      // 'operatorsAliases': false
    }
  }
};
