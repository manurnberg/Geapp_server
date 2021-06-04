const Sequelize = require('.').Sequelize;
const sequelize = require('.').sequelize;

class Election extends Sequelize.Model{}
Election.init({
  name: {type: Sequelize.STRING, allowNull: false},
  year: {type: Sequelize.STRING, allowNull: false},
  description: {type: Sequelize.STRING, allowNull:true},
  isActive: {type: Sequelize.BOOLEAN, allowNull:false, defaultValue: false}  
},{sequelize, modelName:'election'});

module.exports = Election;