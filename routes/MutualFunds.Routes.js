const { getMutualFunds, postMutualFunds, updateMutualFunds, deleteMutualFunds } = require('../controller/MutualFundsController');
const { isTokenValid } = require('../middleware/verifyToken.middleware');

const router = require('express').Router();


router.get('/', getMutualFunds)
router.post('/',isTokenValid('ADMIN'), postMutualFunds)
router.put('/:id',isTokenValid('ADMIN'),  updateMutualFunds)
router.delete('/:id',isTokenValid('ADMIN'),  deleteMutualFunds)

module.exports = router