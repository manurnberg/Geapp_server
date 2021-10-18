const User = require('../models/user');
const Citizen = require('../models/citizen');
const Config = require('../models/config');
const Sequelize = require('../models').Sequelize;
const Voter = require('../models/voter');
const VotingTable = require('../models/voting-table');



const passwordChecker = require('../utils/password-check');
const userController = {};
const nodemailer = require('nodemailer')


userController.getUsers = async (req, res, next) => {
    try {
        const filter = (req.query.q == undefined) ? '' : req.query.q;
        const pageIx = (req.query.page == undefined || isNaN(req.query.page) || req.query.page < 0) ? 0 : req.query.page;
        const pageSize = 25;
        console.log(`filter: ${filter}`);

        const usersAndCount = await User.findAndCountAll(
            {
                attributes: ['id', 'nationalId', 'first', 'last', 'email', 'phone', 'helpPhone', 'role', 'approved','fiscal','table', 'createdAt'],
                where: {
                    [Sequelize.Op.or]: [
                        { nationalId: { [Sequelize.Op.like]: `${filter}%` } },
                        { first: { [Sequelize.Op.like]: `${filter}%` } },
                        { last: { [Sequelize.Op.like]: `${filter}%` } },
                    ]
                },
                offset: pageIx * pageSize,
                limit: pageSize,
                order: [['last', 'ASC']]
            }
        );

        return res.json(usersAndCount);
    } catch (e) {
        next(e);
    }
};

userController.getUser = async (req, res, next) => {
    try {
        const userRole = req.payload.role;
        let userId = req.params.id;

        //not admin? go for the it's own information.
        if (userRole !== 'ADMIN') {
            userId = req.payload.id;
        }

        const user = await User.findOne({ where: { "id": userId } });
        if (!user) return res.sendStatus(401);

        const usersVotingTable = await VotingTable.findOne(
            { include: [{ 
                model: Voter, 
                include: [
                    { model: Citizen, 
                        where: { "nationalId": req.payload.nationalId } 
                    }] 
                }] 
            });
        if(usersVotingTable){
            console.log("User voting table", usersVotingTable)
        }
        

        return res.json(user.toAuthJSON());
    } catch (e) {
        next(e);
    }
};

userController.editUser = async (req, res, next) => {
    try {
        const userRole = req.payload.role;
        const nationalId = req.body.nationalId;
        const userId = req.params.id;
        const password = req.body.password;
        const approved = req.body.approved;
        const fiscal = req.body.fiscal;
        

        

        console.log(`Edit user: ${userId} - who is editing?:${req.payload.id}`);

        //I can trust in this 
        if (userRole !== 'ADMIN') {
            const err = Error('No tiene privilegios.'); err.status = 403;
            throw err;
        }

        const userToEdit = await User.findOne({ where: { "id": userId } });
        if (!userToEdit) {
            const err = Error('Usuario no encontrado.'); err.status = 422;
            throw err;
        }

        const userByid = await User.findOne({
            where: {'id':userId}
        })

        const userCitizen = await Citizen.findOne({
            where: { "nationalId": userByid.nationalId },
            // include: [{model: Voter, where: { "isOwner": true },
            //   include: [{model: VotingTable, where: { "isOpen": true }
            //   }]
            // }]
          });
          const voterToEdit = await Voter.findOne({ where: { "citizenId": userCitizen.id } });
          if (!voterToEdit) {
              const err = Error('Votante no encontrado.'); err.status = 422;
              throw err;
          }
      
          console.log("User citizen-->>", userCitizen.id)
      
          const userVotingTableId = await Voter.findOne({
            where: {'citizenId': userCitizen.id},
          });
      
          console.log("user voting table id  --->>" ,userVotingTableId.votingtableId.toString())
          const vtId = userVotingTableId.votingtableId;
      
          const userVTable = await VotingTable.findOne({
            where: {'table': vtId},
          });

          console.log("user voting table table-->", userVTable.table);



        //passwordChecker.checkPassword(password);
        let fieldsObjVoter = { fields: ['isOwner']};
        let fieldsObj = { fields: ['approved'] };
        if (approved !== undefined) {
            userToEdit.approved = approved;
        }
         
        if (fiscal !== undefined && fiscal !== false) {
            userToEdit.fiscal = fiscal;
            userToEdit.table = userVTable.table
            fieldsObj = {fields: ['fiscal','table']}


        }
        if(fiscal == false){ 
            userToEdit.fiscal = null;
            userToEdit.table = null;
            fieldsObj = {fields: ['fiscal','table']};
            voterToEdit.isOwner = false;
            fieldsObjVoter = {fields: ['isOwner']};
        }
        

        if(fiscal){
            voterToEdit.isOwner = true
            fieldsObjVoter = {fields: ['isOwner']}
        }


        if (password !== undefined) {
            userToEdit.setPassword(password);
            fieldsObj = { fields: ['salt', 'hash', 'approved', 'fiscal', 'table'] };
        }

        await userToEdit.save(fieldsObj);
        await voterToEdit.save(fieldsObjVoter);
        const status = { status: 'Usuario actualizado correctamente.'};
        const table = {'nationalId':userByid.nationalId,'table': userVTable.table};
        console.log("table print--->>", table)

        const response = Object.assign(status,table)

        console.log("response from edit -->>", response)

        // res.json({ status: 'Usuario actualizado correctamente.'});
        return res.json(response);
    } catch (e) {
        next(e);
    }
};

userController.login = async (req, res, next) => {
    console.log("dni request",req.body.nationalId)
    console.log("pass", req.body.password)
    try {

        if (!req.body.nationalId || !req.body.password || req.body.nationalId.trim() == '') {
            //return res.status(422).json({errors: {email: "can't be blank"}});

            const err = Error('DNI o contraseña en blanco prueba.'); err.status = 422;
            throw err;
        }
        const passport = require('passport');
        passport.authenticate('login', { session: false }, (err, user, info) => {
            if (err) { return next(err); }

            if (!user) {
                console.log("error--->>>",res.status(422))
                return res.status(422).json(info);
            }
           // console.log("inside info", info.votingTable);

            
            
            //const tableInfo = info.votingTable;
            const userToJson = user.toAuthJSON();
            

            //const mergeObject = Object.assign(userToJson,tableInfo);
            //console.log("usr to json merge", mergeObject);
            
            user.token = user.generateJWT();  
            console.log("user token--->", user.token)
            return res.json(userToJson);
        })(req, res, next);
    } catch (e) {
        next(e);
    }

};
// api email login for ios app
userController.eLogin = async (req, res, next) => {
    console.log("dni request",req.body.email)
    console.log("pass", req.body.password)
    try {

        if (!req.body.email || !req.body.password || req.body.email.trim() == '') {
            //return res.status(422).json({errors: {email: "can't be blank"}});

            const err = Error('Email o contraseña en blanco.'); err.status = 422;
            throw err;
        }
        console.log("pass y contrasenia nos son vacios")
        const passport = require('passport');
        passport.authenticate('elogin', { session: false }, (err, user, info) => {
            if (err) { 
                console.log("error passport", err)
                return next(err); }

            if (!user) {
                console.log("error no user exist")
                return res.status(422).json(info);
            }
        
        

            console.log("a generar token")

            user.token = user.generateJWT2();
            return res.json(user.toAuthJSON2());
        })(req, res, next);
    } catch (e) {
        next(e);
    }

};
// api user register for ios app
userController.addUser = async (req, res, next) => {
    try {
        const email = req.body.email;
        const phone = req.body.phone;
        const password = req.body.password;

        console.log(`Create User ${email}`);

        if (!email || !password || email.trim() == '' || password.trim() == '') {
            const err = Error('Usuario o contraseña en blanco'); err.status = 422;
            throw err;
        }

        if (password.length < 4) {
            const err = Error('Contraseña: Al menos 4 caracteres'); err.status = 422;
            throw err;
        }

        const userDb = await User.findOne({ where: { "email": email } });
        if (userDb) { //exist?
            const err = Error('Usuario ya creado'); err.status = 422;
            throw err;
        }

        const config = await Config.findOne({ where: { "code": "DEFAULT_HELP_PHONE" } });

        const user = new User();
        // user.nationalId = nationalId;
        // user.first = citizen.first;
        // user.last = citizen.last;
        user.phone = phone;
        user.email = email;
        user.helpPhone = (config) ? config.value : '+5411111111';
        user.approved = true;
        

        //passwordChecker.checkPassword(password);
        user.setPassword(password);
        
        
        

        await user.save();
        //throw Error('s'); //TO TEST
        
       
        createTransporter(user.email)
        res.json(user.toAuthJSON2());
    } catch (e) {
        if (e.name == 'ValidationError') {
            e.status = 422;
        }
        console.error(e.message);
        next(e);
    }

}


userController.createUser = async (req, res, next) => {
    try {
        const nationalId = req.body.nationalId;
        const phone = req.body.phone;
        const email = req.body.email;
        const password = req.body.password;

        console.log(`Create User ${nationalId}`);

        if (!nationalId || !password || nationalId.trim() == '' || password.trim() == '') {
            const err = Error('Usuario o contraseña en blanco'); err.status = 422;
            throw err;
        }

        if (password.length < 4) {
            const err = Error('Contraseña: Al menos 4 caracteres'); err.status = 422;
            throw err;
        }

        const userDb = await User.findOne({ where: { "nationalId": nationalId } });
        if (userDb) { //exist?
            const err = Error('Usuario ya creado'); err.status = 422;
            throw err;
        }

        const citizen = await Citizen.findOne({ where: { "nationalId": nationalId } });
        if (!citizen) {
            const err = Error('DNI no encontrado en padrón'); err.status = 422;
            throw err;
        }

        const config = await Config.findOne({ where: { "code": "DEFAULT_HELP_PHONE" } });

        const user = new User();
        user.nationalId = nationalId;
        user.first = citizen.first;
        user.last = citizen.last;
        user.phone = phone;
        user.email = email;
        user.helpPhone = (config) ? config.value : '+5411111111';
        user.approved = true;

        //passwordChecker.checkPassword(password);
        user.setPassword(password);

        await user.save();
        //throw Error('s'); //TO TEST

        res.json(user.toAuthJSON());
    } catch (e) {
        if (e.name == 'ValidationError') {
            e.status = 422;
        }
        console.error(e.message);
        next(e);
    }
};

userController.deleteUser = async (req, res) => {
    const { id } = req.params;
    console.log(id);
    //updated the user.
    //await User.findByIdAndUpdate(id, {deleted: true}, {new: false});

    res.json({ 'message': 'Usuario eliminado.(dummy)' });
};

function createTransporter(user_email){
    var transporter = nodemailer.createTransport({
        host:'smtpout.secureserver.net',
        port: 587,
        secure: false,
        auth:{
            user:'geapp@coinpasrl.net',
            pass: 'xsw2zaq1_'
        }

    })

    var mailOptions = {
        from:'Geapp <autenticacion@geapp.com',
        to: user_email,
        subject:'Este es un mail de verificacion de usuario',
        text:'Gracias por registrarse en Geapp',
        html: `<p>Bienvenido a la comunidad de Geapp</p>`,

        
    }

    transporter.sendMail(mailOptions, (error,info) => {

        if(error){
            console.log("ERROR", error.message)
        }else{
            console.log("MENSAJE ENVIADO")
        }

    });
}

module.exports = userController;