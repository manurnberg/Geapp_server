const Sequelize = require('.').Sequelize;
const sequelize = require('.').sequelize;

class Friend extends Sequelize.Model{}
Friend.init({
    name: {type: Sequelize.STRING, allowNull:true}, // ios app field 
    last_name: {type: Sequelize.STRING, allowNull:true}, // ios app field 
    phone: {type: Sequelize.STRING, allowNull:true },
    email: {type: Sequelize.STRING, allowNull:false } // ios app field change to mandatory
},{sequelize, modelName: 'friend', paranoid:true});

module.exports = Friend;