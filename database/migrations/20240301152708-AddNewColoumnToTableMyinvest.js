'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'myinvest',
      'pendingswitch_amount',{
          type: Sequelize.DECIMAL,
          allowNull: true,
        },
     
    )
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.removeColumn(
      'myinvest',
      'pendingswitch_amount',{
          type: Sequelize.DECIMAL,
          
        },
     
    )
  }
};
