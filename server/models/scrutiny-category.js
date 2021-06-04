const Sequelize = require('.').Sequelize;
const sequelize = require('.').sequelize;

class ScrutinyCategory extends Sequelize.Model{}
ScrutinyCategory.init({
  name: {type: Sequelize.STRING, allowNull: false}  
},{sequelize, timestamps: false, modelName:'scrutinycategory'});

module.exports = ScrutinyCategory;