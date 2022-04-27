const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];

function createTransporter(user){

    const token = generateJWT(user);
    
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
        to: user.email,
        subject:'Recuperar contraseña',
        text:'Sigue el link para resetear tu contraseña',
        html: `<p>Sigue el siguiente enlace para generar una nueva contraseña</p>
        <a href="http://localhost:3000/reset/${token}">Resetear contraseña</a>`,

        
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
        id: user.id}, config.jwtsecret, {expiresIn: '2h'}); 
        console.log("token", token);
    return token;
}

module.exports = createTransporter;