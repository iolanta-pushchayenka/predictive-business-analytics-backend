'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.addIndex(
      'analyses',
      ['user_id', { name: 'created_at', order: 'DESC' }],
      {
        name: 'analyses_user_created_at_idx'
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.removeIndex(
      'analyses',
      'analyses_user_created_at_idx'
    );
  }
};