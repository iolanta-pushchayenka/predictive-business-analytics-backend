'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable('segmentations', {
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

        cluster_count: {
          type: Sequelize.INTEGER,
          allowNull: false
        },

        customers_analyzed: {
          type: Sequelize.INTEGER,
          allowNull: false
        },

        silhouette_score: {
          type: Sequelize.DECIMAL(10, 8),
          allowNull: true
        }
      }, { transaction });

      await queryInterface.sequelize.query(`
        ALTER TABLE segmentations
        ADD CONSTRAINT segmentations_values_check
        CHECK (
          cluster_count >= 2
          AND customers_analyzed >= cluster_count
          AND (
            silhouette_score IS NULL
            OR silhouette_score BETWEEN -1 AND 1
          )
        );
      `, { transaction });
      });
  },

  async down (queryInterface, Sequelize) {
      await queryInterface.dropTable('segmentations');
  }
};
