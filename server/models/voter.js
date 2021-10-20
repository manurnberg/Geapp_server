const Sequelize = require('.').Sequelize;
const sequelize = require('.').sequelize;

class Voter extends Sequelize.Model{}
Voter.init({
  order: {type: Sequelize.STRING, allowNull: true },
  voted: {type: Sequelize.BOOLEAN, allowNull: false, defaultValue:false},
  isOwner: {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false},
  votingtableId: {type: Sequelize.INTEGER, allowNull: true},
  citizenId: {type: Sequelize.INTEGER, allowNull: true},
  address: {type: Sequelize.STRING, allowNull: true},
  dateVoted: {type: Sequelize.STRING(30), allowNull: false},
},{sequelize, modelName:'voter'});

module.exports = Voter;