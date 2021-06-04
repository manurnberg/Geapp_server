const router = require('express').Router();
const auth = require('./auth');
const electionController = require('../controllers/election.controller');

router.get('/',/* auth.required,*/ electionController.getElection);

module.exports = router;