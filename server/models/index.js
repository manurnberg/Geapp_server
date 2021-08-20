'use strict';
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'test';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  console.log('Sequielize: V1');
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  console.log(`Sequielize: V2 - DATABASE:${config.database} - USERNAME:${config.username} - HOST:${config.host}`);
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

sequelize.authenticate().then(() => {
  console.log('Connection has been established successfully.');
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});

// ---------- ASSOCIATIONS -------------------------------------
const Citizen = require('./citizen');
const Election = require('./election');
const ScrutinyCategory = require('./scrutiny-category');
const ScrutinyParty = require('./scrutiny-party');
const Scrutiny = require('./scrutiny');
const Friend = require('./friend');
const User = require('./user');
const Voter = require('./voter');
const VotingTable = require('./voting-table');

Friend.belongsTo(User);

Citizen.hasMany(Friend);
Friend.belongsTo(Citizen);

Citizen.hasMany(Voter);
Voter.belongsTo(Citizen);

VotingTable.hasMany(Voter);
Voter.belongsTo(VotingTable);

//Election.hasMany(VotingTable);
VotingTable.belongsTo(Election);

Election.hasMany(ScrutinyCategory);
//ScrutinyCategory.belongsTo(Election);

Election.hasMany(ScrutinyCategory);
ScrutinyCategory.hasMany(ScrutinyParty);
ScrutinyParty.hasMany(Scrutiny);
Scrutiny.belongsTo(ScrutinyParty);
VotingTable.hasMany(Scrutiny);
Scrutiny.belongsTo(VotingTable);


/*
const User = require('./user');
//const user = User.build();
// User.create({nationalId:'10001',first: 'some',last:'last'});
const user = new User();
     user.nationalId='223223',
     user.first= 'some',
     user.last='last',  
      user.setPassword("satas");
user.save();
*/

/*
db.sequelize.sync().then(() => {
  console.log('DB has been set up succesfully.');
}).catch((e) => {
  console.log('BD Sync failed: ' + e);
});
*/