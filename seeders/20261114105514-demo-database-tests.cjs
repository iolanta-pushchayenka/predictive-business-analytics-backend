
'use strict';

// Synthetic test data for the development database.

const records = {
  users: [
    {
      id: 'f5615091-2bd3-548e-9231-af555adc7bb4',
      email: 'demo-owner-a@example.invalid',
      password_hash: '$2b$10$u3avjyFgq6jB9sauLbmtceQ3eFWAncenSMr4amoBTu0ZkjNbtE39m',
      created_at: '2026-11-01T10:00:00Z',
      updated_at: '2026-11-01T10:00:00Z'
    },
    {
      id: '1a38dac2-d875-52a3-936c-f31e51be7481',
      email: 'demo-owner-b@example.invalid',
      password_hash: '$2b$10$u3avjyFgq6jB9sauLbmtceQ3eFWAncenSMr4amoBTu0ZkjNbtE39m',
      created_at: '2026-11-01T10:00:00Z',
      updated_at: '2026-11-01T10:00:00Z'
    }
  ],

  analyses: [
    {
      id: 'a79ae3de-5257-5c24-9c6d-c8c5d7149b36',
      user_id: 'f5615091-2bd3-548e-9231-af555adc7bb4',
      name: 'Demo - full analysis',
      created_at: '2026-11-02T09:00:00Z',
      updated_at: '2026-11-02T09:00:00Z'
    },
    {
      id: '3f0b2b12-7739-55ef-bf83-c85d8b96f688',
      user_id: 'f5615091-2bd3-548e-9231-af555adc7bb4',
      name: 'Demo - missing customer IDs',
      created_at: '2026-11-03T09:00:00Z',
      updated_at: '2026-11-03T09:00:00Z'
    },
    {
      id: '9dae205d-9c2d-5c55-a76f-b5b06c8acfb8',
      user_id: 'f5615091-2bd3-548e-9231-af555adc7bb4',
      name: 'Demo - zero usable rows',
      created_at: '2026-11-04T09:00:00Z',
      updated_at: '2026-11-04T09:00:00Z'
    },
    {
      id: '6fdd2940-798e-512e-8ddf-1e1d543dc3e0',
      user_id: '1a38dac2-d875-52a3-936c-f31e51be7481',
      name: 'Demo - another user',
      created_at: '2026-11-05T09:00:00Z',
      updated_at: '2026-11-05T09:00:00Z'
    }
  ],

  dataset_profiles: [
    {
      id: '4119a7d6-2414-5f08-814b-c95c494aab75',
      analysis_id: 'a79ae3de-5257-5c24-9c6d-c8c5d7149b36',
      filename: 'demo-full.csv',
      total_rows: 120,
      total_columns: 5,
      min_date: '2026-10-01',
      max_date: '2026-10-30'
    },
    {
      id: '8c1b723f-7a3d-5145-83c3-1ab664b44754',
      analysis_id: '3f0b2b12-7739-55ef-bf83-c85d8b96f688',
      filename: 'demo-no-customers.csv',
      total_rows: 20,
      total_columns: 3,
      min_date: '2026-10-05',
      max_date: '2026-10-06'
    },
    {
      id: 'fe868e73-d1ff-5111-a4f3-c449c4d1ec8e',
      analysis_id: '9dae205d-9c2d-5c55-a76f-b5b06c8acfb8',
      filename: 'demo-invalid.csv',
      total_rows: 0,
      total_columns: 3,
      min_date: null,
      max_date: null
    },
    {
      id: 'b6652887-e5a6-5306-a02c-88b44fd7de4d',
      analysis_id: '6fdd2940-798e-512e-8ddf-1e1d543dc3e0',
      filename: 'demo-other.csv',
      total_rows: 10,
      total_columns: 3,
      min_date: '2026-10-01',
      max_date: '2026-10-10'
    }
  ],

  kpi_results: [
    {
      id: 'b23a5373-8b9c-57fc-9e8f-a62782ea335f',
      analysis_id: 'a79ae3de-5257-5c24-9c6d-c8c5d7149b36',
      total_revenue: '12500.50',
      total_orders: 100,
      total_customers: 64
    },
    {
      id: '3255f84b-b777-5b19-bbcc-a74ed896e394',
      analysis_id: '6fdd2940-798e-512e-8ddf-1e1d543dc3e0',
      total_revenue: '490.00',
      total_orders: 7,
      total_customers: null
    }
  ],

  sales_trend_points: [
    {
      id: '4416a3e7-c6a7-5006-ba4c-1ecf19758c77',
      analysis_id: 'a79ae3de-5257-5c24-9c6d-c8c5d7149b36',
      sales_date: '2026-10-01',
      total_revenue: '350.00'
    },
    {
      id: 'cd70b1d9-1668-5085-8120-2699d7f393e4',
      analysis_id: 'a79ae3de-5257-5c24-9c6d-c8c5d7149b36',
      sales_date: '2026-10-02',
      total_revenue: '520.75'
    },
    {
      id: 'cfbbc6f1-d1d1-543a-9be1-da8f5d05a9da',
      analysis_id: '3f0b2b12-7739-55ef-bf83-c85d8b96f688',
      sales_date: '2026-10-05',
      total_revenue: '0.00'
    },
    {
      id: '4b954f73-264c-5a80-a1ac-0cb178c0a78d',
      analysis_id: '6fdd2940-798e-512e-8ddf-1e1d543dc3e0',
      sales_date: '2026-10-01',
      total_revenue: '70.00'
    }
  ],

  category_sales_points: [
    {
      id: '0b75276b-b1b6-580c-8e62-724f6e783c0b',
      analysis_id: 'a79ae3de-5257-5c24-9c6d-c8c5d7149b36',
      category_name: 'Office supplies',
      total_revenue: '7800.50'
    },
    {
      id: 'e1c28582-754a-5e1c-a5bb-68da1a0dc4aa',
      analysis_id: 'a79ae3de-5257-5c24-9c6d-c8c5d7149b36',
      category_name: 'Accessories',
      total_revenue: '4700.00'
    }
  ],

  eda_summary_stats: [
    {
      id: '834e5592-7e3a-5ec9-a4ca-3b830b0e805e',
      analysis_id: 'a79ae3de-5257-5c24-9c6d-c8c5d7149b36',
      metric_name: 'revenue',
      valid_count: 120,
      missing_count: 0,
      min_value: '0.000000',
      max_value: '500.000000',
      mean_value: '104.170833',
      median_value: '95.000000',
      std_dev: '61.240000'
    },
    {
      id: '02b01edc-efdd-599a-990a-c04048a406d8',
      analysis_id: 'a79ae3de-5257-5c24-9c6d-c8c5d7149b36',
      metric_name: 'quantity',
      valid_count: 110,
      missing_count: 10,
      min_value: '1.000000',
      max_value: '7.000000',
      mean_value: '2.300000',
      median_value: '2.000000',
      std_dev: '1.100000'
    }
  ],

  eda_correlations: [
    {
      id: 'cf60db1e-2458-510f-9e1d-1ba1f66ca071',
      analysis_id: 'a79ae3de-5257-5c24-9c6d-c8c5d7149b36',
      metric_x: 'quantity',
      metric_y: 'revenue',
      correlation_value: '0.62000000',
      pair_count: 110
    }
  ],

  eda_distribution_bins: [
    {
      id: '40f75aa3-85cf-5697-9482-5a1963e97a7e',
      analysis_id: 'a79ae3de-5257-5c24-9c6d-c8c5d7149b36',
      metric_name: 'revenue',
      bin_index: 0,
      bin_start: '0.000000',
      bin_end: '100.000000',
      frequency: 67
    },
    {
      id: '5d7843df-1fd9-549a-b2c8-70fe0ba64554',
      analysis_id: 'a79ae3de-5257-5c24-9c6d-c8c5d7149b36',
      metric_name: 'revenue',
      bin_index: 1,
      bin_start: '100.000000',
      bin_end: '500.000000',
      frequency: 53
    }
  ],

  forecasts: [
    {
      id: '52500dd9-d0d4-5157-95be-41fd08870cde',
      analysis_id: 'a79ae3de-5257-5c24-9c6d-c8c5d7149b36',
      train_count: 24,
      test_count: 6,
      model_mae: '15.500000',
      baseline_mae: '21.250000'
    }
  ],

  forecast_points: [
    {
      id: '54a9970b-62ca-5d18-9906-0ed60baa9911',
      forecast_id: '52500dd9-d0d4-5157-95be-41fd08870cde',
      forecast_date: '2026-10-31',
      predicted_revenue: '390.00'
    },
    {
      id: 'e5a3c5e0-b289-5f14-9ce4-c8876d0f0ba3',
      forecast_id: '52500dd9-d0d4-5157-95be-41fd08870cde',
      forecast_date: '2026-11-01',
      predicted_revenue: '405.00'
    }
  ],

  segmentations: [
    {
      id: '380cf56f-5e17-5ebd-a9a3-1cca81c3f73b',
      analysis_id: 'a79ae3de-5257-5c24-9c6d-c8c5d7149b36',
      cluster_count: 3,
      customers_analyzed: 64,
      silhouette_score: '0.48000000'
    }
  ],

  segment_profiles: [
    {
      id: '99dafa9a-b28d-5140-94f8-92b44125b850',
      segmentation_id: '380cf56f-5e17-5ebd-a9a3-1cca81c3f73b',
      cluster_label: 0,
      customer_count: 23,
      avg_recency: '4.50',
      avg_frequency: '8.20',
      avg_monetary: '430.00'
    },
    {
      id: 'ab32294f-c630-56b0-a96e-6f5b1c6afb1f',
      segmentation_id: '380cf56f-5e17-5ebd-a9a3-1cca81c3f73b',
      cluster_label: 1,
      customer_count: 31,
      avg_recency: '15.30',
      avg_frequency: '3.40',
      avg_monetary: '165.00'
    },
    {
      id: '16472044-26de-5afd-bdd9-520fe83a46c1',
      segmentation_id: '380cf56f-5e17-5ebd-a9a3-1cca81c3f73b',
      cluster_label: 2,
      customer_count: 10,
      avg_recency: '28.00',
      avg_frequency: '1.20',
      avg_monetary: '45.00'
    }
  ]
};

// Foreign-key-safe insertion order.
const order = [
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
];

function ensureDevelopment() {
  const env = process.env.NODE_ENV || 'development';

  if (env !== 'development') {
    throw new Error(
      `Demo seed blocked for NODE_ENV=${env}; use development only.`
    );
  }
}

module.exports = {
  async up(queryInterface, Sequelize) {
    ensureDevelopment();

    const trx = await queryInterface.sequelize.transaction();

    try {
      // Prevent duplicate demo records.
      const demoId = records.users[0].id;

      const [existing] = await queryInterface.sequelize.query(
        'SELECT 1 FROM "users" WHERE "id" = :id LIMIT 1',
        {
          replacements: { id: demoId },
          type: Sequelize.QueryTypes.SELECT,
          transaction: trx
        }
      );

      if (existing) {
        throw new Error(
          'Demo data already exists; undo this seeder before rerunning.'
        );
      }

      // Insert all records in a single transaction.
      for (const table of order) {
        await queryInterface.bulkInsert(
          table,
          records[table],
          { transaction: trx }
        );
      }

      await trx.commit();

    } catch (error) {
      await trx.rollback();
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    ensureDevelopment();

    const trx = await queryInterface.sequelize.transaction();

    try {
      // Delete only the demo records in reverse order.
      for (const table of [...order].reverse()) {
        const ids = records[table].map(row => row.id);

        if (ids.length) {
          await queryInterface.bulkDelete(
            table,
            {
              id: {
                [Sequelize.Op.in]: ids
              }
            },
            { transaction: trx }
          );
        }
      }

      await trx.commit();

    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }
};
