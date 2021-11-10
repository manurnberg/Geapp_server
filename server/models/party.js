const Sequelize = require('.').Sequelize;
const sequelize = require('.').sequelize;

class Party extends Sequelize.Model{}
Party.init({
  votingtable_id: {type: Sequelize.INTEGER, allowNull: false},
    senator: {type: Sequelize.INTEGER, allowNull: false},
    deputy: {type: Sequelize.INTEGER, allowNull: false},
    nameParty: {type: Sequelize.STRING, allowNull: false},
},
{sequelize, modelName:'party'});


module.exports = Party;