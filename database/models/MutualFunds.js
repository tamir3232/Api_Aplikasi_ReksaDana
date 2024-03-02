const { Model, DataTypes } = require('sequelize');
const connection = require('./Sequelize')

class MutualFunds extends Model {}

MutualFunds.init({
    id:{
        type:DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name:{
        type:DataTypes.STRING,
        allowNull:false
      },
      company:{
        type:DataTypes.STRING,
        allowNull:false
      },
      nav:{
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
     

}, {
    sequelize: connection, //ini adalh sequelize dari config di atas
    timestamps: true, // aktifin update_at dan create_at
    underscored: true, // biar colom-colomnya pake <_>
    paranoid: true, // untuk mengaktifi softdelete yg delete_at
    freezeTableName: true,
    tableName: 'mutual-funds',
    paranoid: true,
    // If you want to give a custom name to the deletedAt column
    deletedAt: 'deleted_at'

})

module.exports = MutualFunds