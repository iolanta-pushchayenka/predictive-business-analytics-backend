
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // Remove the old CHECK constraint
      await queryInterface.removeConstraint(
        'kpi_results',
        'kpi_results_values_check',
        { transaction }
      );

      // Remove the redundant column
      await queryInterface.removeColumn(
        'kpi_results',
        'average_order_value',
        { transaction }
      );

      // Add the updated CHECK constraint
      await queryInterface.sequelize.query(`
        ALTER TABLE kpi_results
        ADD CONSTRAINT kpi_results_values_check
        CHECK (
          total_revenue >= 0
          AND total_orders >= 0
          AND (total_customers IS NULL OR total_customers >= 0)
        );
      `, { transaction });
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeConstraint(
        'kpi_results',
        'kpi_results_values_check',
        { transaction }
      );

      await queryInterface.addColumn(
        'kpi_results',
        'average_order_value',
        {
          type: Sequelize.DECIMAL(18, 2),
          allowNull: true
        },
        { transaction }
      );

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
  }
};

