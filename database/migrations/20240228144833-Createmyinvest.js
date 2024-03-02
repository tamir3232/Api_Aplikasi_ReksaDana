'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('myinvest',{
      id:{
        type:Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      mutualfund_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'mutual-funds',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      units:{
        type:Sequelize.INTEGER,
        allowNull:false,
        defaultValue:0
      },
      amount:{
        type:Sequelize.INTEGER,
        allowNull:false,
        defaultValue:0
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: new Date(),
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: new Date(),
        allowNull: false,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      }
      

    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('myinvest');
  }
};
