const { Model, DataTypes } = require('sequelize');
const connection = require('./Sequelize')

class MyInvest extends Model{}


MyInvest.init({
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
      units:{
        type:DataTypes.INTEGER,
        allowNull:false,
        defaultValue:0
      },
      amount:{
        type:DataTypes.INTEGER,
        allowNull:false,
        defaultValue:0
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      pendingswitch_amount:{
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      pendingsell_amount:{
        type: DataTypes.INTEGER,
        allowNull: true,
      }
      
},{
    sequelize: connection, //ini adalh sequelize dari config di atas
    timestamps: true, // aktifin update_at dan create_at
    underscored: true, // biar colom-colomnya pake <_>
    paranoid: true, // untuk mengaktifi softdelete yg delete_at
    freezeTableName: true,
    tableName: 'myinvest',
})


module.exports = MyInvest