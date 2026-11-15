
-- PostgreSQL access-role bootstrap for the diploma project.
-- Run against the intended project database as its owner / PostgreSQL administrator.
-- Run BEFORE Sequelize migrations.
-- No passwords are stored in this file.
-- This file does NOT create the database itself.

-- 1. Reusable privilege roles (no direct login).
DO $roles$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_read') THEN
    CREATE ROLE app_read NOLOGIN NOSUPERUSER;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_write') THEN
    CREATE ROLE app_write NOLOGIN NOSUPERUSER;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'db_admin') THEN
    CREATE ROLE db_admin NOLOGIN NOSUPERUSER;
  END IF;

  -- Separate login roles without passwords.
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'backend_user') THEN
    CREATE ROLE backend_user LOGIN NOSUPERUSER;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'migration_user') THEN
    CREATE ROLE migration_user LOGIN NOSUPERUSER;
  END IF;
END
$roles$;

-- 2. Assign privileges to connection users.
GRANT app_write TO backend_user;
GRANT db_admin TO migration_user;

-- Do not assign db_admin to backend_user.
-- migration_user uses SET ROLE db_admin for migrations.

-- 3. Schema privileges.
GRANT USAGE ON SCHEMA public TO app_read, app_write;
GRANT ALL ON SCHEMA public TO db_admin;

-- 4. Privileges for future tables created by db_admin.
ALTER DEFAULT PRIVILEGES FOR ROLE db_admin IN SCHEMA public
  GRANT SELECT ON TABLES TO app_read;

ALTER DEFAULT PRIVILEGES FOR ROLE db_admin IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_write;

-- 5. Privileges for existing application tables.
-- SequelizeMeta is excluded.
DO $grants$
DECLARE
  table_name text;
BEGIN
  FOREACH table_name IN ARRAY ARRAY[
    'users',
    'analyses',
    'dataset_profiles',
    'kpi_results',
    'sales_trend_points',
    'category_sales_points',
    'eda_summary_stats',
    'eda_correlations',
    'eda_distribution_bins',
    'forecasts',
    'forecast_points',
    'segmentations',
    'segment_profiles'
  ] LOOP
    IF to_regclass(format('public.%I', table_name)) IS NOT NULL THEN
      EXECUTE format(
        'GRANT SELECT ON TABLE public.%I TO app_read',
        table_name
      );

      EXECUTE format(
        'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.%I TO app_write',
        table_name
      );
    END IF;
  END LOOP;
END
$grants$;

-- Configure passwords separately using a secure administrator session.
-- Example in psql:
-- \password backend_user
-- \password migration_user
