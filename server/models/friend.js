const Sequelize = require('.').Sequelize;
const sequelize = require('.').sequelize;

class Friend extends Sequelize.Model{}
Friend.init({
    phone: {type: Sequelize.STRING, allowNull:true },
    email: {type: Sequelize.STRING, allowNull:true }
},{sequelize, modelName: 'friend', paranoid:true});

module.exports = Friend;