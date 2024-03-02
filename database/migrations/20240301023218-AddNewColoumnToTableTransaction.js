'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'transactions',
      'switch_to',{
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'mutual-funds',
            key: 'id'
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        }
    )},
     
  async down (queryInterface, Sequelize) {
    return queryInterface.removeColumn(
      'transactions',
      'switch_to',
     Sequelize.STRING
    );
  }
};

