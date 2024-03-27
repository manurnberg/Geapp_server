const Client            = require('../../models/scpl-client');
const math              = require('../../utils/math');
const api = require('../scpl/client.api.controller')
const clientController  = {};

clientController.getClients = async (req, res, next) => {
    try{
        const clientsAndCount = await Client.findAndCountAll(
            {
                attributes: ['id','dni', 'name_lastname', 'created_at'],
                order: [['id','DESC']]
            }
        );

        return res.json(clientsAndCount);
    } catch(e) {
        next(e);
    }
};

clientController.getClient = async (req, res, next) => {
    try{
        let clientId = req.params.id;
        const client = await Client.findOne({where:{ "id": clientId}});

        if(!client) return res.sendStatus(401);
        return res.json(client);

    } catch(e) {
        next(e);
    }
};

clientController.fetchClient = async (req, res, next) => {
    try{
        
        let clientDni   = parseInt(req.body.dni);

        if(clientDni === 0){
            return res.sendStatus(401);
        }
        const client = await Client.findOne({where:{"dni": clientDni}})|| await Client.findOne({where:{"cuit": clientDni.toString()}}); 
        

        if(!client) return res.sendStatus(401);
        return res.json(client);

    } catch(e) {
        next(e);
    }
};

// clientController.fetchClientByPartnerNumber = async (req, res, next) => {
    
//     try{
//         const clientPartner   = parseInt(req.body.partner);
//         console.log("cliente socio -->>>>", clientPartner)
//         const client    = await Client.findOne({where:{ "partner": clientPartner}});

//         if(!client) return res.sendStatus(401);
//         return res.json(client);

//     } catch(e) {
//         next(e);
//     }
// };

clientController.editAvalClient = async (req, res, next) => {
    try{
        const clientId      = req.params.id;
        const referrerId    = (req.body.referrerId ? req.body.referrerId : 0);

        const clientToEdit = await Client.findOne({where: {"id": clientId}});

        if(!clientToEdit)
        {
            const err   = Error('Asociado no encontrado.');
            err.status  = 422;
            throw err;
        }

        let fieldsObj                   = {fields: ['is_signed', 'id_user_referrer', 'sign_date']};
        console.log('fecha', math.getTimeStampDate())

        clientToEdit.is_signed          = "1";
        clientToEdit.id_user_referrer   = referrerId;
        clientToEdit.sign_date          = math.getTimeStampDate();
        console.log("time stamp date: ", clientToEdit.sign_date)

        await clientToEdit.save(fieldsObj);
        await api.sendReferredId(clientId);

        res.json({status: 'Aval Firmado con Exito!'});

    } catch(e) {
        next(e);
    }
};

clientController.deleteClient = async (req, res, next) => {
    try{
        const clientId = req.params.id;

        const d = await Client.destroy({where: {"id": clientId, "clientId":req.payload.id}});
        
        res.json({message: 'Scpl, Cliente/Asociado eliminado'});
    } catch(e) {
        next(e);
    }
};

module.exports = clientController;