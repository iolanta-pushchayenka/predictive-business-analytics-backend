'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable('forecasts', { 
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

        train_count: {
          type: Sequelize.INTEGER,
          allowNull: false
        },

        test_count: {
          type: Sequelize.INTEGER,
          allowNull: false
        },

        model_mae: {
          type: Sequelize.DECIMAL(20, 6),
          allowNull: false
        },

        baseline_mae: {
          type: Sequelize.DECIMAL(20, 6),
          allowNull: false
        }
      }, { transaction });

      await queryInterface.sequelize.query(`
        ALTER TABLE forecasts
        ADD CONSTRAINT forecasts_values_check
        CHECK (
          train_count >= 2
          AND test_count >= 1
          AND model_mae >= 0
          AND baseline_mae >= 0
        );
      `, { transaction });
      });
  },

  async down (queryInterface, Sequelize) {
      await queryInterface.dropTable('forecasts');
  }
};
