const http = require('http');

sendReferredId = async (clientId) => {
    try{
       return http.get('http://dashboard.geapp.com.ar/api/nuevoAval/'+clientId);
        
    } catch(e) {
        next(e);
    }
}

module.exports = {sendReferredId};