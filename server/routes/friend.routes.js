const router = require('express').Router();
const auth = require('./auth');
const friendController = require('../controllers/friend.controller');

router.get('/', auth.required, friendController.getFriends);
router.post('/', auth.required, friendController.addFriend);
//router.post('/add_ios_friend', auth.required, friendController.addiosFriend); //ios app api route
router.delete('/:id', auth.required, friendController.deleteFriend);
 
module.exports = router;