const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];
const template = require('./reset-password-template');

function createTransporter(user){

    const token = generateJWT(user);
    
    var transporter = nodemailer.createTransport({
        host:'smtpout.secureserver.net',
        port: 587,
        secure: false,
        auth:{
            user:'geapp@coinpasrl.net',
            pass: 'FoG@@2022'
        }

    })

    var mailOptions = {
        from:'Geapp <autenticacion@geapp.com',
        to: user.email,
        subject:'Recuperar contraseña',
        text:'Sigue el link para resetear tu contraseña',
        html: template(user.first,token)

        
    }

    transporter.sendMail(mailOptions, (error,info) => {

        if(error){
            console.log("error", error.message);
            return false;
            
        }else{
            console.log("message send")
            
            return true;
        }

    });
}

function generateJWT(user){
    const token = jwt.sign({
        id: user.id,
        nationalId: user.nationalId,
        role: user.role,
        isOwner: user.isOwner}, config.jwtsecret, {expiresIn: '2h'}); 
        console.log("token", token, " jwtsecret", config.jwtsecret);
    return token;
}

module.exports = createTransporter;