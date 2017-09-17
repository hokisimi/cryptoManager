module.exports = function(){

  var express = require('express');
  var config = require('./config.js');
  var app = express();
  var path = require('path');
  var session = require('express-session');
  var bodyParser = require('body-parser');
  var MySQLStore = require('express-mysql-session')(session);
  var flash = require('connect-flash');
  var cookieParser = require('cookie-parser')

  app.locals.pretty = true;

  app.set('view engine', 'jade');
  app.set('views', './views');

  app.use(express.static('public'));
  app.use(express.static('js'));

  app.use(bodyParser.urlencoded({ extended: false}));
  app.use(bodyParser.json());
  app.use(session(
    {
      secret: config.get('session.secret_key'),
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge : config.get('session.cookie.maxage')
      },
      store:new MySQLStore({
        host:config.get('database.host'),
        port:config.get('database.port'),
        user:config.get('database.user'),
        password:config.get('database.password'),
        database:config.get('database.name')
      })
    }
  ));

  app.use(cookieParser(config.get('cookie.secret_key')));
  app.use(flash());

  return app;
}
