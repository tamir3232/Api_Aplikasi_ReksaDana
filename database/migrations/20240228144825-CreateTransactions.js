'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('transactions',{
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
      
      transaction_type: {
        type: Sequelize.ENUM('buy', 'sell', 'switch'),
        allowNull: false
      },
      transaction_amount: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      payment_method: {
        type: Sequelize.ENUM('QR Code', 'Bank Transfer'),
        allowNull: false
      },
      transaction_time: {
        type: Sequelize.DATE
      },
      executed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      executed_date: {
        type: Sequelize.DATE
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
    await queryInterface.dropTable('transactions');
  }
};
