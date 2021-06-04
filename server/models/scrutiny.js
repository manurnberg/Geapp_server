const Sequelize = require('.').Sequelize;
const sequelize = require('.').sequelize;

class Scrutiny extends Sequelize.Model{}
Scrutiny.init({
  quantity: {type: Sequelize.INTEGER, allowNull: false}  
},{sequelize, modelName:'scrutiny'});

module.exports = Scrutiny;