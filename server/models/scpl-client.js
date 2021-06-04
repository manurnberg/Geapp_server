const Sequelize = require('.').Sequelize;
const sequelize = require('.').sequelize;

class Client extends Sequelize.Model{}
Client.init({
  id_citizen: {type: Sequelize.INTEGER, allowNull: false},
  service: {type: Sequelize.INTEGER, allowNull: false},
  category: {type: Sequelize.INTEGER, allowNull: false},
  partner: {type: Sequelize.INTEGER, allowNull: false},
  name_lastname: {type: Sequelize.STRING, allowNull: false},
  sum: {type: Sequelize.INTEGER, allowNull: false},
  area: {type: Sequelize.INTEGER, allowNull: false},
  route: {type: Sequelize.INTEGER, allowNull: false},
  address: {type: Sequelize.STRING, allowNull: false},
  address_number: {type: Sequelize.INTEGER, allowNull: false},
  piso: {type: Sequelize.INTEGER, allowNull: false},
  dpto: {type: Sequelize.STRING, allowNull: false},
  cp: {type: Sequelize.STRING, allowNull: false},
  dni: {type: Sequelize.INTEGER, allowNull: false},
  cuit: {type: Sequelize.STRING, allowNull: false},
  electroral: {type: Sequelize.STRING, allowNull: false},
  electoral: {type: Sequelize.STRING, allowNull: false},
  telephone: {type: Sequelize.STRING, allowNull: false},
  telephone_one: {type: Sequelize.STRING, allowNull: false},
  telephone_two: {type: Sequelize.STRING, allowNull: false},
  mail: {type: Sequelize.STRING, allowNull: false},
  is_active: {type: Sequelize.BOOLEAN, allowNull: false},
  is_signed: {type: Sequelize.STRING, allowNull: false},
  id_user_referrer: {type: Sequelize.INTEGER, allowNull: false},
  sign_date: {type: Sequelize.STRING, allowNull: true},
  created_at: {type: Sequelize.STRING, allowNull: true},
  updated_at: {type: Sequelize.STRING, allowNull: true},
},{sequelize, modelName:'scpl_clients', timestamps: false});

module.exports = Client;