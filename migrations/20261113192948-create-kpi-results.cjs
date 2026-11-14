'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable('kpi_results', {
        id: {
          type: Sequelize.UUID,
          allowNull: false,
          primaryKey: true,
          defaultValue: Sequelize.literal('gen_random_uuid()')
        },

        analysis_id: {
          type: Sequelize.UUID,
          allowNull: false,
          unique: true,
          references: {
            model: 'analyses',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },

        total_revenue: {
          type: Sequelize.DECIMAL(18, 2),
          allowNull: false
        },

        total_orders: {
          type: Sequelize.INTEGER,
          allowNull: false
        },

        total_customers: {
          type: Sequelize.INTEGER,
          allowNull: true
        },

        average_order_value: {
          type: Sequelize.DECIMAL(18, 2),
          allowNull: true
        }
      }, { transaction });

      await queryInterface.sequelize.query(`
        ALTER TABLE kpi_results
        ADD CONSTRAINT kpi_results_values_check
        CHECK (
          total_revenue >= 0
          AND total_orders >= 0
          AND (total_customers IS NULL OR total_customers >= 0)
          AND (
            average_order_value IS NULL
            OR average_order_value >= 0
          )
        );
      `, { transaction });
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('kpi_results');
  }
};