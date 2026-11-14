'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable('sales_trend_points', { 
        id: {
          type: Sequelize.UUID,
          allowNull: false,
          primaryKey: true,
          defaultValue: Sequelize.literal('gen_random_uuid()')
        },

        analysis_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'analyses',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },

        sales_date: {
          type: Sequelize.DATEONLY,
          allowNull: false
        },

        total_revenue: {
          type: Sequelize.DECIMAL(18, 2),
          allowNull: false
        }
      }, { transaction });

      await queryInterface.addConstraint('sales_trend_points', {
        fields: ['analysis_id', 'sales_date'],
        type: 'unique',
        name: 'sales_trend_points_analysis_date_unique',
        transaction
      });

      await queryInterface.sequelize.query(`
        ALTER TABLE sales_trend_points
        ADD CONSTRAINT sales_trend_points_revenue_check
        CHECK (total_revenue >= 0);
      `, { transaction });


      });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('sales_trend_points');
  }
};
