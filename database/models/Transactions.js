const { Model, DataTypes } = require('sequelize');
const connection = require('./Sequelize')

class Transactions extends Model{}

Transactions.init({
    id:{
        type:DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      mutualfund_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'mutual-funds',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      transaction_type: {
        type: DataTypes.ENUM('buy', 'sell', 'switch'),
        allowNull: false
      },
      transaction_amount: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      switch_to:{
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'mutual-funds',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      payment_method: {
        type: DataTypes.ENUM('QR Code', 'Bank Transfer'),
        allowNull: true
      },
      transaction_time: {
        type: DataTypes.DATE
      },
      executed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      paid: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      executed_date: {
        type: DataTypes.DATE
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
      }
     
},{

    sequelize: connection, //ini adalh sequelize dari config di atas
    timestamps: true, // aktifin update_at dan create_at
    underscored: true, // biar colom-colomnya pake <_>
    paranoid: true, // untuk mengaktifi softdelete yg delete_at
    freezeTableName: true,
    tableName: 'transactions',

})

module.exports = Transactions