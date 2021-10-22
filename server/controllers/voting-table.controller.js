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
const Op = sequelize2.Op;





//const fileDir = require('../config').fileDir;
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];

const votingTableController = {};

votingTableController.getVotingTable = async (req, res, next) => {
    console.log("prueba" + req.payload)
    try {
        console.log(" DNI: " + req.payload.nationalId);
        //need to find the voting table with its voters and citizens for the voting table where the user in session belongs to.
        //maybe this is not the best approach.
        const usersVotingTable = await VotingTable.findOne(
            {
                include: [{
                    model: Voter,
                    include: [
                        {
                            model: Citizen,
                            where: {
                                nationalId: req.payload.nationalId
                            }
                        }]
                }]
            });
        console.log("test" + JSON.stringify(usersVotingTable))
        if (!usersVotingTable) {
            const err = Error('Mesa no encontrada.'); err.status = 422;
            throw err;
        }
        //hecho_hoy
        /*   const votingTableId = await User.findOne({
              where: { "nationalId": req.payload.nationalId}
  
          })
          console.log("prueba" + votingTableId.fiscal)
          if (votingTableId.table == null) {
              const err = Error('mesa no encontrada')
              throw err;
          } */
        //fin
        const votingTable = await VotingTable.findOne(
            {
                where: { "id": usersVotingTable.table },
                include: [{ model: Voter, include: [Citizen] }],
                //order: [[{model: Voter, as: 'voters'},'order', 'ASC']]
            });

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
        const isOwner = req.payload.isOwner;
        const voterId = req.params.voterId;
        //TODO: validate the parameters are present.
        console.log(`Voting voter: ${voterId} and user ${userNationalId}`);

        const userCitizen = await Citizen.findOne({
            where: { "nationalId": userNationalId },
            include: [{
                model: Voter,
                where: { "isOwner": true },
                include: [{
                    model: VotingTable,
                    where: { "isOpen": true }
                }]
            }]
        });


        const voter = await Voter.findByPk(voterId, { include: [VotingTable] });


        if (voter.votingtable.id === userCitizen.voters[0].votingtable.id
            && voter.votingtable.isOpen && !voter.voted) {
            voter.voted = true;
            voter.dateVoted = dateVoted
            await voter.save();

            voter.votingtable.sumVotes += 1;
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

        const userCitizen = await Citizen.findOne({
            where: { "nationalId": userNationalId },
            include: [{
                model: Voter,
                where: { "isOwner": true },
                include: [{
                    model: VotingTable,
                    where: { "isOpen": true }
                }]
            }]
        });

        console.log('date time ---->>>>', date)

        const votingTable = userCitizen.voters[0].votingtable;
        votingTable.replenishQty = votingTable.replenishQty + qty;

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
        const effectiveVoters = req.body.effectiveVoters;
        const votesInBallotBox = req.body.votesInBallotBox;
        const identityContestvotes = req.body.identityContestvotes;
        const nullVotes = req.body.nullVotes;
        const appealedVotes = req.body.appealedVotes;
        const whiteVotes = req.body.whiteVotes;
        const totalVotes = req.body.totalVotes;


        console.log(`Scrutiny Image - user:${userNationalId}`);

        const user = await User.findOne({
            where: { 'nationalId': userNationalId }
        })

        const votingTableId = user.table
        const newPathAndName = config.filepath + '/' + votingTableId + dateformat(new Date(), "_yy_mm_dd_HH_MM_ss_") + req.file.originalname;
        fs.rename(req.file.path, newPathAndName, (err) => {
            if (err) { console.log(err); }
            console.log('Scrutiny file saved.');
        });

        const sheetReference = newPathAndName;
        console.log("sheetreference-->", sheetReference);
       
        const datetime = new Date();

        const votingTableSheet = VotingTableSheet.build({
            votingtable_id: votingTableId,
            effective_voters: effectiveVoters,
            votes_in_ballot_box: votesInBallotBox,
            identity_contest_votes: identityContestvotes,
            null_votes: nullVotes,
            appealed_votes: appealedVotes,
            white_votes: whiteVotes,
            total_votes: totalVotes,
            datetime: datetime,
            sheet_reference: sheetReference


        })



        await votingTableSheet.save();


        const votingTable = await VotingTable.findByPk(votingTableId);
        votingTable.scrutinyPath = newPathAndName;
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
        const sheetReference = await VotingTableSheet.findOne({
            where: { 'votingtable_id': req.body.vtableId }
        })
        console.log("sheetreference", sheetReference);
        const filepath = sheetReference.sheet_reference;

        const image64 = base64converter(filepath);
        console.log("image64 ", image64)

        res.json(image64);

    } catch (e) {
        console.log(e.message);
    }

}


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

            if (notes.length > 480) {
                notes = notes.substring(0, 480); //MAX LENGTH HARDC. :p
            }

            //if length is 0, it's not valid.
            let isValid = (requestPartiesArr.length > 0) ? true : false;
            //check all params are positives, if one is not, it's not valid.
            requestPartiesArr.forEach(scrutinyPartyObj => {
                if (isNaN(scrutinyPartyObj.qty) || isNaN(scrutinyPartyObj.scrutinyPartyId)
                    || scrutinyPartyObj.qty < 0 || scrutinyPartyObj.scrutinyPartyId < 0) {
                    isValid = false;
                }
            });

            // if(!isValid){
            //     const err = Error('Hay datos incorrectos.'); err.status = 422;
            //     throw err;
            // }

            const election = await Election.findOne({
                where: { "isActive": true },
                include: [{ model: ScrutinyCategory, include: [ScrutinyParty] }]
            });

            if (!election) {
                const err = Error('Elección no encontrada.'); err.status = 422;
                throw err;
            }

            const userCitizen = await Citizen.findOne({
                where: { "nationalId": userNationalId },
                include: [{
                    model: Voter, where: { "isOwner": true },
                    include: [{ model: VotingTable, where: { "isOpen": true } }]
                }]
            });

            if (!isOwner || !userCitizen || !userCitizen.voters[0] || !userCitizen.voters[0].votingtable) {
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
                let scrutiny = scrutiniesArr.find(p => { return reqParty.scrutinyPartyId == p.scrutinypartyId });
                if (scrutiny) {
                    scrutiny.quantity = reqParty.qty;
                }
            });

            console.log(`Persisting Scrutiny for vtable: ${votingTable.id} and DNI User: ${userNationalId}`);
            /*scrutiniesArr.forEach(scr => { console.log(`scrutinypartyId: ${scr.scrutinypartyId} : quantity: ${scr.quantity} : votingtableId: ${scr.votingtableId}`);
            });*/
            await Scrutiny.bulkCreate(scrutiniesArr, { transaction });

            console.log(`notas: ${notes}`);
            //votingTable.isOpen = false;
            votingTable.notes = notes;
            await votingTable.save({ transaction });

            // always call commit at the end
            await transaction.commit();

            res.json({ message: 'Datos cargados. Mesa cerrada.' });
        } catch (e) {
            // always rollback 
            await transaction.rollback();
            next(e);
        }
    };

    module.exports = votingTableController;