require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_MIGRATION_USER,
    password: process.env.DB_MIGRATION_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    dialect: 'postgres',

    hooks: {
      afterConnect: async (connection) => {
        await connection.query('SET ROLE db_admin');
      }
    }
  }
};