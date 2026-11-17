'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable('eda_correlations', {
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

        metric_x: {
          type: Sequelize.STRING(255),
          allowNull: false
        },

        metric_y: {
          type: Sequelize.STRING(255),
          allowNull: false
        },

        correlation_value: {
          type: Sequelize.DECIMAL(10, 8),
          allowNull: false
        },

        pair_count: {
          type: Sequelize.INTEGER,
          allowNull: false
        }
      }, { transaction });

      await queryInterface.addConstraint('eda_correlations', {
        fields: ['analysis_id', 'metric_x', 'metric_y'],
        type: 'unique',
        name: 'eda_correlations_analysis_pair_unique',
        transaction
      });

      await queryInterface.sequelize.query(`
        ALTER TABLE eda_correlations
        ADD CONSTRAINT eda_correlations_values_check
        CHECK (
          length(trim(metric_x)) > 0
          AND length(trim(metric_y)) > 0
          AND metric_x < metric_y
          AND correlation_value BETWEEN -1 AND 1
          AND pair_count >= 2
        );
      `, { transaction });
        
      });

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('eda_correlations');
  }
};
