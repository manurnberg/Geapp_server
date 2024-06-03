const ScrutinyParty = require('../models/scrutiny-party');
const ScrutinyCategory = require('../models/scrutiny-category');
const Election = require('../models/election');
const electionController = {};

electionController.getElection = async (req, res, next) => {
    try {
        console.log("Get current election");
       
        const election = await Election.findOne({ 
                where: {"isActive": true},
                include: [{ model: ScrutinyCategory, include: [ScrutinyParty] }]
            });
            console.log(election.isActive);

            if(!election){
                const err = Error('Elección no encontrada.'); err.status = 422;
                throw err;
            }

        res.json(election);
    } catch (e) {
        next(e);
    }
};

/*
Create the folder when the election is created.
//https://stackoverflow.com/questions/21194934/node-how-to-create-a-directory-if-doesnt-exist
*/

/**
 * SHOW ELECTION:
 * SELECT sc.shortDescription, sr.shortDescription, sum(s.quantity) FROM geapp_test.scrutinycolumns sc 
inner join geapp_test.scrutinyrows sr 
inner join geapp_test.scrutinies s on sr.id = s.scrutinyrowId and sc.id =sr.scrutinycolumnId group by sc.shortDescription, sr.shortDescription;

SELECT * FROM geapp_test.scrutinycolumns sc 
inner join geapp_test.scrutinyrows sr 
inner join geapp_test.scrutinies s on sr.id = s.scrutinyrowId and sc.id =sr.scrutinycolumnId;
 */

module.exports = electionController;