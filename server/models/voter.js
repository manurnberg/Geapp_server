const Sequelize = require('.').Sequelize;
const sequelize = require('.').sequelize;

class Voter extends Sequelize.Model{}
Voter.init({
  order: {type: Sequelize.STRING, allowNull: true },
  voted: {type: Sequelize.BOOLEAN, allowNull: false, defaultValue:false},
  isOwner: {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false}
},{sequelize, modelName:'voter'});

module.exports = Voter;