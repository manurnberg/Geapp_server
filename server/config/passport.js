const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const Citizen = require('../models/citizen');
const Voter = require('../models/voter');
const VotingTable = require('../models/voting-table');

passport.use(new LocalStrategy({
  usernameField: 'nationalId',
  passwordField: 'password'
}, async (nationalId, password, done) => {
  console.log("pasa dentro de passport.js ")
  try {
    const user = await User.findOne({ where: { "nationalId": nationalId } });
    
    if (!user || !user.validPassword(password)) {
      return done(null, false, { errors: { 'message': 'DNI o contraseña incorrecta.' } });
    }
    if (!user.approved) {
      return done(null, false, { errors: { 'message': 'Usuario bloqueado.' } });
    }

    const userCitizen = await Citizen.findOne({
      where: { "nationalId": nationalId },
      include: [{model: Voter, where: { "isOwner": true },
        include: [{model: VotingTable, where: { "isOpen": true }
        }]
      }]
    });

    user.isOwner=false;
    if(userCitizen){
      user.isOwner=true;
    }

    return done(null, user);
  } catch (e) {
    console.log('error en login-passport:' + e);
    done(null, false, { errors: { 'message': 'Error en login.' } });
    //done;
  }
}));