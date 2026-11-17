
# Data Dictionary

**Database:** `diploma_analytics`  
**DBMS:** PostgreSQL 17  
**Schema:** `public`

## 1. Database Overview

The PostgreSQL database stores registered user accounts, analysis metadata, and analytical results generated in server-side computation mode.

Original CSV files are not stored in the database. Data validation and preparation will be performed by the application before analytical results are saved to the database.

The database does not implement separate raw, staging, or data mart layers. Its tables are organised into five functional groups:

1. User Management and Analysis History
2. Dataset Metadata
3. Exploratory Data Analysis (EDA)
4. Sales Forecasting
5. Customer Segmentation

The database contains 13 application tables. The `SequelizeMeta` table is used internally by Sequelize to track executed migrations and is not part of the application data model.

**Notation:**

- **PK** — Primary Key
- **FK** — Foreign Key
- **NN** — NOT NULL
- **UQ** — UNIQUE
- **CK** — CHECK constraint
- **DEFAULT** — Default value

The Constraints column describes rules enforced by PostgreSQL. The Description / Data Quality column explains the expected meaning and validity of the stored values. Application-level expectations are not necessarily enforced by database constraints.

## 2. User Management and Analysis History

### 2.1 `users`

**Description:** Stores registered user accounts and authentication information.

| Column | Data Type | Key | Constraints | Description / Data Quality |
|---|---|---|---|---|
| `id` | UUID | PK | NN, DEFAULT `gen_random_uuid()` | Unique user identifier |
| `email` | VARCHAR(255) | — | NN, UQ | User email address; expected to have a valid email format |
| `password_hash` | TEXT | — | NN | Secure password hash; plaintext passwords must not be stored |
| `created_at` | TIMESTAMPTZ | — | NN, DEFAULT `CURRENT_TIMESTAMP` | Account creation timestamp |
| `updated_at` | TIMESTAMPTZ | — | NN, DEFAULT `CURRENT_TIMESTAMP` | Last account update timestamp |

### 2.2 `analyses`

**Description:** Stores analysis records associated with registered users.

| Column | Data Type | Key | Constraints | Description / Data Quality |
|---|---|---|---|---|
| `id` | UUID | PK | NN, DEFAULT `gen_random_uuid()` | Unique analysis identifier |
| `user_id` | UUID | FK → `users.id` | NN | References an existing user |
| `name` | VARCHAR(255) | — | NN | User-defined analysis name |
| `created_at` | TIMESTAMPTZ | — | NN, DEFAULT `CURRENT_TIMESTAMP` | Analysis creation timestamp |
| `updated_at` | TIMESTAMPTZ | — | NN, DEFAULT `CURRENT_TIMESTAMP` | Last analysis update timestamp |

## 3. Dataset Metadata

### 3.1 `dataset_profiles`

**Description:** Stores metadata about the uploaded dataset used for an analysis. The original CSV content is not stored.

| Column | Data Type | Key | Constraints | Description / Data Quality |
|---|---|---|---|---|
| `id` | UUID | PK | NN, DEFAULT `gen_random_uuid()` | Unique dataset profile identifier |
| `analysis_id` | UUID | FK → `analyses.id` | NN, UQ | References the associated analysis; at most one dataset profile per analysis |
| `filename` | VARCHAR(255) | — | NN | Original uploaded file name |
| `total_rows` | INTEGER | — | NN, CK ≥ 0 | Number of rows in the uploaded dataset |
| `total_columns` | INTEGER | — | NN, CK ≥ 1 | Number of dataset columns |
| `min_date` | DATE | — | Nullable, CK | Earliest detected valid date |
| `max_date` | DATE | — | Nullable, CK | Latest detected valid date |

**Additional constraint:** `min_date` and `max_date` must either both be NULL or both contain valid dates with `min_date <= max_date`.

## 4. Exploratory Data Analysis (EDA)

### 4.1 `kpi_results`

**Description:** Stores key business performance indicators calculated for an analysis.

| Column | Data Type | Key | Constraints | Description / Data Quality |
|---|---|---|---|---|
| `id` | UUID | PK | NN, DEFAULT `gen_random_uuid()` | Unique KPI result identifier |
| `analysis_id` | UUID | FK → `analyses.id` | NN, UQ | References the associated analysis; at most one KPI record per analysis |
| `total_revenue` | NUMERIC(18,2) | — | NN, CK ≥ 0 | Total calculated sales revenue |
| `total_orders` | INTEGER | — | NN, CK ≥ 0 | Total number of orders |
| `total_customers` | INTEGER | — | Nullable, CK ≥ 0 when present | Number of unique customers; NULL if unavailable |

### 4.2 `sales_trend_points`

**Description:** Stores daily sales revenue values used to display sales trends.

| Column | Data Type | Key | Constraints | Description / Data Quality |
|---|---|---|---|---|
| `id` | UUID | PK | NN, DEFAULT `gen_random_uuid()` | Unique sales trend point identifier |
| `analysis_id` | UUID | FK → `analyses.id` | NN | References the associated analysis |
| `sales_date` | DATE | — | NN | Date of the aggregated sales |
| `total_revenue` | NUMERIC(18,2) | — | NN, CK ≥ 0 | Total revenue for the specified date |

**Additional constraint:** `UNIQUE (analysis_id, sales_date)` prevents duplicate daily entries within one analysis.

### 4.3 `category_sales_points`

**Description:** Stores aggregated revenue by product or business category.

| Column | Data Type | Key | Constraints | Description / Data Quality |
|---|---|---|---|---|
| `id` | UUID | PK | NN, DEFAULT `gen_random_uuid()` | Unique category sales record identifier |
| `analysis_id` | UUID | FK → `analyses.id` | NN | References the associated analysis |
| `category_name` | VARCHAR(255) | — | NN, CK non-empty after trimming | Category name |
| `total_revenue` | NUMERIC(18,2) | — | NN, CK ≥ 0 | Total revenue associated with the category |

**Additional constraint:** `UNIQUE (analysis_id, category_name)` prevents duplicate categories within one analysis.

### 4.4 `eda_summary_stats`

**Description:** Stores descriptive statistics for numerical dataset metrics.

| Column | Data Type | Key | Constraints | Description / Data Quality |
|---|---|---|---|---|
| `id` | UUID | PK | NN, DEFAULT `gen_random_uuid()` | Unique summary statistics record identifier |
| `analysis_id` | UUID | FK → `analyses.id` | NN | References the associated analysis |
| `metric_name` | VARCHAR(255) | — | NN, CK non-empty after trimming | Name of the analysed numerical metric |
| `valid_count` | INTEGER | — | NN, CK ≥ 1 | Number of valid values used in the calculation |
| `missing_count` | INTEGER | — | NN, CK ≥ 0 | Number of missing or excluded values recorded for the metric |
| `min_value` | NUMERIC(20,6) | — | NN, CK | Minimum observed value |
| `max_value` | NUMERIC(20,6) | — | NN, CK | Maximum observed value; must be ≥ minimum |
| `mean_value` | NUMERIC(20,6) | — | NN, CK | Arithmetic mean; must lie within the minimum and maximum |
| `median_value` | NUMERIC(20,6) | — | NN, CK | Median; must lie within the minimum and maximum |
| `std_dev` | NUMERIC(20,6) | — | NN, CK ≥ 0 | Standard deviation of the metric |

**Additional constraint:** `UNIQUE (analysis_id, metric_name)` prevents duplicate statistical summaries for the same metric within one analysis.

### 4.5 `eda_correlations`

**Description:** Stores calculated correlation coefficients between pairs of numerical metrics.

| Column | Data Type | Key | Constraints | Description / Data Quality |
|---|---|---|---|---|
| `id` | UUID | PK | NN, DEFAULT `gen_random_uuid()` | Unique correlation record identifier |
| `analysis_id` | UUID | FK → `analyses.id` | NN | References the associated analysis |
| `metric_x` | VARCHAR(255) | — | NN, CK non-empty | First metric name |
| `metric_y` | VARCHAR(255) | — | NN, CK non-empty | Second metric name |
| `correlation_value` | NUMERIC(10,8) | — | NN, CK between -1 and 1 | Calculated correlation coefficient |
| `pair_count` | INTEGER | — | NN, CK ≥ 2 | Number of valid paired observations used |

**Additional constraints:** `metric_x < metric_y` enforces a consistent ordering of metric pairs. `UNIQUE (analysis_id, metric_x, metric_y)` prevents duplicate correlation records for the same pair.

### 4.6 `eda_distribution_bins`

**Description:** Stores histogram bins used to visualise numerical data distributions.

| Column | Data Type | Key | Constraints | Description / Data Quality |
|---|---|---|---|---|
| `id` | UUID | PK | NN, DEFAULT `gen_random_uuid()` | Unique distribution bin identifier |
| `analysis_id` | UUID | FK → `analyses.id` | NN | References the associated analysis |
| `metric_name` | VARCHAR(255) | — | NN, CK non-empty after trimming | Name of the analysed metric |
| `bin_index` | INTEGER | — | NN, CK ≥ 0 | Position of the histogram bin |
| `bin_start` | NUMERIC(20,6) | — | NN, CK | Lower boundary of the bin |
| `bin_end` | NUMERIC(20,6) | — | NN, CK | Upper boundary; must be greater than `bin_start` |
| `frequency` | INTEGER | — | NN, CK ≥ 0 | Number of observations in the bin |

**Additional constraint:** `UNIQUE (analysis_id, metric_name, bin_index)` prevents duplicate bin positions for the same metric and analysis.

## 5. Sales Forecasting

### 5.1 `forecasts`

**Description:** Stores sales forecasting metadata and prediction error metrics.

| Column | Data Type | Key | Constraints | Description / Data Quality |
|---|---|---|---|---|
| `id` | UUID | PK | NN, DEFAULT `gen_random_uuid()` | Unique forecast identifier |
| `analysis_id` | UUID | FK → `analyses.id` | NN, UQ | References the associated analysis; at most one forecast per analysis |
| `train_count` | INTEGER | — | NN, CK ≥ 2 | Number of training observations |
| `test_count` | INTEGER | — | NN, CK ≥ 1 | Number of testing observations |
| `model_mae` | NUMERIC(20,6) | — | NN, CK ≥ 0 | Mean Absolute Error of the forecasting model |
| `baseline_mae` | NUMERIC(20,6) | — | NN, CK ≥ 0 | Mean Absolute Error of the baseline forecast |

### 5.2 `forecast_points`

**Description:** Stores individual predicted revenue values produced by a forecast.

| Column | Data Type | Key | Constraints | Description / Data Quality |
|---|---|---|---|---|
| `id` | UUID | PK | NN, DEFAULT `gen_random_uuid()` | Unique forecast point identifier |
| `forecast_id` | UUID | FK → `forecasts.id` | NN | References the associated forecast |
| `forecast_date` | DATE | — | NN | Date for which revenue is predicted |
| `predicted_revenue` | NUMERIC(18,2) | — | NN, CK ≥ 0 | Predicted sales revenue for the specified date |

**Additional constraint:** `UNIQUE (forecast_id, forecast_date)` prevents duplicate prediction dates within one forecast.

## 6. Customer Segmentation

### 6.1 `segmentations`

**Description:** Stores the overall results and evaluation metrics of customer segmentation.

| Column | Data Type | Key | Constraints | Description / Data Quality |
|---|---|---|---|---|
| `id` | UUID | PK | NN, DEFAULT `gen_random_uuid()` | Unique segmentation identifier |
| `analysis_id` | UUID | FK → `analyses.id` | NN, UQ | References the associated analysis; at most one segmentation per analysis |
| `cluster_count` | INTEGER | — | NN, CK ≥ 2 | Number of customer clusters |
| `customers_analyzed` | INTEGER | — | NN, CK ≥ `cluster_count` | Total number of customers included in segmentation |
| `silhouette_score` | NUMERIC(10,8) | — | Nullable, CK between -1 and 1 when present | Clustering quality indicator; NULL when unavailable |

### 6.2 `segment_profiles`

**Description:** Stores aggregated characteristics of each customer segment based on Recency, Frequency, and Monetary (RFM) metrics.

| Column | Data Type | Key | Constraints | Description / Data Quality |
|---|---|---|---|---|
| `id` | UUID | PK | NN, DEFAULT `gen_random_uuid()` | Unique segment profile identifier |
| `segmentation_id` | UUID | FK → `segmentations.id` | NN | References the associated segmentation |
| `cluster_label` | INTEGER | — | NN, CK ≥ 0 | Numerical identifier assigned to the cluster |
| `customer_count` | INTEGER | — | NN, CK ≥ 1 | Number of customers assigned to the cluster |
| `avg_recency` | NUMERIC(12,2) | — | NN, CK ≥ 0 | Average recency value of customers in the cluster |
| `avg_frequency` | NUMERIC(12,2) | — | NN, CK ≥ 1 | Average purchase frequency |
| `avg_monetary` | NUMERIC(18,2) | — | NN, CK ≥ 0 | Average monetary value of customer purchases |

**Additional constraint:** `UNIQUE (segmentation_id, cluster_label)` prevents duplicate cluster labels within one segmentation.

## 7. General Data Quality Expectations

The database enforces data integrity through primary keys, foreign keys, uniqueness constraints, non-null requirements, and value checks.

The following expectations apply to the stored data:

- **Identifiers and references:** Each record must have a unique primary key, and foreign keys must reference existing parent records.
- **Numeric values:** Counts, revenue values, error metrics, and other numerical results must satisfy their defined database constraints.
- **Dates and timestamps:** Date fields must contain valid PostgreSQL dates. Dataset date ranges must satisfy the defined chronological constraints.
- **Analytical results:** Calculated statistics, forecasting results, and segmentation metrics must be based on validated and prepared input data.
- **Missing information:** Nullable fields are used where a value may legitimately be unavailable, such as `total_customers`, dataset dates, or `silhouette_score`.
- **User information:** Email addresses are expected to be validated by the application, and passwords must be stored using secure password hashing.

The application is responsible for validating and preparing source CSV data before calculations. Database constraints provide an additional level of protection against invalid or inconsistent stored results.
