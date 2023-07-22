const VotingTable = require('../models/voting-table');
const Voter = require('../models/voter');
const Citizen = require('../models/citizen');
const Election = require('../models/election');
const ScrutinyCategory = require('../models/scrutiny-category');
const ScrutinyParty = require('../models/scrutiny-party');
const Scrutiny = require('../models/scrutiny');
const VotingTableSheet = require('../models/votingtable-result-sheet');
const fs = require('fs');
const dateformat = require('dateformat');
const math = require('../utils/math');
const sequelize = require('../models').sequelize;
const sequelize2 = require('sequelize');
const User = require('../models/user');
const { json } = require('sequelize');
const Op = sequelize2.Op;
const Party = require('../models/party');
let referencePathGlobal = ''



//const fileDir = require('../config').fileDir;
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];

const votingTableController = {};

votingTableController.getVotingTable = async (req, res, next) => {
    
    try {
        console.log(" DNI: " + req.payload.nationalId);
        //need to find the voting table with its voters and citizens for the voting table where the user in session belongs to.
        //maybe this is not the best approach.
        const fiscalUser = await User.findOne({
            where: { 'nationalId': req.payload.nationalId },
        })
        

        console.log(`user voting table ${fiscalUser.table}`)

        const usersVotingTable = await VotingTable.findOne(
            {
                where: {
                    'id': fiscalUser.table,
                }

            });
        console.log("test ------->>>>>>>>>" + JSON.stringify(usersVotingTable.id))
        if (!usersVotingTable) {
            const err = Error('Mesa no encontrada.'); err.status = 422;
            throw err;
        }
        
        const votingTable = await VotingTable.findOne(
            {
                where: { "id": usersVotingTable.id },
                include: [{ model: Voter, include: [Citizen] }],
                //order: [[{model: Voter, as: 'voters'},'order', 'ASC']]
            });
        console.log("selected voting table -->", votingTable)

        //sort them by order. cannot do it in sql because col is varchar.
        votingTable.voters.sort((a, b) => { return a.order - b.order });

        votingTable.voters.map(
            (voter) => {
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
    console.log('time voted ------->>>', req.body.dateVoted)
    try {
        const dateVoted = req.body.dateVoted;
        const userNationalId = req.payload.nationalId;
        //const isOwner = req.payload.isOwner;
        const voterId = req.params.voterId;
        //TODO: validate the parameters are present.
        console.log(`Voting voter: ${voterId} and user ${userNationalId}`);

        const userFiscal = await User.findOne({
            where: { 'nationalId': userNationalId }
        })

        // const userCitizen = await Citizen.findOne({
        //     where: { "nationalId": userNationalId },
        //     include: [{
        //         model: Voter,
        //         where: { "isOwner": true },
        //         include: [{
        //             model: VotingTable,
        //             where: { "isOpen": true }
        //         }]
        //     }]
        // });



        const voter = await Voter.findByPk(voterId, { include: [VotingTable] });
        console.log("voter-->>>", voter);


        if (
            voter.votingtable.isOpen && !voter.voted) {
            voter.voted = 1;
            voter.dateVoted = dateVoted
            await voter.save();

            voter.votingtable.sumVotes += 1;
            console.log("voter.votingtable-->>", voter.votingtable.sumVotes);
            await voter.votingtable.save();
        }

        res.json({ message: 'Voto registrado correctamente.' });
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


    console.log('requuuuu---->>>>', req)
    try {


        const date = req.body.updateReplenish;
        const userNationalId = req.payload.nationalId;
        const isOwner = req.payload.isOwner;
        const qty = parseInt(req.params.qty, 10); // qty = quantity -----> cantidad de boletas repuestas
        console.log(`Replenish qty: ${qty} and user ${userNationalId}`);

        // const userCitizen = await Citizen.findOne({
        //     where: { "nationalId": userNationalId },
        //     include: [{
        //         model: Voter,
        //         where: { "isOwner": true },
        //         include: [{
        //             model: VotingTable,
        //             where: { "isOpen": true }
        //         }]
        //     }]
        // });
        const userFiscal = await User.findOne({
            where: { "nationalId": userNationalId }
        })

        console.log('date time ---->>>>', date)

        const votingTable = await VotingTable.findOne(
            {
                where: { "id": userFiscal.table }
            })


        if (req.body.newQuantity) {
            console.log("newQuantity: " + req.body.newQuantity);
            const lastQuantity = req.body.lastQuantity;
            const newQuantity = req.body.newQuantity;

            var aux = votingTable.replenishQty;
            aux = aux - lastQuantity;
            aux = aux + newQuantity;
            votingTable.replenishQty = aux;
        } else {
            votingTable.replenishQty = votingTable.replenishQty + qty;
        }

        votingTable.updateReplenish = date
        await votingTable.save();

        res.json({ message: 'Reposición guardada correctamente' });
    } catch (e) {
        next(e);
    }
};




votingTableController.scrutinyImage = async (req, res, next) => {
    try {
        const userNationalId = req.payload.nationalId;
        const isOwner = req.payload.isOwner;
        // const effectiveVoters = req.body.effectiveVoters;
        // const votesInBallotBox = req.body.votesInBallotBox;
        // const identityContestvotes = req.body.identityContestvotes;
        // const nullVotes = req.body.nullVotes;
        // const appealedVotes = req.body.appealedVotes;
        // const whiteVotes = req.body.whiteVotes;
        // const totalVotes = req.body.totalVotes;
        // const testing = req
        // console.log("formadata on backend-->>", testing);


        // console.log(`Scrutiny Image - user:${userNationalId}`);

        const user = await User.findOne({
            where: { 'nationalId': userNationalId }
        })

        const votingTableId = user.table
        const newPathAndName = config.filepath + '/' + votingTableId + dateformat(new Date(), "_yy_mm_dd_HH_MM_ss_") + req.file.originalname;
        fs.rename(req.file.path, newPathAndName, (err) => {
            if (err) { console.log(err); }
            console.log('Scrutiny file saved.');
        });
        referencePathGlobal = newPathAndName;
        const sheetReference = newPathAndName;
        console.log("sheetreference-->", sheetReference);

        // const datetime = new Date();

        // const votingTableSheet = VotingTableSheet.build({
        //     votingtable_id: votingTableId,
        //     effective_voters: effectiveVoters,
        //     votes_in_ballot_box: votesInBallotBox,
        //     identity_contest_votes: identityContestvotes,
        //     null_votes: nullVotes,
        //     appealed_votes: appealedVotes,
        //     white_votes: whiteVotes,
        //     total_votes: totalVotes,
        //     datetime: datetime,
        //     sheet_reference: referencePathGlobal


        // })



        // await votingTableSheet.save();


        const votingTable = await VotingTable.findByPk(votingTableId);
        votingTable.scrutinyPath = sheetReference;
        await votingTable.save();

        res.json({ "message": "Imágen cargada con éxito." });
    } catch (e) {
        next(e);
    }
};

const base64converter = (file) => {
    return "data:image/png;base64," + fs.readFileSync(file, 'base64');
}

votingTableController.getScrutinyImage = async (req, res) => {
    console.log("req-->>", req.body)
    try {
        const sheetReference = await VotingTable.findOne({
            where: { 'votingtable_id': req.body.vtableId }
        })
        console.log("sheetreference", sheetReference);
        const filepath = sheetReference.scrutinyPath;

        const image64 = base64converter(filepath);
        console.log("image64 ", image64)

        res.json(image64);

    } catch (e) {
        console.log(e.message);
    }

}


votingTableController.scrutiny = async (req, res, next) => {
    //let transaction;
    // try {
    // Unmanaged Transaction
    //transaction = await sequelize.transaction();
    const formdata = JSON.stringify(req.body.formdata);
    const formcst = JSON.stringify(req.body.formcst);
    const jsonFormCst = JSON.parse(formcst);
    console.log ('FORM -------->' + jsonFormCst.nameParty);

    const formpidc = JSON.stringify(req.body.formpidc);
    const jsonFormPidc = JSON.parse(formpidc);
    
    const formfdt = JSON.stringify(req.body.formfdt);
    const jsonFormFdt = JSON.parse(formfdt);

    const formjpc = JSON.stringify(req.body.formjpc);
    const jsonFormJpc = JSON.parse(formjpc);

    const formfizq = JSON.stringify(req.body.formfizq);
    const jsonFormFizq = JSON.parse(formfizq);

    const formSenator = JSON.stringify(req.body.formsenator);
    const jsonFormSenator = JSON.parse(formSenator);

    const formDeputy = JSON.stringify(req.body.formdeputy);
    const jsonFormDeputy = JSON.parse(formDeputy);

    console.log(`Scrutiny Data ${JSON.stringify(req.body.formdata)}`);
    const userNationalId = req.payload.nationalId;
    const isOwner = req.payload.isOwner;
    const requestPartiesArr = req.body.quantities;
    console.log(`Scrutiny Data quant ${req.body.notes}`);
    let notes = req.body.notes | '';
    console.log(`Scrutiny Data: DNI User:${userNationalId}`);

    const jsonData = JSON.parse(formdata);

    const effectiveVoters = parseInt(jsonData.effectiveVoters, 10);
    const votesInBallotBox = parseInt(jsonData.votesInBallotBox);
    const diference = parseInt(jsonData.diference);

    console.log(`Scrutiny Data:effectivevoters:${effectiveVoters}`);
    const datetime = new Date();


    const user = await User.findOne({
        where: { 'nationalId': userNationalId }
    })

    const votingTableId = user.table
    const votingTable = await VotingTable.findOne({
        where: { 'id': votingTableId }
    })
    // const votingTable = await VotingTable.findByPk(votingTableId);
    // votingTable.scrutinyPath = newPathAndName;

    votingTable.effective_voters = effectiveVoters;
        votingTable.votes_in_ballot_box=votesInBallotBox;
        votingTable.diference=diference;
    

    const votingTableSheetSenator = VotingTableSheet.build({
        votingtable_id: votingTableId,
        identity_contest_votes: parseInt(jsonFormSenator.identityContestVotes),
        null_votes: parseInt(jsonFormSenator.nullVotes),
        appealed_votes: parseInt(jsonFormSenator.appealedVotes),
        white_votes: parseInt(jsonFormSenator.whiteVotes),
        total_votes: parseInt(jsonFormSenator.totalVotes),
        datetime: new Date(),
        electoral_command: parseInt(jsonFormSenator.electoralCommand),
        type: jsonFormSenator.type,
    })

    const votingTableSheetDeputy = VotingTableSheet.build({
        votingtable_id: votingTableId,
        identity_contest_votes: parseInt(jsonFormDeputy.identityContestVotes),
        null_votes: parseInt(jsonFormDeputy.nullVotes),
        appealed_votes: parseInt(jsonFormDeputy.appealedVotes),
        white_votes: parseInt(jsonFormDeputy.whiteVotes),
        total_votes: parseInt(jsonFormDeputy.totalVotes),
        datetime: new Date(),
        electoral_command: parseInt(jsonFormDeputy.electoralCommand),
        type: jsonFormDeputy.type,
    })
    const partyPidc = Party.build({
        votingtable_id: votingTableId,
        nameParty: jsonFormPidc.nameParty,
        senator: parseInt(jsonFormPidc.votoSenador),
        deputy: parseInt(jsonFormPidc.votoDeputy),
    })
    const partyCst = Party.build({
        votingtable_id: votingTableId,
        nameParty: jsonFormCst.nameParty,
        senator: parseInt(jsonFormCst.votoSenador),
        deputy: parseInt(jsonFormCst.votoDeputy),
    })
    const partyJpc = Party.build({
        votingtable_id: votingTableId,
        nameParty: jsonFormJpc.nameParty,
        senator: parseInt(jsonFormJpc.votoSenador),
        deputy: parseInt(jsonFormJpc.votoDeputy),
    })
    const partyFdt = Party.build({
        votingtable_id: votingTableId,
        nameParty: jsonFormFdt.nameParty,
        senator: parseInt(jsonFormFdt.votoSenador),
        deputy: parseInt(jsonFormFdt.votoDeputy),
    })
    const partyFizq = Party.build({
        votingtable_id: votingTableId,
        nameParty: jsonFormFizq.nameParty,
        senator: parseInt(jsonFormFizq.votoSenador),
        deputy: parseInt(jsonFormFizq.votoDeputy),
    })
    




    console.log("votingtable-->> ", votingTable);
    console.log("votingTableSheetSenator-->> ", votingTableSheetSenator);
    console.log ("VERIFICAR NAN -------->>>>>", votingTableSheetSenator.identity_contest_votes);
    console.log("FORM JPC ----->", partyJpc )

    // await votingTable.save();
    await votingTableSheetSenator.save();
    await votingTableSheetDeputy.save();
    await partyPidc.save();
    await partyCst.save();
    await partyJpc.save();
    await partyFdt.save();
    await partyFizq.save();

    if (notes.length > 480) {
        notes = notes.substring(0, 480); //MAX LENGTH HARDC. :p
    }

    //-------------- NO VA
    //if length is 0, it's not valid.
    //let isValid = (requestPartiesArr.length > 0) ? true : false;
    //check all params are positives, if one is not, it's not valid.
    // requestPartiesArr.forEach(scrutinyPartyObj => {
    //     if (isNaN(scrutinyPartyObj.qty) || isNaN(scrutinyPartyObj.scrutinyPartyId)
    //         || scrutinyPartyObj.qty < 0 || scrutinyPartyObj.scrutinyPartyId < 0) {
    //         isValid = false;
    //     }
    // });

    // if(!isValid){
    //     const err = Error('Hay datos incorrectos.'); err.status = 422;
    //     throw err;
    // }

    // const election = await Election.findOne({
    //     where: { "isActive": true },
    //     include: [{ model: ScrutinyCategory, include: [ScrutinyParty] }]
    // });

    // if (!election) {
    //     const err = Error('Elección no encontrada.'); err.status = 422;
    //     throw err;
    // }

    // const userCitizen = await Citizen.findOne({
    //     where: { "nationalId": userNationalId },
    //     include: [{
    //         model: Voter, where: { "isOwner": true },
    //         include: [{ model: VotingTable, where: { "isOpen": true } }]
    //     }]
    // });

    // if (!isOwner || !userCitizen || !userCitizen.voters[0] || !userCitizen.voters[0].votingtable) {
    //     const err = Error('Mesa cerrada o no encontrada.'); err.status = 422;
    //     throw err;
    // }

    //const votingTable = userCitizen.voters[0].votingtable;


    //flat all parties in an array.
    // let scrutiniesArr = [];
    // election.scrutinycategories.forEach(category => {
    //     category.scrutinyparties.forEach(party => {
    //         scrutiniesArr.push({
    //             scrutinypartyId: party.id,
    //             votingtableId: votingTable.id,
    //             quantity: 0
    //         });
    //     });
    // });

    // //update quantity if it's found in the request.
    // requestPartiesArr.forEach(reqParty => {
    //     let scrutiny = scrutiniesArr.find(p => { return reqParty.scrutinyPartyId == p.scrutinypartyId });
    //     if (scrutiny) {
    //         scrutiny.quantity = reqParty.qty;
    //     }
    // });

    //console.log(`Persisting Scrutiny for vtable: ${votingTable.id} and DNI User: ${userNationalId}`);
    /*scrutiniesArr.forEach(scr => { console.log(`scrutinypartyId: ${scr.scrutinypartyId} : quantity: ${scr.quantity} : votingtableId: ${scr.votingtableId}`);
    });*/
    //await Scrutiny.bulkCreate(scrutiniesArr, { transaction });
    // ----------------------------

    console.log(`notas: ${notes}`);
    //votingTable.isOpen = false; ---------
    votingTable.notes = notes;
    // await votingTable.save({ transaction }); -------
    await votingTable.save();
    // always call commit at the end--------------
    // await transaction.commit();-------------

    res.json({ message: 'Datos cargados. Mesa cerrada.' });
    // } catch (e) {-------------
    //     // always rollback -------------
    //     await transaction.rollback();------------
    //     next(e);------------
    // }
};

module.exports = votingTableController;