--
-- PostgreSQL database dump
--

\restrict dSs8KiPJwKO21UlOJupZqEwcZCNqutn8iFhhmOw3QtlwNhvTBZCjVLjv9LVmCYw

-- Dumped from database version 17.7
-- Dumped by pg_dump version 17.7

-- Started on 2026-11-15 17:18:14

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 217 (class 1259 OID 102035)
-- Name: SequelizeMeta; Type: TABLE; Schema: public; Owner: db_admin
--

CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);


ALTER TABLE public."SequelizeMeta" OWNER TO db_admin;

--
-- TOC entry 219 (class 1259 OID 102052)
-- Name: analyses; Type: TABLE; Schema: public; Owner: db_admin
--

CREATE TABLE public.analyses (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    name character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.analyses OWNER TO db_admin;

--
-- TOC entry 223 (class 1259 OID 102108)
-- Name: category_sales_points; Type: TABLE; Schema: public; Owner: db_admin
--

CREATE TABLE public.category_sales_points (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    analysis_id uuid NOT NULL,
    category_name character varying(255) NOT NULL,
    total_revenue numeric(18,2) NOT NULL,
    CONSTRAINT category_sales_points_values_check CHECK (((total_revenue >= (0)::numeric) AND (length(TRIM(BOTH FROM category_name)) > 0)))
);


ALTER TABLE public.category_sales_points OWNER TO db_admin;

--
-- TOC entry 220 (class 1259 OID 102065)
-- Name: dataset_profiles; Type: TABLE; Schema: public; Owner: db_admin
--

CREATE TABLE public.dataset_profiles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    analysis_id uuid NOT NULL,
    filename character varying(255) NOT NULL,
    total_rows integer NOT NULL,
    total_columns integer NOT NULL,
    min_date date,
    max_date date,
    CONSTRAINT dataset_profiles_counts_check CHECK (((total_rows >= 0) AND (total_columns >= 1))),
    CONSTRAINT dataset_profiles_dates_check CHECK ((((min_date IS NULL) AND (max_date IS NULL)) OR ((min_date IS NOT NULL) AND (max_date IS NOT NULL) AND (min_date <= max_date))))
);


ALTER TABLE public.dataset_profiles OWNER TO db_admin;

--
-- TOC entry 225 (class 1259 OID 102136)
-- Name: eda_correlations; Type: TABLE; Schema: public; Owner: db_admin
--

CREATE TABLE public.eda_correlations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    analysis_id uuid NOT NULL,
    metric_x character varying(255) NOT NULL,
    metric_y character varying(255) NOT NULL,
    correlation_value numeric(10,8) NOT NULL,
    pair_count integer NOT NULL,
    CONSTRAINT eda_correlations_values_check CHECK (((length(TRIM(BOTH FROM metric_x)) > 0) AND (length(TRIM(BOTH FROM metric_y)) > 0) AND ((metric_x)::text < (metric_y)::text) AND ((correlation_value >= ('-1'::integer)::numeric) AND (correlation_value <= (1)::numeric)) AND (pair_count >= 2)))
);


ALTER TABLE public.eda_correlations OWNER TO db_admin;

--
-- TOC entry 226 (class 1259 OID 102152)
-- Name: eda_distribution_bins; Type: TABLE; Schema: public; Owner: db_admin
--

CREATE TABLE public.eda_distribution_bins (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    analysis_id uuid NOT NULL,
    metric_name character varying(255) NOT NULL,
    bin_index integer NOT NULL,
    bin_start numeric(20,6) NOT NULL,
    bin_end numeric(20,6) NOT NULL,
    frequency integer NOT NULL,
    CONSTRAINT eda_distribution_bins_values_check CHECK (((length(TRIM(BOTH FROM metric_name)) > 0) AND (bin_index >= 0) AND (bin_start < bin_end) AND (frequency >= 0)))
);


ALTER TABLE public.eda_distribution_bins OWNER TO db_admin;

--
-- TOC entry 224 (class 1259 OID 102122)
-- Name: eda_summary_stats; Type: TABLE; Schema: public; Owner: db_admin
--

CREATE TABLE public.eda_summary_stats (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    analysis_id uuid NOT NULL,
    metric_name character varying(255) NOT NULL,
    valid_count integer NOT NULL,
    missing_count integer NOT NULL,
    min_value numeric(20,6) NOT NULL,
    max_value numeric(20,6) NOT NULL,
    mean_value numeric(20,6) NOT NULL,
    median_value numeric(20,6) NOT NULL,
    std_dev numeric(20,6) NOT NULL,
    CONSTRAINT eda_summary_stats_values_check CHECK (((length(TRIM(BOTH FROM metric_name)) > 0) AND (valid_count >= 1) AND (missing_count >= 0) AND (min_value <= max_value) AND ((mean_value >= min_value) AND (mean_value <= max_value)) AND ((median_value >= min_value) AND (median_value <= max_value)) AND (std_dev >= (0)::numeric)))
);


ALTER TABLE public.eda_summary_stats OWNER TO db_admin;

--
-- TOC entry 228 (class 1259 OID 102180)
-- Name: forecast_points; Type: TABLE; Schema: public; Owner: db_admin
--

CREATE TABLE public.forecast_points (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    forecast_id uuid NOT NULL,
    forecast_date date NOT NULL,
    predicted_revenue numeric(18,2) NOT NULL,
    CONSTRAINT forecast_points_revenue_check CHECK ((predicted_revenue >= (0)::numeric))
);


ALTER TABLE public.forecast_points OWNER TO db_admin;

--
-- TOC entry 227 (class 1259 OID 102166)
-- Name: forecasts; Type: TABLE; Schema: public; Owner: db_admin
--

CREATE TABLE public.forecasts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    analysis_id uuid NOT NULL,
    train_count integer NOT NULL,
    test_count integer NOT NULL,
    model_mae numeric(20,6) NOT NULL,
    baseline_mae numeric(20,6) NOT NULL,
    CONSTRAINT forecasts_values_check CHECK (((train_count >= 2) AND (test_count >= 1) AND (model_mae >= (0)::numeric) AND (baseline_mae >= (0)::numeric)))
);


ALTER TABLE public.forecasts OWNER TO db_admin;

--
-- TOC entry 221 (class 1259 OID 102080)
-- Name: kpi_results; Type: TABLE; Schema: public; Owner: db_admin
--

CREATE TABLE public.kpi_results (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    analysis_id uuid NOT NULL,
    total_revenue numeric(18,2) NOT NULL,
    total_orders integer NOT NULL,
    total_customers integer,
    CONSTRAINT kpi_results_values_check CHECK (((total_revenue >= (0)::numeric) AND (total_orders >= 0) AND ((total_customers IS NULL) OR (total_customers >= 0))))
);


ALTER TABLE public.kpi_results OWNER TO db_admin;

--
-- TOC entry 222 (class 1259 OID 102094)
-- Name: sales_trend_points; Type: TABLE; Schema: public; Owner: db_admin
--

CREATE TABLE public.sales_trend_points (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    analysis_id uuid NOT NULL,
    sales_date date NOT NULL,
    total_revenue numeric(18,2) NOT NULL,
    CONSTRAINT sales_trend_points_revenue_check CHECK ((total_revenue >= (0)::numeric))
);


ALTER TABLE public.sales_trend_points OWNER TO db_admin;

--
-- TOC entry 230 (class 1259 OID 102208)
-- Name: segment_profiles; Type: TABLE; Schema: public; Owner: db_admin
--

CREATE TABLE public.segment_profiles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    segmentation_id uuid NOT NULL,
    cluster_label integer NOT NULL,
    customer_count integer NOT NULL,
    avg_recency numeric(12,2) NOT NULL,
    avg_frequency numeric(12,2) NOT NULL,
    avg_monetary numeric(18,2) NOT NULL,
    CONSTRAINT segment_profiles_values_check CHECK (((cluster_label >= 0) AND (customer_count >= 1) AND (avg_recency >= (0)::numeric) AND (avg_frequency >= (1)::numeric) AND (avg_monetary >= (0)::numeric)))
);


ALTER TABLE public.segment_profiles OWNER TO db_admin;

--
-- TOC entry 229 (class 1259 OID 102194)
-- Name: segmentations; Type: TABLE; Schema: public; Owner: db_admin
--

CREATE TABLE public.segmentations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    analysis_id uuid NOT NULL,
    cluster_count integer NOT NULL,
    customers_analyzed integer NOT NULL,
    silhouette_score numeric(10,8),
    CONSTRAINT segmentations_values_check CHECK (((cluster_count >= 2) AND (customers_analyzed >= cluster_count) AND ((silhouette_score IS NULL) OR ((silhouette_score >= ('-1'::integer)::numeric) AND (silhouette_score <= (1)::numeric)))))
);


ALTER TABLE public.segmentations OWNER TO db_admin;

--
-- TOC entry 218 (class 1259 OID 102040)
-- Name: users; Type: TABLE; Schema: public; Owner: db_admin
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email character varying(255) NOT NULL,
    password_hash text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.users OWNER TO db_admin;

--
-- TOC entry 4777 (class 2606 OID 102039)
-- Name: SequelizeMeta SequelizeMeta_pkey; Type: CONSTRAINT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);


--
-- TOC entry 4783 (class 2606 OID 102059)
-- Name: analyses analyses_pkey; Type: CONSTRAINT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY public.analyses
    ADD CONSTRAINT analyses_pkey PRIMARY KEY (id);


--
-- TOC entry 4798 (class 2606 OID 102120)
-- Name: category_sales_points category_sales_points_analysis_category_unique; Type: CONSTRAINT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY public.category_sales_points
    ADD CONSTRAINT category_sales_points_analysis_category_unique UNIQUE (analysis_id, category_name);


--
-- TOC entry 4800 (class 2606 OID 102113)
-- Name: category_sales_points category_sales_points_pkey; Type: CONSTRAINT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY public.category_sales_points
    ADD CONSTRAINT category_sales_points_pkey PRIMARY KEY (id);


--
-- TOC entry 4786 (class 2606 OID 102072)
-- Name: dataset_profiles dataset_profiles_analysis_id_key; Type: CONSTRAINT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY public.dataset_profiles
    ADD CONSTRAINT dataset_profiles_analysis_id_key UNIQUE (analysis_id);


--
-- TOC entry 4788 (class 2606 OID 102070)
-- Name: dataset_profiles dataset_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY public.dataset_profiles
    ADD CONSTRAINT dataset_profiles_pkey PRIMARY KEY (id);


--
-- TOC entry 4806 (class 2606 OID 102150)
-- Name: eda_correlations eda_correlations_analysis_pair_unique; Type: CONSTRAINT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY public.eda_correlations
    ADD CONSTRAINT eda_correlations_analysis_pair_unique UNIQUE (analysis_id, metric_x, metric_y);


--
-- TOC entry 4808 (class 2606 OID 102143)
-- Name: eda_correlations eda_correlations_pkey; Type: CONSTRAINT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY public.eda_correlations
    ADD CONSTRAINT eda_correlations_pkey PRIMARY KEY (id);


--
-- TOC entry 4810 (class 2606 OID 102164)
-- Name: eda_distribution_bins eda_distribution_bins_analysis_metric_index_unique; Type: CONSTRAINT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY public.eda_distribution_bins
    ADD CONSTRAINT eda_distribution_bins_analysis_metric_index_unique UNIQUE (analysis_id, metric_name, bin_index);


--
-- TOC entry 4812 (class 2606 OID 102157)
-- Name: eda_distribution_bins eda_distribution_bins_pkey; Type: CONSTRAINT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY public.eda_distribution_bins
    ADD CONSTRAINT eda_distribution_bins_pkey PRIMARY KEY (id);


--
-- TOC entry 4802 (class 2606 OID 102134)
-- Name: eda_summary_stats eda_summary_stats_analysis_metric_unique; Type: CONSTRAINT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY public.eda_summary_stats
    ADD CONSTRAINT eda_summary_stats_analysis_metric_unique UNIQUE (analysis_id, metric_name);


--
-- TOC entry 4804 (class 2606 OID 102127)
-- Name: eda_summary_stats eda_summary_stats_pkey; Type: CONSTRAINT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY public.eda_summary_stats
    ADD CONSTRAINT eda_summary_stats_pkey PRIMARY KEY (id);


--
-- TOC entry 4818 (class 2606 OID 102192)
-- Name: forecast_points forecast_points_forecast_date_unique; Type: CONSTRAINT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY public.forecast_points
    ADD CONSTRAINT forecast_points_forecast_date_unique UNIQUE (forecast_id, forecast_date);


--
-- TOC entry 4820 (class 2606 OID 102185)
-- Name: forecast_points forecast_points_pkey; Type: CONSTRAINT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY public.forecast_points
    ADD CONSTRAINT forecast_points_pkey PRIMARY KEY (id);


--
-- TOC entry 4814 (class 2606 OID 102173)
-- Name: forecasts forecasts_analysis_id_key; Type: CONSTRAINT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY public.forecasts
    ADD CONSTRAINT forecasts_analysis_id_key UNIQUE (analysis_id);


--
-- TOC entry 4816 (class 2606 OID 102171)
-- Name: forecasts forecasts_pkey; Type: CONSTRAINT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY public.forecasts
    ADD CONSTRAINT forecasts_pkey PRIMARY KEY (id);


--
-- TOC entry 4790 (class 2606 OID 102087)
-- Name: kpi_results kpi_results_analysis_id_key; Type: CONSTRAINT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY public.kpi_results
    ADD CONSTRAINT kpi_results_analysis_id_key UNIQUE (analysis_id);


--
-- TOC entry 4792 (class 2606 OID 102085)
-- Name: kpi_results kpi_results_pkey; Type: CONSTRAINT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY public.kpi_results
    ADD CONSTRAINT kpi_results_pkey PRIMARY KEY (id);


--
-- TOC entry 4794 (class 2606 OID 102106)
-- Name: sales_trend_points sales_trend_points_analysis_date_unique; Type: CONSTRAINT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY public.sales_trend_points
    ADD CONSTRAINT sales_trend_points_analysis_date_unique UNIQUE (analysis_id, sales_date);


--
-- TOC entry 4796 (class 2606 OID 102099)
-- Name: sales_trend_points sales_trend_points_pkey; Type: CONSTRAINT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY public.sales_trend_points
    ADD CONSTRAINT sales_trend_points_pkey PRIMARY KEY (id);


--
-- TOC entry 4826 (class 2606 OID 102213)
-- Name: segment_profiles segment_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY public.segment_profiles
    ADD CONSTRAINT segment_profiles_pkey PRIMARY KEY (id);


--
-- TOC entry 4828 (class 2606 OID 102220)
-- Name: segment_profiles segment_profiles_segmentation_cluster_unique; Type: CONSTRAINT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY public.segment_profiles
    ADD CONSTRAINT segment_profiles_segmentation_cluster_unique UNIQUE (segmentation_id, cluster_label);


--
-- TOC entry 4822 (class 2606 OID 102201)
-- Name: segmentations segmentations_analysis_id_key; Type: CONSTRAINT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY public.segmentations
    ADD CONSTRAINT segmentations_analysis_id_key UNIQUE (analysis_id);


--
-- TOC entry 4824 (class 2606 OID 102199)
-- Name: segmentations segmentations_pkey; Type: CONSTRAINT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY public.segmentations
    ADD CONSTRAINT segmentations_pkey PRIMARY KEY (id);


--
-- TOC entry 4779 (class 2606 OID 102051)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4781 (class 2606 OID 102049)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4784 (class 1259 OID 102222)
-- Name: analyses_user_created_at_idx; Type: INDEX; Schema: public; Owner: db_admin
--

CREATE INDEX analyses_user_created_at_idx ON public.analyses USING btree (user_id, created_at DESC);


--
-- TOC entry 4829 (class 2606 OID 102060)
-- Name: analyses analyses_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY public.analyses
    ADD CONSTRAINT analyses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4833 (class 2606 OID 102114)
-- Name: category_sales_points category_sales_points_analysis_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY public.category_sales_points
    ADD CONSTRAINT category_sales_points_analysis_id_fkey FOREIGN KEY (analysis_id) REFERENCES public.analyses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4830 (class 2606 OID 102073)
-- Name: dataset_profiles dataset_profiles_analysis_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY public.dataset_profiles
    ADD CONSTRAINT dataset_profiles_analysis_id_fkey FOREIGN KEY (analysis_id) REFERENCES public.analyses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4835 (class 2606 OID 102144)
-- Name: eda_correlations eda_correlations_analysis_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY public.eda_correlations
    ADD CONSTRAINT eda_correlations_analysis_id_fkey FOREIGN KEY (analysis_id) REFERENCES public.analyses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4836 (class 2606 OID 102158)
-- Name: eda_distribution_bins eda_distribution_bins_analysis_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY public.eda_distribution_bins
    ADD CONSTRAINT eda_distribution_bins_analysis_id_fkey FOREIGN KEY (analysis_id) REFERENCES public.analyses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4834 (class 2606 OID 102128)
-- Name: eda_summary_stats eda_summary_stats_analysis_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY public.eda_summary_stats
    ADD CONSTRAINT eda_summary_stats_analysis_id_fkey FOREIGN KEY (analysis_id) REFERENCES public.analyses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4838 (class 2606 OID 102186)
-- Name: forecast_points forecast_points_forecast_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY public.forecast_points
    ADD CONSTRAINT forecast_points_forecast_id_fkey FOREIGN KEY (forecast_id) REFERENCES public.forecasts(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4837 (class 2606 OID 102174)
-- Name: forecasts forecasts_analysis_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY public.forecasts
    ADD CONSTRAINT forecasts_analysis_id_fkey FOREIGN KEY (analysis_id) REFERENCES public.analyses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4831 (class 2606 OID 102088)
-- Name: kpi_results kpi_results_analysis_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY public.kpi_results
    ADD CONSTRAINT kpi_results_analysis_id_fkey FOREIGN KEY (analysis_id) REFERENCES public.analyses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4832 (class 2606 OID 102100)
-- Name: sales_trend_points sales_trend_points_analysis_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY public.sales_trend_points
    ADD CONSTRAINT sales_trend_points_analysis_id_fkey FOREIGN KEY (analysis_id) REFERENCES public.analyses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4840 (class 2606 OID 102214)
-- Name: segment_profiles segment_profiles_segmentation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY public.segment_profiles
    ADD CONSTRAINT segment_profiles_segmentation_id_fkey FOREIGN KEY (segmentation_id) REFERENCES public.segmentations(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4839 (class 2606 OID 102202)
-- Name: segmentations segmentations_analysis_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY public.segmentations
    ADD CONSTRAINT segmentations_analysis_id_fkey FOREIGN KEY (analysis_id) REFERENCES public.analyses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4991 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA public TO app_read;
GRANT USAGE ON SCHEMA public TO app_write;
GRANT ALL ON SCHEMA public TO db_admin;


--
-- TOC entry 4992 (class 0 OID 0)
-- Dependencies: 219
-- Name: TABLE analyses; Type: ACL; Schema: public; Owner: db_admin
--

GRANT SELECT ON TABLE public.analyses TO app_read;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.analyses TO app_write;


--
-- TOC entry 4993 (class 0 OID 0)
-- Dependencies: 223
-- Name: TABLE category_sales_points; Type: ACL; Schema: public; Owner: db_admin
--

GRANT SELECT ON TABLE public.category_sales_points TO app_read;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.category_sales_points TO app_write;


--
-- TOC entry 4994 (class 0 OID 0)
-- Dependencies: 220
-- Name: TABLE dataset_profiles; Type: ACL; Schema: public; Owner: db_admin
--

GRANT SELECT ON TABLE public.dataset_profiles TO app_read;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.dataset_profiles TO app_write;


--
-- TOC entry 4995 (class 0 OID 0)
-- Dependencies: 225
-- Name: TABLE eda_correlations; Type: ACL; Schema: public; Owner: db_admin
--

GRANT SELECT ON TABLE public.eda_correlations TO app_read;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.eda_correlations TO app_write;


--
-- TOC entry 4996 (class 0 OID 0)
-- Dependencies: 226
-- Name: TABLE eda_distribution_bins; Type: ACL; Schema: public; Owner: db_admin
--

GRANT SELECT ON TABLE public.eda_distribution_bins TO app_read;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.eda_distribution_bins TO app_write;


--
-- TOC entry 4997 (class 0 OID 0)
-- Dependencies: 224
-- Name: TABLE eda_summary_stats; Type: ACL; Schema: public; Owner: db_admin
--

GRANT SELECT ON TABLE public.eda_summary_stats TO app_read;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.eda_summary_stats TO app_write;


--
-- TOC entry 4998 (class 0 OID 0)
-- Dependencies: 228
-- Name: TABLE forecast_points; Type: ACL; Schema: public; Owner: db_admin
--

GRANT SELECT ON TABLE public.forecast_points TO app_read;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.forecast_points TO app_write;


--
-- TOC entry 4999 (class 0 OID 0)
-- Dependencies: 227
-- Name: TABLE forecasts; Type: ACL; Schema: public; Owner: db_admin
--

GRANT SELECT ON TABLE public.forecasts TO app_read;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.forecasts TO app_write;


--
-- TOC entry 5000 (class 0 OID 0)
-- Dependencies: 221
-- Name: TABLE kpi_results; Type: ACL; Schema: public; Owner: db_admin
--

GRANT SELECT ON TABLE public.kpi_results TO app_read;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.kpi_results TO app_write;


--
-- TOC entry 5001 (class 0 OID 0)
-- Dependencies: 222
-- Name: TABLE sales_trend_points; Type: ACL; Schema: public; Owner: db_admin
--

GRANT SELECT ON TABLE public.sales_trend_points TO app_read;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.sales_trend_points TO app_write;


--
-- TOC entry 5002 (class 0 OID 0)
-- Dependencies: 230
-- Name: TABLE segment_profiles; Type: ACL; Schema: public; Owner: db_admin
--

GRANT SELECT ON TABLE public.segment_profiles TO app_read;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.segment_profiles TO app_write;


--
-- TOC entry 5003 (class 0 OID 0)
-- Dependencies: 229
-- Name: TABLE segmentations; Type: ACL; Schema: public; Owner: db_admin
--

GRANT SELECT ON TABLE public.segmentations TO app_read;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.segmentations TO app_write;


--
-- TOC entry 5004 (class 0 OID 0)
-- Dependencies: 218
-- Name: TABLE users; Type: ACL; Schema: public; Owner: db_admin
--

GRANT SELECT ON TABLE public.users TO app_read;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.users TO app_write;


--
-- TOC entry 2095 (class 826 OID 102230)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: db_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE db_admin IN SCHEMA public GRANT SELECT ON TABLES TO app_read;
ALTER DEFAULT PRIVILEGES FOR ROLE db_admin IN SCHEMA public GRANT SELECT,INSERT,DELETE,UPDATE ON TABLES TO app_write;


-- Completed on 2026-11-15 17:18:15

--
-- PostgreSQL database dump complete
--

\unrestrict dSs8KiPJwKO21UlOJupZqEwcZCNqutn8iFhhmOw3QtlwNhvTBZCjVLjv9LVmCYw

