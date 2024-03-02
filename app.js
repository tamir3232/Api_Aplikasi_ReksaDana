require('dotenv').config()
require('express-group-routes')
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const port = 3000
var indexRouter = require('./routes/index');
require('express-group-routes')
var {google} = require('googleapis');
const { Users } = require('./database/models');
const { error,notFound } = require('./middleware/ErrorHandling.middleware');
const bodyParser = require('body-parser');
const multer = require('multer');


var storage = multer.diskStorage({
  destination: (req, file, cb) => {

    cb(null, './public/images/uploads')
    
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getTime()+'-'+file.originalname)
  }
});


const oauth2client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  'http://localhost:3000/auth/google/callback'
)

const scopes = [
'https://www.googleapis.com/auth/userinfo.email',
'https://www.googleapis.com/auth/userinfo.profile'
]

const authorizationUrl = oauth2client.generateAuthUrl({
  access_type:'offline',
  scope:scopes,
  include_granted_scopes:true
})




var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(multer({storage: storage}).single('file'))
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
app.use(indexRouter);

app.use('*', notFound)
app.use(error)


// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
