var jwt = require('express-jwt');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];
const User = require('../models/user');

function getTokenFromHeader(req) {
    console.log('token from header');
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token' ||
        req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    }

    return null;
}

var isRevokedCallback = async function(req, payload, done){
    var nationalId = payload.nationalId;
    const user =  await User.findOne({ where: { "nationalId": nationalId } });
    
    if(!user || !user.approved){
        const err = Error('Usuario inactivo.'); err.status=401;
        return done(err);
    }

    return done(null);

  };

var auth = {
    required: jwt({
        secret: config.jwtsecret,
        userProperty: 'payload',
        getToken: getTokenFromHeader,
       // isRevoked: isRevokedCallback
    }),
    optional: jwt({
        secret: config.jwtsecret,
        userProperty: 'payload',
        credentialsRequired: false,
        getToken: getTokenFromHeader
    })
};






const verifyApproved = async(req, res, next) => {
    //const token = req.header('Authorization').replace('Bearer ', '')
    //const data = jwt.verify(token, process.env.JWT_KEY)
    try {
        const user = await User.findOne({where:{'nationalId': req.payload.nationalId/*, 'approved':true*/ }})
        if (!user) {
            const err = new Error('Usuario bloqueado'); err.status=401;
        }
        
        next(auth.required)
    } catch (e) {
        //res.status(401).send({ errors: { 'message': 'Usuario bloqueado.' }});
        //next(e);
    }

}

module.exports = auth;