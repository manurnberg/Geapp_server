const router = require('express').Router();
const auth = require('./auth');
const clientController = require('../controllers/scpl/client.controller');

router.get('/', auth.required, clientController.getClients);
router.get('/:id', auth.required, clientController.getClient);
router.put('/:id', auth.required, clientController.editAvalClient);
router.post('/fetch', auth.required, clientController.fetchClient);
router.delete('/:id', auth.required, clientController.deleteClient);

module.exports = router;