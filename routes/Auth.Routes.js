const { login,register,UpdatePassword } = require('../controller/Auth.Controllerr');
const { OauthRegister, OauthCallback } = require('../controller/OauthController');
const { isTokenValid } = require('../middleware/verifyToken.middleware');

const router = require('express').Router();





//login


router.get('/google',OauthRegister)
router.get('/google/callback', OauthCallback)
router.post('/login',login)
router.post('/register',register)
router.put('/updatepassword',isTokenValid('MEMBER'),UpdatePassword)


   
  


module.exports = router
