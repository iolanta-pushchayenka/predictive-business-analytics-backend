'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable('forecast_points', { 
        id: {
          type: Sequelize.UUID,
          allowNull: false,
          primaryKey: true,
          defaultValue: Sequelize.literal('gen_random_uuid()')
        },

        forecast_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'forecasts',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },

        forecast_date: {
          type: Sequelize.DATEONLY,
          allowNull: false
        },

        predicted_revenue: {
          type: Sequelize.DECIMAL(18, 2),
          allowNull: false
        }
      }, { transaction });

      await queryInterface.addConstraint('forecast_points', {
        fields: ['forecast_id', 'forecast_date'],
        type: 'unique',
        name: 'forecast_points_forecast_date_unique',
        transaction
      });

      await queryInterface.sequelize.query(`
        ALTER TABLE forecast_points
        ADD CONSTRAINT forecast_points_revenue_check
        CHECK (predicted_revenue >= 0);
      `, { transaction });
      });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('forecast_points');
  }
};
