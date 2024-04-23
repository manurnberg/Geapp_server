const User = require('../models/user');
const Citizen = require('../models/citizen');
const Config = require('../models/config');
const Sequelize = require('../models').Sequelize;
const Voter = require('../models/voter');
const VotingTable = require('../models/voting-table');
const Friend = require('../models/friend');



const passwordChecker = require('../utils/password-check');
const userController = {};



userController.getUsers = async (req, res, next) => {
    try {
        const filter = (req.query.q == undefined) ? '' : req.query.q;
        const pageIx = (req.query.page == undefined || isNaN(req.query.page) || req.query.page < 0) ? 0 : req.query.page;
        const pageSize = 25;
        console.log(`filter: ${filter}`);

        const usersAndCount = await User.findAndCountAll(
            {
                attributes: ['id', 'nationalId', 'first', 'last', 'email', 'phone', 'helpPhone', 'role', 'approved', 'fiscal', 'table', 'createdAt'],
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
    console.log("get user api", req.params.id)
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
            {
                include: [{
                    model: Voter,
                    include: [
                        {
                            model: Citizen,
                            where: { "nationalId": req.payload.nationalId }
                        }]
                }]
            });
        if (usersVotingTable) {
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
        // if (userRole !== 'ADMIN') {
        //     const err = Error('No tiene privilegios.'); err.status = 403;
        //     throw err;
        // }

        const userToEdit = await User.findOne({ where: { "id": userId } });
        if (!userToEdit) {
            const err = Error('Usuario no encontrado.'); err.status = 422;
            throw err;
        }

        const userByid = await User.findOne({
            where: { 'id': userId }
        })

        const userCitizen = await Citizen.findOne({
            where: { "nationalId": userByid.nationalId },
            // include: [{model: Voter, where: { "isOwner": true },
            //   include: [{model: VotingTable, where: { "isOpen": true }
            //   }]
            // }]
        });

        //TODO: desacoplar usuarios de votantes y mesas de votacion
        // de momento se comenta todo lo que tiene que ver con votantes y mesas de votacion 
        // para permitir la edición de usuarios


        // const voterToEdit = await Voter.findOne({ where: { "citizenId": userCitizen.id } });
        // if (!voterToEdit) {
        //     const err = Error('Votante no encontrado.'); err.status = 422;
        //     throw err;
        // }

        // console.log("User citizen-->>", userCitizen.id)

        // const userVotingTableId = await Voter.findOne({
        //     where: { 'citizenId': userCitizen.id },
        // });

        // console.log("user voting table id  --->>", userVotingTableId.votingtableId.toString())
        // const vtId = userVotingTableId.votingtableId;

        // const userVTable = await VotingTable.findOne({
        //     where: { 'table': vtId },
        // });

        // console.log("user voting table table-->", userVTable.table);



        
        // let fieldsObjVoter = { fields: ['isOwner'] }; 

        let fieldsObj = { fields: ['approved'] };
        if (approved !== undefined) {
            console.log("user approved", approved);
            userToEdit.approved = approved;
        }

        if (fiscal !== undefined && fiscal !== false) {
            console.log("user fiscal", fiscal);
            userToEdit.fiscal = fiscal;
            //userToEdit.table = userVTable.table
            fieldsObj = { fields: ['fiscal', 'table'] }


        }
        if (fiscal == false) {
            console.log("not fiscal");
            userToEdit.fiscal = null;
            userToEdit.table = null;
            fieldsObj = { fields: ['fiscal', 'table'] };
            //voterToEdit.isOwner = false;
            //fieldsObjVoter = { fields: ['isOwner'] };
        }


        // if (fiscal) {
        //     console.log("fiscal");
        //     voterToEdit.isOwner = true
        //     fieldsObjVoter = { fields: ['isOwner'] }
        // }


        if (password !== undefined) {
            console.log("first password", password)
            userToEdit.setPassword(password);
            fieldsObj = { fields: ['salt', 'hash', 'approved', 'fiscal', 'table'] };
        }

        await userToEdit.save(fieldsObj);
       // await voterToEdit.save(fieldsObjVoter);
        const status = { status: 'Usuario actualizado correctamente.' };
        //const table = { 'nationalId': userByid.nationalId, 'table': userVTable.table };
        //console.log("table print--->>", table)

        //const response = Object.assign(status, table)
        const response = Object.assign(status);
        console.log("response from edit -->>", response)

        // res.json({ status: 'Usuario actualizado correctamente.'});
        return res.json(response);
    } catch (e) {
        next(e);
    }
};

userController.login = async (req, res, next) => {
    console.log("dni request", req.body.nationalId)
    console.log("pass", req.body.password)

    try {

        if (!req.body.nationalId || !req.body.password || req.body.nationalId.trim() == '') {
            //return res.status(422).json({errors: {email: "can't be blank"}});

            const err = Error('DNI o contraseña en blanco prueba.'); err.status = 401;
            throw err;
        }
        const passport = require('passport');
        passport.authenticate('login', { session: false }, (err, user, info) => {
            if (err) { return next(err); }

            if (!user || user.enable == false) {
                console.log("error--->>>", res.status(422))
                return res.status(422).json(info);
            }

            const userToJson = user.toAuthJSON();

            user.token = user.generateJWT();
            console.log("user token--->", user.token)
            return res.json(userToJson);
        })(req, res, next);
    } catch (e) {
        next(e);
    }

};


userController.sendPasswordReset = async (req, res, next) => {
    const { nationalId, email } = req.body;
    console.log("nationalId", nationalId, "email", email)
    try {
        const user = await User.findOne({
            where: {
                nationalId: nationalId
            }
        });
        if (!user) {
            const err = Error('Usuario no encontrado.'); err.status = 422;
            throw err;
        }
        if (user.email !== email) {
            const err = Error('Email no coincide.'); err.status = 422;
            throw err;
        }
        const transporter = require('../utils/email-transporter');
        const response = await transporter(user)

        return await res.status(200).json(response);



    } catch (e) {
        next(e);
    }

}

userController.resetPassword = async (req, res, next) => {
    const userId = req.params.id;
    const password = req.body.password;
    try {

        const userToEdit = await User.findOne({ where: { "id": userId } });
        if (!userToEdit) {
            const err = Error('Usuario no encontrado.'); err.status = 422;
            throw err;
        }

        if (password !== undefined) {
            console.log("first password", password)
            userToEdit.setPassword(password);
            userNewpass = { fields: ['salt', 'hash'] };
        }

        await userToEdit.save(userNewpass);
        const status = { status: 'Usuario actualizado correctamente.' };


        const response = Object.assign(status)

        console.log("response from edit -->>", response)

        // res.json({ status: 'Usuario actualizado correctamente.'});
        return res.json(response);
    } catch (e) {
        next(e);
    }

}


userController.createUser = async (req, res, next) => {
    try {
        const nationalId = req.body.nationalId;
        const phone = req.body.phone;
        const email = req.body.email;
        const password = req.body.password;

        console.log(`Creating User ${nationalId}`);

        // Validación de campos obligatorios
        if (!nationalId || !password || nationalId.trim() === '' || password.trim() === '') {
            const err = new Error('Usuario o contraseña en blanco');
            err.status = 422;
            throw err;
        }

        // Validación de longitud mínima de la contraseña
        if (password.length < 4) {
            const err = new Error('Contraseña: Al menos 4 caracteres');
            err.status = 422;
            throw err;
        }

        // Verificar si el usuario ya existe en la base de datos
        let userDb = await User.findOne({ where: { "nationalId": nationalId } });
        if (userDb) {
            // Si el usuario existe pero está deshabilitado, se actualizan los datos y se habilita
            if (!userDb.enable) {
                userDb.enable = true;
                if (phone && phone !== userDb.phone) {
                    userDb.phone = phone;
                }
                if (email && email !== userDb.email) {
                    userDb.email = email;
                }
                userDb.setPassword(password);
                await userDb.save();
                return res.json(userDb.toAuthJSON());
            } else {
                const err = new Error('Usuario ya creado');
                err.status = 422;
                throw err;
            }
        }

        // Verificar si el DNI está en el padrón de ciudadanos
        const citizen = await Citizen.findOne({ where: { "nationalId": nationalId } });
        if (!citizen) {
            const err = new Error('DNI no encontrado en padrón');
            err.status = 422;
            throw err;
        }

        // Verificar si el DNI está en la lista de amigos
        let isFriend = false;
        const friend = await Friend.findOne({ where: { "nationalId": nationalId } });
        if (friend) {
            isFriend = true;
        }

        // Obtener la configuración predeterminada para el teléfono de ayuda
        const config = await Config.findOne({ where: { "code": "DEFAULT_HELP_PHONE" } });
        const defaultHelpPhone = (config) ? config.value : '+5492974756985';

        // Crear un nuevo usuario
        const newUser = await User.create({
            nationalId: nationalId,
            first: citizen.first,
            last: citizen.last,
            phone: phone,
            email: email,
            helpPhone: defaultHelpPhone,
            approved: true,
            isFriend: isFriend,
            enable: true
        });

        // Establecer la contraseña del usuario y guardar en la base de datos
        newUser.setPassword(password);
        await newUser.save();

        res.json(newUser.toAuthJSON());
    } catch (error) {
        // Manejo de errores
        if (error.name === 'SequelizeValidationError') {
            error.status = 422;
        }
        console.error(error.message);
        next(error);
    }
};


userController.deleteUser = async (req, res) => {
    const { id } = req.params;
    console.log('on user deletion ',id);
    const user = await User.findOne({ where: { "id": id } });
    user.enable = false;
    user.save();
    //updated the user.
    //await User.findByIdAndUpdate(id, {deleted: true}, {new: false});

   // res.json({ 'message': 'Usuario eliminado.(dummy)' });
};



module.exports = userController;