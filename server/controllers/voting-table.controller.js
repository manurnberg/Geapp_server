const VotingTable = require('../models/voting-table');
const Voter = require('../models/voter');
const Citizen = require('../models/citizen');
const Election = require('../models/election');
const ScrutinyCategory = require('../models/scrutiny-category');
const ScrutinyParty = require('../models/scrutiny-party');
const Scrutiny = require('../models/scrutiny');

const fs = require('fs');
const dateformat = require('dateformat');
const math = require('../utils/math'); 
const sequelize = require('../models').sequelize;

//const fileDir = require('../config').fileDir;
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];

const votingTableController = {};

votingTableController.getVotingTable = async (req, res, next) => {
    try {
        console.log("Voting Table for DNI: " + req.payload.nationalId);
        //need to find the voting table with its voters and citizens for the voting table where the user in session belongs to.
        //maybe this is not the best approach.
        const usersVotingTable = await VotingTable.findOne(
            { include: [{ 
                model: Voter, 
                include: [
                    { model: Citizen, 
                        where: { "nationalId": req.payload.nationalId } 
                    }] 
                }] 
            });

            if(!usersVotingTable){
                const err = Error('Mesa no encontrada.'); err.status = 422;
                throw err;
            }

        const votingTable = await VotingTable.findOne(
            { where: { "id": usersVotingTable.id }, 
            include: [{ model: Voter, include: [Citizen] }],
            //order: [[{model: Voter, as: 'voters'},'order', 'ASC']]
        });

        //sort them by order. cannot do it in sql because col is varchar.
        votingTable.voters.sort((a,b)=>{return a.order - b.order});

        votingTable.voters.map(
            (voter)=>{
                voter.citizen.dataValues['age'] = math.diffInYearsFromToday(voter.citizen.birthday);
            }
        );
        
        res.json(votingTable);
    } catch (e) {
        next(e);
    }
};

/**
 * - get voter of the user in session through its citizen.
 * - get the voter that wants to vote.
 * - did I say the user in session is owner? YES
 * - are both on the same table? YES
 * - is the table open? YES
 * - Didn't the voter vote? NO
 * if YES/YES/YES/NO? =>  save the vote with its vote. 
 */
votingTableController.vote = async (req, res, next) => {
    try {
        const userNationalId = req.payload.nationalId;
        const isOwner = req.payload.isOwner;
        const voterId = req.params.voterId;
        //TODO: validate the parameters are present.
        console.log(`Voting voter: ${voterId} and user ${userNationalId}`);

        const userCitizen = await Citizen.findOne({
            where: {"nationalId": userNationalId}, 
            include:[{
                model:Voter,
                where: {"isOwner":true},
                include:[{
                    model: VotingTable,
                    where: {"isOpen":true}
                }]
            }]
        });
        /*const votingTable = await VotingTable.findOne({
            where: {"isOpen":true}, include: [{ model: Voter, where: {"isOwner":true}, include:[{model: Citizen,
             where: {"nationalId": userNationalId}}] }]
        });*/
        
        const voter = await Voter.findByPk(voterId, {include: [VotingTable]});
        
        // if(!isOwner || !userCitizen || !userCitizen.voters[0] || !userCitizen.voters[0].votingtable 
        //     || !voter || !voter.votingtable ){
        //     const err = Error('Mesa no encontrada.'); err.status = 422;
        //     throw err;
        // }
        
        //are both on the same table? is the table open? didn't vote yet?
        if(voter.votingtable.id === userCitizen.voters[0].votingtable.id  
            && voter.votingtable.isOpen && !voter.voted){
            voter.voted = true;
            await voter.save();

            voter.votingtable.sumVotes += 1;
            await voter.votingtable.save();
        }

        //res.json(voter);
        res.json({message:'Voto registrado correctamente.'});
    } catch (e) {
        next(e);
    }
};

/**
 * - get the user in session and find his/her table.
 * - ensure that the he/she is responsible for the table.
 * - add qty to the previous value to the table.
 */
votingTableController.replenish = async (req, res, next) => {
    try {
        const userNationalId = req.payload.nationalId;
        const isOwner = req.payload.isOwner;
        const qty = parseInt(req.params.qty,10); // qty = quantity -----> cantidad de boletas repuestas
        console.log(`Replenish qty: ${qty} and user ${userNationalId}`);

        const userCitizen = await Citizen.findOne({
            where: {"nationalId": userNationalId}, 
            include:[{
                model: Voter,
                where: {"isOwner":true},
                include:[{
                    model: VotingTable,
                    where: {"isOpen":true}
                }]
            }]
        });

        // if(!isOwner || !userCitizen || !userCitizen.voters[0] || !userCitizen.voters[0].votingtable || isNaN(qty)){
        //     const err = Error('Mesa no encontrada.'); err.status = 422;
        //     throw err;
        // }

        const votingTable = userCitizen.voters[0].votingtable;
        votingTable.replenishQty = votingTable.replenishQty + qty;
        await votingTable.save();
        
        res.json({message:'Reposición guardada correctamente'});
    } catch (e) {
        next(e);
    }
};



votingTableController.scrutinyImage = async (req, res, next) => {
    try {
        const userNationalId = req.payload.nationalId;
        const isOwner = req.payload.isOwner;
        
        console.log(`Scrutiny Image - user:${userNationalId}`);
        
        const userCitizen = await Citizen.findOne({
            where: {"nationalId": userNationalId},
            include:[{model:Voter, where: {"isOwner":true},
                include:[{model: VotingTable, where: {"isOpen":true}}]
            }]
        });

        if(!req.file || !isOwner || !userCitizen || !userCitizen.voters[0] || !userCitizen.voters[0].votingtable){
            const msg = (!req.file)?'Debe agregar imagen con nombre scrutinyImage':'Mesa no encontrada.';
            const err = Error(msg); err.status = 422;
            throw err;
        }
        const votingTableId = userCitizen.voters[0].votingtable.id;
        const newPathAndName = config.filepath + '/' + votingTableId + dateformat(new Date(), "_yy_mm_dd_HH_MM_ss_") + req.file.originalname;
        fs.rename(req.file.path, newPathAndName, (err)=>{
           if(err){ console.log(err); } 
           console.log('Scrutiny file saved.');
        });

        const votingTable = await VotingTable.findByPk(votingTableId);
        votingTable.scrutinyPath = newPathAndName;
        await votingTable.save();

        res.json({"message":"Imágen cargada con éxito."});
    } catch (e) {
        next(e);
    }
};

votingTableController.scrutiny = async (req, res, next) => {
    let transaction;
    try {
        // Unmanaged Transaction
        transaction = await sequelize.transaction();
        
        console.log(`Scrutiny Data`);
        const userNationalId = req.payload.nationalId;
        const isOwner = req.payload.isOwner;
        const requestPartiesArr = req.body.quantities; 
        let notes = req.body.notes | '';
        console.log(`Scrutiny Data: DNI User:${userNationalId}`);
        
        if(notes.length > 480){
            notes = notes.substring(0, 480); //MAX LENGTH HARDC. :p
        }
        
        //if length is 0, it's not valid.
        let isValid = (requestPartiesArr.length > 0)? true : false;
        //check all params are positives, if one is not, it's not valid.
        requestPartiesArr.forEach(scrutinyPartyObj => {
            if(isNaN(scrutinyPartyObj.qty) || isNaN(scrutinyPartyObj.scrutinyPartyId) 
            || scrutinyPartyObj.qty < 0 || scrutinyPartyObj.scrutinyPartyId < 0){
                isValid = false;
            }
        });

        // if(!isValid){
        //     const err = Error('Hay datos incorrectos.'); err.status = 422;
        //     throw err;
        // }

        const election = await Election.findOne({ 
            where: {"isActive": true},
            include: [{ model: ScrutinyCategory, include: [ScrutinyParty] }]
        });

        if(!election){
            const err = Error('Elección no encontrada.'); err.status = 422;
            throw err;
        }

        const userCitizen = await Citizen.findOne({
            where: {"nationalId": userNationalId}, 
            include:[{model:Voter, where: {"isOwner":true},
                include:[{model: VotingTable, where: {"isOpen":true}}]
            }]
        });

        if(!isOwner || !userCitizen || !userCitizen.voters[0] || !userCitizen.voters[0].votingtable){
            const err = Error('Mesa cerrada o no encontrada.'); err.status = 422;
            throw err;
        }

        const votingTable = userCitizen.voters[0].votingtable;
        
        //flat all parties in an array.
        let scrutiniesArr = [];
        election.scrutinycategories.forEach(category => {
            category.scrutinyparties.forEach(party => {
                scrutiniesArr.push({
                    scrutinypartyId: party.id, 
                    votingtableId: votingTable.id,
                    quantity: 0
                });
            });
        });

        //update quantity if it's found in the request.
        requestPartiesArr.forEach(reqParty => {
            let scrutiny = scrutiniesArr.find(p => {return reqParty.scrutinyPartyId == p.scrutinypartyId});
            if(scrutiny){
                scrutiny.quantity = reqParty.qty;
            }
        });

        console.log(`Persisting Scrutiny for vtable: ${votingTable.id} and DNI User: ${userNationalId}`);
        /*scrutiniesArr.forEach(scr => { console.log(`scrutinypartyId: ${scr.scrutinypartyId} : quantity: ${scr.quantity} : votingtableId: ${scr.votingtableId}`);
        });*/
        await Scrutiny.bulkCreate(scrutiniesArr, {transaction});

        console.log(`notas: ${notes}`);
        //votingTable.isOpen = false;
        votingTable.notes = notes;
        await votingTable.save({transaction});

        // always call commit at the end
        await transaction.commit();

        res.json({message:'Datos cargados. Mesa cerrada.'});
    } catch (e) {
        // always rollback 
        await transaction.rollback();
        next(e);
    }
};

module.exports = votingTableController;