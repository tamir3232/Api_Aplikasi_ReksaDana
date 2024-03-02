
var express = require('express');
var router = express.Router();
const app = express()
const bodyParser = require('body-parser')


const auth = require('./Auth.Routes')
const mutualFunfd = require('./MutualFunds.Routes')
const Transaction = require('./Transaction.Routes')
const executed = require('./Executed.Routes')
const myInvest = require('./MyInvest.Routes')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

app.group('/api/v1', (router) => {
  router.use('/auth', auth)
  router.use('/mutualfunds',mutualFunfd)
  router.use('/transaction', Transaction)
  router.use('/executed', executed)
  router.use('/myinvest',myInvest)
})



module.exports = app;



