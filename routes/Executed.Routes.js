const executed = require("../controller/Executed.Controller");
const { isTokenValid } = require("../middleware/verifyToken.middleware");
const router = require('express').Router();


router.post('/:id', isTokenValid('ADMIN'),executed)


module.exports = router