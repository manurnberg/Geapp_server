
var passwordChecker = {};

//To check a password between 7 to 16 characters which contain only characters, 
//numeric digits, underscore and first character must be a letter
const LOW = /^[A-Za-z]\w{7,14}$/;
//To check a password between 6 to 20 characters which contain at least one numeric digit, 
//one uppercase and one lowercase letter
const MID_LOW = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
//To check a password between 7 to 15 characters which contain at least one numeric digit 
//and a special character
const MID_HIGH = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/; 
//To check a password between 8 to 15 characters which contain at least one lowercase letter, 
//one uppercase letter, one numeric digit, and one special character
const HIGH =  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;

passwordChecker.checkPassword = (password, level) => {
    if(level !== LOW || level !== MID_LOW || level !== MID_HIGH || level !== HIGH){
        level = LOW;
    }

    if(typeof password !== "string" || !password.match(level)){
        const err = Error('El password no coincide con las caracteristicas.');
        err.status = 422;
        throw err;
    }

    return true;
};

module.exports = passwordChecker;