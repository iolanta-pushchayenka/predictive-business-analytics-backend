'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable('category_sales_points', { 
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

        category_name: {
          type: Sequelize.STRING(255),
          allowNull: false
        },

        total_revenue: {
          type: Sequelize.DECIMAL(18, 2),
          allowNull: false
        }
      }, { transaction });

      await queryInterface.addConstraint('category_sales_points', {
        fields: ['analysis_id', 'category_name'],
        type: 'unique',
        name: 'category_sales_points_analysis_category_unique',
        transaction
      });

      await queryInterface.sequelize.query(`
        ALTER TABLE category_sales_points
        ADD CONSTRAINT category_sales_points_values_check
        CHECK (
          total_revenue >= 0
          AND length(trim(category_name)) > 0
        );
      `, { transaction });
      });
  },

  async down (queryInterface, Sequelize) {
      await queryInterface.dropTable('category_sales_points');
  }
};
