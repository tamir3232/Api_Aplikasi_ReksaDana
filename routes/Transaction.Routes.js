const { buy,pay, sell, switchMutualFund, getAllTransactions,getDetailTransactions } = require('../controller/Transaction.Controller');
const { isTokenValid } = require('../middleware/verifyToken.middleware');





const router = require('express').Router();

router.get('/:id', isTokenValid('MEMBER'),getDetailTransactions)
router.get('/', isTokenValid('MEMBER'),getAllTransactions)
router.post('/buy', isTokenValid('MEMBER'),buy)
router.post('/pay', isTokenValid('MEMBER'),pay)
router.post('/sell/:id', isTokenValid('MEMBER'),sell)
router.post('/switch/:id', isTokenValid('MEMBER'),switchMutualFund)
// router.post('/', postMutualFunds)
// router.put('/:id', updateMutualFunds)
// router.delete('/:id', deleteMutualFunds)

module.exports = router



