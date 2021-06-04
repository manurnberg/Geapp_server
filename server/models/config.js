const Sequelize = require('.').Sequelize;
const sequelize = require('.').sequelize;

//this is a table,
class Config extends Sequelize.Model{}
Config.init({
  code: {type: Sequelize.STRING, allowNull: false, unique:true, primaryKey:true},
  value: {type: Sequelize.STRING, allowNull: false}  
},{sequelize, modelName:'config', timestamps: false});

module.exports = Config;