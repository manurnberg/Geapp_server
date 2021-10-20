const Sequelize = require('.').Sequelize;
const sequelize = require('.').sequelize;

class VotingTable extends Sequelize.Model{}
VotingTable.init({
  table: {type: Sequelize.STRING, allowNull: false},
  address: {type: Sequelize.STRING, allowNull: false},
  establishment: {type: Sequelize.STRING, allowNull: false},
  section: {type: Sequelize.STRING, allowNull: false},
  circuit: {type: Sequelize.STRING, allowNull: false},
  district: {type: Sequelize.STRING, allowNull: false},
  isOpen: {type: Sequelize.BOOLEAN, allowNull: false, defaultValue:true},
  replenishQty: {type: Sequelize.INTEGER, allowNull: false, defaultValue: 0},
  notes: {type: Sequelize.STRING(500), allowNull: true},
  scrutinyPath: {type: Sequelize.STRING(500), allowNull: true},
  sumVotes: {type: Sequelize.INTEGER, allowNull: true},
  updateReplenish: {type: Sequelize.STRING(30), allowNull: false},
},{sequelize, modelName:'votingtable'});


module.exports = VotingTable;