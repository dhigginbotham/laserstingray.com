var config;
try {
  config = require('app/config');
} catch(err) {
  console.error('!!!! ^^^^ IMPORTANT:\n Run this:\nnpm run symlink\n\n\nThat should fix it!\n\n\nError:', err);
  process.exit(-99);
}

var express = require('express');
var app = express();

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

var middleware = require('app/middleware');
var templateVariables = middleware.templateVariables;
var userVariables = middleware.userVariables;
var canPlayRoleOf = middleware.canPlayRoleOf;
var hasRoleOf = middleware.hasRoleOf;
var expressFlash = middleware.expressFlash;

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
  app.use(morgan('tiny'));
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

//
//passport wiring for authentication
//

app.use(passport.initialize());
app.use(passport.session());

app.use(expressFlash);
app.use(templateVariables);
app.use(userVariables);
app.use(canPlayRoleOf);
app.use(hasRoleOf);

//
//sub applications
//

app.use(require('app/home'));
app.use(require('app/auth'));
app.use(require('app/admin'));
app.use(require('app/blog'));
app.use(require('app/rest'));
app.use(require('app/users'));

//
//error pages, dont mount things after this
//

app.use(require('app/errors'));

app.listen(app.get('port'), function () {
  console.log('%s is listening on port %d in %s mode',
              app.get('title'),
              app.get('port'),
              app.get('env'));
});