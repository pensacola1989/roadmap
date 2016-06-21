// Update with your config settings.

module.exports = {

  development: {
    client: 'mysql',
    connection: {
      database: 'roadmap',
      user:     'root',
      password: ''
    },
    useNullAsDefault: true,
    migrations: {
      tableName: 'knex_migrations'
    }
  }
};
