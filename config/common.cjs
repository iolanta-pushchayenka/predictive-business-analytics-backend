const dotenv = require('dotenv');
const fs = require('node:fs');

// Load the selected environment file for Sequelize migrations.
dotenv.config({
  path: process.env.MIGRATION_ENV_FILE || '.env',
  override: Boolean(process.env.MIGRATION_ENV_FILE)
});

// Switch to the database administration role after connecting.
const migrationHooks = {
  afterConnect: async (connection) => {
    await connection.query('SET ROLE db_admin');
  }
};

module.exports = {
  development: {
    username: process.env.DB_MIGRATION_USER,
    password: process.env.DB_MIGRATION_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    dialect: 'postgres',
    hooks: migrationHooks
  },

  production: {
    username: process.env.DB_MIGRATION_USER,
    password: process.env.DB_MIGRATION_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    dialect: 'postgres',

    dialectOptions: {
  ssl: {
    require: true,
    rejectUnauthorized: true,
    ca: fs.readFileSync(
      process.env.DB_SSL_CA_PATH || './certs/prod-ca-2021.crt',
      'utf8'
    )
  }
},

    hooks: migrationHooks
  }
};