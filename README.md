
# Predictive Business Analytics Platform

## Project Overview

This project is a web platform for predictive business analytics.

The platform aims to help users analyse sales data, identify patterns, forecast sales revenue, and perform customer segmentation.

The planned analytical functionality includes:
- CSV upload and automated data preparation
- Exploratory Data Analysis (EDA)
- Sales forecasting using linear regression
- Customer segmentation using K-means clustering
- Client-side and server-side computation modes

The application will use React for the frontend, Node.js and Express.js for the backend, and PostgreSQL for storing user accounts and server-side analytical results.

**Current status:** The PostgreSQL database structure, migrations, access roles, and development test data have been implemented. The main application functionality is still under development.

## Technology Stack

- **Database:** PostgreSQL 17
- **Backend:** Node.js, Express.js
- **ORM:** Sequelize
- **Database migrations and seeders:** Sequelize CLI
- **Frontend (planned):** React

## Database Implementation

The database uses a relational PostgreSQL structure consisting of 13 application tables.

The tables are organised into five functional groups:

1. User Management and Analysis History
2. Dataset Metadata
3. Exploratory Data Analysis (EDA)
4. Sales Forecasting
5. Customer Segmentation

The database stores analytical results rather than original CSV files. Analysis history is intended to be available only for server-side computations.

Data integrity is maintained through primary keys, foreign keys, NOT NULL, UNIQUE and CHECK constraints.

The database also uses cascading foreign key actions and transactions in the development data seeder.

## Getting Started

### Prerequisites

- Node.js and npm
- PostgreSQL 17
- Git

### Installation

Clone the repository:

```bash
git clone <repository-url>
cd predictive-business-analytics-backend
```

Install the project dependencies:

```bash
npm install
```

### Database Configuration

Create a PostgreSQL database and configure the required database users and permissions.

Create a local `.env` file based on `.env.example` and provide the required database connection settings.

The application and migration configurations are located in:

- `src/db/sequelize.js`
- `config/common.cjs`



### Database Migrations

Database tables and constraints are created using Sequelize migrations.

Migration files are located in the `migrations/` directory.

After configuring PostgreSQL and the required environment variables in `.env`, run:

```bash
npx sequelize-cli db:migrate --config config/common.cjs --env development
```

This command applies the existing migrations and creates the database structure.

To check the migration status, run:

```bash
npx sequelize-cli db:migrate:status --config config/common.cjs --env development
```


The database schema can also be inspected in the exported SQL file:

[PostgreSQL Schema](docs/database/diploma_schema.sql)

### Development Test Data

Synthetic test data is provided through a Sequelize seeder located in the `seeders/` directory.

The seeder includes test records for all 13 application tables and covers different scenarios, including missing customer information, zero usable rows, and multiple users.

After applying the database migrations, run the following command to populate the database with test data:

```bash
npx sequelize-cli db:seed:all --config config/common.cjs --env development
```

The seeder uses transactions to maintain data consistency during insertion and deletion.

**Important:** The demo seeder is intended for development environments only. It must not be executed against a production database.

## Database Documentation


| Document | Description |
|---|---|
| [Data Dictionary](docs/database/data_dictionary.md) | Tables, columns, data types, keys, constraints, and data quality expectations |
| [Database Design](docs/database/database_design.md) | Data integrity, transaction management, and database normalization up to 3NF |
| [Logical Database Schema](docs/database/ER_diagram_dimploma.drawio.png) | Visual representation of database tables and their relationships |
| [PostgreSQL DDL](docs/database/diploma_schema.sql) | SQL export of the implemented PostgreSQL database structure |

Database migrations are available in the [migrations](migrations/) directory.

Development test data is available in the [seeders](seeders/) directory.

## Current Development Status

**Implemented:**
- PostgreSQL database structure
- Sequelize migrations
- Primary and foreign key relationships
- Data integrity constraints
- Database access roles and privileges
- Development test data and seeder
- Database documentation and logical schema

**Planned:**
- User authentication
- CSV upload and data preparation
- Analytical calculations
- Transactional saving of server-side analysis results
- Analysis history API
- Frontend integration

The application backend and frontend are not yet fully implemented.

