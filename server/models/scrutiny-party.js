const Sequelize = require('.').Sequelize;
const sequelize = require('.').sequelize;

class ScrutinyParty extends Sequelize.Model{}
ScrutinyParty.init({
  name: {type: Sequelize.STRING, allowNull: false}  
},{sequelize, timestamps: false, modelName:'scrutinyparty'});

module.exports = ScrutinyParty;