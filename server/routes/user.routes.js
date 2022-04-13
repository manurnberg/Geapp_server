const router = require('express').Router();
const auth = require('./auth');
const userController = require('../controllers/user.controller');

router.get('/', auth.required, userController.getUsers);
router.get('/:id', auth.required, userController.getUser);
router.put('/:id', auth.required, userController.editUser);
router.post('/login', userController.login);
router.post('/elogin', userController.eLogin);
router.post('/addUser', userController.addUser);
router.post('/', userController.createUser);
router.put('/:id', userController.deleteUser);


module.exports = router;