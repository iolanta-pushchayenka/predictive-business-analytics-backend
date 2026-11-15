
# Database Design and Data Integrity

## 1. Data Integrity

The application uses PostgreSQL 17 to maintain data integrity through primary keys, foreign keys, constraints, and transactions.

The following mechanisms are implemented:

- **Primary Keys (PK):** Each application table has a UUID primary key that uniquely identifies its records.
- **Foreign Keys (FK):** Foreign keys ensure that related records reference existing parent records. For example, `analyses.user_id` references `users.id`.
- **NOT NULL:** Required fields cannot contain NULL values.
- **UNIQUE:** Uniqueness constraints prevent duplicate values. For example, `users.email` must be unique, and `forecasts.analysis_id` allows only one forecast per analysis.
- **CHECK:** Constraints validate stored values. For example, `kpi_results.total_revenue` cannot be negative, and correlation coefficients must be between -1 and 1.
- **ON DELETE CASCADE:** When a parent record is deleted, its related records are automatically deleted. For example, deleting an analysis also removes its associated analytical results.
**ON UPDATE CASCADE:** If a referenced primary key is updated, the corresponding foreign key values in related tables are updated automatically.


The constraints were verified using test data and invalid INSERT operations. PostgreSQL successfully rejected negative revenue (SQLSTATE 23514), duplicate email addresses (SQLSTATE 23505), and foreign keys referencing nonexistent users (SQLSTATE 23503).

## 2. Transaction Management

PostgreSQL transactions are used to ensure that related database operations are executed atomically.

The Sequelize test-data seeder uses transactions to insert records into all 13 application tables. If an insertion fails, the transaction is rolled back, preventing partial insertion of test data.

The seeder also uses transactions when removing test records.

During backend implementation, the same approach will be used when saving analysis results. An analysis record and its associated analytical results will be saved within a single transaction. If any required database operation fails, all changes made within that transaction will be rolled back.

This approach helps prevent incomplete analysis records and maintains consistency between related tables.

## 3. Database Normalization (3NF)

The database structure was designed according to relational normalization principles up to Third Normal Form (3NF).

**First Normal Form (1NF):** Each table has a primary key, and columns store individual values rather than repeating groups. For example, daily sales values are stored as separate records in `sales_trend_points`.

**Second Normal Form (2NF):** The database uses single-column primary keys and composite unique constraints for business identifiers. Non-key attributes depend on the complete corresponding key. For example, statistical values in `eda_summary_stats` are associated with a specific combination of `analysis_id` and `metric_name`, while customer segment characteristics depend on the combination of `segmentation_id` and `cluster_label`. No partial dependencies have been identified.

**Third Normal Form (3NF):** Tables separate information according to its purpose, and non-key attributes are designed to avoid transitive dependencies.

For example:

- `users` stores account information, while `analyses` stores analysis records and references users through `user_id`.
- `dataset_profiles` stores dataset metadata separately from analysis records.
- `forecasts` stores forecasting metrics, while `forecast_points` stores individual predicted values linked through `forecast_id`.
- `segmentations` stores clustering results, while `segment_profiles` stores characteristics of individual clusters.

The database intentionally stores calculated analytical results, such as total revenue and descriptive statistics, to support analysis history without retaining original CSV files. These values represent results at different levels of aggregation rather than unnecessary duplication of user information.

This structure reduces data redundancy, separates responsibilities between tables, and supports consistent storage and retrieval of analytical results.
