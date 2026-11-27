import "dotenv/config";
import fs from "node:fs";
import { Sequelize } from "sequelize";

// Enable verified TLS for production or explicitly configured connections.
const useSSL =
  process.env.NODE_ENV === "production" || process.env.DB_SSL === "true";

// Configure PostgreSQL SSL without changing local database settings.
const dialectOptions = useSSL
  ? {
      ssl: {
        require: true,
        rejectUnauthorized: true,
        ca: fs.readFileSync(
          process.env.DB_SSL_CA_PATH || "./certs/prod-ca-2021.crt",
          "utf8",
        ),
      },
    }
  : {};

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    dialect: "postgres",
    dialectOptions,
    logging: false,
  },
);
