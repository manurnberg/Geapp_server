const Sequelize = require('.').Sequelize;
const sequelize = require('.').sequelize;

class Citizen extends Sequelize.Model{}
Citizen.init({
  nationalId: {type: Sequelize.STRING, allowNull:false, unique: true},
  first: {type: Sequelize.STRING, allowNull: false},
  last: {type: Sequelize.STRING, allowNull: false},
  birthday: {type: Sequelize.DATEONLY, allowNull: true},
  friendsQty: {type: Sequelize.INTEGER, allowNull: true, defaultValue:0}
},{sequelize, modelName:'citizen'});

module.exports = Citizen;