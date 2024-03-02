'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'transactions',
      'paid',
     Sequelize.BOOLEAN
    );
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.removeColumn(
      'transactions',
      'paid',
     Sequelize.BOOLEAN
    );
  }
};
