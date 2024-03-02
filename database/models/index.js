'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const configs = require('../../database/config/config.js');
const Users = require('./Users.js');
const Transactions = require('./Transactions.js');
const MyInvest = require('./MyInvest.js');
const sequelize = require('./Sequelize.js');
const MutualFunds = require('./MutualFunds.js');

const db = {};








Users.hasMany(Transactions,{
  as:'transactions',
  foreignKey:'user_id'
})

Transactions.belongsTo(Users,{
  as:'user',
  foreignKey:'user_id'
})


Users.hasMany(MyInvest,{
  as:'MyInvest',
  foreignKey:'user_id'
})


MyInvest.belongsTo(Users,{
  as:'user',
  foreignKey:'user_id'
})


MutualFunds.hasMany(Transactions,{
  as:'transactions',
  foreignKey:'mutualfund_id'
})

Transactions.belongsTo(MutualFunds,{
  as:'mutual-funds',
  foreignKey:'mutualfund_id'
})

MutualFunds.hasMany(Transactions,{
  as:'transactions_switch',
  foreignKey:'mutualfund_id'
})

Transactions.belongsTo(MutualFunds,{
  as:'mutual-funds_switch',
  foreignKey:'mutualfund_id'
})



MutualFunds.hasMany(MyInvest,{
  as:'MyInvest',
  foreignKey:'mutualfund_id'
})


MyInvest.belongsTo(MutualFunds,{
  as:'mutual-funds',
  foreignKey:'mutualfund_id'
})






module.exports = {sequelize,Users, MutualFunds, MyInvest, Transactions};
