const { getMyInvest, getDetailMyInvest } = require("../controller/Myinvest.Controller");
const { isTokenValid } = require("../middleware/verifyToken.middleware");
const router = require('express').Router();


router.get('/', isTokenValid('MEMBER'),getMyInvest)
router.get('/:id', isTokenValid('MEMBER'),getDetailMyInvest)

module.exports = router