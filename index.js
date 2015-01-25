var express = require('express');
var app = express();
var config = require('./config');

//
//app dependencies
//

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('cookie-session');
var passport = require('passport');

//
//app level middleware
//

var middleware = require('./controllers/middleware');
var templateVariables = middleware.templateVariables;
var userVariables = middleware.userVariables;
var canPlayRoleOf = middleware.canPlayRoleOf;

//
//app settings
//

app.set('title', config.title);
app.set('port', config.port);
app.use(cookieParser());
app.use(express.static(config.public));
app.use(bodyParser.urlencoded({ extended: false }));

//
//app settings:production
//

if(app.get('env') == 'production') {
  app.use(session({
    name: config.sessionId,
    secret: config.secret,
  }));
  app.use(morgan());
}

//
//app settings:development
//

if (app.get('env') == 'development') {
  app.use(session({
    name: config.sessionId,
    secret: config.secret,
  }));
  app.use(morgan('dev'));
}

app.use(passport.initialize());
app.use(passport.session());

app.use(templateVariables);
app.use(userVariables);
app.use(canPlayRoleOf);

//
//sub applications
//

app.use(require('./controllers/home'));
app.use(require('./controllers/auth'));
app.use(require('./controllers/admin'));
app.use(require('./controllers/blog'));
app.use(require('./controllers/rest'));

app.listen(app.get('port'), function () {
  console.log('%s is listening on port %d in %s mode', 
              app.get('title'), 
              app.get('port'),
              app.get('env'));
});