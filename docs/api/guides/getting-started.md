# Getting Started

## 1. Overview

The Predictive Business Analytics API is the backend component of a web platform designed to help small businesses analyze their data.

The backend is developed using Node.js and Express.js, with PostgreSQL for data storage and Sequelize as the Object-Relational Mapping (ORM) tool.

This guide explains how to set up the backend locally, configure the database connection, start the server, and access the interactive API documentation.

## 2. Prerequisites

Before starting, ensure that the following tools are available:

- **Node.js** — version 22 or a compatible version specified by the project.
- **npm** — for installing dependencies and running scripts.
- **PostgreSQL** — a database instance accessible to the application.
- **Git** — for cloning the repository.

A code editor such as Visual Studio Code is recommended.

## 3. Installation

Clone the backend repository:

```bash
git clone https://github.com/iolanta-pushchayenka/predictive-business-analytics-backend.git
```

Navigate to the project directory:

```bash
cd predictive-business-analytics-backend
```

Install the required dependencies:

```bash
npm install
```

## 4. Environment Configuration

The application requires environment variables to configure the database connection, authentication, and server settings.

Copy the example environment file:

```bash
cp .env.example .env
```

On Windows PowerShell, use:

```powershell
Copy-Item .env.example .env
```

Open `.env` and configure the required values according to the descriptions in `.env.example`.

The database connection uses the following variables:

| Variable            | Description                                |
| ------------------- | ------------------------------------------ |
| `DB_USER`           | Database user used by the application      |
| `DB_PASS`           | Password for the application database user |
| `DB_MIGRATION_USER` | Database user used for schema migrations   |
| `DB_MIGRATION_PASS` | Password for the migration database user   |

Configure the remaining database, JWT, and server variables using the names provided in `.env.example`.

**Security note:** Never commit `.env`, database passwords, JWT signing secrets, or access tokens to version control.

## 5. Database Setup

Ensure that the configured PostgreSQL database is accessible.

The project uses Sequelize migrations to create and update the database schema.

Run:

```bash
npx sequelize-cli db:migrate
```

Use the migration-specific database credentials configured for the project.

Optional demo data can be inserted using the available seeders:

```bash
npx sequelize-cli db:seed:all
```

Seeding is optional and should only be performed in an appropriate development database.

For additional details about the database structure, refer to the documentation in `docs/database/`.

## 6. Starting the Backend

Start the application:

```bash
npm run start
```

The application starts an Express HTTP server.

With the local configuration using port 3000, the API is available at:

```text
http://localhost:3000
```

A successful startup should produce messages similar to:

```text
Database connection established successfully.
Server running on port 3000
```

## 7. Accessing API Documentation

The backend provides interactive API documentation using Swagger UI.

**Local Swagger UI:**

http://localhost:3000/api-docs

**Deployed Swagger UI:**

https://predictive-business-analytics-backend.onrender.com/api-docs

Note: The initial request may take up to a minute if the Render service has been inactive, as the server needs time to start.

Swagger UI allows developers to explore endpoints, review request and response formats, inspect error responses, and execute HTTP requests.

The OpenAPI specification is maintained in:

`docs/api/openapi.yaml`

## 8. Verifying the API

To verify that the API is responding, send the following request:

```http
GET http://localhost:3000/api/health
```

Alternatively, open Swagger UI, select `GET /api/health`, click **Try it out**, and then **Execute**.

Expected response:

**HTTP 200 OK**

```json
{
  "status": "ok"
}
```

This confirms that the HTTP API is responding. It does not independently verify database connectivity.

## 9. Available API Endpoints

The current implementation provides the following endpoints:

| Method | Endpoint             | Description                               | Authentication |
| ------ | -------------------- | ----------------------------------------- | -------------- |
| GET    | `/api/health`        | Check API availability                    | Not required   |
| POST   | `/api/auth/register` | Register a new user                       | Not required   |
| POST   | `/api/auth/login`    | Authenticate a user and obtain a JWT      | Not required   |
| GET    | `/api/auth/me`       | Retrieve the authenticated user's profile | Bearer JWT     |

Registration and login return a JWT access token.

Protected endpoints require an `Authorization` header:

```http
Authorization: Bearer <access_token>
```

For a complete authentication workflow, refer to the Integration Tutorial.

## 10. API Specification Validation

The OpenAPI specification is validated using Redocly CLI.

Run:

```bash
npx @redocly/cli lint docs/api/openapi.yaml
```

The project-specific validation configuration is stored in `redocly.yaml`.

A successful validation confirms that the specification satisfies the enabled OpenAPI linting rules. It does not replace runtime API testing.

## 11. Troubleshooting

| Problem                             | Possible solution                                                     |
| ----------------------------------- | --------------------------------------------------------------------- |
| Server fails to start               | Check environment variables and terminal errors                       |
| Database connection fails           | Verify PostgreSQL availability, credentials, and connection settings  |
| Port 3000 is unavailable            | Stop the conflicting process or configure another port                |
| Swagger UI does not open            | Ensure the backend is running and visit `/api-docs`                   |
| API returns `401 Unauthorized`      | Verify that the JWT is valid and included in the Authorization header |
| API returns `429 Too Many Requests` | Wait before retrying authentication requests                          |
