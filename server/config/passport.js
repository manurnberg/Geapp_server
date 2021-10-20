const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const Citizen = require('../models/citizen');
const Voter = require('../models/voter');
const VotingTable = require('../models/voting-table');



passport.use('login',new LocalStrategy({
  usernameField: 'nationalId',
  passwordField: 'password'
}, async (nationalId, password, done) => {
  console.log("pasa dentro de passport.js ")
  try {
    const user = await User.findOne({ where: { "nationalId": nationalId } });
    console.log("usuario pasando por passport->", user)
    
    if (!user || !user.validPassword(password)) {
      return done(null, false, { errors: { 'message': 'DNI o contraseña incorrecta.' }});
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

   // console.log("User citizen-->>", userCitizen.id)

    // const userVotingTableId = await Voter.findOne({
    //   where: {'citizenId': userCitizen.id},
    // });

    // console.log("user voting table id  --->>" ,userVotingTableId.votingtableId.toString())
    // const vtId = userVotingTableId.votingtableId;

    // const userVTable = await VotingTable.findOne({
    //   where: {'table': vtId},
    // });

    //console.log("user voting table--->>", userVTable)

//esto lo que comente recien

    user.isOwner=false;
    if(userCitizen){
      user.isOwner=true;
     
      console.log("user is owner")
      
   
    }
//hasta aca 20/10
    //console.log("USER-->>", user)

    return done(null, user);
  } catch (e) {
    console.log('error en login-passport:' + e);
    done(null, false, { errors: { 'message': 'Error en login.' } });
    //done;
  }
}));
// passport.use('elogin',new LocalStrategy({
//   usernameField: 'email',
//   passwordField: 'password'
// }, async (email, password, done) => {
//     console.log("pasa dentro de epassport.js ")
//   try {
//     const user = await User.findOne({ where: { "email": email } });
    
//     if (!user || !user.validPassword(password)) {
//       return done(null, false, { errors: { 'message': 'Email o contraseña incorrecta.' } });
//     }
//     if (!user.approved) {
//       return done(null, false, { errors: { 'message': 'Usuario bloqueado.' } });
//     }

    // const userCitizen = await Citizen.findOne({
    //   where: { "nationalId": nationalId },
    //   include: [{model: Voter, where: { "isOwner": true },
    //     include: [{model: VotingTable, where: { "isOpen": true }
    //     }]
    //   }]
    // });

    // user.isOwner=false;
    // if(userCitizen){
    //   user.isOwner=true;
    // }

//     return done(null, user);
//   } catch (e) {
//     console.log('error en login-passport:' + e);
//     done(null, false, { errors: { 'message': 'Error en login.' } });
//     //done;
//   }

// }));

