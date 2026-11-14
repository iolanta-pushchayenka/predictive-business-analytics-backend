'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable('segment_profiles', 
      {
        id: {
          type: Sequelize.UUID,
          allowNull: false,
          primaryKey: true,
          defaultValue: Sequelize.literal('gen_random_uuid()')
        },

        segmentation_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'segmentations',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },

        cluster_label: {
          type: Sequelize.INTEGER,
          allowNull: false
        },

        customer_count: {
          type: Sequelize.INTEGER,
          allowNull: false
        },

        avg_recency: {
          type: Sequelize.DECIMAL(12, 2),
          allowNull: false
        },

        avg_frequency: {
          type: Sequelize.DECIMAL(12, 2),
          allowNull: false
        },

        avg_monetary: {
          type: Sequelize.DECIMAL(18, 2),
          allowNull: false
        }
      }, { transaction });

      await queryInterface.addConstraint('segment_profiles', {
        fields: ['segmentation_id', 'cluster_label'],
        type: 'unique',
        name: 'segment_profiles_segmentation_cluster_unique',
        transaction
      });

      await queryInterface.sequelize.query(`
        ALTER TABLE segment_profiles
        ADD CONSTRAINT segment_profiles_values_check
        CHECK (
          cluster_label >= 0
          AND customer_count >= 1
          AND avg_recency >= 0
          AND avg_frequency >= 1
          AND avg_monetary >= 0
        );
      `, { transaction });
      });
  },

  async down (queryInterface, Sequelize) {
      await queryInterface.dropTable('segment_profiles');
  }
};
