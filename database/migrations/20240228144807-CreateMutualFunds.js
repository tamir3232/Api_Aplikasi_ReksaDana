'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('mutual-funds',{
      id:{
        type:Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      name:{
        type:Sequelize.STRING,
        allowNull:false
      },
      company:{
        type:Sequelize.STRING,
        allowNull:false
      },
      nav:{
        type: Sequelize.INTEGER,
        allowNull: false
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
    await queryInterface.dropTable('mutual-funds');
  }
};
