'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'myinvest',
      
      'pendingsell_amount',{
          type: Sequelize.INTEGER,
          allowNull: true,
        }
    )
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.removeColumn(
      'myinvest',
      
      'pendingsell_amount',{
          type: Sequelize.INTEGER,
          
        }
    )
  }
};
