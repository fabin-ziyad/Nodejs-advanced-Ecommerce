var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs=require('express-handlebars')
var adminRouter = require('./routes/admin');
var usersRouter = require('./routes/users');
var db = require('./config/connection')
const flash=require('connect-flash')
var app = express();
var fileUpload=require('express-fileupload')
var session=require('express-session')
// view engine setup
app.set('views layout', path.join(__dirname, 'views','layout/UserLayout'));
app.set('view engine', 'hbs');
app.use(logger('dev'));

app.use(flash())
app.use(express.static(path.join(__dirname, 'public')));
app.engine('hbs', hbs.engine({
  extname: 'hbs',
  defaultLayout: 'layout',
  layoutsDir: __dirname + '/views/layout/',
  partialsDir: __dirname + '/views/partials',
  helpers: {
    inc: (value) => {
      return parseInt(value)+1
    },
    ifEquals: function(arg1, arg2, options) {
      return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
  }
  }
}))

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(fileUpload())
app.use(session({secret:"secretkey",resave: true,
  saveUninitialized: true, cookie: { maxAge: 980000000 } // session expire time
}))

app.use('/admin', adminRouter);
app.use('/', usersRouter);
db.connect((err) => {
  if (err) console.log(err,'db error')
  else console.log('db connected')
})
app.use((req, res, next)=>{
  app.locals.success = req.flash('success')
  next();
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
