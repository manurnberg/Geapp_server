const Sequelize = require('.').Sequelize;
const sequelize = require('.').sequelize;

class VotingTableSheet extends Sequelize.Model{}
VotingTableSheet.init({
  votingtable_id: {type: Sequelize.INTEGER, allowNull: false},
  identity_contest_votes: {type: Sequelize.INTEGER, allowNull: true},
  null_votes: {type: Sequelize.INTEGER, allowNull: true},
  appealed_votes: {type: Sequelize.INTEGER, allowNull: true},
  white_votes: {type: Sequelize.INTEGER, allowNull: true},
  total_votes: {type: Sequelize.INTEGER, allowNull: true},
  datetime: {type: Sequelize.DATE, allowNull: true},
  electoral_command: {type: Sequelize.INTEGER, allowNull: true},
  type: {type: Sequelize.ENUM('Senador', 'Diputado'), allowNull: true},
},
{sequelize, modelName:'votingtablesheet'});


module.exports = VotingTableSheet;