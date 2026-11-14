'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable('eda_summary_stats', { 
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

        valid_count: {
          type: Sequelize.INTEGER,
          allowNull: false
        },

        missing_count: {
          type: Sequelize.INTEGER,
          allowNull: false
        },

        min_value: {
          type: Sequelize.DECIMAL(20, 6),
          allowNull: false
        },

        max_value: {
          type: Sequelize.DECIMAL(20, 6),
          allowNull: false
        },

        mean_value: {
          type: Sequelize.DECIMAL(20, 6),
          allowNull: false
        },

        median_value: {
          type: Sequelize.DECIMAL(20, 6),
          allowNull: false
        },

        std_dev: {
          type: Sequelize.DECIMAL(20, 6),
          allowNull: false
        }
      }, { transaction });

       await queryInterface.addConstraint('eda_summary_stats', {
        fields: ['analysis_id', 'metric_name'],
        type: 'unique',
        name: 'eda_summary_stats_analysis_metric_unique',
        transaction
      });

      await queryInterface.sequelize.query(`
        ALTER TABLE eda_summary_stats
        ADD CONSTRAINT eda_summary_stats_values_check
        CHECK (
          length(trim(metric_name)) > 0
          AND valid_count >= 1
          AND missing_count >= 0
          AND min_value <= max_value
          AND mean_value BETWEEN min_value AND max_value
          AND median_value BETWEEN min_value AND max_value
          AND std_dev >= 0
        );
      `, { transaction });
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('eda_summary_stats');
  }
};
