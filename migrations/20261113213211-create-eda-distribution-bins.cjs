'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable('eda_distribution_bins', { 
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

        metric_name: {
          type: Sequelize.STRING(255),
          allowNull: false
        },

        bin_index: {
          type: Sequelize.INTEGER,
          allowNull: false
        },

        bin_start: {
          type: Sequelize.DECIMAL(20, 6),
          allowNull: false
        },

        bin_end: {
          type: Sequelize.DECIMAL(20, 6),
          allowNull: false
        },

        frequency: {
          type: Sequelize.INTEGER,
          allowNull: false
        }
      }, { transaction });

      await queryInterface.addConstraint('eda_distribution_bins', {
        fields: ['analysis_id', 'metric_name', 'bin_index'],
        type: 'unique',
        name: 'eda_distribution_bins_analysis_metric_index_unique',
        transaction
      });

      await queryInterface.sequelize.query(`
        ALTER TABLE eda_distribution_bins
        ADD CONSTRAINT eda_distribution_bins_values_check
        CHECK (
          length(trim(metric_name)) > 0
          AND bin_index >= 0
          AND bin_start < bin_end
          AND frequency >= 0
        );
      `, { transaction });
      });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('eda_distribution_bins');
  }
};
