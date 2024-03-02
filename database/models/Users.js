const { Sequelize,Model, DataTypes } = require('sequelize');
const connection = require('./Sequelize')


class Users extends Model {}

Users.init(
  {
    id:{
      type:DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name:{
      type:DataTypes.STRING,
      allowNull:false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    account_number:{
      type:DataTypes.STRING,
      allowNull:true
    },
    role:{
      type:DataTypes.STRING,
      allowNull:true
    }
    
    
  },{
    sequelize : connection,
    timestamps: true, // Aktifkan updatedAt dan createdAt
    underscored: true, // Gunakan nama kolom dengan format snake_case
    paranoid: true, // Aktifkan soft delete dengan deletedAt
    freezeTableName: true,
    tableName: 'users',
  }
);

module.exports = Users;
