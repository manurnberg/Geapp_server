const Sequelize = require('.').Sequelize;
const sequelize = require('.').sequelize;
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];

class User extends Sequelize.Model { 

  validPassword(password) {
    console.log("Password-->> ", password)
    var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 256, 'sha256').toString('hex');
    console.log("hash == hash?", this.hash == hash)
    return this.hash === hash;
  };
  
  setPassword(password) {
    console.log("Set password--->>>", password)
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 256, 'sha256').toString('hex')
    this.password = '';
  };
  
  generateJWT = function () {
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 60);
  
    return jwt.sign({
      id: this.id,
      nationalId: this.nationalId,
      role: this.role,
      isOwner: this.isOwner,
      exp: parseInt(exp.getTime() / 1000),
    }, config.jwtsecret);
  };

  
  toAuthJSON = function () {
    return {
      id: this.id,
      nationalId: this.nationalId,
      first: this.first,
      last: this.last,
      helpPhone: this.helpPhone,
      email: this.email,
      phone: this.phone,
      role: this.role,
      fiscal: this.fiscal,
      table: this.table,
      approved: this.approved,
      isOwner: this.isOwner,
      isFriend: this.isFriend,
      token: this.generateJWT()
    };
  };

  
}


User.init({
  nationalId: { type: Sequelize.STRING, allowNull: false, unique: true }, // se permite un DNI nulo
  first: { type: Sequelize.STRING, allowNull: false },
  last: { type: Sequelize.STRING, allowNull: false },
  email: { type: Sequelize.STRING, allowNull: true},
  phone: {type: Sequelize.STRING, allowNull: true},
  helpPhone: {type: Sequelize.STRING, allowNull:true},
  role: {type: Sequelize.STRING, allowNull: false, defaultValue: 'USER'},
  approved: { type: Sequelize.BOOLEAN, allowNull:false, defaultValue: true },
  table: {type: Sequelize.STRING, allowNull:true},
  fiscal: {type: Sequelize.BOOLEAN, allowNull:true, defaultValue: false},
  hash: {type: Sequelize.STRING(550), allowNull:false},
  salt: {type: Sequelize.STRING, allowNull: false},
  isFriend: {type: Sequelize.BOOLEAN, allowNull:true},
}, {
  sequelize,
  //paranoid: true,
  modelName: 'user'
});


module.exports = User;