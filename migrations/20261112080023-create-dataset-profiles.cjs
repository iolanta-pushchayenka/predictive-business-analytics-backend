'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable('dataset_profiles', { 
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

        filename: {
          type: Sequelize.STRING(255),
          allowNull: false
        },

        total_rows: {
          type: Sequelize.INTEGER,
          allowNull: false
        },

        total_columns: {
          type: Sequelize.INTEGER,
          allowNull: false
        },

        min_date: {
          type: Sequelize.DATEONLY,
          allowNull: true
        },

        max_date: {
          type: Sequelize.DATEONLY,
          allowNull: true
        }
      
      }, { transaction });

      await queryInterface.sequelize.query(`
        ALTER TABLE dataset_profiles
        ADD CONSTRAINT dataset_profiles_counts_check
        CHECK (
          total_rows >= 0
          AND total_columns >= 1
        ),

        ADD CONSTRAINT dataset_profiles_dates_check
        CHECK (
          (min_date IS NULL AND max_date IS NULL)
          OR
          (min_date IS NOT NULL AND max_date IS NOT NULL
          AND min_date <= max_date)
        )
      `, { transaction });
        });
  },

  async down (queryInterface, Sequelize) {
        await queryInterface.dropTable('dataset_profiles');
  }
  
};
